const Gallery = require("../db/models/gallery.model")
const randomHash = require("./utilities/random")
const mime = require("mime-types")
const MediaStorageService = require("./MediaStorageService")
const MediaService = new MediaStorageService()
const User = require("../db/models/user.model")
const Image = require("../db/models/image.model")
const imagesize = require("image-size")
const async = require("async")
const GalleryService = require("./GalleryService")
const GS = new GalleryService()
const Arrangement = require("../db/models/arrangement.model")
const fs = require('fs')
const path = require('path')
const { Readable } = require("stream")
const ffmpeg = require("fluent-ffmpeg")
const TS = require('./TagService')
const probe = require('ffprobe')
// this service handles the management of the gallery/post entity as a whole.  Mostly used for creation, deletion and ensuring that the database and bucket stay in sync.
class PostService {
  photoSize = 20000
  videoSize = 40000
  videoLength = 90
  imageFormats = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "apng",
    "tiff",
    "tif",
    "bmp",
    "xcf",
    "webp",
    "svg",
  ]
  videoFormats = [
    "mp4",
    "mov",
    "avi",
    "webm",
    "mpeg",
    "flv",
    "mkv",
    "mpv",
    "wmv",
  ]
  // new post/gallery
  async new(req) {
    return new Promise(async (resolve, reject) => {
      // // don't allow if upload limit reached
      // if (req.user.limit >= 60) {
      //   return reject([400, null])
      // }
      let postTitle = req.body.title || "Pick a different title!"
      let postDescription = req.body.description || null
      let files = req.files


      let processedFiles = await Promise.all(files.map(async (file) =>{
        return await process_media_statistics(file) 
      }))
     
      console.log("this should be after video info")
      let new_gallery_id = randomHash() // create new gallery id

      let valid = await checkMediaValid(processedFiles)
      if (!valid) {
        // early exit
        return reject([400, null])
      }
      console.log('all checks checked')
      // call to create new gallery row (need to make sure this happens in sync with file dispatch to bucket)
      let create_gallery_response = await Gallery.create(
        postTitle,
        req.user.user_id,
        req.user.username,
        new_gallery_id,
        postDescription
      )

      if (create_gallery_response == 500) {
        return reject[(500, null)]
      }
      // create images
      let create_media_results = await Promise.all(processedFiles.map(async (file) =>{
        return await this.createMediaObject(
            file,
            req,
            new_gallery_id
          )
      }))

      // deal with tags if present
      let tags
      if(req.body.tags){
        tags = JSON.parse(req.body.tags)
        let tag_create_completion = await Promise.all(tags.map(async(tagString)=>{
          let tag_create_res = await TS.addTagToGallery(tagString, new_gallery_id)
        }))
        console.log("finished with adding tags to new gallery")
      }
      

      console.log('non async worked')
      return resolve([200, new_gallery_id])
     
    })
  }

  async createMediaObject(file, req, new_gallery_id) {
    console.log("creating a media object")
    let add_image_response = await Image.addSync(
      file,
      req.user.user_id,
      new_gallery_id
    )
    if (add_image_response == 500) {
      return 500
    }
    let media_dispatch_response = await MediaService.create_new_object(file)
    return media_dispatch_response
  }

  // for owner editing routes
  async addImage(req) {
    try {
      // check gallery length to impose 100 image gallery limit
      console.log("adding image to " + req.params.gallery_id)
      let images = await Image.getAllSync(req.params.gallery_id)
      let length = images.length
      if (length >= 100) return 401
      // don't allow if upload limit reached
      if (req.user.limit >= 60) {
        return  429
      }
      // check file sizes
      let file = req.files[0]
      let processedFile = await process_media_statistics(file) // create new unique filename
      // console.log(processedFile)
  
      
      // determine if filetype is valid and filesize is ok
      let type = getType(processedFile.newName)
      let limit
      if (type === "video") {
        limit = 60000000
      } else {
        limit = 20000000
      }
      if (processedFile.buffer.length > limit) {
        return 413
      }
      // create image entry
      let image_db_response = await Image.addSync(processedFile, req.user.user_id, req.params.gallery_id)

      // dispatch media
      let media_service_response = await MediaService.create_new_object(processedFile)
      
      // increment upload limit
      let increment_response = await User.incrementLimit(req.user.user_id)
      
      console.log(increment_response)
      return 200

    } catch (err) {
      console.log(err)
      return 500
    }

    
  }

  async updateTitle(newTitle, gallery_id) {
    try{
      let set_title_response = await Gallery.setTitle(newTitle, gallery_id)
      return 200
    }
    catch(err){
      return 500
    }
    
  }

  async updateImageDescription(description, image_id, gallery_id) {
    console.log("updating image description")
    try{
      let description_update_response = await Image.updateDescription(description, image_id, gallery_id)
      return 200
    }
    catch(err){
      return 500
    }
    
  }

  async deleteGallery(gallery_id) {
    return new Promise(async (resolve, reject) => {
      let images_to_delete = await Image.getAllSync(gallery_id)
      let delete_gallery_response = await Gallery.deleteSync(gallery_id)
      if (delete_gallery_response == 500) {
        return 500
      }
      let image_object_array = GS.create_image_array(images_to_delete)
      async.each(
        image_object_array,
        async (imageObj, cb) => {
          let delete_media_response = await MediaService.delete(imageObj)
          if (delete_media_response == 500) {
            return Promise.resolve()
          }
          return Promise.resolve()
        },
        function (err) {
          if (err) {
            reject(500)
            return
          }
          console.log("all media from image array deleted.")
          resolve(200)
          return
        }
      )
    })
  }

  async deleteImage(gallery_id, image_id) {
    // check images in gallery, if only 1, early return
    try {
      let gallery_images = await Image.getAllSync(gallery_id)
      if (gallery_images.length == 1) {
        return 500
      }
    } catch (err) {
      console.log(err)
    }

    // get image object
    let imageObj = await Image.getSync(image_id)
    if (imageObj == 500) {
      return 500
    }
    let image_delete_response = await Image.deleteSync(gallery_id, image_id)
    if (image_delete_response == 500) {
      return 500
    }
    if (image_delete_response.rowsAffected == 0) {
      return 500
    }
    let media_service_delete_response = await MediaService.delete(
      GS.create_image_object(imageObj)
    )
    if (media_service_delete_response == 500) {
      return 500
    }
    return 200
  }

  // arrangements
  async update_arrangement(gallery_id, arrangement_order_array) {
    if (!Array.isArray(arrangement_order_array)) return 500
    let order_array = arrangement_order_array.map(
      (imageObj) => imageObj.image_id
    )
    // get images from db to verify all image_id match
    try {
      let images = await Image.getAllSync(gallery_id)
      let valid = true
      console.log(order_array)
      if (order_array.length !== images.length) return 500

      images.forEach((image) => {
        if (!order_array.includes(image.image_id)) {
          valid = false
        }
      })
      console.log("here2")
      // early return for invalid order set
      if (!valid) return 500
      // if valid create or update entry
      let set_arrangement_response = await Arrangement.createArrangement(
        gallery_id,
        JSON.stringify(order_array)
      )
      return set_arrangement_response
    } catch (err) {
      console.log(err)
      return 500
    }
  }
}

async function checkMediaValid(mediaArray) {
  return new Promise(async (resolve, reject) => {
    let valid = true
    let response = await Promise.all(mediaArray.map(async(file)=>{
      let type = getType(file.newName)
        let limit
        if (type === "video") {
          limit = 60000000
        } else {
          limit = 30000000
        }

        if (file.buffer.length > limit) {
          valid = false
        }
      return await file
    }))
    resolve(valid)
    
  })
}

// takes in an image object and gives it a new unique name, and reappends with correct extension, stored as newName in the returned object
async function process_media_statistics(imageBufferObject) {
  return new Promise(async (resolve, reject) => {
    let newName = randomHash()
    let extension = imageBufferObject.mimetype
    let mimestring = mime.extension(extension)
    if (mimestring === "qt") {
      mimestring = "mov"
    }
    newName += "." + mimestring
    imageBufferObject.newName = newName
    // console.log(imageBufferObject)
    imageBufferObject.media_type = getType(newName)
    // get dimensions
    if (imageBufferObject.media_type == "image") {
      let dimensions = imagesize(imageBufferObject.buffer)
      imageBufferObject.width = dimensions.width
      imageBufferObject.height = dimensions.height
      return resolve(imageBufferObject)
    }
    if (imageBufferObject.media_type == "video") {
      // get resolution
  
      let readStream = new Readable()
      readStream._read = () => {}
      readStream.push(imageBufferObject.buffer)
      readStream.push(null)


     console.log('attempting to get meta data')
     let metadata = await get_video_meta_data(readStream)
     console.log(metadata)


      imageBufferObject.width = metadata.streams[0].width
      imageBufferObject.height = metadata.streams[0].height
      return resolve(imageBufferObject)
    }
  })
}
async function writeFile(file){
  return new Promise((resolve, reject)=>{
    fs.writeFile(path.join(__dirname, 'tmp', file.newName), file.buffer, (err)=>{
      resolve(200)
    })
  })
}
async function deleteFile(file){
  return new Promise((resolve, reject)=>{
    fs.unlink(path.join(__dirname, 'tmp', file.newName), (err)=>{
      resolve(200)
    })
  })
}

async function get_video_meta_data(stream){
  return new Promise((resolve, reject)=>{
    ffmpeg.ffprobe(stream, (err, meta)=>{
      resolve(meta)
    })
  })
}
const videoFormats = [
  ".mp4",
  ".mov",
  ".avi",
  ".webm",
  ".mpeg",
  ".flv",
  ".mkv",
  ".mpv",
  ".wmv",
]
const imageFormats = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".apng",
  ".tiff",
  ".tif",
  ".bmp",
  ".xcf",
  ".webp",
  ".svg",
]
function getType(file) {
  console.log("checking " + file)
  let type
  videoFormats.forEach((str) => {
    if (file.includes(str)) {
      type = "video"
    }
  })
  imageFormats.forEach((str) => {
    if (file.includes(str)) {
      type = "image"
    }
  })
  return type
}

module.exports = PostService

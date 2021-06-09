const Gallery = require("../db/models/gallery.model.js")
const Likes = require("../db/models/votes.model.js")
const Images = require("../db/models/image.model")
const redis = require("redis")
const red = redis.createClient()
const async = require("async")
const MSS = require("../services/MediaStorageService")
const MediaStorageService = new MSS()
const adm = require("adm-zip")
const CommentService = require("./CommentService")
const CS = new CommentService()
const mime = require("mime-types")
const randomHash = require("./utilities/random")
const fs = require("fs")
const path = require("path")
const Arrangement = require("../db/models/arrangement.model")
// the gallery service handles the editing of gallery properties and uploading new images/videos
const create_id = require("./create_id.js")
const Votes = require("../db/models/votes.model.js")
const domain = "https://i.imgbeam.com/"
class GalleryService {
  async getOne(gallery_id) {
    try {
      console.log("id: " + gallery_id)
      let gallery_response = await Gallery.get(gallery_id)
      return await this.create_safe_dispatch_async(gallery_response)
    } catch (err) {
      console.log(err)
      return err
    }
  }
  // grab one gallery, including pathnames and descriptions
  async addView(gallery_id, cookies) {
    // if cookie already exists for gallery_id, do not add view
    if (cookies[gallery_id] == "") {
      return 500
    }
    try {
      // add view to gallery
      let add_view_response = await Gallery.addView(gallery_id)
      return add_view_response
    } catch (err) {
      return 500
    }
  }
  async addHistoryView(gallery_id, user_id) {
    try {
      let add_view_response = await Gallery.addHistoryView(gallery_id, user_id)
      return add_view_response
    } catch (err) {
      return 500
    }
  }
  // get all posts via user_id
  async getPosts(user_id) {
    try {
      let raw_galleries = await Gallery.getByUserIDSync(user_id)
      let galleries = await Promise.all(
        raw_galleries.map(async (gallery) => {
          return await this.create_safe_dispatch_async(gallery)
        })
      )
      return galleries
    } catch (err) {
      console.log(err)
      return 500
    }
  }
  async getViewHistory(user_id) {
    let views = await Gallery.getHistoryViews(user_id)
    let galleries = await Promise.all(
      views.map(async (view_history_object) => {
        let gall = this.create_safe_dispatch_async(
          await Gallery.get(view_history_object.gallery_id)
        )
        gall.date_viewed = view_history_object.date_viewed
        return gall
      })
    )
    // sort into days
    let sorted = []

    return galleries
  }
  async deleteViewHistoryUser(user_id) {
    try {
      let delete_response = await Gallery.deleteHistoryViewUser(user_id)
      return 200
    } catch (err) {
      return 500
    }
  }
  getLikes(gallery_id, callback) {
    Likes.getByGallery(gallery_id, (err, res) => {
      if (err) {
        return callback(err, null)
      }
      return callback(null, res)
    })
  }
  async getLikesSync(gallery_id) {
    return await Likes.getByGallerySync(gallery_id)
  }

  getImages(gallery_id, callback) {
    Images.getAll(gallery_id, (err, res) => {
      return callback(err, res)
    })
  }

  process_image(imageBufferObject) {
    console.log("processing image")
    let originalName = imageBufferObject.originalname
    let newName = randomHash()
    let extension = imageBufferObject.mimetype
    let mimestring = mime.extension(extension)
    newName += "." + mimestring
    imageBufferObject.newName = newName
    return imageBufferObject
  }

  // build an object for sending to the client when they view a gallery
  // this should make sure it doesnt send any private information like reports, user_id, etc
  async create_safe_dispatch(galleryRow, callback) {
    let gallery_for_client = {}
    // get image array
    this.getImages(galleryRow.gallery_id, async (err, res) => {
      if (galleryRow.avatar)
        gallery_for_client.avatar = domain + galleryRow.avatar
      gallery_for_client.username = galleryRow.username
      gallery_for_client.title = galleryRow.title
      gallery_for_client.gallery_id = galleryRow.gallery_id
      gallery_for_client.description = galleryRow.description
      gallery_for_client.date_created = galleryRow.date_created
      gallery_for_client.views = galleryRow.views
      gallery_for_client.comment_count = await CS.getCount(
        galleryRow.gallery_id
      )
      gallery_for_client.comments_enabled = galleryRow.comments_enabled
      this.getVotes(galleryRow.gallery_id, async (err, votes) => {
        if (res) {
          gallery_for_client.images = this.create_image_array(
            res,
            galleryRow.sequence
          )
        }
        gallery_for_client.singleton =
          gallery_for_client.images.length === 1 ? true : false
        gallery_for_client.upvotes = 0
        gallery_for_client.downvotes = 0
        votes.forEach((vote) => {
          if (vote.vote_type == 0) {
            gallery_for_client.downvotes += 1
            return
          }
          gallery_for_client.upvotes += 1
        })
        this.getLikes(galleryRow.gallery_id, (err, likes) => {
          gallery_for_client.likes = likes
          return callback(gallery_for_client)
        })
      })
    })
  }

  async create_safe_dispatch_async(galleryRow, req) {
    return new Promise(async (resolve, reject) => {
      try {
        let gallery_for_client = {}
        // get image array
        let images = await Images.getAllSync(galleryRow.gallery_id)

        // check for sequence data
        let sequence = null
        try {
          sequence = JSON.parse(
            await this.getArrangement(galleryRow.gallery_id)
          )
        } catch (err) {}
        gallery_for_client.arrangement = sequence
        gallery_for_client.images = this.create_image_array(images, sequence)

        // avatar if present
        if (galleryRow.avatar){

          gallery_for_client.avatar = domain + galleryRow.avatar
        gallery_for_client.avatar_lq =
          domain + this.get_lq_name(galleryRow.avatar)
        }
        else{
          gallery_for_client.avatar = "/defaults/avatar"
        gallery_for_client.avatar_lq =
          "/defaults/avatar"
        }
       
        // check ownership
        if (req) {
          if (req.user) {
            if (req.user.username === galleryRow.username) {
              gallery_for_client.owner = true
            }
          } else {
            gallery_for_client.owner = false
          }
        } else {
          gallery_for_client.owner = false
        }

        gallery_for_client.avatar = domain + galleryRow.avatar
        gallery_for_client.username = galleryRow.username
        gallery_for_client.title = galleryRow.title
        gallery_for_client.gallery_id = galleryRow.gallery_id
        gallery_for_client.description = galleryRow.description
        gallery_for_client.date_created = galleryRow.date_created
        gallery_for_client.views = galleryRow.views
        gallery_for_client.comment_count = await CS.getCount(
          galleryRow.gallery_id
        )

        gallery_for_client.comments_enabled = galleryRow.comments_enabled
        gallery_for_client.upvotes = 0
        gallery_for_client.downvotes = 0
        gallery_for_client.singleton =
          gallery_for_client.images.length === 1 ? true : false
        let votes = await this.getVotesSync(galleryRow.gallery_id)
        votes.forEach((vote) => {
          if (vote.vote_type == 0) {
            gallery_for_client.downvotes += 1
            return
          }
          gallery_for_client.upvotes += 1
        })
        gallery_for_client.likes = await this.getLikesSync(
          galleryRow.gallery_id
        )
        resolve(gallery_for_client)
        return
      } catch (err) {
        console.log(err)
        reject(500)
      }
    })
  }
  async getArrangement(gallery_id) {
    try {
      let arrangement_response = await Arrangement.getArrangement(gallery_id)
      if (arrangement_response == 500) return null
      if (arrangement_response.length == 0) return null
      return arrangement_response
    } catch (err) {
      return null
    }
  }
  get_lq_name(file_name) {
    if (!file_name) return null
    let splitz = file_name.split(".")
    return splitz[0] + "_lq.webp"
  }
  getVotes(gallery_id, callback) {
    Votes.getByGallery(gallery_id, (err, votes) => {
      return callback(err, votes)
    })
  }
  async getVotesSync(gallery_id) {
    return await Votes.getByGallerySync(gallery_id)
  }
  create_image_array(images, sequence) {
    // console.log(images)
    let imageArray = images.map((imageObj, index) => {
      delete imageObj.original_name
      imageObj.path = domain + imageObj.file_name
      imageObj.key = imageObj.file_name
      let ext = imageObj.file_name.split(".")
      imageObj.thumb = domain + imageObj.image_id + "_lq_thumb.gif"
      imageObj.key_thumb = imageObj.image_id + "_lq_thumb.gif"

      // update lq path for images and video
      // video
      if (imageObj.media_type == "video") {
        imageObj.path_lq = domain + imageObj.image_id + "_lq." + ext[1]
        imageObj.key_lq = imageObj.image_id + "_lq." + ext[1]
      }
      // images
      if (imageObj.media_type == "image") {
        if (imageObj.file_extension.includes("gif")) {
          imageObj.path_lq = domain + imageObj.image_id + "_lq.gif"
          imageObj.key_lq = imageObj.image_id + "_lq.gif"
        } else {
          imageObj.path_lq = domain + imageObj.image_id + "_lq.webp"
          imageObj.key_lq = imageObj.image_id + "_lq.webp"
        }
      }
      imageObj.image_id = imageObj.image_id.replace(/\.[^/.]+$/, "")
      return imageObj
    })
    // optional ordering of array
    if (sequence) {
      // console.log("sequence found")
      let sequence_array = sequence
      let images = imageArray
      let new_images = []
      sequence_array.forEach((image_id, index) => {
        images.forEach((image_object) => {
          if (image_object.image_id === image_id) {
            new_images.push(image_object)
          }
        })
      })
      imageArray = new_images
    }
    // return image array
    return imageArray
  }

  create_image_object(image) {
    // console.log(images)
    delete image.original_name
    image.path = domain + image.file_name
    image.key = image.file_name
    let ext = image.file_name.split(".")
    image.thumb = domain + image.image_id + "_lq_thumb.gif"
    image.key_thumb = image.image_id + "_lq_thumb.gif"

    // update lq path for images and video
    // video
    if (image.media_type == "video") {
      image.path_lq = domain + image.image_id + "_lq." + ext[1]
      image.key_lq = image.image_id + "_lq." + ext[1]
    }
    // images
    if (image.media_type == "image") {
      if (image.file_extension.includes("gif")) {
        image.path_lq = domain + image.image_id + "_lq.gif"
        image.key_lq = image.image_id + "_lq.gif"
      } else {
        image.path_lq = domain + image.image_id + "_lq.webp"
        image.key_lq = image.image_id + "_lq.webp"
      }
    }
    image.image_id = image.image_id.replace(/\.[^/.]+$/, "")
    return image

    return imageArray
  }

  create_image_link(imagePath) {
    return domain + imagePath
  }

  async getZip(gallery_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let images = await Images.getAllSync(gallery_id)
        let image_objects = []
        async.each(
          images,
          async (image, cb) => {
            try {
              let object_get = await MediaStorageService.retrieve(
                image.file_name
              )
              console.log(object_get)
              image_objects.push(object_get)
              Promise.resolve()
              return
            } catch (err) {
              Promise.reject()
            }
          },
          function (err) {
            if (err) {
              console.log(err)
            }
            let result = image_objects
            console.log(result)

            // now zip results
            let zip = new adm()

            let count = 0
            result.forEach((imageObj, index) => {
              console.log(images[index].file_name)
              count++
              console.log(imageObj)
              zip.addFile(images[index].file_name, imageObj.Body)
            })

            let zipFile = zip.toBuffer()
            let object = {
              success: true,
              archive: zipFile,
              archiveName: create_id() + ".zip",
            }
            console.log(object)
            // return
            resolve(object)
          }
        )
      } catch (err) {
        console.log(err)
        reject(500)
      }
    })
  }
  async download(gallery_id) {
    try {
      let images_response = await Images.getAllSync(gallery_id)
      let file_name = images_response[0].file_name
      let object = await MediaStorageService.retrieve(file_name)
      console.log(object)
      return {
        success: true,
        image: object.Body,
        file_name: file_name,
        content_type: images_response[0].file_extension,
      }
    } catch (err) {
      console.log(err)
      return err
    }
  }
  // get a gallery with relationship to visiting user
  getWithRelationship(gallery_id, visitor_id, callback) {
    Gallery.getWithRelationship(gallery_id, visitor_id, (err, gallery) => {
      if (err) {
        return callback({
          success: false,
          message: "error with db query",
        })
      }
      return callback({
        success: true,
        galleries: gallery,
      })
    })
  }

  // get a gallery array from an array of gallery_id
  getGalleries(gallery_id_array, callback) {
    let that = this
    async.map(
      gallery_id_array,
      (gallery_id, cb) => {
        Gallery.getOne(gallery_id, (err, gallery_row) => {
          if (err) return cb(err, null)
          return cb(null, gallery_row)
        })
      },
      function (err, galleryArray) {
        if (err) return callback([])
        async.map(
          galleryArray,
          (gallery, cb2) => {
            that.create_safe_dispatch(gallery, (safeGallery) => {
              return cb2(null, safeGallery)
            })
          },
          function (err, safeGalleryArray) {
            return callback(safeGalleryArray)
          }
        )
      }
    )
  }
  async getGalleriesSync(gallery_id_array) {
    let array = JSON.parse(gallery_id_array)
    console.log(array)
    try {
      let galleries = await Promise.all(
        array.map(async (gallery_id) => {
          let gallery = await Gallery.get(gallery_id)
          // return if no longer exists
          if (!gallery) return false
          // console.log(gallery)
          return await this.create_safe_dispatch_async(gallery)
        })
      )
      galleries = galleries.filter((gallery) => {
        if (gallery == false) return false
        return true
      })
      // console.log(galleries)
      return galleries
    } catch (err) {
      return 500
    }
  }

  async getFromRedis(gallery_key) {
    return new Promise((resolve, reject) => {
      red.get(gallery_key, (err, gallery_as_string) => {
        if (err || gallery_as_string == null) {
          return reject(null)
        }
        resolve(JSON.parse(gallery_as_string))
      })
    })
  }
}

module.exports = GalleryService

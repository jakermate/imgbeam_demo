// this service interfaces with the aws api and dispatches changes to the spaces bucket
// will mostly be relied on by other services as opposed to being called directly by routes
const aws = require("aws-sdk")
const credentials = require("./space.config")
const ThumbnailService = require("./ThumbnailService")
const TS = new ThumbnailService()
const endpoint = new aws.Endpoint("sfo2.digitaloceanspaces.com")
const s3 = new aws.S3({
  endpoint: endpoint,
  accessKeyId: "JXJUAB2L6WXNEYUEK4KP",
  secretAccessKey: "DhEUiYXprkrti6gXeD/MtBdQiyK1bhPkW4K4nIFNNbU",
})

// object constructor, built prior to dispatching
class Object {
  constructor(objectBuffer, __filename, mime) {
    this.Key = __filename
    this.Body = objectBuffer
    this.Bucket = "imgbeam"
    this.ACL = "public-read"
    this.ContentEncoding = "base64"
    this.ContentType = mime
  }
}

class MediaStorageService {
  async create_avatar_object(mediaObject) {
    try {
      // make lq image
      let lq_object = await TS.create_lq_avatar(mediaObject)

       // send regular image
       let res = await this.send(mediaObject)
       // send lq image
      let lq_res = await this.send(lq_object)

      return 200
    }
    catch(err){
      console.log(err)
      return 500
    }
  }
  async create_backdrop_object(mediaObject) {
    try {
       // send regular image
       let res = await this.send(mediaObject)

      return 200
    }
    catch(err){
      console.log(err)
      return 500
    }
  }
  // send newly created/process image out to cdn
  async create_new_object(mediaObject) {
    return new Promise(async (resolve, reject) => {
      console.log("setting up media dispatch - ")

      // send full size image
      console.log("MediaService built new object ")
      let result = await this.send(mediaObject)
      // console.log('after async storage' + JSON.stringify(result))
      if (result.error) {
        console.log("Error sending object to bucket.")
        return reject(500)
      }

      // create thumbnail
      let lq_response = await TS.request_lq(mediaObject)
      // send out thumbnail
      let lq_sent_response = await this.send(lq_response)
      // if video, and thumbnail gif present, send that too
      if (mediaObject.media_type == "video") {
        let thumbnail_object = await TS.ffmpeg_get_video_thumb(mediaObject)
        console.log(thumbnail_object)
        if (thumbnail_object == 500) {
          return
        }
        let thumb_response = await this.send(thumbnail_object)
      }

      // return
      return resolve(200)
    })
  }
  // send to cdn
  async send(fileObject) {
    let newObject = new Object(
      fileObject.buffer,
      fileObject.newName,
      fileObject.mimetype
    )
    try {
      const result = await s3.putObject(newObject).promise()
      console.log(result)
      return result
    } catch (err) {
      console.log(err)
      return err
    }
  }
  // retrieve asset from cdn
  async retrieve(key) {
    return new Promise(async (resolve, reject) => {
      console.log("retrieving " + key + " from bucket")
      let params = {
        Key: key,
        Bucket: "imgbeam",
      }
      try {
        let s3_response = await s3.getObject(params).promise()
        console.log(s3_response)
        resolve(s3_response)
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }
  

  // delete media asset (usually occurs as record is deleted from database)
  async delete(fileObj) {
    return new Promise(async (resolve, reject) => {
      // setup params for all media versions
      let base_params = {
        Key: fileObj.key,
        Bucket: "imgbeam",
      }
      let lq_params = {
        Key: fileObj.key_lq,
        Bucket: "imgbeam",
      }
      let video_gif_params = {
        Key: fileObj.key_thumb,
        Bucket: "imgbeam",
      }

      console.log("deleting " + JSON.stringify(fileObj) + " from bucket")
      try {
        let res_base = await s3.deleteObject(base_params).promise()
        let res_lq = await s3.deleteObject(lq_params).promise()
        console.log("both versions deleted")

        // if video, get rid of gif thumbnail
        try {
          let res_gif = await s3.deleteObject(video_gif_params).promise()
        } catch (err) {
          console.log("No thumbnail gif to delete")
        }

        return resolve(200)
      } catch (err) {
        console.log(err)
        return reject(err)
      }
    })
  }

  async delete_avatar(key){
    console.log(key)
    let avatar_params = {
        Key: key,
        Bucket: "imgbeam",
      }
    let avatar_params_lq = {
      Key: this.get_lq_key(key),
      Bucket: 'imgbeam'
    }
    try{
      let res_base = await s3.deleteObject(avatar_params).promise()
      // console.log(res_base)
      let res_lq = await s3.deleteObject(avatar_params_lq).promise()
      // console.log(res_lq)
      return 200
    }
    catch(err){
      console.log(err)
      return 500
    }

   }
   async delete_backdrop(key){
    console.log(key)
    let backdrop_params = {
        Key: key,
        Bucket: "imgbeam",
      }
  
    try{
      let response = await s3.deleteObject(backdrop_params).promise()
      // console.log(res_base)
    
      return 200
    }
    catch(err){
      console.log(err)
      return 500
    }

   }

  get_lq_key(key){
    let splitz = key.split('.')
    return splitz[0] + '_lq.webp'
  }

}
module.exports = MediaStorageService

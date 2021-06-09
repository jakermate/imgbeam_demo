const sharp = require("sharp")
const ffmpeg = require("fluent-ffmpeg")
const path = require("path")
const fs = require("fs")
const { Readable, Writable } = require("stream")
class ThumbnailService {
  // general thumbnail request to parse thumbnail type
  async request_lq(mediaObject) {
    console.log(mediaObject)
    if (mediaObject.media_type == "image") {
      let thumbnail_response = await this.create_lq_image(mediaObject)
      return thumbnail_response
    }
    if (mediaObject.media_type == "video") {
      let thumbnail_response = await this.create_lq_video(mediaObject)
      return thumbnail_response
    }
    return "there was an error creating thumbnail"
  }

  // IMAGE
  // create thumbnail verion
  async create_lq_image(imageObject, size = 500) {
    if (imageObject.mimetype == "image/gif") {
      // alter newName of object
      let splits = imageObject.newName.split(".")

      imageObject.newName = splits[0] + "_lq." + splits[1]
      return imageObject
    }

    // feed in image object and resize buffer
    let newBuffer = await sharp(imageObject.buffer, {
      // animated: imageObject.mimetype == "image/gif" ? true : false
    })
      .resize({
        width: size,
      })
      .webp()
      .toBuffer()
    // console.log('now continuing async TS function')
    // deep copy original object
    let thumbnailObject = JSON.parse(JSON.stringify(imageObject))
    // replace buffer with thumbnail buffer
    thumbnailObject.buffer = newBuffer
    thumbnailObject.mimetype = "image/webp"
    // alter newName of object
    thumbnailObject.newName = this.create_lq_image_name(thumbnailObject.newName)
    console.log(thumbnailObject)

    return thumbnailObject
  }

  async create_lq_avatar(imageObject) {
    let newObject = { ...imageObject }
    try {
      let newBuffer = await sharp(newObject.buffer)
        .resize({
          width: 64,
          height: 64,
          fit: "outside",
        })
        .webp()
        .toBuffer()
      newObject.mimetype = "image/webp"
      newObject.buffer = newBuffer
      newObject.newName = this.create_lq_image_name(newObject.newName)
      return newObject
    } catch (err) {
      console.log(err)
      return 500
    }
  }

  // VIDEO
  async create_lq_video(videoBufferObject, size = 500) {
    // new method
    let stream = new Readable()
    stream._read = () => {}
    stream.push(videoBufferObject.buffer)
    stream.push(null)

    let split = videoBufferObject.newName.split(".")
    let pre = split[0]
    let ext = split[1]

    // await lq conversion and save to fs
    try {
      let ffmpegRes = await this.ffmpeg_get_lq(pre, ext, stream)
      if (ffmpegRes == 200) {
        console.log("ffmpeg success")
      }
      if (ffmpegRes == 500) {
        console.log("ffmpeg failure")
      }
    } catch (err) {
      console.log("it fucked up")
    }

    // read saved lq file
    let lq_video = fs.readFileSync(
      path.join(__dirname, "tmp", `${pre}_lq.${ext}`)
    )
    // update videoObject to low quality buffer
    videoBufferObject.buffer = lq_video

    // update name
    videoBufferObject.newName = `${pre}_lq.${ext}`

    fs.unlinkSync(path.join(__dirname, "tmp", `${pre}_lq.${ext}`))

    return videoBufferObject
  }

  // lower quality video with no audio and 20 sec duration
  ffmpeg_get_lq(pre, ext, videoStream) {
    return new Promise((resolve, reject) => {
      try {
        ffmpeg(videoStream)
          .size("480x?")
          .videoBitrate("256")
          .duration(20)
          .noAudio()
          .on("end", () => {
            resolve(200)
          })
          .on("error", (err) => {
            console.log(err)
            console.log("error with lq video conversion")
            reject(500)
          
          }).save(path.join(__dirname, "tmp", `${pre}_lq.${ext}`))
         
      } catch (err) {
        console.log(err)
      }
    })
  }

  // get a static thumbnail from start of video
  ffmpeg_get_video_thumb(videoBufferObject) {
    let oldName = videoBufferObject.newName
    let split = videoBufferObject.newName.split(".")
    let pre = split[0]
    let ext = split[1]
    fs.writeFileSync(
      path.join(__dirname, "tmp", `${oldName}`),
      videoBufferObject.buffer
    )

    return new Promise((resolve, reject) => {
      ffmpeg(path.join(__dirname, "tmp", `${oldName}`))
        .size("128x?")
        .duration(8)
        .noAudio()
        .fps(15)
        .save(path.join(__dirname, "tmp", `${pre}.gif`))
        .on("end", () => {
          // alter thumbnail object
          videoBufferObject.buffer = fs.readFileSync(
            path.join(__dirname, "tmp", `${pre}.gif`)
          )
          videoBufferObject.newName = pre + "_thumb.gif"
          videoBufferObject.mimetype = "image/gif"
          // delete tmp files
          fs.unlinkSync(path.join(__dirname, "tmp", `${pre}.gif`))
          fs.unlinkSync(path.join(__dirname, "tmp", `${oldName}`))

          // return gif thumbnail object
          resolve(videoBufferObject)
        })
        .on("error", () => {
          reject(500)
        })
    })
  }

  create_lq_image_name(newName) {
    let array = newName.split(".")
    let ext = array[1]
    let pre = array[0]
    let thumb_name = pre + "_lq.webp"
    console.log(thumb_name)
    return thumb_name
  }
}

module.exports = ThumbnailService

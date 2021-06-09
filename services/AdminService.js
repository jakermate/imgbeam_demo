const User = require("../db/models/user.model")
const Comment = require("../db/models/comment.model")
const Gallery = require("../db/models/gallery.model")
const async = require("async")
const Image = require("../db/models/image.model")
const ms = require("./MediaStorageService")
const Report = require("../db/models/reports.model")
const GalleryService = require("../services/GalleryService")
const GS = new GalleryService()

const Media = new ms()
// the adminservice is responsible for all elivated privilege actions that an admin with use
class AdminService {
  async getUserID(user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.findOneUserID(user_id)
        if (user.length == 0) return null
        user = user[0]
        this.get_galleries(user.user_id, (err, galleries) => {
          user.galleries = galleries
          resolve(user)
          return
        })
      } catch (err) {
        console.log(err)
        reject(500)
        return
      }
    })
  }
  getUserUsername(username, callback) {
    User.findOneUsername(username, (err, res) => {
      if (err) {
        return callback({
          success: false,
          message: "Error finding user.",
        })
      }
      if (res) {
        let user = res
        this.get_galleries(user.user_id, (err, galleries) => {
          if (err) {
            return callback({
              success: false,
              message: "error getting galleries",
            })
          }
          user.galleries = galleries
          return callback({
            success: true,
            user: user,
          })
        })
      }
      if (!res) {
        return callback({
          success: true,
          user: null,
        })
      }
    })
  }
  getUserEmail(email, callback) {
    User.findOneEmail(email, (err, user) => {
      if (err) {
        return callback({
          success: false,
          message: "Error finding user.",
        })
      }
      if (user) {
        this.get_galleries(user.user_id, (err, galleries) => {
          if (err) {
            return callback({
              success: false,
              message: "error getting galleries",
            })
          }
          user.galleries = galleries
          return callback({
            success: true,
            user: user,
          })
        })
      }
      if (!user) {
        return callback({
          success: true,
          user: null,
        })
      }
    })
  }
  get_galleries(user_id, callback) {
    Gallery.getByUserID(user_id, (err, res) => {
      async.map(
        res,
        (gallery, cb) => {
          Image.getAll(gallery.gallery_id, (err, imageArray) => {
            if (imageArray) {
              gallery.images = GS.create_image_array(imageArray)
              return cb(null, gallery)
            }
          })
        },
        function (err, newGalleryArray) {
          return callback(err, newGalleryArray)
        }
      )
    })
  }

  delete_user(user_id, callback) {
    // permanently delete user
    User.delete(user_id, (err, res) => {
      if (err) {
        return callback({
          success: false,
          message: "User not deleted",
        })
      }
      if (res.affectedRows > 0) {
        console.log("Deleted user - " + user_id)
        return callback({
          success: true,
          message: "User deleted.",
        })
      }
      if (res.affectedRows == 0) {
        return callback({
          success: false,
          message: "User not deleted.",
        })
      }
    })
  }
  delete_comment(comment_id, user_id, callback) {
    Comment.delete(comment_id, user_id, (err, res) => {
      if (err) {
        return callback({
          success: false,
          message: "Comment not deleted.",
        })
      }
      if (res.affectedRows > 0) {
        return callback({
          success: true,
          message: "Comment deleted.",
        })
      } else {
        return callback({
          success: false,
          message: "Comment not deleted.",
        })
      }
    })
  }
  async delete_gallery(gallery_id, callback) {
    return new Promise(async (resolve, reject) => {
      // get image list
      let images = await Image.getAllSync(gallery_id)
      if (images == 500) {
        return 500
      }
      // delete gallery
      let gallery_delete_response = await Gallery.deleteSync(gallery_id)
      if (gallery_delete_response == 500) {
        return 500
      }
      async.each(
        GS.create_image_array(images),
        async (image, cb) => {
          try {
            let media_delete_res = await Media.delete(image)
            console.log(media_delete_res)
            Promise.resolve(null)
            return
          } catch (err) {
            Promise.reject(err)
            return
          }
        },
        function (err) {
          console.log("Made it to callback of async delete")
          if (err) {
            console.log(err)
            reject(500)
            return
          }
          resolve(200)
          return
        }
      )
    })
  }
  async delete_image(gallery_id, image_id) {
    let imageObject = await Image.getSync(image_id)
    if (imageObject == 500) {
      return 500
    }
    if (imageObject.length == 0) {
      return 500
    }
    let image_delete_response = await Image.deleteSync(gallery_id, image_id)
    if (image_delete_response == 500 || image_delete_response.length == 0) {
      return 500
    }
    let media_delete_response = await Media.delete(imageObject[0])
    return media_delete_response
  }
  // REPORTS
  async get_all_reports() {
    try {
      let reports = await Report.getAll()
      console.log(reports)
      return reports
    } catch (err) {
      return 500
    }
  }
  async clear_report(report_id) {
    if (isNaN(report_id)) {
      return 500
    }
    return await Report.clear(report_id)
  }
}
module.exports = AdminService

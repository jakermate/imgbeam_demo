const Notifications = require("../db/models/notifications.model")
const Comment = require("../db/models/comment.model")
const Gallery = require("../db/models/gallery.model")
const async = require('async')
class NotificationService {
  set_comment_notification(reply_id, callback) {
    console.log("setting notification")
    // should find comment owner based on comment_id, and set comment_notification for them
    Comment.getByID(reply_id, (err, res) => {
      if (err) {
        return callback({
          success: false,
          message: "Could not query for comment.",
        })
      }
      if (!res.length) {
        return callback({
          success: false,
          message: "Comment not found with that ID.",
        })
      }
      if (res.length) {
        // comment found, now create notification for it's user
        console.log(res)
        Notifications.addComment(res[0].user_id, reply_id, (err, res) => {
          if (err) {
            return callback({
              success: false,
              message: "Could not add comment notification.",
            })
          }
          if (res.affectedRows == 0) {
            if (err) {
              return callback({
                success: false,
                message: "Error adding comment.",
              })
            }
          }
          if (res.affectedRows > 0) {
            return callback({
              success: true,
              message: "Successfully added comment notification.",
            })
          }
        })
      }
    })
  }
  set_post_comment_notification(gallery_id, comment_id, callback) {
    console.log("setting notification")
    // should find comment owner based on comment_id, and set comment_notification for them
    Gallery.getOwner(gallery_id, (err, res) => {
      if (err) {
        return callback({
          success: false,
          message: "Could not query for gallery owner.",
        })
      }
      if (!res.length) {
        return callback({
          success: false,
          message: "Gallery not found with that ID.",
        })
      }
      if (res.length) {
        // comment found, now create notification for it's user
        console.log(res)
        Notifications.addComment(res[0].user_id, comment_id, (err, res) => {
          if (err) {
            return callback({
              success: false,
              message: "Could not add gallery post notification.",
            })
          }
          if (res.affectedRows == 0) {
            if (err) {
              return callback({
                success: false,
                message: "Error adding comment notification.",
              })
            }
          }
          if (res.affectedRows > 0) {
            return callback({
              success: true,
              message: "Successfully added gallery comment notification.",
            })
          }
        })
      }
    })
  }

  retire_comment_notification(comment_notification_id, user_id, callback) {
    Notifications.deleteComment(comment_notification_id, user_id, (err, status) => {
      if (err) {
        return callback({
          success: false,
          message: "Could not retire notification.",
        })
      }
      if (status.affectedRows > 0) {
        return callback({
          success: true,
          message: "Comment notification retired",
        })
      }
      if (status.affectedRows == 0) {
        return callback({
          success: false,
          message: "Could not retire that comment",
        })
      }
    })
  }
  retire_all_comment_notifications(user_id, callback) {
    Notifications.deleteAllCommentsForUser(user_id, (err, status) => {
      if (err) {
        return callback({
          success: false,
          message: "Could not retire notifications.",
        })
      }
      if (status.affectedRows > 0) {
        return callback({
          success: true,
          message: "Comment notifications retired",
        })
      }
      else{
          return callback({
              success: false,
              message: 'There was nothing to clear.'
          })
      }
    })
  }

  async getUserNotifications(user_id) {
    try{
      let notifications = await Notifications.getUserComments(user_id)
      return notifications
    }
    catch(err){
      console.log(err)
      return 500
    }
      
  }
}

class Notification{
  constructor(type, user_id, gallery_id){
    this.gallery_id = gallery_id
    this.type = type
    this.user_id = user_id
  }

}

module.exports = NotificationService

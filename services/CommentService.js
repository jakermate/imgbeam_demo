const querystring = require("querystring")
const Comment = require("../db/models/comment.model")
const NS = require("../services/NotificationService")
const NotificationService = new NS()
const async = require("async")
const API = 'https://i.imgbeam.com/'
class CommentService {
  send(user_id, gallery_id, message, reply_id = null, callback) {
    // parse out comment query (was encoded in browser)
    let commentString = querystring.decode(message)
    // do verification here

    Comment.add(user_id, gallery_id, message, reply_id, (err, result) => {
      console.log(result)
      if (err) {
        console.log("error in comment service.add")
        return callback(err, null)
      }
      if (!err && result) {
        // success adding comment, if its a reply, then set a notification
        if (reply_id !== null) {
          NotificationService.set_comment_notification(
            reply_id,
            (successObject) => {
              if (!successObject.success) {
                console.log(successObject.message)
              }
              return callback(null, result)
            }
          )
        }
        if (reply_id == null) {
          NotificationService.set_post_comment_notification(
            gallery_id,
            result,
            (successObject) => {
              if (!successObject.success) {
                console.log(successObject.message)
              }
              return callback(null, result)
            }
          )
        }
      }
    })
  }
  delete(comment_id, user_id, callback) {
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
  get(gallery_id, requestingUser = "", callback) {
    Comment.get(gallery_id, (err, comments) => {
      if (err) {
        return callback(err, comments)
      }
      if (comments) {
        let count = 0
        // make a safe comment dispatch (no user_ids)
        comments.forEach((commentObj) => {
          delete commentObj.reports
          delete commentObj.user_id
          commentObj.owner = false
          if (commentObj.username === requestingUser) {
            commentObj.owner = true
          }
          commentObj.avatar_lq = API + get_lq_avatar_string(commentObj.avatar)
          commentObj.avatar = API + commentObj.avatar
          count++
        })
        // use async to get comment likes prior to structuring the comment object
        async.map(
          comments,
          (commentObj, cb) => {
            Comment.getCommentLikes(
              commentObj.comment_id,
              (err, commentLikes) => {
                if (err) return cb(err, null)
                commentObj.likes = commentLikes
                return cb(null, commentObj)
              }
            )
          },
          function (err, newComments) {
            let commentsToSort = comments
            if (!err) {
              commentsToSort = newComments
            }

            // created structured thread object
            let roots = []
            let replies = []
            let commentThread = {}

            commentsToSort.forEach((commentObj, index) => {
              commentObj.replies = []
              if (commentObj.reply_id == null) {
                roots.push(commentObj)
              } else {
                replies.push(commentObj)
              }
            })

            roots.forEach((rootObj, ind) => {
              roots[ind].replies = getReplies(rootObj)
            })

            function getReplies(root) {
              // console.log(root)
              let root_replies = []
              replies.forEach((reply) => {
                if (reply.reply_id == root.comment_id) {
                  reply.replies = getReplies(reply)
                  root_replies.push(reply)
                }
              })
              return root_replies
            }

            callback(err, roots, count)
          }
        )
      }
    })
  }
  likeComment(gallery_id, comment_id, user_id, callback) {
    Comment.likeComment(comment_id, user_id, (err, res) => {
      return callback(err, res)
    })
  }
  unlikeComment(gallery_id, comment_id, user_id, callback) {
    Comment.unlikeComment(comment_id, user_id, (err, res) => {
      return callback(err, res)
    })
  }
  getCommentLike(comment_id, user_id, callback) {
    Comment.getOneLike(comment_id, user_id, (err, res) => {
      console.log(res)
      return callback(err, res)
    })
  }
  async getCount(gallery_id, callback) {
    return new Promise((resolve, reject) => {
      Comment.countByGallery(gallery_id, (err, count) => {
        if (err) {
          reject(null)
        } else {
          resolve(count[0]["COUNT(*)"])
        }
      })
    })
  }
}
function get_lq_avatar_string(string){
  if(!string) return null
  return string.split('.')[0]+"_lq.webp"
}
module.exports = CommentService

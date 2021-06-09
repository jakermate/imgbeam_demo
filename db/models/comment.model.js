const db = require("../db.js")
const mysql = require('mysql')
const escape = require('mysql').escape
const Comment = function(){
}
Comment.add = function(user_id, gallery_id, message, reply = null, callback){
    // replace single quotes with double single quotes
    db.query(`INSERT INTO comments (user_id, gallery_id, message, reply_id) VALUES (${user_id}, '${gallery_id}', ${mysql.escape(message)}, ${reply})`, (err, result)=>{
        console.log(result)
        if(err){
            console.log(err)
            return callback(err, null)
        }
        if(!err && result){
            console.log('comment add success at db')
            db.query(`SELECT LAST_INSERT_ID()`, (err, row)=>{
                
                return callback(err, row[0]['LAST_INSERT_ID()'])

            })
        }
    })
}
// delete should not delete the entry,as this would break the comment chain
// deletion should just remove the content
Comment.delete = function(comment_id, user_id, callback){
    db.query(`UPDATE comments SET message = null, user_id = null WHERE comment_id = ${comment_id} AND user_id = ${user_id}`, (err, result)=>{
        if(err){
            console.log(err)
            return callback(err, null)
        }
        if(!err && result){
            console.log('comment delete success at db')
            return callback(null, result)
        }
    })
}
Comment.get = function(gallery_id, callback){
    db.query(`SELECT c.*, u.username, u.user_id, u.avatar FROM comments c LEFT JOIN users u ON c.user_id = u.user_id WHERE gallery_id = '${gallery_id}'`, (err, res)=>{
        return callback(err, res)
    })
}
Comment.getSync = function(gallery_id){
    return new Promise((resolve, reject)=>{
        db.query(`SELECT c.*, u.username, u.user_id FROM comments c LEFT JOIN users u ON c.user_id = u.user_id WHERE gallery_id = '${gallery_id}'`, (err, res)=>{
        if(err){
            return reject(500)
        }
        return resolve(res)
    })
    })
    
}

Comment.getByID = function(comment_id, callback){
    db.query(`SELECT c.*, u.username, u.user_id FROM comments c LEFT JOIN users u ON u.user_id = c.user_id WHERE c.comment_id = ${comment_id}`, (err, res)=>{
        return callback(err, res)
    })
}
// get user comments joined with the gallery information associated with that comment
Comment.getByUserID = function(user_id, callback){
    db.query(`SELECT c.*, g.title as gallery_title, g.username as gallery_username, g.gallery_id, g.date_created as gallery_date_created FROM comments c LEFT JOIN galleries g ON c.gallery_id = g.gallery_id WHERE c.user_id = ${user_id} ORDER BY comment_date DESC`, (err, comments)=>{
        if(err){
            console.log(err)
        }
        return callback(err, comments)
    })
}
Comment.countByGallery = function(gallery_id, callback){
    db.query(`SELECT COUNT(*) FROM comments WHERE gallery_id = ${escape(gallery_id)}`, (err, count)=>{
        return callback(err, count)
    })
}
Comment.getCommentLikes = function (comment_id, callback) {
  db.query(
    `SELECT * FROM comment_likes WHERE comment_id = ${comment_id}`,
    (err, comment_likes) => {
      return callback(err, comment_likes)
    }
  )
}
Comment.likeComment = function (comment_id, user_id, callback) {
  db.query(
    `INSERT IGNORE INTO comment_likes (comment_id, user_id) VALUES (${comment_id}, ${user_id})`,
    (err, res) => {
        console.log(res + err)
      return callback(err, res)
    }
  )
}
Comment.unlikeComment = function(comment_id, user_id, callback) {
    db.query(
    `DELETE FROM comment_likes WHERE comment_id = ${comment_id} AND user_id = ${user_id}`,
    (err, res) => {
        if(err){
            console.log(err)
        }
      return callback(err, res)
    }
  )
}
Comment.getOneLike = function(comment_id, user_id, callback){
    db.query(`SELECT * FROM comment_likes WHERE comment_id = ${comment_id} AND user_id = ${user_id}`, (err, res)=>{
        if(err){
            console.log(err)
        }
        console.log(res)
        return callback(err, res)
    })
}
module.exports = Comment
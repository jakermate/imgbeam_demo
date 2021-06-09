const db = require("../db.js")
const mysql = require('mysql')
const Notifications = function(){
}
// this is responsible for interfacing with the database for notifications of all types.

// comment replies
Notifications.getUserComments = async function(user_id){
    return new Promise((resolve, reject)=>{
        db.query(`SELECT cn.*, c.comment_id, c.gallery_id, c.comment_date, c.comment_id, c.message, c.reply_id, c.user_id AS replying_user, u.username, g.title FROM comment_notifications AS cn JOIN comments AS c ON cn.comment_id = c.comment_id JOIN users AS u ON u.user_id = c.user_id JOIN galleries g ON g.gallery_id = c.gallery_id WHERE cn.user_id = ${user_id}`, (err, res)=>{
            if(err){
                console.log(err)
                reject(500)
            }
            return resolve(res)
        })
    })
    
}
Notifications.deleteAllCommentsForUser = function(user_id, callback){
    db.query(`DELETE FROM comment_notifications WHERE user_id = ${user_id}`, (err, status)=>{
        return callback(err, status)
    })
}
Notifications.addComment = function(user_id, comment_id, callback){
    db.query(`INSERT INTO comment_notifications (user_id, comment_id)  VALUES (${user_id}, ${comment_id})`, (err, status)=>{
        if(err){
            console.log(err)
        }
        return callback(err, status)

    })
}
Notifications.deleteComment = function(comment_notification_id, user_id, callback){
    db.query(`DELETE FROM comment_notifications WHERE comment_notification_id = ${comment_notification_id} AND user_id = ${user_id}`, (err, res)=>{
        return callback(err, res)
    })
}


module.exports = Notifications
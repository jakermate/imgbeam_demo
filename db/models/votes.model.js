const db = require('../db')
const escape = require('mysql').escape
const Votes = function(){
}
Votes.upVote = function(gallery_id, user_id, callback){
    db.query(`INSERT INTO votes (gallery_id, user_id, vote_type) VALUES (${escape(gallery_id)}, ${user_id}, 1) ON DUPLICATE KEY UPDATE vote_type = 1`, (err, res)=>{
        return callback(err, res)
    })
}
Votes.downVote = function(gallery_id, user_id, callback){
    db.query(`INSERT INTO votes (gallery_id, user_id, vote_type) VALUES (${escape(gallery_id)}, ${user_id}, 0) ON DUPLICATE KEY UPDATE vote_type = 0`, (err, res)=>{
        return callback(err, res)
    })
}
Votes.deleteVote = function(gallery_id, user_id, callback){
    db.query(`DELETE FROM votes WHERE gallery_id = ${escape(gallery_id)} AND user_id = ${user_id}`, (err, res)=>{
        return callback(err, res)
    })
}
Votes.delete = function(gallery_id, user_id, callback){
    db.query(`DELETE FROM votes WHERE user_id = ${user_id} AND gallery_id = '${gallery_id}'`, (err, res)=>{
        if(err){
            console.log(err)
        }
        return callback(err, res)
    })
}
Votes.getOne = function(gallery_id, user_id, callback){
    db.query(`SELECT * FROM votes WHERE user_id = ${user_id} AND gallery_id = '${gallery_id}' `, (err,res)=>{
        if(err){
            console.log(err)
        }
        return callback(err, res)
    })
}
Votes.getByGallery = function(gallery_id, callback){
    db.query(`SELECT vote_type, vote_id FROM votes WHERE gallery_id = '${gallery_id}' `, (err, res)=>{
        if(err){
            console.log(err)
        }
        return callback(err, res)
    })
}
Votes.getByGallerySync = function(gallery_id){
    return new Promise((resolve, reject)=>{
        db.query(`SELECT vote_type, vote_id FROM votes WHERE gallery_id = '${gallery_id}' `, (err, res)=>{
        if(err){
            resolve(null)
            return
        }
        resolve(res)
        return
    })
    })
    
}
Votes.getByUser = function(user_id, callback){
db.query(`SELECT * FROM votes WHERE user_id = ${user_id} `, (err, res)=>{
    if(err){
        console.log(err)
    }
        return callback(err, res)
    })
}
module.exports = Votes
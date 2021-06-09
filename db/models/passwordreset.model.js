const db = require("../db.js")
const mysql = require('mysql')
const PasswordReset = function(){
}
PasswordReset.create = function(user_id, resetHash, resetSalt, callback){
    db.query(`REPLACE INTO password_resets (user_id, reset_hash, reset_salt) VALUES (${user_id}, '${resetHash}', '${resetSalt}') `, (err, res)=>{
        console.log('got here')
        if(err){
            console.log(err)
        }
        return callback(err, res)
    })
}

PasswordReset.get = function(user_id){
    return new Promise((resolve, reject)=>{
        db.query(`SELECT * FROM password_resets WHERE user_id = ${user_id} `, (err, res)=>{
        console.log(res)
        if(err){
            console.log(err)
            return reject(500)
        }
        return resolve(res)
    })
    })
    
}
PasswordReset.delete = function(user_id){
    return new Promise((resolve, reject)=>{
        db.query(`DELETE FROM password_resets WHERE user_id = ${user_id}`, (err ,res)=>{
            if(err){
                console.log(err)
                return reject(500)
            }
            return resolve(200)
        })
    })
}

PasswordReset.delete_old = function(callback){
    db.query(`DELETE FROM password_resets WHERE date_created < (CURRENT_TIMESTAMP - INTERVAL 1 DAY)`, (err, status)=>{
        if(err){
            console.log(err)

        }
        return callback(err, status)
    })
}
module.exports = PasswordReset
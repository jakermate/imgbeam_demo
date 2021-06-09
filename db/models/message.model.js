const db = require('../db.js')
const escape = require('mysql').escape
const socket = require('socket.io')
const auth = require('passport.socketio')
const postmaster = new socket()
postmaster.on('connect', (socket)=>{
    console.log('new connection')
})
postmaster.on('message', ()=>{

})
module.exports = {
    create_message(sender_id, receiver_id, message){
        return new Promise((resolve, reject)=>{
            db.query(`INSERT INTO messages (sender_id, receiver_id, message) VALUES (${escape(sender_id)}, ${escape(receiver_id)}, ${escape(message)});`, (err, response)=>{
                if(err){
                    console.log(err)
                    return reject(500)
                }
                return resolve(200)
            })
        })
        
    },

    get_conversation(user_id, correspondant){
        return new Promise((resolve, reject)=>{
            db.query(`SELECT m.*, u.username FROM messages as m JOIN users u ON m.sender_id = u.user_id WHERE m.sender_id IN (${user_id}, ${correspondant}) AND m.receiver_id IN (${user_id}, ${correspondant})  ORDER BY date_created ASC`, (err, conversation)=>{
                if(err){
                    console.log(err)
                    return reject(500)
                }
                return resolve(conversation)
            })
        })
    }
}
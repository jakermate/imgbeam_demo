const db = require('../db')
const escape = require('mysql').escape
const { create } = require('./gallery.model')

module.exports = {
    getAll(){
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM reports`, (err, reports) => {
        if (err) {
          return reject(err)
        }
        return resolve(reports)
      })
    })
  },
  create(gallery_id, user_id, reason){
    return new Promise((resolve, reject)=>{
      db.query(`INSERT INTO reports (gallery_id, user_id, reason) VALUES (${escape(gallery_id)}, ${user_id}, ${escape(reason)})`, (err, response)=>{
        if(err){
          console.log(err)
          return reject(500)
        }
        return resolve(response)
      })
    })
  },
  clear(report_id){
    return new Promise((resolve, reject)=>{
      db.query(`DELETE FROM reports WHERE report_id = ${report_id}`, (err, response)=>{
        if(err){
          console.log(err)
          return reject(500)
        }
        return resolve(response)
      })
    })
  }

}
 



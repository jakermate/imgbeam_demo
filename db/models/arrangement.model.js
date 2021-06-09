const db = require("../db")
const escape = require("mysql").escape

module.exports = {
  createArrangement(gallery_id, arrangement_string) {
    console.log('model maker')
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO arrangements (gallery_id, sequence) VALUES (${escape(gallery_id)}, '${arrangement_string}') ON DUPLICATE KEY UPDATE sequence = '${arrangement_string}'`, (err, res) => {
          if(err){
              console.log(err)
              reject(err)
              return
          }
          resolve(200)
          return
      })
    })
  },
  getArrangement(gallery_id){
    return new Promise((resolve, reject)=>{
        db.query(`SELECT * FROM arrangements WHERE gallery_id = ${escape(gallery_id)}`, (err, res)=>{
          // console.log(res)
            if(err){
                console.log(err)
                reject(err)
                return
            }
            if(res.length == 0){
              reject(null)
              return

            }
            resolve(res[0].sequence)
            return
        })
    })
  }
}

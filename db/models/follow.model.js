const db = require("../db")
const Follow = function () {}
Follow.check = function (user_id, target_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM follows WHERE user_id = ${user_id} AND target_id = ${target_id} `,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(500)
          return
        }
        resolve(result)
      }
    )
  })
}
Follow.create = function (user_id, target_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO follows (user_id, target_id) VALUES (${user_id}, ${target_id})`,
      (err, result) => {
          if(err){
              console.log(err)
              reject(500)
              return
          }
        return resolve(result)
      }
    )
  })
}
Follow.delete = function (user_id, target_id) {
  return new Promise((resolve, reject) => {
    db.query(
    `DELETE FROM follows WHERE user_id = ${user_id} AND target_id = ${target_id}`,
    (err, result) => {
      if(err){
          console.log(err)
          return reject(500)
      }
      return resolve(result)
    }
  )
  })
  
}
// get all who user is following,
Follow.get_following = function (user_id) {
  return new Promise((resolve, reject)=>{
    db.query(`SELECT f.target_id, u.username FROM follows as f WHERE f.user_id = ${user_id} JOIN users as u ON u.user_id = f.user_id`, (err, res)=>{
      if(err){
        console.log(err)
        return reject(500)
      }
      return resolve(res)
    })

  })
}
// get who is following a user, so get rows where they are targeted
Follow.get_followers = async function (user_id) {
  return new Promise((resolve, reject)=>{
    db.query(`SELECT f.user_id, u.username FROM follows as f JOIN users as u ON u.user_id = f.user_id WHERE f.target_id = ${user_id}`, (err, res)=>{
      if(err){
        console.log(err)
        return reject(500)
      }
      return resolve(res)
    })

  })
}
module.exports = Follow

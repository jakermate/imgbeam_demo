const db = require("../db.js")
const escape = require('mysql').escape
const Favorites = function () {}
Favorites.add = function (user_id, gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO favorites (user_id, gallery_id) VALUES (${user_id}, '${gallery_id}')`,
      (err, status) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
// this is a seperate request after favorite is added
// simply updates row to include a value for folder_id
Favorites.addToFolder = function (user_id, gallery_id, folder_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE favorites SET folder_id = ${folder_id} WHERE user_id = ${user_id} AND gallery_id = ${gallery_id}`,
      (err, res) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
Favorites.removeFromFolder = function (user_id, gallery_id, folder_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE favorites SET folder_id = null WHERE user_id = ${user_id} AND gallery_id = ${gallery_id} AND folder_id = ${folder_id}`,
      (err, res) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
Favorites.addToFolder = function (user_id, gallery_id, folder_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO favorites (user_id, gallery_id, folder_id) VALUES (${user_id}, ${gallery_id}, ${folder_id})`,
      (err, res) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
Favorites.getFolders = function(user_id){
    return new Promise((resolve, reject)=>{
        db.query(`SELECT * FROM folders WHERE user_id = ${user_id}`, (err, res)=>{
            if(err){
                console.log(err)
                return reject(500)
            }
            return resolve(res)
        })
    })
}
Favorites.createFolder = function (user_id, folderName) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO folders (name, user_id) VALUES (${escape(
        folderName
      )}, ${user_id})`,
      (err, res) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
Favorites.getFolder = function(user_id, folder_id){
  console.log('im here')
  let nulloption = folder_id === 'null' ?  'f.folder_id IS NULL' : `f.folder_id = ${folder_id}`
  return new Promise((resolve, reject)=>{
    db.query(`SELECT f.* FROM favorites as f JOIN galleries as g ON g.gallery_id = f.gallery_id WHERE f.user_id = ${user_id} AND ${nulloption}`, (err, res)=>{
      if(err){
        console.log(err)
        return reject(500)
      }
      return resolve(res)
    })
  })
}
Favorites.deleteFolder = function (user_id, folder_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM folders WHERE user_id = ${user_id} AND folder_id = ${folder_id}`,
      (err, res) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
Favorites.renameFolder = function(user_id, folder_id, folder_name){
    return new Promise((resolve, reject)=>{
        db.query(`UPDATE folders SET name = ${escape(folder_name)} WHERE user_id = ${user_id} AND folder_id = ${folder_id}`, (err, res)=>{
            if(err){
                console.log(err)
                return reject(500)
            }
            return resolve(200)
        })
    })
}
Favorites.move = function(user_id, gallery_id, folder_id){
  return new Promise((resolve, reject)=>{
    db.query(`UPDATE favorites SET folder_id = ${folder_id} WHERE user_id = ${user_id} AND gallery_id = ${escape(gallery_id)}`, (err, res)=>{
      if(err){
        console.log(err)
        return reject(500)
      }
      return resolve(200)
    })
  })
}
Favorites.remove = function (user_id, gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM favorites WHERE user_id = ${user_id} AND gallery_id = '${gallery_id}' `,
      (err, status) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
Favorites.check = function (user_id, gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM favorites WHERE user_id = ${user_id} AND gallery_id = '${gallery_id}' `,
      (err, status) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(status)
      }
    )
  })
}
Favorites.getUnsortedFavorites = function (user_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT fav.*, g.* FROM favorites as fav JOIN galleries as g ON fav.gallery_id = g.gallery_id WHERE fav.user_id = ${user_id} AND fav.folder_id IS NULL`,
      (err, res) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(res)
      }
    )
  })
}
Favorites.getByGallery = function (gallery_id, callback) {
  db.query(
    `SELECT * FROM favorites WHERE gallery_id = '${gallery_id}'`,
    (err, favorites) => {
      return callback(err, favorites)
    }
  )
}

module.exports = Favorites

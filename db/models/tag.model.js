const db = require("../db.js")
const chalk = require("chalk")
const escape = require("mysql").escape
const Tag = function () {}
Tag.getByGallery = function (gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM gallery_tags as gt JOIN tags t ON gt.tag_id = t.tag_id WHERE gt.gallery_id = '${gallery_id}' `,
      (err, tags) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(tags)
      }
    )
  })
}
Tag.create = function (name) {
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO tags (name) VALUES ('${name}')`, (err, success) => {
      if (err) {
        console.log(err)
        return reject(500)
      }
      return resolve(200)
    })
  })
}
Tag.checkInGallery = function (name, callback) {
  db.query(`SELECT * FROM gallery_tags WHERE name = '${name}'`, (err, tags) => {
    return callback(err, tags)
  })
}
Tag.getIdExact = function (tagString) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT tag_id FROM tags WHERE name = ${escape(tagString)} `,
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
Tag.getIdFulltext = function (tagString, callback) {
  db.query(
    `SELECT tag_id FROM tags MATCH (name) AGAINST ('(${escape(
      tagString
    )})' IN BOOLEAN MODE) `,
    (err, res) => {
      return callback(err, res)
    }
  )
}
Tag.addToGallery = function (tag_id, gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO gallery_tags (tag_id, gallery_id) VALUES (${tag_id}, '${gallery_id}')`,
      (err, success) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
Tag.removeFromGallery = function (tag_id, gallery_id) {
  return new Promise((resolve, reject)=>{
    db.query(
    `DELETE FROM gallery_tags WHERE tag_id = '${tag_id}' AND gallery_id = '${gallery_id}'`,
    (err, res) => {
      if(err){
        console.log(err)
        return reject(500)
      }
      return resolve(200)
    }
  )
  })
  
}
Tag.search = function (searchString) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM tags WHERE name LIKE '${searchString}%'`,
      (err, results) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(results)
      }
    )
  })
}
Tag.getGalleries = function (tag_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT gt.*, g.*, t.name, u.avatar FROM gallery_tags gt INNER JOIN galleries g ON g.gallery_id = gt.gallery_id JOIN tags t ON gt.tag_id = t.tag_id JOIN users as u ON g.user_id = u.user_id WHERE gt.tag_id = ${tag_id}`,
      (err, galleries) => {
        if (err) {
          console.log(err)
          reject(500)
          return
        }
        return resolve(galleries)
      }
    )
  })
}
Tag.getGalleriesLimit = function (tag_id, callback) {
  db.query(
    `SELECT gt.*, g.*, t.name FROM gallery_tags gt INNER JOIN galleries g ON g.gallery_id = gt.gallery_id JOIN tags t ON gt.tag_id = t.tag_id WHERE gt.tag_id = ${tag_id} ORDER BY g.date_created DESC LIMIT 20 `,
    (err, galleries) => {
      if (err) {
        console.log(err)
      }
      return callback(err, galleries)
    }
  )
}

module.exports = Tag

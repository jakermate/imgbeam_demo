const db = require("../db.js")
const escape = require("mysql").escape
const Image = function () {}

// this initiates a friendship relation row in user_relations and sets confirmed to false
Image.add = function (imageObject, user_id, gallery_id, callback) {
  let name = imageObject.newName
  let id = imageObject.newName.replace(/\.[^/.]+$/, "")
  let width = imageObject.width
  let height = imageObject.height
  if (!width) {
    width = 0
  }
  if (!height) {
    height = 0
  }
  db.query(
    `INSERT INTO images (image_id, file_name, file_extension, gallery_id, original_name, media_type, width, height, user_id) VALUES ('${id}', '${name}', '${imageObject.mimetype}', '${gallery_id}', '${imageObject.originalname}', '${imageObject.media_type}', ${width}, ${height}, ${user_id})`,
    (err, success) => {
      return callback(err, success)
    }
  )
}
Image.addSync = async function (imageObject, user_id, gallery_id) {
  return new Promise((resolve, reject) => {
    let name = imageObject.newName
    let id = imageObject.newName.replace(/\.[^/.]+$/, "")
    let width = imageObject.width
    let height = imageObject.height
    if (!width) {
      width = 0
    }
    if (!height) {
      height = 0
    }
    db.query(
      `INSERT INTO images (image_id, file_name, file_extension, gallery_id, original_name, media_type, width, height, user_id) VALUES ('${id}', '${name}', '${imageObject.mimetype}', '${gallery_id}', '${imageObject.originalname}', '${imageObject.media_type}', ${width}, ${height}, ${user_id})`,
      (err, success) => {
        if (err) {
          console.log(err)
          reject(500)
          return
        }
        return resolve(200)
      }
    )
  })
}
Image.getAll = function (gallery_id, callback) {
  db.query(
    `SELECT * FROM images WHERE gallery_id = '${gallery_id}'`,
    (err, res) => {
      return callback(err, res)
    }
  )
}
Image.getAllSync = function (gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM images WHERE gallery_id = '${gallery_id}'`,
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

Image.delete = function (gallery_id, image_id, callback) {
  console.log("deleting" + image_id + "from" + gallery_id)
  db.query(
    `DELETE FROM images WHERE gallery_id = '${gallery_id}' AND image_id = '${image_id}' `,
    (err, res) => {
      if (err) {
        console.log(err)
      }
      return callback(err, res)
    }
  )
}
Image.updateDescription = function (description, image_id, gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE images SET description = ${escape(
        description
      )} WHERE gallery_id = '${gallery_id}' AND image_id = '${image_id}'`,
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

Image.getByUser = function (user_id, callback) {
  db.query(
    `SELECT * FROM images WHERE user_id = ${user_id} ORDER BY date_added DESC`,
    (err, success) => {
      return callback(err, success)
    }
  )
}
Image.deleteByGallery = function (gallery_id, callback) {
  db.query(
    `DELETE FROM images WHERE gallery_id = ${escape(gallery_id)}`,
    (err, res) => {
      return callback(err, res)
    }
  )
}
Image.getOne = function (image_id, callback) {
  db.query(
    `SELECT * FROM images WHERE image_id = ${escape(image_id)}`,
    (err, res) => {
      return callback(err, res)
    }
  )
}

Image.getSync = async function (image_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM images WHERE image_id = ${escape(image_id)}`,
      (err, res) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(res[0])
      }
    )
  })
}
Image.deleteSync = function (gallery_id, image_id) {
  return new Promise((resolve, reject) => {
    console.log("deleting" + image_id + "from" + gallery_id)
    db.query(
      `DELETE FROM images WHERE gallery_id = '${gallery_id}' AND image_id = '${image_id}' `,
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

module.exports = Image

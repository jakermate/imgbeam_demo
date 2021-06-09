const db = require("../db.js")
const mysql = require("mysql")
const escape = mysql.escape
const bcrypt = require("bcrypt")
const chalk = require("chalk")
const log = console.log
// the gallery object is responsible for db entries based on new "posts".  Each new post makes a new gallery.  Once a gallery is made, then additional images can be added.
const Gallery = function () {}
// create new gallery/post on initial upload
Gallery.create = async function (
  title,
  user_id,
  username,
  new_gallery_id,
  description,
  callback
) {
  return new Promise((resolve, reject) => {
    // stringify the array so the brackets are preserved when stored as type {text}
    db.query(
      `INSERT INTO galleries (title, user_id, username, gallery_id, description) VALUES (${escape(
        title
      )}, ${user_id}, ${escape(username)}, ${escape(new_gallery_id)}, ${
        description ? escape(description) : "NULL"
      }) `,
      (err, data) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
// add another image to gallery in gallery view
Gallery.addImage = function (newImagePath, gallery_id, user_id, callback) {
  // to ensure user has the right to add image, find gallery via ID and check user_id owner
  db.query(
    `SELECT * FROM galleries WHERE gallery_id = '${gallery_id}'`,
    (err, res) => {
      if (err) {
        console.log("gallery not found - " + err)
        callback(err, { message: "gallery id not found" })
        return
      }
      if (res[0] && res[0].user_id !== user_id) {
        console.log(
          "user id " +
            user_id +
            " does not match gallery owner id " +
            res[0].user_id
        )
        // gallery found, but no permission
        callback(err, {
          message: "you don't have permission to alter this gallery",
        })
        return
      }
      // permission granted to add image
      let images = JSON.parse(res[0].images)
      // console.log(images)
      images.push(newImagePath)
      db.query(
        `UPDATE galleries SET images = '${JSON.stringify(
          images
        )}' WHERE gallery_id = '${gallery_id}'`,
        (err, res) => {
          if (err) {
            console.log("Error inserting image.")
            callback(err, {
              message: "error adding image to gallery with id: " + gallery_id,
            })
            return
          }
          // console.log(res)
          callback(null, {
            message: "inserted image into gallery: " + gallery_id,
          })
          return
        }
      )
    }
  )
}
Gallery.makePrivate = function (gallery_id, callback) {
  db.query(
    `UPDATE galleries SET private = 1 WHERE gallery_id = '${gallery_id}'`,
    (err, success) => {
      if (err) {
        console.log(err)
        callback(err, success)
        return
      }
      callback(null, success)
      return
    }
  )
}

Gallery.addView = async function (gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE galleries SET views = views + 1 WHERE gallery_id = '${gallery_id}' `,
      (err, res) => {
        if (err) {
          console.log(err)
          return reject(500)
        }
        if (!err && res) {
          return resolve(200)
        }
      }
    )
  })
}
Gallery.getHistoryViews = async function (user_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM view_history WHERE user_id = ${user_id} ORDER BY date_viewed DESC`,
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
Gallery.addHistoryView = async function (gallery_id, user_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO view_history (gallery_id, user_id) VALUES ('${gallery_id}', ${user_id}) ON DUPLICATE KEY UPDATE date_viewed = now()`,
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
Gallery.deleteHistoryViews = async function () {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM view_history WHERE date_viewed < (CURRENT_TIMESTAMP - INTERVAL 3 MONTH)`,
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
Gallery.deleteHistoryViewsUser = async function (user_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM view_history WHERE user_id = ${user_id}`,
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

Gallery.delete = function (gallery_id, callback) {
  db.query(
    `DELETE FROM galleries WHERE gallery_id = '${gallery_id}'`,
    (err, res) => {
      if (err) {
        console.log(err)
        callback(err, null)
        return
      }
      if (!res) {
        // should return true if deletion occured
        console.log("No gallery deleted")
        callback(null, res)
        return
      }
      if (res) {
        // should return true if deletion occured
        console.log("Gallery deleted")
        callback(null, res)
        return
      }
    }
  )
}
Gallery.deleteSync = function (gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM galleries WHERE gallery_id = ${escape(gallery_id)}`,
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
Gallery.getOne = function (gallery_id, callback) {
  // this now gets the gallery desired joined with the users table, so we have the username to provide to the client
  db.query(
    `SELECT g.gallery_id, g.date_created, g.title, g.description, g.views, g.comments_enabled, u.username, u.avatar FROM galleries g JOIN users u ON g.user_id = u.user_id WHERE g.gallery_id = '${gallery_id}'`,
    (err, res) => {
      if (err) {
        console.log(err)
        callback(err, null)
        return
      }
      if (!res[0]) {
        console.log("gallery does not exist")
        callback(null, null)
        return
      }
      if (res.length) {
        console.log("Fetched gallery " + gallery_id)
        callback(null, res[0])
        return
      }
    }
  )
}
Gallery.get = async function (gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT g.gallery_id, g.date_created, g.title, g.description, g.views, g.comments_enabled, u.username, u.avatar FROM galleries g JOIN users u ON g.user_id = u.user_id WHERE g.gallery_id = '${gallery_id}'`,
      (err, res) => {
        if (err) {
          console.log(err)
          reject(500)
          return
        }
        resolve(res[0])
        return
      }
    )
  })
}

Gallery.getOwner = function (gallery_id, callback) {
  db.query(
    `SELECT user_id FROM galleries WHERE gallery_id = '${gallery_id}' `,
    (err, res) => {
      if (err) {
        console.log(err)
        return callback(err, null)
      }
      if (!err && res) {
        return callback(null, res)
      }
    }
  )
}

Gallery.setLikes = function (likes, gallery_id, callback) {
  db.query(
    `UPDATE galleries SET like_c = '${likes.like_c}', like_i = '${likes.like_i}', like_f = '${likes.like_f}', dislike = '${likes.dislike}' WHERE gallery_id = '${gallery_id}'`,
    (err, res) => {
      if (err) {
        return callback(err, null)
      }
      if (!err && res) {
        return callback(null, res)
      }
    }
  )
}

Gallery.getByUser = function (username, callback) {
  db.query(
    `SELECT g.* FROM galleries g WHERE g.username = ${escape(
      username
    )} ORDER BY g.date_created DESC`,
    (err, res) => {
      if (err) {
        console.log(err)
      }
      return callback(err, res)
    }
  )
}
Gallery.getByUserSync = function (username) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT g.* FROM galleries g WHERE g.username = ${escape(
        username
      )} ORDER BY g.date_created DESC`,
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

Gallery.getByUserID = function (user_id, callback) {
  db.query(
    `SELECT g.* FROM galleries g WHERE g.user_id = ${escape(
      user_id
    )} ORDER BY g.date_created DESC`,
    (err, res) => {
      if (err) {
        console.log(err)
      }
      return callback(err, res)
    }
  )
}
Gallery.getByUserIDSync = function (user_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT g.*, u.avatar FROM galleries g JOIN users as u ON g.user_id = u.user_id WHERE g.user_id = ${escape(
        user_id
      )} ORDER BY g.date_created DESC`
    ,(err, res)=>{
      if(err){
        console.log(err)
        return reject(500)
      }
      return resolve(res)
    })
  })
}

// get latest galleries to have in trending
Gallery.getLatest50 = function (callback) {
  db.query(
    `SELECT * FROM galleries ORDER BY date_created DESC LIMIT 50`,
    (err, res) => {
      return callback(err, res)
    }
  )
}
Gallery.getLatest1000 = function (callback) {
  db.query(
    `SELECT * FROM galleries ORDER BY date_created DESC LIMIT 1000`,
    (err, res) => {
      return callback(err, res)
    }
  )
}
Gallery.get1000MostViewed = function () {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT g.*, u.avatar FROM galleries as g LEFT JOIN users as u ON g.user_id = u.user_id ORDER BY g.views DESC LIMIT 1000`,
      (err, res) => {
        // console.log(res)
        if (err) {
          reject(500)
          return
        }
        return resolve(res)
      }
    )
  })
}

Gallery.getLastestFromTo = function (from, to, callback) {
  return new Promise((resolve, reject) => {
    let limit = to
    db.query(
      `SELECT g.*, a.sequence FROM galleries as g LEFT JOIN arrangements as a ON g.gallery_id = a.gallery_id ORDER BY date_created DESC LIMIT ${limit}`,
      (err, res) => {
        if (err) {
          console.log(err)
          reject(500)
          return
        }
        return resolve(res)
      }
    )
  })
}

Gallery.setTitle = function (newTitle, gallery_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE galleries SET title = ${escape(
        newTitle
      )} WHERE gallery_id = '${gallery_id}' `,
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

Gallery.getByTitle = function (searchString, callback) {
  db.query(
    `SELECT * FROM galleries WHERE title LIKE '%${searchString}%' LIMIT 50`,
    (err, res) => {
      if (err) {
        console.log(err)
      }
      return callback(err, res)
    }
  )
}
Gallery.search = function (searchString, searchArray) {
  return new Promise((resolve, reject) => {
    let partials = ""
    searchArray.forEach((word) => {
      partials += `${word}* `
    })
    console.log(partials)
    db.query(
      `SELECT g.*, u.avatar FROM galleries as g JOIN users as u ON u.user_id = g.user_id WHERE MATCH (g.title, g.description) AGAINST ('("${searchString}") (${partials})' IN BOOLEAN MODE) LIMIT 50`,
      (err, res) => {
        if (err) {
          console.log(err)
          reject(500)
          return
        }
        return resolve(res)
      }
    )
  })
}

module.exports = Gallery

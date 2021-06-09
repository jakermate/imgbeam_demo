const db = require("../db.js")
const chalk = require("chalk")
const escape = require("mysql").escape
const User = function (username, hash, salt) {
  this.username = username
  this.hash = hash
  this.salt = salt
}
User.create = async function (
  user_id,
  username,
  email,
  password,
  hash,
  salt,
  activation,
  callback
) {
  db.query(
    `INSERT INTO users (username, email, hash, salt, activation_string) VALUES (${escape(
      username
    )}, ${escape(email)},'${hash}', '${salt}', '${activation}')`,
    (err, res) => {
      // error during insert
      if (err) {
        console.log(chalk.red(err))
        callback(err, null)
        return
      }
      if (!err && res) {
        //success
        console.log(
          chalk.green("Success creating user: " + username + " - " + email)
        )
        console.log(res)
        callback(null, true)
        return
      }
    }
  )
}
User.create_request = async function (username, email, hash, salt, activation) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO user_activations (username, email, hash, salt, activation_string) VALUES (${escape(
        username
      )}, ${escape(
        email
      )}, '${hash}', '${salt}', '${activation}') ON DUPLICATE KEY UPDATE email = '${email}', username = '${username}', date_created = NOW() `,
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
User.activate = async function (username, email, hash, salt) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users (username, email, hash, salt) VALUES ('${username}', '${email}', '${hash}', '${salt}')`,
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
User.findActivation = function (email) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM user_activations WHERE email = '${email}'`,
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
User.findActivationByUsername = function (username) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM user_activations WHERE username = '${username}'`,
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
User.delete_activation_entry = function (email) {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM user_activations WHERE email = '${email}'`,
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
User.delete_expired_requests = async function () {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM user_activations WHERE date_created < (CURRENT_TIMESTAMP - INTERVAL 1 DAY)`,
      (err, res) => {
        if (err) {
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}

User.findOneUsername = function (username, callback) {
  // console.log(`querying - SELECT * FROM users WHERE username = ${username}`)
  db.query(
    `SELECT * FROM users WHERE username = ${escape(username)}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err)
        callback(err, null)
        return
      }
      if (res.length) {
        callback(null, res[0])
        return
      }
      // not found Customer with the id
      callback(null, null)
    }
  )
}
User.findOneUsernameSync = function (username) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users WHERE username = ${escape(username)}`,
      (err, res) => {
        if (err) {
          console.log("error: ", err)
          reject(500)
          return
        }
        resolve(res)
        return
      }
    )
  })
}
User.findOneEmail = function (email, callback) {
  console.log(`Looking for email ` + escape(email) + " in database.")
  db.query(`SELECT * FROM users WHERE email = ${escape(email)}`, (err, res) => {
    console.log(res)
    if (err) {
      console.log("error: ", err)
      callback(err, null)
      return
    }
    if (res.length) {
      // console.log("found email: ", res[0])
      callback(null, res[0])
      return
    }

    // not found Customer with the email
    callback(null, null)
    return
  })
}
User.findOneEmailSync = async function (email) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users WHERE email = ${escape(email)}`,
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
User.findOneUserID = function (user_id, callback) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM users WHERE user_id = ${user_id}`, (err, res) => {
      if (err) {
        console.log(err)
        return reject(500)
      }
      return resolve(res)
    })
  })
}

User.getLikes = function (user_id, callback) {
  db.query(
    `SELECT like_c, like_i, like_f FROM users WHERE user_id = ${user_id}`,
    (err, res) => {
      if (err) {
        console.log(err)
        return callback(err, null)
      }
      if (!err && res.length) {
        // console.log(res[0])
        return callback(null, {
          like_c: JSON.parse(res[0].like_c),
          like_f: JSON.parse(res[0].like_f),
          like_i: JSON.parse(res[0].like_i),
        })
      } else return callback(null, null)
    }
  )
}

User.setLikes = function (likes, user_id, callback) {
  db.query(
    `UPDATE users SET like_c = '${JSON.stringify(
      likes.like_c
    )}', like_f = '${JSON.stringify(likes.like_f)}', like_i = '${JSON.stringify(
      likes.like_i
    )}' WHERE user_id = ${user_id}`,
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
// increment limit
User.incrementLimit = function (user_id, callback) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE users SET uploads = uploads + 1 WHERE user_id = ${user_id}`,
      (err, success) => {
        if (err) {
          console.log(err)
          return resolve(500)
        }
        return resolve(200)
      }
    )
  })
}
// decrement limit for all
User.decrementLimit = function (callback) {
  db.query(
    "UPDATE users SET uploads = uploads - 1 WHERE uploads > 0",
    (err, success) => {
      if (err) {
        console.log(err)
        return callback(err, null)
      }
      return callback(null, success)
    }
  )
}

// avatar
User.setAvatar = async function (image_id, user_id) {
  return new Promise(async (resolve, reject) => {
    db.query(
      `UPDATE users SET avatar = '${image_id}' WHERE user_id = ${user_id} `,
      (err, success) => {
        if (err) {
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
User.setBackdrop = async function (image_id, user_id) {
  return new Promise(async (resolve, reject) => {
    db.query(
      `UPDATE users SET backdrop = '${image_id}' WHERE user_id = ${user_id} `,
      (err, success) => {
        if (err) {
          return reject(500)
        }
        return resolve(200)
      }
    )
  })
}
User.getBackdrop = function (user_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT backdrop FROM users WHERE user_id = ${user_id} `,
      (err, res) => {
        if (err) {
          console.log(err)
          resolve(null)
          return
        }
        if (!res.length) {
          resolve(null)
          return
        }

        return resolve(res[0].backdrop)
      }
    )
  })
}
User.getAvatar = function (user_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT avatar FROM users WHERE user_id = ${user_id} `,
      (err, res) => {
        if (err) {
          console.log(err)
          resolve(null)
          return
        }
        if (!res.length) {
          resolve(null)
          return
        }

        return resolve(res[0].avatar)
      }
    )
  })
}

// update password
User.updatePassword = function (newHash, newSalt, user_id) {
  return new Promise((resolve, reject)=>{
    db.query(
    `UPDATE users SET salt = '${newSalt}', hash = '${newHash}' WHERE user_id = ${user_id} `,
    (err, status) => {
      if(err){
        console.log(err)
        return reject(500)
      }
      return resolve(200)
    }
  )
  })

}

// update email
User.updateEmail = function (newEmail, user_id, callback) {
  db.query(
    `UPDATE users SET email = ${mysql.escape(
      newEmail
    )} WHERE user_id = ${user_id} `,
    (err, status) => {
      return callback(err, status)
    }
  )
}

// delete user
User.delete = function (user_id, callback) {
  db.query(`DELETE FROM users WHERE user_id = ${user_id}`, (err, res) => {
    return callback(err, res)
  })
}

User.moveToGraveyard = function (user_id, callback) {
  db.query(
    `BEGIN INSERT INTO graveyard SELECT * FROM users WHERE user_id = ${user_id}; DELETE FROM users WHERE user_id = ${user_id}; END`,
    (err, res) => {}
  )
}

// should only return usernames
User.findOneLike = function (searchString) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users WHERE username LIKE '%${searchString}%' `,
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
User.confirmAccount = function (email, callback) {
  db.query(
    `UPDATE users SET activated = 1 WHERE email = ${escape(email)}`,
    (err, res) => {
      return callback(err, res)
    }
  )
}
// search for users based on username
User.search = function (userString, callback) {
  db.query(
    `SELECT * FROM users WHERE username LIKE '%${userString}%'`,
    (err, users) => {
      return callback(err, users)
    }
  )
}

module.exports = User

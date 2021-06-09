// user service handles things like signup, login, changing user account settings, and will handle the logic in interfacing with the database, keeping the routing logic of the app clean
const validate = require("../validate")
const User = require("../db/models/user.model")
const { default: validator } = require("validator")
const bcrypt = require("bcrypt")
const Gallery = require("../db/models/gallery.model")
const uuid = require("uuid").v4
const domain = "https://i.imgbeam.com/"
const PasswordResets = require("../db/models/passwordreset.model")
const mailer = require("nodemailer")
const cron = require("cron").CronJob
const async = require("async")
const PasswordReset = require("../db/models/passwordreset.model")
const reserved_names = require("../db/models/reserved_names")
const reserved_emails = require("../db/models/reserved_emails")
const Comment = require("../db/models/comment.model")
const Image = require("../db/models/image.model")
const GalleryServiceC = require("./GalleryService")
const GalleryService = new GalleryServiceC()
const { default: getType } = require("./utilities/getType")
const MediaStorageService = require("./MediaStorageService")
const MediaStorage = new MediaStorageService()
const cdn = "https://i.imgbeam.com/"
const filter = require("bad-words")
const FollowService = require("./FollowService")
const FS = new FollowService()
const bw = new filter()
// setup cron services
const passwordResetCron = new cron("1 1 * * * *", delete_old_password_resets) // should run every hour
passwordResetCron.start()
let userregex = /^[a-z]([a-z0-9-]*[a-z0-9])?$/
class UserService {
  // sign up new user
  async signup(reqBody) {
    try {
      console.log("Request body: " + JSON.stringify(reqBody))
      // check username for bad words
      if (bw.isProfane(reqBody.username)) {
        return callback(true, null)
      }
      // ensure username is not a reserved username and email is not reserved
      if (reserved_names.includes(reqBody.username)) {
        return callback(true, null)
      }
      if (reserved_emails.includes(reqBody.email)) {
        return callback(true, null)
      }
      // ensure valid signup credentials
      if (!validate.validateSignUp(reqBody).valid) {
        // early exit on invalid credentials
        return callback(true, null)
      }
      // check if email exists
      if (await this.emailexists(reqBody.email)) return 409
      if (await this.usernameexists(reqBody.username)) return 409
      // create credentials
      // generate activation string
      let activation = uuid()
      // generate salt
      let salt = bcrypt.genSaltSync(12)
      // use salt and generate hash
      let hash = bcrypt.hashSync(reqBody.password, salt)
      // create db entry
      let create_account_request_entry = await User.create_request(
        reqBody.username,
        reqBody.email,
        hash,
        salt,
        activation
      )
      // on success, send email
      if (create_account_request_entry == 200) {
        this.sendConfirmationEmail(reqBody.username, reqBody.email, activation)
      }
      return 200
    } catch (err) {
      console.log(err)
      return 500
    }
  }
  // send email to confirm an account
  sendConfirmationEmail(username, email, token) {
    var transporter = mailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    })

    let url =
      process.env.MODE == "development"
        ? `http://localhost:8888/signup/confirm?email=${email}&token=${token}`
        : `https://imgbeam.com/signup/confirm?email=${email}&token=${token}`

    var mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: `${email}`,
      subject: `imgbeam account confirmation`,
      text: `You have created an imgbeam account.  To confirm the account and start using imgbeam, confirm via the following link: ${url} \nThis link will expire in 24 hours. \n\nIf you did not create an imgbeam account, simply ignore this email.`,
      html: `<div style="margin: 0 auto; text-align: center">
  <a href="imgbeam.com" style="text-decoration: none; color: black">
    <div style="">
      <h2>imgbeam</h2>
    </div>
  </a>
  <section
    style="
      background-color: rgba(170, 170, 170, 0.2);
      padding: 12px;
      border-radius: 16px;
    "
  >
    <h2>Just one more thing to get started...</h2>
    <p style="margin-top: 32px">${username}</p>
    <p style="font-size: 12px; padding-top: 32px">
      Click the button to finish setting up your account, then start posting.
    </p>
    <div style="padding: 24px">
      <a
        href="${url}"
        style="
          text-decoration: none;
          color: white;
          font-weight: bold;
          background-color: #2ecc71;
          border-radius: 4px;
          padding: 12px 16px;
        "
        >Activate Account</a
      >
    </div>
  </section>
  <div style="padding-top: 42px">
    <p>&copy; 2021 Imgbeam, All Rights Reserved</p>
  </div>
</div>
`,
    }
    transporter.sendMail(mailOptions, (err, i) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(i)
      console.log("Confirmation email sent")
    })
  }

  async confirmAccount(email, token) {
    try {
      let user_activation_row = await User.findActivation(email)
      let user = user_activation_row[0]
      if (user_activation_row.length == 0) return 500
      let activation_string = user.activation_string
      // check if stored string matches emailed token
      if (activation_string === token) {
        let activation_response = await User.activate(
          user.username,
          user.email,
          user.hash,
          user.salt
        )
        let request_delete_response = await User.delete_activation_entry(email)
        return activation_response
      } else {
        throw new Error("Token does not match activation string")
      }
    } catch (err) {
      console.log(err)
      return 500
    }
  }

  login(loginentered, passwordentered, callback) {
    console.log("Checking login.")
    let login = loginentered
    let password = passwordentered
    let hash = ""
    let salt
    let user
    if (this.isLoginEmail(login)) {
      // get username by email
      User.findOneEmail(login, (err, res) => {
        console.log("finding user via email")
        // handle error during query for login credential
        if (err) {
          console.log(err)
          callback(err, null)
          return
        }
        // handle login not found
        if (!err && !res) {
          callback(null, null)
          return
        }
        if (res) {
          hash = res.hash
          salt = res.salt
          user = res
        }
        if (user.hash === bcrypt.hashSync(password, user.salt)) {
          console.log("Hash match")
          callback(null, user)
          return
        } else {
          console.log("Hash doesn't matchMedia.")
          callback(null, null)
          return
        }
      })
    } else {
      User.findOneUsername(login, (err, res) => {
        console.log("finding user via username")
        // handle error during query for login credential
        if (err) {
          console.log(err)
          callback(err, null)
          return
        }
        // handle login not found
        if (!err && !res) {
          callback(null, null)
          return
        }
        if (res) {
          console.log("found " + JSON.stringify(res))
          hash = res.hash
          salt = res.salt
          user = res
        }
        if (user.hash === bcrypt.hashSync(password, user.salt)) {
          console.log("Hash match")
          callback(null, user)
          return
        } else {
          console.log("Hash doesn't match.")
          callback(null, null)
          return
        }
      })
    }
  }

  // gets a client-safe user object without sensitive data
  async getSafeUserObject(username, requesting_user) {
    try {
      let user_data = await User.findOneUsernameSync(username)
      let user = user_data[0]
      // create client-safe user object
      let userObject = {
        username: user.username,
        member_since: user.date_created,
        avatar: cdn + user.avatar,
        backdrop: user.backdrop ? `${cdn + user.backdrop}` : null,
        description: user.description,
        rank: this.get_rank(),
        owner: username === requesting_user ? true : false,
        followers: await FS.getFollowers(user.user_id)
      }
      // get galleries
      let galleries = await Gallery.getByUserSync(username)
      userObject.galleries = this.sanitizeGalleries(galleries)

      return userObject
    } catch (err) {
      return 500
    }
  }
  // create border
  getBorderStyle() {}

  // get recent posts and comments by user, as well as images added to galleries
  getActivity(username, from, to, callback) {
    // get userid
    User.findOneUsername(username, (err, user) => {
      if (!user) {
        return callback({
          success: false,
          message: "Could not find user.",
        })
      }
      if (user) {
        let user_id = user.user_id
        Image.getByUser(user_id, (err, success) => {
          if (err) {
            return callback({
              success: false,
              message: "Could not get user images.",
            })
          }
          // got images
        })
      }
    })
  }
  async getPostsSync(username, from, to) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.findOneUsernameSync(username)
        if (!user[0]) return 500
        let galleries = await Gallery.getByUserSync(username)
        galleries = galleries.slice(from, to)
        let new_galleries = []
        async.each(
          galleries,
          async (gallery, cb) => {
            // // get comments
            // let comments = await Comment.getSync(gallery_id)
            gallery = await GalleryService.create_safe_dispatch_async(
              gallery,
              null
            )
            new_galleries.push(gallery)
            Promise.resolve()
          },
          (err) => {
            resolve(new_galleries)
          }
        )
      } catch (err) {
        console.log(err)
        reject(500)
      }
    })
  }

  // get recent comments by user
  getComments(username, from, to, callback) {
    // get userid
    User.findOneUsername(username, (err, user) => {
      if (!user) {
        return callback({
          success: false,
          message: "Could not find user.",
        })
      }
      if (user) {
        let user_id = user.user_id
        // this returns a join between the comment row and the associated gallery
        Comment.getByUserID(user_id, (err, comments) => {
          if (err) {
            return callback({
              success: false,
              status: 500,
            })
          }
          // get slice
          comments = comments.slice(from, to)
          comments.forEach((commentobj) => {
            delete commentobj.reports
          })
          // make db queries for comments with a reply id
          async.map(
            comments,
            (commentobj, cb) => {
              if (commentobj.reply_id !== null) {
                Comment.getByID(
                  commentobj.reply_id,
                  (err, commentreplyarray) => {
                    if (err) return cb(err, null)
                    let reply = commentreplyarray[0]
                    commentobj.reply = reply
                    return cb(null, commentobj)
                  }
                )
              }
              if (commentobj.reply_id === null) {
                return cb(null, commentobj)
              }
            },
            function (err, newComments) {
              if (err) {
                console.log(err)
                return callback({
                  success: false,
                  message: "Error finding replies",
                })
              }
              // success setting replies
              return callback({
                success: true,
                comments: newComments,
              })
            }
          )
        })
      }
    })
  }

  get_rank(points) {
    const ranks = {
      0: "Peon",
      10: "Grunt",
      100: "Scout",
      1000: "Soldier",
      10000: "Knight",
      30000: "Captain",
      50000: "Commander",
      100000: "Legionaire",
      1000000: "General",
      20000000: "Warlord",
      10000000: "King",
    }
    return ranks[0]
  }

  changePassword(oldPassword, newPassword, user, callback) {
    if (!this.validatePassword(newPassword)) {
      return callback({
        success: false,
        message: "Password does not meet criteria.",
      })
    }
    let hashToCheck = bcrypt.hashSync(oldPassword, user.salt)
    if (hashToCheck !== user.hash) {
      return callback({
        success: false,
        message: "Incorrect password.",
      })
    }
    let newSalt = bcrypt.genSaltSync(12)
    let newHash = bcrypt.hashSync(newPassword, newSalt)
    User.updatePassword(newHash, newSalt, user.user_id, (err, status) => {
      if (err) {
        return callback({
          success: false,
          message: "Error during password update.",
        })
      }
      if (status.affectedRows > 0) {
        return callback({
          success: true,
          message: "Password updated successfully.",
        })
      }
    })
  }
  // this returns all user account data (for own account), not accessible to other users
  async getAccount(user_id) {
    try {
      let user = await User.findOneUserID(user_id)
      return user
    } catch (err) {
      console.log(err)
      return 500
    }
  }
  lostPassword(login, callback) {
    // url format /forgotpassword?reset=dfkjwbkwjefkjwefjknwef
    let uid = uuid()
    // let resetString = bcrypt.hashSync(uid, 10)
    let resetString = uid
    let resetSalt = bcrypt.genSaltSync(10)
    let resetHash = bcrypt.hashSync(resetString, resetSalt)

    if (validator.isEmail(login)) {
      // get account by email
      console.log("finding user")
      User.findOneEmail(login, (err, res) => {
        if (err) {
          return callback({
            success: false,
            message: "Error while searching for user account.",
          })
        }
        if (res) {
          let user_id = res.user_id
          PasswordResets.create(
            user_id,
            resetHash,
            resetSalt,
            (err, response) => {
              if (err) {
                return callback({
                  success: false,
                  message: "Error adding entry to reset db.",
                })
              }
              if (response) {
                // NEED TO SEND EMAIL
                console.log("Got to email section.")
                this.sendPasswordResetEmail(res.email, resetString)

                return callback({
                  success: true,
                  message: "Im at this point",
                })
              }
            }
          )
        }
      })
    } else {
      // get account by username
      console.log("finding user2")
      User.findOneUsername(login, (err, res) => {
        if (err) {
          return callback({
            success: false,
            message: "Error while searching for user account.",
          })
        }
        console.log(res)
        if (res) {
          let user_id = res.user_id
          console.log("found user to reset")
          PasswordResets.create(
            user_id,
            resetHash,
            resetSalt,
            (err, response) => {
              if (err) {
                return callback({
                  success: false,
                  message: "Error adding entry to reset db.",
                })
              }
              if (response) {
                // NEED TO SEND EMAIL
                console.log("Got to email section.")
                this.sendPasswordResetEmail(res.email, resetString)

                return callback({
                  success: true,
                  message: "Im at this point",
                })
              }
            }
          )
        }
        if (!res) {
          return callback({ success: false, message: "Could not find user." })
        }
      })
    }
  }

  async changeAvatar(user_id, image) {
    // get old avatar string if exists
    let avatar_string_old = await User.getAvatar(user_id)
    // determine if media type is supported
    let mime = image.mimetype
    if (!this.still_mime_valid(mime)) return 500
    try {
      // make sure avatar is valid string
      let newImageFile = GalleryService.process_image(image)
      console.log(newImageFile)
      let newName = newImageFile.newName
      // set new string
      let set_avatar_string_response = await User.setAvatar(newName, user_id)
      console.log(set_avatar_string_response)
      let avatar_media_response = await MediaStorage.create_avatar_object(
        newImageFile
      )
      console.log(avatar_media_response)

      // if works, delete old media
      if (avatar_string_old) {
        console.log("deleting old media ")
        let delete_response = await MediaStorage.delete_avatar(
          avatar_string_old
        )
        console.log(delete_response)
      }

      // return
      return 200
    } catch (err) {
      return 500
    }
  }

  async changeBackdrop(user_id, file) {
    console.log("here")
    // get old avatar string if exists
    let old_backdrop_string = await User.getBackdrop(user_id)
    // determine if media type is supported
    let mime = file.mimetype
    console.log("here 2")
    if (!this.still_mime_valid(mime)) return 500
    try {
      // make sure avatar is valid string
      let newImageFile = GalleryService.process_image(file)
      console.log(newImageFile)
      let newName = newImageFile.newName
      console.log("here 3")

      // set new string
      let set_backdrop_response = await User.setBackdrop(newName, user_id)
      console.log(set_backdrop_response)
      let backdrop_media_response = await MediaStorage.create_backdrop_object(
        newImageFile
      )
      console.log(backdrop_media_response)

      // if works, delete old media
      if (old_backdrop_string) {
        console.log("deleting old media ")
        let delete_response = await MediaStorage.delete_backdrop(
          old_backdrop_string
        )
        console.log(delete_response)
      }

      // return
      return 200
    } catch (err) {
      return 500
    }
  }

  avatar_types = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/apng",
    "image/tiff",
    "image/tif",
    "image/bmp",
    "image/webp",
  ]
  still_mime_valid(mimetype) {
    if (this.avatar_types.includes(mimetype)) return true
    return false
  }

  changeEmail(newEmail, password, user, callback) {
    // validate email string
    if (!validateEmail(newEmail)) {
      return callback({
        success: false,
        message: "Invalid email.",
      })
    }
    // check if email is already in use
    User.findOneEmail(newEmail, (err, res) => {
      if (err) {
        return callback({
          success: false,
          message: "Cannot change email at this time.",
        })
      }
      if (res) {
        return callback({
          success: false,
          message: "Email already in use.",
        })
      }
      if (!res) {
        // email is available
        let hash = bcrypt.hashSync(password, user.salt)
        if (hash === user.hash) {
          // valid password, commence email update
          User.updateEmail(newEmail, user.user_id, (err, status) => {
            if (err) {
              return callback({
                success: false,
                message: "DB syntax error.",
              })
            }
            if (status.affectedRows == 0) {
              return callback({
                success: false,
                message: "Not updated.",
              })
            }
            if (status.affectedRows > 0) {
              return callback({
                success: true,
                message: "Email updated.",
              })
            }
          })
        }
      }
    })
  }

  isLoginEmail(login) {
    if (validator.isEmail(login)) {
      return true
    }
    return false
  }
  // return true if user exists with email
  async emailexists(email) {
    let user = await User.findOneEmailSync(email)
    let activation = await User.findActivation(email)
    console.log(user)
    if (user.length == 0 && activation.length == 0) return false
    return true
  }
  // return true if user exists with username
  async usernameexists(username) {
    let user = await User.findOneUsernameSync(username)
    let activation = await User.findActivationByUsername(username)
    console.log(user + "2")
    if (user.length == 0 && activation.length == 0) return false
    return true
  }
  generateUserID() {
    console.log("Generating unique ID")
    let newID = ""
    let set = "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < 60; i++) {
      let newCharacter
      newCharacter = set.charAt(Math.floor(Math.random() * set.length))
      newID += newCharacter
    }
    return newID
  }

  sanitizeGalleries(galleries) {
    galleries.forEach((gallery) => {
      delete gallery.user_id
      delete gallery.original_resolution_x
      delete gallery.original_resolution_y
      delete gallery.original_name
      delete gallery.id
      gallery.path = domain + gallery.file_name
    })
    return galleries
  }

  validatePassword(newPassword) {
    console.log('validating ' + newPassword)
    // check password length
    if (newPassword.length < 6 || validator.isAlpha(newPassword)) {
      return false
    }
    if (!validator.isAlphanumeric(newPassword)) {
      return false
    }
    return true
  }
  

  sendPasswordResetEmail(email, resetToken) {
    var transporter = mailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    })

    let url =
      process.env.MODE == "development"
        ? `http://localhost:8888/password/reset?email=${email}&token=${resetToken}`
        : `https://www.imgbeam.com/password/reset?email=${email}&token=${resetToken}`

    var mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: `${email}`,
      subject: `imgbeam password reset`,
      text: `You have requested an imgbeam password reset.  Please follow the link to create a new password: ${url} \nThis link will expire in 24 hours. \n\nDidn't request a password reset, just ignore this email.`,
      html: `<div style="margin: 0 auto; text-align: center">
  <a href="imgbeam.com" style="text-decoration: none; color: black">
    <div style="">
      <h2>imgbeam</h2>
    </div>
  </a>
  <section
    style="
      background-color: rgba(170, 170, 170, 0.2);
      padding: 12px;
      border-radius: 16px;
    "
  >
    <h2>Need to reset your password?</h2>
    <p style="margin-top: 32px">${email}</p>
    <p style="font-size: 12px; padding-top: 32px">
      Click the button to reset your account password.
    </p>
    <div style="padding: 24px">
      <a
        href="${url}"
        style="
          text-decoration: none;
          color: white;
          font-weight: bold;
          background-color: #2ecc71;
          border-radius: 4px;
          padding: 12px 16px;
        "
        >Reset Password</a
      >
    </div>
  </section>
  <div style="padding-top: 42px">
    <p>&copy; 2021 Imgbeam, All Rights Reserved</p>
  </div>
</div>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("Email sent: " + info.response)
      }
    })
  }

  async confirm_password_reset(resetToken, email) {
    try {
      console.log("reset token " + resetToken)
      // get user_id based on email received
      let user = await User.findOneEmailSync(email)
      if (!user) return 500
      let user_id = user[0].user_id
      let password_reset_object = await PasswordReset.get(user_id)
      if (!password_reset_object[0]) return 500
      let password_reset = password_reset_object[0]
      let salt = password_reset.reset_salt
      console.log(salt)
      let newHash = bcrypt.hashSync(resetToken, salt)
      console.log(password_reset.reset_hash)
      console.log(newHash)
      if (newHash === password_reset.reset_hash) return 200
    } catch (err) {
      console.log(err)
      return 500
    }
  }
  async reset_password(p1, p2, resetString, email) {
    if (p1 !== p2) return 401
    // verify password matches requirements
    if(!this.validatePassword(p1)) return 401

    // check user_id of reset string matches email
    let user = await User.findOneEmailSync(email)
    if(!user[0]) return 400
    let user_id = user[0].user_id
    let reset_entry = await PasswordReset.get(user_id)
    if(!reset_entry[0]) return 400
    if(reset_entry[0].user_id !== user_id) return 400
    // check token matches hash
    let reset_hash = reset_entry[0].reset_hash
    let reset_salt = reset_entry[0].reset_salt
    let reset_hash_from_request = bcrypt.hashSync(resetString, reset_salt)
    if(reset_hash !== reset_hash_from_request) return 400

    console.log('credentials are valid, change password in database')
    
    let new_salt = bcrypt.genSaltSync(12)
    let new_hash = bcrypt.hashSync(p1, new_salt)
    let password_change_response = await User.updatePassword(new_hash, new_salt, user_id)
    if(password_change_response == 200){
      // delete reset entry
      let delete_response = await PasswordReset.delete(user_id)
      console.log('delete reset response' + delete_response)
    }
    return password_change_response
  }
}

function delete_old_password_resets() {
  PasswordResets.delete_old((err, success) => {
    if (err) {
      console.log("Could not complete password reset cron.")
      return
    }
    console.log("Old password resets deleted.")
  })
}

module.exports = UserService

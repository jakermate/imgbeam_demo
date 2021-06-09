var express = require("express")
const UserService = require("../services/UserService")
const US = new UserService()
var router = express.Router()
const path = require("path")

router.get("/forgot", (req, res) => {
  console.log("Someone forgot their password")
  return res.render(
    path.join(__dirname, "../", "static", "password", "forgotpassword"),
    {
      error: "",
    }
  )
})

router.post("/forgot", (req, res) => {
  console.log("Password reset request.")
  let login = req.body.login
  US.lostPassword(login, (successObject) => {
    if (!successObject.success) {
      return res.render(
        path.join(__dirname, "../", "static", "password", "forgotpassword"),
        {
          error: "User with that email or login not found.\nTry Again",
        }
      )
    } else
      return res.sendFile(
        path.join(
          __dirname,
          "../",
          "static",
          "password",
          "password_reset_sent.html"
        )
      )
  })
})

router.get("/reset", async (req, res) => {
  try {
    console.log("Password reset request.")
    let resetToken = req.query.token
    let email = req.query.email
    let reset_response = await US.confirm_password_reset(resetToken, email)
    console.log(reset_response)
    if (reset_response === 200) {
      console.log("sending reset page")
      return res.render("password/passwordreset", {
        token: resetToken,
        email: email,
        error: "",
      })
    }

    throw new Error()
  } catch (err) {
    return res.sendFile(
      path.join(
        __dirname,
        "../",
        "static",
        "password",
        "expiredpasswordreset.html"
      )
    )
  }
})
router.post("/reset", async (req, res) => {
  try {
    let token = req.query.token
    let email = req.query.email
    let p1 = req.body.password1
    let p2 = req.body.password2
    if (p1 !== p2) {
      // return reset page with error displayed
      return res.render("password/passwordreset", {
        token: token,
        email: email,
        error: "Passwords do not match",
      })
    }
    let password_reset_response = await US.reset_password(p1, p2, token, email)
    console.log(password_reset_response)
    if (password_reset_response == 200) {
      return res.send("Password updated!")
    }
    if (password_reset_response == 401) {
      return res.render("password/passwordreset", {
        token: token,
        email: email,
        error:
          "Password does not meet requirements. (Must be greater than 6 characters and contain both letters and numbers.)",
      })
    }
  } catch (err) {
    console.log(err)
    return res.send("Failure!")
  }
})

module.exports = router

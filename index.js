require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 8888
const cors = require("cors")
const log = console.log
const morgan = require("morgan")
const bp = require("body-parser")
const fs = require('fs')
const GS = require('./services/GalleryService')
const GalleryService = new GS()
const passport = require("passport")
const path = require("path")
const session = require("express-session")
const chalk = require("chalk")
const local = require("passport-local").Strategy
const validate = require("validator").default
const cookieParser = require("cookie-parser")
const badwords = require("bad-words")
const redisSession = require('connect-redis')(session)
const bw = new badwords()
const redis = require('redis')
const client = redis.createClient()
const nocache = require('nocache')

// templates
const ejs = require("ejs")
app.set("view engine", "ejs")
app.set("views", path.join("static"))
// services
const UserServiceClass = require("./services/UserService")
const UserService = new UserServiceClass()
// cron service
const cron = require("./services/CronService")()
// trending service
const trending = require("./services/TrendingService.js")

// routers
const account_router = require("./routes/account_route")
const password_service_router = require("./routes/password_service_route")
const notification_route = require("./routes/notifications_route")
const messaging_route = require("./routes/messaging_route")
const search_router = require("./routes/search_route")
const trending_router = require("./routes/trending_route")
const uploads_router = require("./routes/upload_route") // create a post
const users_guest_router = require("./routes/user_guest_route") // get user information (non-editing)
const defaults_router = require("./routes/defaults_router")
const stash_router = require("./routes/stash_route")
const gallery_api = require("./routes/gallery_route") // for getting galleries (non-editing)

// admin level access
const admin_router = require("./routes/admin_route")

// middleware stack
app.use(morgan("combined"))
app.disable("x-powered-by")
app.use(bp.urlencoded({ extended: true, limit: "50mb" }))
app.use(bp.json({ limit: "50mb" }))
app.use(cookieParser())
app.use(nocache())
app.use(
  session({
    secret: "pixigi is now imgbeam",
    resave: true,
    saveUninitialized: true,
    store: new redisSession({
      client: client
    })
  })
)  
app.use(passport.initialize())
app.use(passport.session())

app.listen(PORT, (err) => {
  if (err) console.log
  log(
    chalk.hex("#1ffffb").bold("IMGBEAM") +
      chalk.white(" app running on port: " + PORT)
  )
  log(
    chalk.yellow(
      "Running with ENV variables: " + JSON.stringify(process.env.MODE)
    )
  )
})
// middleware to check if authenticated before sending to new router
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(403).send()
  // res.redirect("/login")
}

// middleware to check if user_group is admin and privilege is elevated
function isAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(400).send()
  }
  if (req.isAuthenticated() && req.user.user_group === "admin") {
    // console.log("Admin access granted to " + req.user.username)
    next()
    return
  }
  console.log("Admin access denied.")
  return res.status(400).send()
}

// cors open in development
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
)

// Route Splitter
app.use("/password", password_service_router)
// defaults
app.use("/defaults", defaults_router)
app.use("/api/account", isAuthenticated, account_router) // account settings routes (not for post controls)
app.use("/api/upload", isAuthenticated, uploads_router)

// notifications router
app.use("/api/notifications", isAuthenticated, notification_route)

// trending and featured
app.use("/api/trending", trending_router)

// search router
app.use("/api/search", search_router)

// routes for user pages
app.use("/api/user", users_guest_router)
// routes for gallery pages
app.use("/api/beam", gallery_api) // view gallery as guest

// admin route protected by authentication and user_group property check
app.use("/admin", isAdmin, admin_router)

// messaging route
app.use("/api/messaging", isAuthenticated, messaging_route)

// stash private storage service
app.use("/api/stash", isAuthenticated, stash_router)

// setup passport authentication method to use with POST /login route
passport.use(
  new local(
    { passReqToCallback: true },
    function (req, username, password, done) {
      let login = username
      let credential = password
      if (!username) {
        login = req.body.username
      }
      if (!password) {
        credential = req.body.password
      }
      UserService.login(login, credential, (err, res) => {
        if (err) {
          return done(err, false)
        }
        if (!res) {
          console.log("Login failed, user login does not exist.")
          return done(null, false)
        }
        if (res) {
          console.log("Login success")
          return done(null, res)
        }
      })
    }
  )
)

// serialize session
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

// credential availability checks
app.get("/checkusername", async (req, res) => {
  if (bw.isProfane(req.query.username)) {
    return res.send({
      valid: false,
      message: "Username contains profanity.",
    })
  }
  if (/\s/.test(req.query.username)) {
    return res.send({
      valid: false,
      message: "Username and password may not contain spaces.",
    })
  }
  if (req.query.username.length > 36) {
    return res.send({
      valid: false,
      message: "Username must be less than 36 characters long.",
    })
  }
  if (req.query.username.length < 4) {
    return res.send({
      valid: false,
      message: "Username must be 4 characters or longer.",
    })
  }
  if (!validate.isAlphanumeric(req.query.username)) {
    return res.send({
      valid: false,
      message: "Username may only contain letters and numbers.",
    })
  }
  console.log("checking availability of username " + req.query.username)
  let username_exists = await UserService.usernameexists(req.query.username)
  if (username_exists)
    return res.send({
      valid: false,
      message: "Username already taken.",
    })
  if (!username_exists)
    return res.send({
      valid: true,
      message: "Valid username choice.",
    })
})
app.get("/checkemail", async (req, res) => {
  if (!validate.isEmail(req.query.email)) {
    return res.send({
      valid: false,
      message: "Not a valid email address.",
    })
  }

  console.log("checking availability of email " + req.query.email)
  let email_exists = await UserService.usernameexists(req.query.email)
  if (email_exists)
    return res.send({
      valid: false,
      message: "Email already in use.",
    })
  if (!email_exists)
    return res.send({
      valid: true,
      message: "Valid email.",
    })
})
app.get("/passwordcheck", (req, res) => {
  if (req.query.p1.length < 6) {
    return res.send({
      valid: false,
      message:
        "Password must be at least 7 characters, and include at least one letter and number.",
    })
  }
  if (req.query.p1.length > 128) {
    return res.send({
      valid: false,
      message: "Password must be 128 characters or less.",
    })
  }
  if (/\s/.test(req.query.p1)) {
    return res.send({
      valid: false,
      message: "Password may not contain spaces.",
    })
  }

  if (validate.isNumeric(req.query.p1) || validate.isAlpha(req.query.p1)) {
    return res.send({
      valid: false,
      message: "Password must contain at least one number and letter.",
    })
  }
  if (req.query.p1 !== req.query.p2) {
    return res.send({
      valid: false,
      message: "Passwords do not match.",
    })
  }
  return res.send({
    valid: true,
    message: "Password is valid.",
  })
})

// New Account Route
app.post("/signup", async (req, res) => {
  try {
    let signup_response = await UserService.signup(req.body)
    return res.sendStatus(signup_response)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})
// success on signup with email notifications
app.get("/signupsuccess", (req, res) => {
  console.log("signup success")
  return res.status(200).render("signupsuccess", {
    email: req.query.email,
  })
})

// account activation via email link get
app.get(`/signup/confirm`, async (req, res) => {
  try {
    let email = req.query.email
    let token = req.query.token
    // confirm account
    let activation_response = await UserService.confirmAccount(email, token)
    console.log("account activation response - " + activation_response)
    if (activation_response === 500) {
      return res.send("Link expired.")
    }
    if (activation_response === 200) {
      return res.send("account activated")
    }
  } catch (err) {
    return res.send("account activation denied")
  }
})

app.use("/signup", express.static(path.join(__dirname, "static", "signup")))
app.get("/signup", (req, res) => {
  // if signed in, redirect to home
  if (req.isAuthenticated()) {
    res.redirect("/")
    return
  }
  res.sendFile(path.join(__dirname, "static", "signup", "index.html"))
})

// Login Route
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    passReqToCallback: true,
  }),
  function (req, res) {
    console.log(req.query)
    // if signin link contains a query with a gallery id
    if (req.query.redirect) {
      console.log("Redirect found for login.")
      return res.redirect(`${req.query.redirect}`)
    }
    console.log(
      chalk.green("User " + req.user.username + " logged in without redirect.")
    )
    res.redirect("/")
  }
)
app.use("/login", express.static(path.join(__dirname, "static", "login")))
app.get("/login", (req, res) => {
  console.log("login route")
  if (req.isAuthenticated()) {
    // if already logged in, redirect
    res.redirect("/")
    return
  }
  // if not authenticated, send login page
  res.sendFile(path.join(__dirname, "static", "login.html"))
})

// this route allows for an authenticated user to periodically get their session status and user information
app.get("/api/loggedin", (req, res) => {
  // just tells client if its logged in or not (subject to change)
  if (req.isAuthenticated()) {
    return res.status(200).send()
  }

  return res.status(401).send()
})

// logout
app.get("/logout", function (req, res) {
  // if not logged in
  if (!req.isAuthenticated()) {
    console.log("not logged in")
    return res.redirect("/")
  }
  console.log("Logging out " + req.user.username)
  req.logout()
  return res.redirect("/")
})

// splash image for social embed links
app.get('/splash.png', (req, res)=>{
  res.sendFile(path.join(__dirname, "static", "splash.png"))
})

// policies
app.get("/termsofuse", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "terms", "index.html"))
})
app.get("/privacypolicy", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "privacy.html"))
})
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "about.html"))
})
app.get("/careers", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "careers.html"))
})
app.get("/support", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "support.html"))
})


// if user accesses gallery on inital load, alter meta tags on base index file for links meta tags embeds to work
app.get("/beam/:gallery_id", async (req, res) => {
  console.log('direct gallery request')
 try{
  let gallery_id = req.params.gallery_id
  let post_info = await GalleryService.getOne(gallery_id)
  let pathname = path.join(__dirname, "static", "build", "index.html")
  console.log(pathname)
  let index = fs.readFileSync(pathname, "utf-8")
  if(index){
    console.log('replacing')
    index = index.replace(/__TITLE__/g, post_info.title).replace(/__DESCRIPTION__/g, post_info.description ? post_info.description : "Share images and videos.").replace(/__IMAGEPATH__/g, post_info.images[0].path).replace(/__URL__/g, req.originalUrl)

    return res.send(index)
  }
 }
 catch(err){
  return res.sendFile(path.join(__dirname, "static", "build", "index.html"), )
  
 }
  
})
app.get("/search/:search_string", async (req, res) => {
  console.log('direct gallery request')
 try{
  let index = fs.readFileSync(pathname, "utf-8")
  if(index){
    console.log('replacing')
    index = index.replace(/__TITLE__/g, req.params.search_string + " - Search on ImgBeam").replace(/__DESCRIPTION__/g, `Search results for ${req.params.search_string} on ImgBeam.  Search for memes, guides, vacation photos, etc...`).replace(/__IMAGEPATH__/g, "https://imgbeam.com/splash.png").replace(/__URL__/g, req.originalUrl)

    return res.send(index)
  }
 }
 catch(err){
  return res.sendFile(path.join(__dirname, "static", "build", "index.html"), )
  
 }
  
})

// user base home route
app.get("/", (req, res) => {
  let index = fs.readFileSync(path.join(__dirname, "static", "build", "index.html"), 'utf-8')
  index = index.replace(/__TITLE__/g, "ImgBeam - Where Dreams Are Made").replace(/__DESCRIPTION__/g, "Upload and share memes and videos.  Free image hosting.  Interactive community.").replace(/__IMAGEPATH__/g, 'https://imgbeam.com/splash.png').replace(/__URL__/g, 'https://imgbeam.com')
  console.log('sending from here')
  return res.send(index)
})
app.use("/", express.static(path.join(__dirname, "static", "build")))

app.get("*", (req, res) => {
  let index = fs.readFileSync(path.join(__dirname, "static", "build", "index.html"), 'utf-8')
  index = index.replace(/__TITLE__/g, "ImgBeam - Where Dreams Are Made").replace(/__DESCRIPTION__/g, "Upload and share memes and videos.  Free image hosting.  Interactive community.").replace(/__IMAGEPATH__/g, 'https://imgbeam.com/splash.png').replace(/__URL__/g, 'https://imgbeam.com')
  console.log('sending from here')
  return res.send(index)
})



// error page
app.use((req, res) => {
  res.status(404).send("Page not found.")
})

module.exports = app

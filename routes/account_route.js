// these routes to be used for a user to interact with their account settings
var express = require("express")
const UserService = require("../services/UserService")
const US = new UserService()
var router = express.Router()
const FS = require('../services/FollowService')
const FollowService = new FS()
const multer = require("multer")
const gs = require('../services/GalleryService')
const Favorites = require('../db/models/favorites.model')
const FavServ = require('../services/FavoriteService')
const FavoriteService = require("../services/FavoriteService")
const GalleryService = new gs()
const storage = multer.memoryStorage()
const multerWare = multer({ storage }).any()
const cdn = "https://i.imgbeam.com/"
// guard all settings routes from non-authenticated users
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("authenticated request to beam api")
    return next()
  }
  res.redirect("/login")
}
router.use("/settings", isAuthenticated)

// get account info
router.get("/", async (req, res) => {
  try {
    let account = await US.getAccount(req.user.user_id)
    if (account == null) return res.sendStatus(404)
    return res.send({
      username: req.user.username,
      member_since: req.user.date_created,
      activated: req.user.activated == 1 ? true : false,
      email: req.user.email,
      avatar: cdn + String(account[0].avatar),
    })
  } catch (err) {
    return res.send(500)
  }
})

// get all posts
router.get('/posts', async (req, res)=>{
  try {
    let posts = await GalleryService.getPosts(req.user.user_id)
    return res.send(posts)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

// HISTORY / RECENTLY VIEWED
//get history
router.get(`/history`, async (req, res)=>{
  console.log('history req')
  try{
    let history = await GalleryService.getViewHistory(req.user.user_id)
    if(history == 500) throw new Error()
    return res.send(history)
  }
  catch(err){
    return res.sendStatus(500)
  }
})

// change password
router.post("/password/update", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(403).send()
  }
  console.log(req.user.username + " requesting new password.")
  let old = req.body["password-old"]
  let pNew1 = req.body["password-new-1"]
  let pNew2 = req.body["password-new-2"]
  console.log(req.body)
  if (pNew1 !== pNew2) {
    return res.status(401).send()
  }
  US.changePassword(old, pNew1, req.user, (status) => {
    return res.send(status)
  })
})

// change avatar
router.post("/settings/avatar/update", multerWare, async (req, res) => {
  let file = req.files[0]
  let user_id = req.user.user_id
  try {
    let avatar_create_response = await US.changeAvatar(user_id, file)
    return res.sendStatus(avatar_create_response)
  } catch (err) {
    return res.sendStatus(500)
  }
})

// change backdrop image
router.post('/settings/backdrop/update', multerWare, async (req, res)=>{
  try{
    let file = req.files[0]
    let user_id = req.user.user_id
    let backdrop_set_response = await US.changeBackdrop(user_id, file)
    return res.sendStatus(backdrop_set_response)
  }
  catch(err){
    return res.sendStatus(500)

  }

})

// change email
router.post("/settings/email/update", (req, res) => {
  let emailString = req.body.email
  let password = req.body.password
  US.changeEmail(emailString, password, req.user, (successObj) => {
    return res.send(successObj)
  })
})

// favorites and follows
router.get('/following', async (req, res) => {
  try{
    let follows = await FollowService.getFollowing(req.user.user_id)
    if(follows == 500) throw new Error('yuck')
    return res.send(follows)
  } 
  catch(err){
    console.log(err)
    return res.sendStatus(500)
  }
})
// get unsorted favorites
router.get('/favorites', async (req, res)=>{
  try {
    let favorites = await FavServ.getUserFavorites(req.user.user_id)
    console.log(favorites)
    return res.send(favorites)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})
// get folder information to request by id
router.get('/favorites/folders', async (req, res)=>{
  try {
    let get_folders_response = await FavServ.getFolders(req.user.user_id)
    return res.send(get_folders_response)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})
router.post('/favorites/folders', async (req, res)=>{
  try {
    let folder_create_response = await FavServ.createFolder(req.user.user_id)
    return res.sendStatus(folder_create_response)
  } catch (err) {
    return res.sendStatus(500)
  }
})
router.put(`/favorites/folders/:folder_id/:newname`, async (req, res)=>{
  try {
    let rename_response = await FavServ.renameFolder(req.user.user_id, req.params.folder_id, req.params.newname)
    return res.sendStatus(rename_response)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})
router.get('/favorites/folders/:folder_id', async (req, res)=>{
  try {
    let folder_contents = await FavServ.getFolder(req.user.user_id, req.params.folder_id)
    return res.send(folder_contents)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})
// move favorite to new folder
router.put('/favorites/move/:gallery_id/:folder_id', async (req, res)=>{
  try {
    let move_response = await FavServ.moveFavorite(req.user.user_id, req.params.gallery_id, req.params.folder_id)
    return res.sendStatus(move_response)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.get((req, res) => {
  res.send("Lost in your own settings, eh?")
})

module.exports = router

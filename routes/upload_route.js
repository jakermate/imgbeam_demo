const router = require("express").Router()
const fs = require("fs")
const path = require("path")
// uploads
const multer = require("multer")
multer({
  limits: {
    // fieldSize: 25 * 1024 * 1024
  },
})
const app = require("..")
const { route } = require("./account_route")
const storage = multer.memoryStorage()
const multerWare = multer({ storage }).any()
const randomHash = require("./utilities/random")
const mime = require("mime-types")
const Gallery = require("../db/models/gallery.model")
const PostServiceClass = require("../services/PostService")
const PostService = new PostServiceClass()
// routes
router.post("/create", multerWare, async (req, res) => {
  console.log("New post incoming.")
  // check if files present
  if (req.files.length == 0) {
    return res.status(400).send()
  }
  // send request throgh to the PostService
  try{
      let new_post_response = await PostService.new(req)
        if(new_post_response[0] == 200){
            res.send({gallery_id: new_post_response[1]})
        }
  }
  catch(err){
    res.status(500).send()
  }
 
})



router.get("/", (req, res) => {
  res.send("UPLOAD PAGE")
})

function process_image(imageBufferObject) {
  let originalName = imageBufferObject.originalname
  let newName = randomHash()
  let extension = imageBufferObject.mimetype
  let mimestring = mime.extension(extension)
  newName += "." + mimestring
  imageBufferObject.newName = newName
  return imageBufferObject
}

// external storage
function forward_image(fileObject, callback) {
  // call to api or save locally for development
  let imageBuffer = fileObject.buffer
  fs.writeFileSync(
    path.join(__dirname, "../vault", `${fileObject.newName}`),
    imageBuffer
  )
  callback()

  function toBuffer(ab) {
    var buf = Buffer.alloc(ab.byteLength)
    var view = new Uint8Array(ab)
    for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i]
    }
    return buf
  }
}
module.exports = router

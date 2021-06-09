const express = require('express')
const router  = express.Router()
const path = require('path')
router.get('/avatar', (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "static", "media", "avatar.png"))
})


module.exports = router
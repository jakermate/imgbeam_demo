var express = require("express")
const router = express.Router()
const StashService = require('../services/StashService')


router.get('/', async (req, res)=>{
    res.send('Home of BeamStash Private Image Storage')
})

module.exports = router
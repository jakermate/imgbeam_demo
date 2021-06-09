const router = require("express").Router()
const chalk = require("chalk")
// uploads
const Gallery = require("../db/models/gallery.model")
const GalleryServiceC = require("../services/GalleryService")
const GalleryService = new GalleryServiceC()
const redis = require('redis')
const red = redis.createClient()
// redis connection handling
red.on('error', function(err){
    console.log(err)
})
const TrendingServ = require('../services/TrendingService')
const TrendingService = new TrendingServ()

router.get('/trending', async (req, res)=>{
    try{
        let trending = await TrendingService.getHotNow(req.query.from, req.query.to)
        console.log(trending)
        res.send(trending)
    }
    catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
    
})

router.get('/new', async (req, res)=>{
    try{
        let trending = await TrendingService.getNew(req.query.from, req.query.to)
        res.send(trending)
    }
    catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
    
})

// trending tags
router.get('/tags', (req, res)=>{
    let from = req.query.from
    let to = req.query.to
    TrendingService.getTrendingTags(from, to, (successObj)=>{
        return res.send(successObj)
    })
})


// get picks for user from cookies
router.get('/picks', (req, res)=>{
    let from = req.query.from
    let to = req.query.to
    // early return if no recent cookie
    if(!req.cookies.recent){
        return res.send(400).send()
    }
    TrendingService.getPicks(req, from, to, (picks)=>{
        // console.log(picks)
        return res.status(200).send(picks)
    })
})

// most viewed all time
router.get('/mostviewed/alltime', (req, res)=>{
    red.get('most_viewed_all_time', (err, galleries)=>{
        if(err){
            return res.send({
                success: false,
                message: 'Could not get all time most viewed'
            })
        }
        // console.log(galleries)
        return({
            success: true,
            galleries: galleries
        })
    })
})



module.exports = router
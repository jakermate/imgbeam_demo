const router = require('express').Router()
const path = require('path')
const SearchService = require('../services/SearchService')
const TagService = require('../services/TagService')

// on submit search function
router.get('/results/:search', async (req,res)=>{
    // console.log(req.params.search)
    if(req.params.search.length < 1){
        return res.send({
            success: false,
            message:'Cannot search for nothing'
        })
    }
    let searchArray = []
    if(req.cookies['search']){
        searchArray = JSON.parse(req.cookies['search'])
    }
    searchArray.push(req.params.search)
    if(searchArray.length > 30){
        searchArray.shift()
    }
    try{
        let results = await SearchService.searchAll(req.params.search)
        return res.cookie('search', JSON.stringify(searchArray), {maxAge: 2629800000}).send(results)
    }
    catch(err){
        res.sendStatus(500)
    }
    
})

// on type search suggestions
router.get('/suggest', async (req,res)=>{
    try{
        console.log(req.query.search)
        let results = await SearchService.suggestion(req.query.search)
        return res.send(results)
    }
    catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
})

// get tags
router.get('/tags', async (req, res)=>{
    try{
        let tagString = req.query.tag
        tagString = tagString.replace("_", " ")
        let galleries = await TagService.getGalleriesWithTag(tagString)
        return res.send(galleries)
    }
    catch(err){
        return res.sendStatus(500)
    }
    
})
// get users
router.get('/users',(req, res)=>{
    let userString = req.query.user
    SearchService.findUsers(userString, (successObj)=>{
        return res.send(successObj)
    })
})


router.get((req,res)=>{
    return res.status(404).send('Error')
})

module.exports = router
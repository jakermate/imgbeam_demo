// routes here are used either for serving the admin-specific front-end client, or serving routes that an admin uses to manage users and galleries.
const router = require('express').Router()
const express = require('express')
const AdminServiceClass = require('../services/AdminService')
const path =require('path')
const SearchService = require('../services/SearchService')
const ReportService = require('../services/ReportService')
const AdminService = new AdminServiceClass()
// this is a protected route and hence admins should already be logged in before this router.


// find users
router.get('/user/username/:username', (req, res)=>{
  AdminService.getUserUsername(req.params.username, (successObj)=>{
    return res.send(successObj)
  })
})

router.get('/user/id/:user_id', async (req, res)=>{
  // this returns an unsanitized user object to the admin client
  try{
    let user = await AdminService.getUserID(req.params.user_id)
    console.log(user)
    return res.send(user)
  }
  catch(err){
    return res.sendStatus(500)
  }
  
})
router.get('/user/email/:email', (req, res)=>{
  // this returns an unsanitized user object to the admin client
  AdminService.getUserEmail(req.params.email, (userObject)=>{
      return res.send(userObject)
  })
})

// search galleries
router.get('/gallery/title/:searchString', (req, res)=>{
  SearchService.searchAll(req.params.searchString, (responseObject)=>{
    res.send(responseObject)
  })
})

// edits

// delete gallery
router.delete('/user/:user_id/gallery/delete/:gallery_id', async (req, res)=>{
  console.log('delete gallery request')
  try{
    let delete_response = await AdminService.delete_gallery(req.params.gallery_id)
    return res.send(delete_response)

  }
  catch(err){
    return res.send(err)
  }
})
// delete image
router.delete('/user/:user_id/image/delete/:image_id/:gallery_id', async (req, res)=>{
  console.log('delete image request')
  try{
    let delete_gallery_response = await AdminService.delete_image(req.params.gallery_id, req.params.image_id)
    res.send(delete_gallery_response)
  }
  catch(err){
    console.log(err)
    return res.send(delete_gallery_response)
  }

})
// delete user
router.delete('/user/:user_id/delete', (req, res)=>{
  console.log('delete request')
  AdminService.delete_user(req.params.user_id, (status)=>{
      res.send(status)
  })
})



router.delete('/comment/:comment_id/delete', (req, res)=>{
  let id = req.body.comment_id
  AdminService.delete_comment(id, (status)=>{
    return res.send(status)
  })
})

// Reports
router.get('/reports/all', async (req, res)=>{
  let report_response = await AdminService.get_all_reports()
  if(report_response === 500){
    return res.sendStatus(report_response)
  }
  return res.send(report_response)
})
router.delete(`/reports/clear/:report_id`, async (req, res)=>{
  let report_id = req.params.report_id
  let clear_report_response = await AdminService.clear_report(report_id)
  if(clear_report_response == 500){
    return res.sendStatus(clear_report_response)
  }
  return res.send(clear_report_response)
})

// check admin authentication status
router.get('/authenticated', (req, res)=>{
  console.log(req.user) 
  if(req.user.user_group == 'admin'){
    return res.status(200).send()
  }
  return res.status(500).send()
})

router.use('/', express.static(path.join(__dirname, "../", "static", "admin_client")))

router.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "static", "admin_client", "index.html"))
  return
})

// error page
router.get((req, res) => {
    res.status(404).send("Admin section not found.")
  })

module.exports = router
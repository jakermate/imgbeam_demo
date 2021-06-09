const Tag = require("../db/models/tag.model")
const TagService = {}
const async = require("async")
const GS = require("./GalleryService")
const GalleryService = new GS()
// first step in all services should be to normalize the tag into the format it would be stored in

// gallery edit services
TagService.addTagToGallery = async function (tagString, gallery_id) {
  try{
    let tag_id_response = await Tag.getIdExact(tagString)
    // check if exists
    if(tag_id_response.length == 0){
      // create tag
      let tag_create_response = await Tag.create(tagString)
      // now get newly created id
      let new_tag_id = await Tag.getIdExact(tagString)
      tag_id_response = new_tag_id
    }
    let tag_id = tag_id_response[0].tag_id
    // create gallery tag
    let gallery_tag_response = await Tag.addToGallery(tag_id, gallery_id)
    return 200
    
  }
  catch(err){
    console.log(err)
    return 500
  }
  
}
TagService.removeTagFromGallery = async function (tagString, gallery_id) {
  try{
    let tag_id_res = await Tag.getIdExact(tagString)
    let tag_id = tag_id_res[0].tag_id
    let delete_response = await Tag.removeFromGallery(tag_id, gallery_id)
    return delete_response
  }
  catch(err){
    console.log(err)
    return 500
  }
  
}

// utility
TagService.NormalizeTag = function (tag, callback) {
  let newTag = tag

  return newTag
}
TagService.getGallery = async function (gallery_id) {
  try{
    let gallery = await Tag.getByGallery(gallery_id)
    return gallery
  }
  catch(err){
    return 500
  }
  
}
TagService.getGalleriesWithTag = async function (tagString) {
  return new Promise(async (resolve, reject)=>{
    try{
      let tag_id_rows = await Tag.getIdExact(tagString)
      if(tag_id_rows.length == 0) return resolve([])
      let tag_id = tag_id_rows[0].tag_id
      // get galleries
      let galleries = await Tag.getGalleries(tag_id)
      if(galleries.length == 0 ) return resolve([])
      let safe_galleries = []
      async.each(
          galleries,
          async (gallery, cb) => {
            try{
              let safe_gallery = await GalleryService.create_safe_dispatch_async(gallery, null)
              safe_galleries.push(safe_gallery)
              return 
            }
            catch(err){
              console.log(err)
              return
            }
           
          },
          function (err) {
            console.log(safe_galleries)
            return resolve(safe_galleries)
          }
        )
    }
    catch(err){
      return reject(500)
    }
  })
  
}

module.exports = TagService

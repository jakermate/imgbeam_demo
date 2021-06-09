const Gallery = require("../db/models/gallery.model")
const Tag = require("../db/models/tag.model")
const GS = require("./GalleryService")
const async = require("async")
const User = require("../db/models/user.model")
const UserService = require("./UserService")
const US = new UserService()
const GalleryService = new GS()
class SearchService {}
const domain = "https://i.imgbeam.com/"

SearchService.searchAll = async function (searchString) {
  return new Promise(async (resolve, reject) => {
    let search = searchString.toLowerCase()
    let search_words = search.split(" ")
    search_words = search_words.filter((word) => {
      if (word !== "") {
        return word
      }
    })
    // remove multiple spaces
    console.log(search_words)

    // let's just search titles for now (full text search)
    try {
      let search_results = await Gallery.search(search, search_words)
      let galleries1 = search_results

      console.log("gallery results from title string ")
      console.log(galleries1)

      let galleries1_id = galleries1.map((gal) => gal.gallery_id)
      // get galleries from tags (tag search)
      let galleries_from_tags = await this.getGalleriesByTag(search)
      console.log(galleries_from_tags)

      // prevent duplicates
      galleries_from_tags.forEach((galleryFromTag) => {
        if (!galleries1_id.includes(galleryFromTag.gallery_id)) {
          galleries1.push(galleryFromTag)
        }
      })
      // create safe dispatches from galleries
      let safe_galleries = []
      let processed_galleries = await Promise.all(galleries1.map(async(gallery)=>{
        return await GalleryService.create_safe_dispatch_async(gallery)
      }))
      return resolve(processed_galleries)
    } catch (err) {
      console.log(err)
      reject(500)
    }
  })
}

SearchService.suggestion = async function (suggestionString) {
  // should look at usernames, tags, and gallery titles
  let search = suggestionString.toLowerCase()
  let search_words = search.split(" ")
  search_words = search_words.filter((word) => {
    if (word !== "") {
      return word
    }
  })
  let suggestions = {
    tags: Tag.search,
    galleries: Gallery.search,
    users: User.findOneLike,
  }
  let results = {
    tags: await suggestions.tags(search),
    galleries: await suggestions.galleries(search, search_words),
    users: await suggestions.users(search),
  }

  results.users = results.users.map((user) => {
        return {
          username: user.username,
          avatar_lq: user.avatar !== null ? domain + get_lq_name(user.avatar) : null
        }
    })
      results.galleries.forEach((gallery) => {
        delete gallery.private
        delete gallery.date_modified
        delete gallery.singleton
        delete gallery.user_id
        delete gallery.reports
      })
      
  return results
}

SearchService.getGalleriesByTag = async function (tagString) {
  // first get tag id
  try {
    let tag = await Tag.getIdExact(tagString)
    if (tag.length == 0) return []
    let tag_id = tag[0].tag_id
    let tag_galleries = await Tag.getGalleries(tag_id)
    return tag_galleries
  } catch (err) {
    console.log(err)
    return []
  }
}

SearchService.findUsers = function (userString, callback) {
  User.search(userString, (err, users) => {
    if (err) {
      return callback({
        success: false,
        message: "DB Error",
      })
    }
    async.map(
      users,
      (user, cb) => {
        let newUser = {
          username: user.username,
          avatar: user.avatar,
          description: user.description,
          date_created: user.date_created,
          rank: US.get_rank(0),
        }
        return cb(null, newUser)
      },
      function (err, newUsers) {
        if (err) {
          return callback({
            success: false,
            message: "Error returning users.",
          })
        }
        return callback({
          success: true,
          users: newUsers,
        })
      }
    )
  })
}
function get_lq_name(file_name) {
    if (!file_name) return null
    let splitz = file_name.split(".")
    return splitz[0] + "_lq.webp"
  }
module.exports = SearchService

const Gallery = require("../db/models/gallery.model")
const User = require("../db/models/user.model")
const Favorite = require("../db/models/favorites.model")
const Votes = require("../db/models/votes.model")
// service responsible for queing up likes/and distributing them in batches to the database

class LikeService {
  upvote(gallery_id, user_id, callback){
    Votes.upVote(gallery_id, user_id, (err, response)=>{
      if(err){
        console.log(err)
        return callback({
          status: 500
        })
      }
      if(response.affectedRows == 0){
        return callback({
          status: 304
        })
      }
      return callback({
        status: 200
      })
    })
  }
  downvote(gallery_id, user_id, callback){
    Votes.downVote(gallery_id, user_id, (err, response)=>{
      if(err){
        console.log(err)
        return callback({
          status: 500
        })
      }
      if(response.affectedRows == 0){
        return callback({
          status: 304
        })
      }
      return callback({
        status: 200
      })
    })
  }
  deleteVote(gallery_id, user_id, callback){
      Votes.delete(gallery_id, user_id, (err, response)=>{
      if(err){
        console.log(err)
        return callback({
          status: 500
        })
      }
      if(response.affectedRows == 0){
        return callback({
          status: 304
        })
      }
      return callback({
        status: 200
      })
      })
    }

  getGalleryLikes(gallery_id, callback) {
    Votes.getByGallery(gallery_id, (err, res) => {
      if (err) {
        console.log("error getting likes for gallery" + gallery_id)
        return callback(err, null)
      }
      if (!err) {
        return callback(err, res)
      }
    })
  }
  getUserLikes(user_id, callback) {
    Votes.getByUser(user_id, (err, res) => {
      if (err) {
        console.log("error getting likes for user " + user_id)
        return callback(err, null)
      }
      if (!err) {
        return callback(err, res)
      }
    })
  }

  // for a user to favorite a specific post, should work like a single 1 factor toggle
  async favoritePost(user_id, gallery_id) {
    try{
      let favorites_check = await Favorite.check(user_id, gallery_id)
      if(favorites_check.length == 0){
        // add favorite
        let add_favorite_response = await Favorite.add(user_id, gallery_id)
        return add_favorite_response
      }
      else{
        // remove favorite
        let delete_favorite_response = await Favorite.remove(user_id, gallery_id)
          return delete_favorite_response
      }

    }
    catch(err){
      console.log(err)
      return 500
    }

    Favorite.check(user_id, gallery_id, (err, res) => {
      console.log(res)
      if (err) {
        console.log(err)
        return callback(err, null)
      }
      // not favorited yet, so add
      if (!err && !res) {
        console.log("not found")
        Favorite.add(user_id, gallery_id, (err2, res2) => {
          if (err2) {
            console.log(err2)
            return callback(err, null)
          }
          if (!err2 && !res2) {
            return callback(null, null)
          }
          if (!err2 && res2) {
            return callback(null, res2)
          }
        })
      }
      // favorited, so remove
      if (!err && res) {
        Favorite.remove(user_id, gallery_id, (err2, res2) => {
          if (err2) {
            console.log(err2)
            return callback(err2, null)
          }
          if (!err2 && !res2) {
            return callback(null, null)
          }
          if (!err2 && res2) {
            return callback(null, res2)
          }
        })
      }
    })
  }

  getFavorites(gallery_id, callback){
    Favorite.getByGallery(gallery_id, (err, favorites)=>{
      if(err){
        return callback({
          success: false,
          message: 'Could not get favorites.'
        })
      }
      return callback({
        success: true,
        favorites: favorites
      })
    })
  }

  
}

module.exports = LikeService

const router = require("express").Router()
const chalk = require("chalk")
// uploads
const Gallery = require("../db/models/gallery.model")
const GalleryServiceC = require("../services/GalleryService")
const GalleryService = new GalleryServiceC()
const LikeServiceC = require("../services/VoteService")
const multer = require("multer")
const storage = multer.memoryStorage()
const VoteService = new LikeServiceC()
const CommentServiceC = require("../services/CommentService")
const Votes = require("../db/models/votes.model")
const TagService = require("../services/TagService")
const PostServiceC = require("../services/PostService")
const PostService = new PostServiceC()
const CommentService = new CommentServiceC()
const multerWare = multer({ storage }).any()
const redis = require("redis")
const Favorites = require("../db/models/favorites.model")
const red = redis.createClient()
const ReportService = require("../services/ReportService")
const RS = new ReportService()
// these routes should be called when the user visits a beam/gallery
// the response will return the gallery information and image information to display. The client will then request the individual images from the i.imgbeam service.

// OPEN ROUTES

// Get gallery object
router.get("/:gallery_id", async (req, res) => {
  console.log(chalk.blue("Request for image beam " + req.params.gallery_id))
  let gallery_id = req.params.gallery_id
  if (gallery_id.length !== 8) return res.sendStatus(401)
  try {
    // retreive the gallery row from database
    let gallery = await Gallery.get(gallery_id)
    // let gallery have a new view
    let add_view_response = await GalleryService.addView(
      req.params.gallery_id,
      req.cookies
    )
    // add view to user activity history
    if (req.user) {
      let add_history_response = await GalleryService.addHistoryView(
        gallery_id,
        req.user.user_id
      )
      console.log(add_history_response)
    }
    let safe_gallery = await GalleryService.create_safe_dispatch_async(
      gallery,
      req
    )
    return res.send(safe_gallery)
  } catch (err) {
    return res.sendStatus(500)
  }
})

// get comments
router.get("/:gallery_id/comments", (req, res) => {
  console.log("Comment request for gallery " + req.params.gallery_id)
  CommentService.get(
    req.params.gallery_id,
    req.user?.username,
    (err, comments, count) => {
      if (err) {
        return res.send({
          success: false,
          message: "Could not retrieve comments.",
        })
      }
      return res.send({
        success: true,
        comments: comments,
        count: count,
      })
    }
  )
})
// get comment count
router.get(`/:gallery_id/comments/count`, async (req, res) => {
  let count = await CommentService.getCount(req.params.gallery_id)
  if (count === null) {
    return res.status(500)
  }
  return res.status.send(count)
})

// get favorites
router.get("/:gallery_id/favoritescount", (req, res) => {
  VoteService.getFavorites(req.params.gallery_id, (favs) => {
    let favoriteCount = favs.favorites.length
    console.log("count" + favoriteCount)
    return res.json(favoriteCount)
  })
})
router.get("/:gallery_id/favorites", (req, res) => {
  VoteService.getFavorites(req.params.gallery_id, (response) => {
    return res.send(response)
  })
})

// update all likes for client
router.get("/:gallery_id/likes", (req, res) => {
  VoteService.getGalleryLikes(req.params.gallery_id, (err, likes) => {
    console.log(likes)
    if (err) {
      return res.send({
        success: false,
      })
    }
    if (likes) {
      return res.send({
        success: true,
        likes: likes,
      })
    }
  })
})

// GET TAGS API
router.get("/:gallery_id/tags", async (req, res) => {
  console.log("tag request")
  try {
    let tags = await TagService.getGallery(req.params.gallery_id)
    return res.send(tags)
  } catch (err) {
    return res.sendStatus(500)
  }
})

// get zip of gallery
router.get("/:gallery_id/zip", async (req, res) => {
  console.log("request for zip file for gallery " + req.params.gallery_id)
  try {
    let zip_object = await GalleryService.getZip(req.params.gallery_id)
    console.log(zip_object)
    res.writeHead(200, {
      "Content-Disposition": `attachment; filename="${zip_object.archiveName}"`,
      "Content-Type": "application/zip",
    })
    return res.end(zip_object.archive)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})
// get singleton (uncompressed)
router.get("/:gallery_id/download", async (req, res) => {
  try {
    let download_package = await GalleryService.download(req.params.gallery_id)
    console.log(download_package)
    res.writeHead(200, {
      "Content-Disposition": `attachment; filename="${download_package.file_name}"`,
      "Content-Type": download_package.content_type,
    })
    return res.end(download_package.image)
  } catch (err) {
    console.log(err)
    return res.send(500)
  }
})

// API / CLOSED ROUTES
// api for guests to interact with other users posts
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // console.log("authenticated request to beam api")
    return next()
  }
  // console.log("unauthenticated request to beam api")
  return res.status(401).send()
}
// this requires all calls to the gallery api to be authenticated users
router.use(isAuthenticated)

// VOTE API
// this sends a like to the current gallery, with it's type (c, f, or i) in a query
// also can handle the dislike event as it works with the same toggle mechanis,
// send upvote
router.post(`/:gallery_id/upvote`, (req, res) => {
  let user = req.user.user_id
  let gallery = req.params.gallery_id
  VoteService.upvote(gallery, user, (success) => {
    return res.status(success.status).send()
  })
})
router.post(`/:gallery_id/downvote`, (req, res) => {
  let user = req.user.user_id
  let gallery = req.params.gallery_id
  VoteService.downvote(gallery, user, (success) => {
    return res.status(success.status).send()
  })
})
router.delete(`/:gallery_id/vote`, (req, res) => {
  let user = req.user.user_id
  let gallery = req.params.gallery_id
  VoteService.deleteVote(gallery, user, (success) => {
    return res.status(success.status).send()
  })
})

// get user vote status
router.get("/:gallery_id/vote", (req, res) => {
  let user_id = req.user.user_id
  console.log("checking vote relationship")
  Votes.getOne(req.params.gallery_id, user_id, (err, data) => {
    if (err) {
      console.log(err)
      return res.status(500).send()
    }
    if (!data.length) {
      return res.send({
        voted: false,
      })
    }
    if (data.length) {
      return res.send({
        voted: true,
        type: data[0].vote_type == 0 ? false : true,
      })
    }
  })
})

// FAVORITES API
// this route sends a request to favorite a post, which will rely on the LikeService and user.model methods
router.post("/:gallery_id/favorite", async (req, res) => {
  try {
    console.log(
      req.user.username + " wants to favorite gallery " + req.params.gallery_id
    )
    let user_id = req.user.user_id
    let gallery_id = req.params.gallery_id
    let favorite_response = await VoteService.favoritePost(user_id, gallery_id)
    if (favorite_response == 200) return res.sendStatus(200)
    else throw new Error("favorite request failed")
  } catch (err) {
    return res.sendStatus(500)
  }
})
// get favorite status
router.get("/:gallery_id/favorite", async (req, res) => {
  try {
    let user_id = req.user.user_id
    let gallery_id = req.params.gallery_id
    let favorite_check_response = await Favorites.check(user_id, gallery_id)
    if (favorite_check_response.length > 0) return res.sendStatus(200)
    else return res.sendStatus(401)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

// COMMENTS API
router.post("/:gallery_id/comment/add", (req, res) => {
  let comment = req.body.comment

  console.log(req.body)

  CommentService.send(
    req.user.user_id,
    req.params.gallery_id,
    comment,
    req.query.reply_id,
    (err, result) => {
      if (err) {
        console.log("comment add error")
        res.send("error adding comment")
      }
      if (!err) {
        res.send({
          success: true,
          message: "Comment added.",
        })
      }
    }
  )
})
router.delete("/:gallery_id/comment/delete", (req, res) => {
  let user_id = req.user.user_id
  let comment_id = req.query.comment_id
  CommentService.delete(comment_id, user_id, (successObj) => {
    if (successObj.success) {
      return res.status(200).send()
    }
    return res.status(500).send()
  })
})

// API FOR COMMENT LIKES
router.get("/:gallery_id/comment/like", (req, res) => {
  let comment_id = req.query.comment_id
  let user_id = req.user.user_id
  if (!comment_id) {
    return res.status(500).send()
  }
  console.log("getting comment like status for " + comment_id)
  CommentService.getCommentLike(comment_id, user_id, (err, rows) => {
    if (err) {
      res.status(500).send()
    }
    if (rows.length == 0) {
      res.status(200).send({
        liked: false,
      })
    }
    if (rows.length == 1) {
      res.status(200).send({
        liked: true,
      })
    }
  })
})
router.post("/:gallery_id/comment/like", (req, res) => {
  let gallery_id = req.params.gallery_id
  let comment_id = req.query.comment_id
  let user_id = req.user.user_id
  if (!comment_id) {
    return res.status(500).send()
  }
  console.log("liking comment")
  CommentService.likeComment(gallery_id, comment_id, user_id, (err, rows) => {
    console.log(rows)
    if (err || rows.affectedRows == 0) {
      res.status(500).send()
    }
    if (rows.affectedRows > 0) {
      res.status(200).send()
    }
  })
})
router.post("/:gallery_id/comment/unlike", (req, res) => {
  let gallery_id = req.params.gallery_id
  let comment_id = req.query.comment_id
  let user_id = req.user.user_id
  if (!comment_id) {
    return res.status(500).send()
  }
  console.log("unliking comment")
  CommentService.unlikeComment(gallery_id, comment_id, user_id, (err, rows) => {
    if (err || rows.affectedRows == 0) {
      res.status(500).send()
    }
    if (rows.affectedRows > 0) {
      res.status(200).send()
    }
  })
})

// REPORTS
router.post("/:gallery_id/report", async (req, res) => {
  let report_response = await RS.report_gallery(req)
  if (report_response === 500) {
    return res.sendStatus(500)
  }
  return res.sendStatus(200)
})

// API FOR OWNER TO EDIT
function isOwner(req, res, next) {
  console.log("checking ownership ")
  // check if both authenticated and if user is gallery owner
  Gallery.getOwner(req.params.gallery_id, (err, owner) => {
    if (err) res.sendStatus(500)
    console.log(owner)
    if (!owner.length) {
      console.log("cannot find owner")
      res.redirect({
        success: false,
        message: "Not authorized for that action.",
      })
    }
    if (req.isAuthenticated() && req.user.user_id === owner[0].user_id) {
      console.log("request is authorized")
      return next()
    }
    console.log("not authorized")
    res.redirect({
      success: false,
      message: "Not authorized for that action.",
    })
  })
}
// api endpoints for editing a gallery
//  /beam/edit/:gallery_id/
router.use("/edit/:gallery_id", isOwner) // route open for authorized owner

router.get("/edit/:gallery_id/test", (req, res) => {
  res.send("Api for editing gallery works")
})
// tags
router.post("/edit/:gallery_id/tags/add", async (req, res) => {
  try {
    let tag = req.query.tag
    console.log("new tag request for gallery " + req.params.gallery_id)
    let tag_add_response = await TagService.addTagToGallery(
      tag,
      req.params.gallery_id
    )
    return res.sendStatus(tag_add_response)
  } catch (err) {
    return res.sendStatus(500)
  }
})
router.delete("/edit/:gallery_id/tags/remove", async (req, res) => {
  try {
    let tag = req.query.tag
    let response = await TagService.removeTagFromGallery(
      tag,
      req.params.gallery_id
    )
    return res.sendStatus(response)
  } catch (err) {
    return res.sendStatus(500)
  }
})
// title
router.post("/edit/:gallery_id/title", async (req, res) => {
  let title = req.query.title
  let title_status_response = await PostService.updateTitle(
    title,
    req.params.gallery_id
  )
  return res.sendStatus(title_status_response)
})
// image description
router.post("/edit/:gallery_id/description", async (req, res) => {
  if (!req.query.image_id) {
    return res.send({
      success: false,
      message: "Missing credentials.",
    })
  }
  let image = req.query.image_id
  let newDescription = req.query.description
  let status_code = await PostService(
    newDescription,
    image,
    req.params.gallery_id
  )
  return res.sendStatus(status_code)
})
// images
router.post("/edit/:gallery_id/images/add", multerWare, async (req, res) => {
  try {
    let image_service_response = await PostService.addImage(req)
    return res.sendStatus(image_service_response)
  } catch (err) {
    return res.sendStatus(500)
  }
})
router.post("/edit/:gallery_id/images/remove", multerWare, async (req, res) => {
  console.log(
    "image id=" + req.query.image_id + "image_name=" + req.query.image_name
  )
  if (!req.query.image_name || !req.query.image_id) {
    res.sendStatus(404)
  }
  if (req.query.image_name.replace(/\.[^/.]+$/, "") !== req.query.image_id) {
    res.sendStatus(400)
  }
  let image = req.query.image_name
  console.log("removing " + image)
  let delete_image_response = await PostService.deleteImage(
    req.params.gallery_id,
    req.query.image_id
  )
  return res.sendStatus(delete_image_response)
})

// media arrangement
router.post("/edit/:gallery_id/arrangement", async (req, res) => {
  let arrangement_response = await PostService.update_arrangement(
    req.params.gallery_id,
    req.body
  )
  res.sendStatus(arrangement_response)
})

// owner delete
router.delete("/edit/:gallery_id/delete", async (req, res) => {
  try {
    let delete_response = await PostService.deleteGallery(
      req.params.gallery_id,
      req.user.user_id
    )
    res.sendStatus(delete_response)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

// 404 catchall
router.get((req, res) => {
  res.status(404).send("Can't find that gallery.")
})

module.exports = router

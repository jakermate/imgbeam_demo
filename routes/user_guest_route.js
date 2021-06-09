const router = require("express").Router()
// uploads
const FollowService = require("../services/FollowService")
const User = require("../db/models/user.model")
const UserService = require("../services/UserService")
const US = new UserService()
const FS = new FollowService()

router.get("/:username", async (req, res) => {
  console.log("Request for user " + req.params.username)
  let requesting_user = null
  if (req.user) {
    requesting_user = req.user.username
  }
  let user_object_response = await US.getSafeUserObject(
    req.params.username,
    requesting_user
  )
  if (user_object_response == 500) return res.sendStatus(500)
  return res.send(user_object_response)
})

// get most recent user activity
router.get("/:username/activity", (req, res) => {
  let from = req.query.from
  let to = req.query.to
  US.getActivity(req.params.username, from, to, (response) => {})
})
// get most recent user activity
router.get("/:username/comments", (req, res) => {
  let from = req.query.from
  let to = req.query.to
  US.getComments(req.params.username, from, to, (response) => {
    return res.send(response)
  })
})
// get most recent user activity
router.get("/:username/galleries", async (req, res) => {
  try {
    let from = req.query.from
    let to = req.query.to
    let posts = await US.getPostsSync(req.params.username, from, to)
    return res.send(posts)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

// authenticated routes
// API / CLOSED ROUTES
// api for guests to interact with other users posts
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).send()
}
// this requires all calls to the gallery api to be authenticated users
router.use(isAuthenticated)

// User API for guests
// FOLLOWS
// the user_id from the request object requests to follow the parameter user (username)

router.post("/:username/follow", async (req, res) => {
  let user_id = req.user.user_id
  let target_username = req.params.username
  console.log("follow request from " + user_id + " to " + target_username)
  try {
    let follow_response = await FS.followUser(user_id, target_username)
    return res.send(follow_response)
  } catch (err) {
    return res.sendStatus(500)
  }
})

// get following status
router.get("/:username/following", async (req, res) => {
  try {
    let user_id = req.user.user_id
    let username = req.params.username
    let result = await FS.amIFollowing(user_id, username)
    return res.send(result)
  } catch (err) {
    return res.sendStatus(500)
  }
})

router.get("/", (req, res) => {
  res.send("These routes are used for guest interaction with a userpage")
})

module.exports = router

const cache = require("memory-cache")
const redis = require("redis")
const red = redis.createClient()
const Gallery = require("../db/models/gallery.model")
const galleryService = require("../services/GalleryService")
const GS = new galleryService()
const async = require("async")
const GalleryService = require("../services/GalleryService")
const cron = require("cron").CronJob
const TagModel = require("../db/models/tag.model")
// connect to redis
red.on("error", (err) => {
  console.log(err)
})

// exports a set of cache keys holding objects with tranding features
class Trending {
  // GET API
  // get all test
  async getHotNow(from, to, callback) {
    return new Promise((resolve, reject)=>{
      if (red.connected) {
      red.get("most_viewed_all_time", (err, hotlist) => {
        if (!hotlist) return callback({ success: false })
        let hotlistjson = JSON.parse(hotlist)
        console.log("getting from " + from + " to " + to)

        let listSized = hotlistjson.slice(from, to)
        console.log("Returning " + listSized.length)
        if (err) {
          reject(500)
          return
        }
        resolve(listSized)
      })
    }
    })
    
  }

  async getNew(from, to) {
    return new Promise(async (resolve, reject)=>{
      try{
        let latest = await Gallery.getLastestFromTo(from, to)
        let gallerySlice = latest.slice(from, to)
        let galleries = []
        // make client-safe
        async.each(
          gallerySlice,
          async (gallery, cb) => {
            try{
              let dispatch = await GS.create_safe_dispatch_async(gallery, null)
              galleries.push(dispatch)
              Promise.resolve()
            }
           catch(err){
            Promise.reject()
           }
          },
          function (err) {
            let safegalleryArray = galleries.filter((gallery, index) => {
              if (gallery.images.length !== 0) {
                return gallery
              }
            })
            return resolve(safegalleryArray)
          }
        )
      }
      catch(err){
        return reject(500)
      }
    })
    
  }

  async getTrendingTags(from, to, callback) {
    red.get("trending_tags", (err, tags) => {
      if (!tags) return callback({ success: false })
      let tagJson = JSON.parse(tags)
      let slice = tagJson.slice(from, to)
      if (err) {
        return callback({
          success: false,
          message: "Could not get trending tags.",
        })
      }
      return callback({
        success: true,
        tags: slice,
      })
    })
  }

  // SERVER STATE HANDLING
  // load redis after restart
  
  async loadTotalHighestViewed() {
    try{
      let most_view = await Gallery.get1000MostViewed()
      let mostViewedAllTime = []
      async.map(
        most_view,
        async (gallery, cb) => {
          try{
            let safe_dispatch = await GS.create_safe_dispatch_async(gallery, null)
            mostViewedAllTime.push(safe_dispatch)
            Promise.resolve()

          }
          catch(err){
            console.log(err)
            Promise.reject()
          }
        
        },
        function (err) {
          // console.log(mostViewedAllTime)
          if (err) {
            console.log("Couldn't load most view all time")
            return
          }
          red.set(
            "most_viewed_all_time",
            JSON.stringify(mostViewedAllTime),
            (err, res) => {
              if (err) {
                console.log("Error setting all time views")
                return
              }
            }
          )
        }
      )
    }
    catch(err){
      return 500
    }
  
  }

  async loadTotalHighestPoints() {
    Gallery.get1000MostViewed((err, res) => {
      // console.log(res.length)
      let mostViewedAllTime = []
      async.map(
        res,
        (gallery, cb) => {
          GS.create_safe_dispatch(gallery, (gallery_dispatch) => {
            if (err) return cb(err)
            cb(err, gallery_dispatch)
          })
        },
        function (err, mostPointsAllTime) {
          if (err) {
            console.log("Couldn't load most view all time")
            return
          }
          red.set(
            "most_points_all_time",
            JSON.stringify(mostPointsAllTime),
            (err, res) => {
              if (err) {
                console.log("Error setting all time points")
                return
              }
              // console.log(res)
            }
          )
        }
      )
    })
  }

  

  getPicks(req, from, to, callback) {
    let recent
    if(req.cookies.recent){
      recent = JSON.parse(req.cookies.recent) || []
    }
    let tagsArray = []
    async.each(
      recent,
      (recentGallery_id, cb) => {
        TagModel.getByGallery(recentGallery_id, (err, tags) => {
          if (err) return cb(err)
          tagsArray = [...tagsArray, ...tags]
          return cb(null)
        })
      },
      function (err) {
        if (err) console.log(err)
        if (tagsArray.length == 0) {
          return callback(tagsArray)
        }
        async.map(
          tagsArray,
          (tagObject, cb2) => {
            TagModel.getGalleriesLimit(tagObject.tag_id, (err, galleries) => {
              if (err) return cb2(err, null)
              return cb2(null, galleries)
            })
          },
          function (err, result) {
            // convert to gallery_id array to get rid of duplicates
            let gallery_ids = result.flat().map(galleryObject=>{
                return galleryObject.gallery_id
            })
            let gallery_id_unique = [ ...new Set(gallery_ids) ]

            GS.getGalleries(gallery_id_unique, (galleries)=>{
              return callback(galleries)

            })

          }
        )
      }
    )
  }

  startCrons() {
    let get_most_viewed_all_time = new cron("1 * * * * *", () => {
      console.log("Getting all time most viewed.")
      this.loadTotalHighestViewed()
    })
    get_most_viewed_all_time.start()
  }

  onboot() {
    this.loadTotalHighestViewed()
    this.startCrons()
  }
}

async function storeGallery(galleryObject){
  let points = 100
  galleryObject.points = points
  try{
    let setResult = await asyncSet(galleryObject.gallery_id, galleryObject)
    return 200
  }
  catch(err){
    return 500
  }
  
}

async function getGallery(key){
  try{
    let galleryRes = await asyncGet(key)
    return galleryRes
  }
  catch(err){
    return null
  }
}


// async promise functions from callbacks
async function asyncSet(key, value){
  return new Promise((resolve, reject)=>{
    red.set(key, JSON.stringify(value), (err)=>{
      if(err){
        reject(err)
      }
      resolve(200)
    })
  })
}
async function asyncGet(key){
  return new Promise((resolve, reject)=>{
    red.get(key, (err, reply)=>{
      if(err){
        reject(err)
      }
      resolve(JSON.parse(reply))
    })
  })
}

// reload last 50 on startup
const trending = new Trending()
trending.onboot()

module.exports = Trending

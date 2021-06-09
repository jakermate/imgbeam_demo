const Follow = require("../db/models/follow.model")
const User = require("../db/models/user.model")
class FollowService {
  // primary user is the one initiating the follow, followed_user is the target
  async followUser(primary_user, followed_user) {
    //get target user id
    try{
      let user_response = await User.findOneUsernameSync(followed_user)
      if(user_response.length == 0) return 500
      let target_id = user_response[0].user_id
      let follow_status = await Follow.check(primary_user, target_id)
      if(follow_status.length == 1){
        // already following
        let delete_follow_response = await Follow.delete(primary_user, target_id)
        return false
      }
      else{
        // not already following
        let create_follow_response = await Follow.create(primary_user, target_id)
        return true

      }
      // get and return updated status
    }
    catch(err){
      console.log(err)
      throw new Error(err)
    }

    
  }
  async amIFollowing(guest_id, target_username) {
    // get target id
    try {
      let user_res = await User.findOneUsernameSync(target_username)
      if (user_res.length == 0) return 500
      let target_id = user_res[0].user_id
      let status = await Follow.check(guest_id, target_id)
      console.log(status)
      if (status.length == 1) {
        return true
      }
      return false
    } catch (err) {
      return 500
    }
  }
  async getFollowing(user_id){
    try{
      let follow_rows = await Follow.get_following(user_id)
      console.log(follow_rows)
      return follow_rows
    }
    catch(err){
      console.log(err)
      return 500
    }
  }
  async getFollowers(user_id){
    try{
      return await Follow.get_followers(user_id)
    }
    catch(err){
      console.log(err)
      return null
    }
  }
}
module.exports = FollowService

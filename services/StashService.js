const { Store } = require("express-session")

module.exports = {
  async store_object() {
    let new_id = get_hash()
    

},

  get_hash(length = 128) {
    let string = ""
    let set = "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < length; i++) {
      let newCharacter
      newCharacter = set.charAt(Math.floor(Math.random() * set.length))
      string += newCharacter
    }
    return string
  },
}

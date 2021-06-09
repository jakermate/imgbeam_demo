module.exports = function(length){
    let string = ''
    let set = 'ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for(let i = 0; i < 8; i++){
        let newCharacter
            newCharacter = set.charAt(Math.floor(Math.random() * set.length))
        string += newCharacter
    }
    return string
}
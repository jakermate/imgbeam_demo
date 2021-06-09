const chalk = require('chalk')

const validator = require('validator').default


module.exports.email = function(email){
    // check iv valid email
    let isValid = validator.isEmail(email)
    // check if only letters and numbers
    isValid = validator.isAlphanumeric(email)
    if(typeof isValid === 'string'){
        return isValid
    }
    return false
}

module.exports.validateSignUp = function(reqBody){
    console.log('Validating signup credentials')
    // check for all necessary fields
    if(!reqBody.username || !reqBody.email || !reqBody.password || !reqBody.password2){
        return {valid: false, message: 'Missing account credential during signup.'}
    }
    if(/\s/.test(reqBody.username) || /\s/.test(reqBody.password)){
        return {
            valid: false,
            message: "Username and password may not contain spaces."
        }
    }
    if(reqBody.username.length > 36){
        return{
            valid:false,
            message: "Username must be less than 36 characters long."
        }
    }
    // check password length
    if(reqBody.password.length < 6 || validator.isAlpha(reqBody.password) ){
        return {valid: false, message: 'Password must contain at least one number and be at least 6 characters long.'}
    }
    if(!validator.isAlphanumeric(reqBody.username)){
        return {valid: false, message: 'Username cannot have special characters.'}
    }
    // validate email
    if(!validator.isEmail(reqBody.email)){
        return {valid: false, message: 'Not a valid email address.'}
    }
    // make sure username isnt email
    if(validator.isEmail(reqBody.username)){
        return{valid: false, message: 'Username cannot be an email.'}

    }
    if(reqBody.username.length < 3){
        return{valid: false, message: 'Username must be 3 characters or greater.'}
    }
    // match passwords
    return {valid: true, message:'Password is valid.'}
}

// module.exports.validateLogin = function(reqBody){
//     console.log('Validating login credentials')
//     // validate email

//     // validate password


//     return true
// }
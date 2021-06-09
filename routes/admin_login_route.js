// obfuscated route for admin login to prevent direct attacks
const exp = require('express')
const router = exp.Router()

router.get("/wkubjwdvkcjnwdvkjwnefliuabwldsacjkvsdbvnma", (req, res)=>{
    console.log('Found admin login page.')
    res.send('Admin Login')
})

module.exports = router
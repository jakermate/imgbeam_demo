const router = require('express').Router()
const MessageService = require('../services/MessageService')
const MS = new MessageService()
// messaging route is authentication protected, so no checks need be done here other than for blocks
router.get('/get', async (req, res)=>{
    if(!req.query.user_id || isNaN(parseInt(req.query.user_id))){
        return res.status(400).send()
    }
    let correspondant = parseInt(req.query.user_id)
    let get_conversation_response = await MS.get_conversation(req.user.user_id, correspondant)
    return res.send(get_conversation_response)

})
router.post('/send', async (req, res)=>{
    console.log(req.body)
    if(!req.query.user_id || !req.body.message.length > 0){
        return res.status(400).send()
    }
    let sender = req.user.user_id
    let receiver = parseInt(req.query.user_id)
    let message_create_response = await MS.send_message(sender, receiver, req.body.message)
    // return response from db to user
    return res.status(message_create_response).send()
})





module.exports = router
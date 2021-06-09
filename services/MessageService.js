const Message = require('../db/models/message.model')
module.exports = class MessageService{

    async get_conversation(user_id, correspondant_id){
        let conversation_response = await Message.get_conversation(user_id, correspondant_id)
        
        return conversation_response
    }

    async send_message(sender_id, receiver_id, message){
        // prevent self messages
        if(sender_id == receiver_id){
            return 400
        }
        let create_message_response = await Message.create_message(sender_id, receiver_id, message)
        return create_message_response
    }

    

}
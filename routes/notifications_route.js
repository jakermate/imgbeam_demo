const exp = require('express')
const router = exp.Router()
const NS = require('../services/NotificationService')
const NotificationService = new NS()

// should be transitioned to any type of notification
router.get('/get/all', async (req, res)=>{
    let notifications = await NotificationService.getUserNotifications(req.user.user_id)
    if(notifications == 500) return res.sendStatus(500)
    return res.send(notifications)
})
router.delete('/clear/all', (req, res)=>{
    let user_id = req.user.user_id
    NotificationService.retire_all_comment_notifications(user_id, (successObj)=>{
        return res.send(successObj)
    })
})
router.delete('/clear', (req, res)=>{
    let notification_id = req.query.notification_id
    NotificationService.retire_comment_notification(notification_id, req.user.user_id, (successObj)=>{
        return res.send(successObj)
    })
})

module.exports = router
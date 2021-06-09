import React, { useState, useEffect } from "react"
import moment from "moment"
import { Link } from "react-router-dom"
import {toast} from 'react-toastify'
import SignInPlaceholder from '../../SignInPlaceholder'
export default function NotificationView(props) {
  const [notifications, setNotifications] = useState(null)
  useState(() => {
    getNotifications()
  }, [])
  useEffect(()=>{
    console.log(notifications)
  }, [notifications])
  async function clearNotification(comment_notification_id) {
    let url = `/notifications/api/clear?notification_id=${comment_notification_id}`
    try{
        let res = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        })
        let json = await res.json()
        if(json.success){
            console.log('cleared')
            getNotifications()
            toast("Notification Cleared")
        }
        else{
            console.log('error clearing notification')
        }
    }
    catch(err){
        console.log(err)
    }
  }
  async function clearAllNotifications(){
    let url = `/notifications/api/clear/all`
    try{
        let res = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        })
        let json = await res.json()
        if(json.success){
            console.log('cleared')
            getNotifications()
            toast("All Notifications Cleared")

        }
        else{
            console.log('error clearing notification')
        }
    }
    catch(err){
        console.log(err)
    }
  }
  async function getNotifications(props) {
    let url = `/notifications/api/get/all`
    try {
      let res = await fetch(url)
      let json = await res.json()
      if (json.success) {
        setNotifications(json.notifications)
      }
    } catch (err) {
      console.log(err)
    }
  }
  if(!props.signedIn){
    return(
      <SignInPlaceholder header={`Sign up to get alerts.`} icon={`fas fa-bell`} subheader={`Sign in or create a new account to start receiving notifications about your favorite posters and artists.`}></SignInPlaceholder>
    )
  }
  if(!notifications){
    return(
      <div className="text-white py-8 font-bold">
      <h2>No New Notifications</h2>
    </div>
    )
   
  }
  return (
    <div className="text-white text-left container mx-auto mt-12 ">
      {notifications !== null && (
        <div
          className=""
          style={{
            maxWidth: "420px",
          }}
        >
            <div id="notification-control" className="w-full">
                <button onClick={e => clearAllNotifications()} className="py-1 px-6 bg-gray-900">
                    Clear All Notifications
                </button>
            </div>
          {notifications.map((notificationObject, index) => {
            return (
              <div className="flex flex-row overflow-hidden bg-gray-700 my-2" style={{
                  borderRadius: '4px'
              }}>
                <Link
                  to={`/beam/${notificationObject.gallery_id}`}
                  className="flex-grow hover:opacity-75"
                >
                <div className="post-title-wrapper p-3">
                    <h3 className="font-bold text-lg">{notificationObject.title}</h3>
                </div>
                  <div key={`notification-${index}`} className="p-3 ">
                  <p className="mt-4 font-bold">"{notificationObject.message}"</p>

                    <h6 className="text-xl font-extrabold">
                      <span className="block leading-6 text-sm">{notificationObject.username}</span>
                    </h6>
                    
                   { 
                       notificationObject.reply_id ?

                       <p className="opacity-75 text-xs">
                    replied  to
                      your comment.
                    </p>
                    :
                    <p className="opacity-75 text-xs">
                    commented on your post.
                    </p>
                    }
                    <div className="">
                        <p className="font-bold text-xs opacity-50">{moment(notificationObject.date_created).fromNow()}</p>
                    </div>
                  </div>
                </Link>
                <button className="self-stretch" onClick={e => clearNotification(notificationObject.comment_notification_id)}>
                <div className="flex flex-col items-center justify-center bg-gray-900 hover:opacity-75 h-full">
                  <i class="fas fa-times block mx-4"></i>
                </div>
                </button>
               
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

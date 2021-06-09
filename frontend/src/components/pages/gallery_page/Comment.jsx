import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { Link } from "react-router-dom"
import icon from "../../../triangle_icon.png"
import moment from "moment"
export default function Comment(props) {
  const [replying, toggleReplying] = useState(false)
  const [replyString, setReplyString] = useState("")
  function cancelReply(e) {
    toggleReplying(false)
    setReplyString("")
  }
  function replyRequest(answer){
    if(props.signedIn){
      replyMethod(answer)
      return
    }
    props.toggleSignUpOverlay(true)

  }

  function replyMethod(){
     // determine if mobile or desktop
     if(window.innerWidth < 800){
       console.log('mobile reply')
      props.setReplyActive(true)
      console.log('setting active comment')
      console.log(props.commentObj)
      props.setActiveComment(props.commentObj)
      return
    }
    toggleReplying(true)

  }
  useEffect(()=>{
    getLike()
  })

 

  const [liked, setLiked] = useState(false)
  async function reply() {
    let reply_id = props.commentObj.comment_id
    let reply_message = replyString

    let url = `/api/beam/${props.commentObj.gallery_id}/comment/add?reply_id=${reply_id}`
    try {
      let res = await fetch(url, {
        body: JSON.stringify({
          comment: reply_message,
        }),
        mode: "cors",
        credentials: "include",
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      })
      let json = await res.json()
      console.log(json)
      if (json.success) {
        cancelReply()
        props.refresh()
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function like(){
    let url = `/api/beam/${props.commentObj.gallery_id}/comment/like?comment_id=${props.commentObj.comment_id}`
    try{
      let res = await fetch(url, {
        method: "POST"
      })
      if(res.status == 200){
        setLiked(true)
        getLike()
        
      }
      if(res.status == 401){
        props.toggleSignUpOverlay(true)
      }
      else{
        getLike()
      }
    }
    catch(err){
      console.log(err)
      // getLike()
    }
    
  }
  async function unlike(){
    let url = `/api/beam/${props.commentObj.gallery_id}/comment/unlike?comment_id=${props.commentObj.comment_id}`
    try{
      let res = await fetch(url, {
        method: 'POST'
      })
      console.log(res)
      if(res.status == 200){
        setLiked(false)
        getLike()
  
      }
      else{
        getLike()
      }
    }
    catch(err){
      console.log(err)
    }
    
  }
  async function getLike(){
    let url = `/api/beam/${props.commentObj.gallery_id}/comment/like?comment_id=${props.commentObj.comment_id}`
    try{
      let res = await fetch(url)
      if(res.status == 500){
        console.log('error')
      }
      console.log('getlike response')
      if(res.status == 200){
        let json = await res.json()
        if(json.liked){
          setLiked(true)
        }
        if(!json.liked){
          setLiked(false)
        }
      }
    }
    catch(err){
      console.log(err)
    }
    
  }
  async function deleteComment(){
    let url = `/api/beam/${props.commentObj.gallery_id}/comment/delete?comment_id=${props.commentObj.comment_id}`
    try{
      let res = await fetch(url, {
        method: "DELETE",
        credentials: 'include'
      })
      if(res.status == 200){
        console.log('comment deleted')

      }
      else{
        console.log('comment not deleted')
      }

    }
    catch(err){
      console.log(err)
    }
  }
  if(props.commentObj.username == null){
    return(
      <CommentWrapper
      className="pt-6"
      id={`gallery-comment-id-${props.commentObj.comment_id}`}
    >
      <div className="comment-user-info-row flex flex-row text-xs font-bold">
          comment deleted by user
          <span className="ml-1">{moment(props.commentObj.comment_date).fromNow()}</span>
      </div>
      <div
        className=""
        style={{
          // marginLeft: "8px",
          // borderLeft: "1px solid rgba(100,100,100,.3)",
        }}
      >
        
       
        <div className="comment-replies ml-6 ">
          {Object.keys(props.commentObj.replies).map((replyIndex, indx) => {
            return (
              <Comment
                reply
                key={`comment-reply-${indx}`}
                owner={props.owner}
                refresh={props.refresh}
                commentObj={props.commentObj.replies[replyIndex]}
              ></Comment>
            )
          })}
        </div>
      </div>
      <HorizontalBar className="horizontal-bar"></HorizontalBar>
    </CommentWrapper>
    )
  }
  else return (
    <CommentWrapper
      className="pt-6"
      id={`gallery-comment-id-${props.commentObj.comment_id}`}
    >
      <div className="comment-user-info-row flex flex-row">
        <div className="comment-avatar mr-2" style={{
          borderRadius: '100%',
          overflow: 'hidden'
        }}>
          <img src={props.commentObj.avatar_lq} style={{
            width: '100%',
            height: '100%',
            objectFit:'cover',

          }} alt=""/>
        </div>
        <div className="comment-header flex flex-row justify-between">
          <div className="flex flex-row items-center">
            <span className="text-xs font-bold pl-2">
            {
              props.commentObj.username == null ?
              <div>
                comment deleted
              </div>
              :
              <Link
                className="text-blue-300"
                to={`/user/${props.commentObj.username}`}
              >
                <UsernameDisplay
                  owner={props.owner}
                  user={props.commentObj.username}
                >
                  {props.commentObj.username}
                  <span>
                    {props.commentObj.username == props.owner && (
                      <img
                        src={icon}
                        alt=""
                        className="w-2 ml-1 inline-block"
                      />
                    )}
                  </span>
                </UsernameDisplay>
              </Link>
            }
              
            </span>
            <span className="text-xs ml-4 font-bold opacity-75">{props.commentObj.likes.length + 1} points</span>

            <span className="ml-2 text-xs font-bold opacity-75">
              &bull; {moment(props.commentObj.comment_date).fromNow()}
            </span>
          </div>
          <div>
            <span className="opacity-75 hover:opacity-100 ml-6">
              {props.commentObj.owner ? (
                <button onClick={e => deleteComment()}>
                  <i className="fas fa-trash"></i>
                </button>
              ) : (
                <button>
                  <i className="fas fa-flag fa-sm"></i>
                </button>
              )}
            </span>
          
          </div>
        </div>
      </div>
      <div
        className=""
        style={{
          // marginLeft: "8px",
          // borderLeft: "1px solid rgba(100,100,100,.3)",
        }}
      >
        <CommentEl
          owner={props.commentObj.owner}
          className=""
          reply={props.reply}
        >
          <div className="text-sm my-4">
            {props.commentObj.message}
          </div>
          <div className="comment-interactions mt-2 flex items-center flex-row">
        
            <div className="like-comment-container" title="like this comment">
             
              {liked ? 
              <button onClick={e => unlike()}>
              <i className="fas fa-heart"></i>
              </button> 
              : 
              <button onClick={e => like()}>
              <i className="far fa-heart"></i>
              </button>}
            </div>
           
            
              <div className="comment-reply-button ml-4">
              <button onClick={(e) => replyRequest(true)}>
                <i className="fas fa-reply "></i>
              </button>
            </div>
          </div>
        </CommentEl>
        <ReplyContainer
          active={replying}
          className="reply-container ml-6 pl-4 border-l-2 border-blue-700"
        >
          <div className="reply-control flex flex-row justify-between">
            <div>
              <span className="text-xs opacity-75 font-bold">
                Replying to {props.commentObj.username}
              </span>
            </div>
            <div>
              <span>
                <button onClick={(e) => cancelReply(e)}>
                  <i className="fas fa-times"></i>
                </button>
              </span>
            </div>
          </div>
          <div className=" flex flex-col sm:flex-row justify-between text-white mt-3">
            <input
              value={replyString}
              onChange={(e) => setReplyString(e.target.value)}
              type="text"
              placeholder="Reply to this comment...."
              className="self-stretch inline-block"
            />
            <button
              className="rounded-md text-black font-bold bg-green-400 py-1 px-2 text-xs sm:text-sm sm:px-4 sm:py-2 self-end"
              onClick={(e) => reply()}
            >
              Reply
            </button>
          </div>
        </ReplyContainer>
        <div className="comment-replies ml-6 ">
          {Object.keys(props.commentObj.replies).map((replyIndex, indx) => {
            return (
              <Comment
                reply
                key={`comment-reply-${indx}`}
                owner={props.owner}
                refresh={props.refresh}
                commentObj={props.commentObj.replies[replyIndex]}
                setActiveComment={props.setActiveComment}
                setReplyActive={props.setReplyActive}
                signedIn={props.signedIn}
                toggleSignUpOverlay={props.toggleSignUpOverlay}
              ></Comment>
            )
          })}
        </div>
      </div>
      <HorizontalBar className="horizontal-bar"></HorizontalBar>
    </CommentWrapper>
  )
}
const CommentEl = styled.div`
  margin-bottom: 1.4rem;
  
`

const enter = keyframes`
  from{
    opacity:0;
    height: 0;
    transform: translateY(-30px);
  }
  to{
    opacity:1;
    height: auto;
    transform: translateY(0);
  }
`
const ReplyContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 24px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  padding: 12px 16px;
  animation: ${enter} 0.3s forwards;
  display: ${(props) => (!props.active ? "none" : "block")};

  input {
    background: transparent;
    outline: none;
    border: none;
  }
`
const UsernameDisplay = styled.div`
  color: ${(props) => (props.owner == props.user ? props.theme.success : props.theme.secondary)};
`
const HorizontalBar = styled.div`
  width: 100%;
  height: 1px;
  background: #373737;
`
const CommentWrapper = styled.div`
  .comment-avatar{
    width: 32px;
    height:32px;
    box-shadow: 2px 2px 4px rgba(0,0,0,.4);
  }

`
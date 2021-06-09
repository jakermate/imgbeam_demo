import React, { useEffect, useState } from "react"
import moment from "moment"
import { Link } from "react-router-dom"
import MoonLoader from "react-spinners/MoonLoader"
import styled from 'styled-components'
export default function CommentsComponent(props) {
  useEffect(() => {
    getComments()
  }, [])
  const [comments, setComments] = useState([])
  const [endReached, setEndReached] = useState(false)
  const [loading, setLoading] = useState(false)
  async function getComments() {
    let from = comments.length
    let to = from + 20
    let url = `/api/user/${props.username}/comments?from=${from}&to=${to}`
    try {
      setLoading(true)
      let res = await fetch(url, {
        mode: "cors",
      })
      let json = await res.json()
      if (json.success) {
        console.log(json.comments)
        setComments([...comments, ...json.comments])
        checkEndReached(from, to, json.comments)
        setLoading(false)
      }
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }
  function checkEndReached(from, to, comments) {
    if (comments < to - from) {
      //   console.log('end reached')
      setEndReached(true)
    }
  }
  function copy(e, urlString) {
    e.preventDefault()
    let input = document.createElement("textarea")
    document.body.appendChild(input)
    input.value = urlString
    // input.style.visibility = 'hidden'
    input.select()
    document.execCommand("copy")
    document.body.removeChild(input)
  }
  if (comments.length == 0) {
    return (
      <div className="mt-24 font-bold opacity-75  text-2xl">
        User has no comments.
        <p className="text-base opacity-50 ">It's quiet... Too quiet...</p>
      </div>
    )
  } else
    return (
      <View className="text-left">
        {comments.map((comment, index) => {
          return (
            <Link
              className=""
              to={`/beam/${comment.gallery_id}?comment_id=${comment.comment_id}`}
            >
              <div
                key={`user-page-comments-history-key-${index}`}
                className="mb-3 comment pb-3 hover:border-gray-500 hover:border-opacity-25 border-2 border-transparent"
                style={{
                  overflow: 'hidden',
                  borderRadius: '8px',
                  boxShadow: '2px 2px 3px rgba(0,0,0,.3)'
                }}
              >
                <div className="comment-gallery-info pt-3 ml-3">
                  <div className="comment-gallery-info-userinfo text-xs">
                    <div>
                      <span
                        className=""
                        style={
                          {
                            // color: "rgb(74, 87, 81)",
                          }
                        }
                      >
                        {props.username}
                      </span>
                      {comment.reply ? (
                        <span className="mr-1"> replied to a comment in</span>
                      ) : (
                        <span className="mr-1"> posted a comment in</span>
                      )}
                      <Link
                        className="font-bold mr-1 hover:underline"
                        style={{}}
                        to={`/beam/${comment.gallery_id}`}
                      >
                        {comment.gallery_title}
                      </Link>
                      from u/{comment.gallery_username}
                      <span className="ml-1">
                        {moment(comment.gallery_date_created).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="comment-gallery-info-title text-xl font-bold"></div>
                </div>
                <hr className="mx-4 my-4 opacity-25" />
                {comment.reply && (
                  <div
                    className="comment-reply-prefix mx-6 p-2 text-sm"
                    style={{
                      background: "rgba(200,200,200,.3)",
                    }}
                  >
                    <div className="comment-prefix-user text-xs font-bold">
                      <Link
                        className="hover:underline"
                        to={`/user/${comment.reply.username}`}
                      >
                        <span className="opacity-50">u/</span>
                        <span
                          className=""
                          style={{ color: "rgb(74, 212, 147)" }}
                        >
                          {comment.reply.username}
                        </span>
                      </Link>
                      <span className="ml-1">
                        - {moment(comment.comment_date).fromNow()}
                      </span>
                    </div>
                    <div className="comment-prefix-message">
                      {comment.reply.message}
                    </div>
                  </div>
                )}
                <div className="comment-content mt-3 mx-6 text-sm">
                  <div className="comment-content-user font-bold">
                    {comment.username}
                  </div>
                  <div className="comment-content-message">
                    {comment.message}
                  </div>
                </div>
                <div className="user-page-comment-control">
                  <ul></ul>
                </div>
                <div className="user-page-comment-controls text-xs ml-6 mt-4 opacity-50 font-bold">
                  <span className="hover:underline mr-2">
                    <i class="fas fa-reply mr-1"></i> reply
                  </span>
                  <span
                    className="hover:underline"
                    onClick={(e) =>
                      copy(
                        e,
                        `https://www.imgbeam.com/beam/${comment.gallery_id}?comment_id=${comment.comment_id}`
                      )
                    }
                  >
                    share
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
        {endReached ? (
          <div></div>
        ) : (
          <div
            className="mt-3 flex flex-row justify-around"
            style={{
                borderRadius: '8px',
                height: '50px'
            }}
          >
            <button
              className="w-full  p-3 flex flex-row justify-around"
              onClick={(e) => getComments()}
              
            >
              {loading ? (
                <MoonLoader size={20}></MoonLoader>
              ) : (
                <span>more</span>
              )}
            </button>
          </div>
        )}
      </View>
    )
}

const View = styled.div`
  color: ${props => props.theme.text};
  .comment{
    background: ${props => props.theme.background_1}
  }
`
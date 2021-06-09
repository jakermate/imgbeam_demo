import React, { useState, useEffect } from "react"
import styled from "styled-components"
import moment from "moment"
import {connect} from 'react-redux'
import Comment from "./Comment"
import {Hr} from '../../Sidebar'
import MobileCommentReply from "./MobileCommentReply"
import colors from "../../../theme/colors"
function Comments(props) {
  const [comments, setComments] = useState({})
  const [count, setCount] = useState(0)
  const [replyActive, toggleReplyActive] = useState(false)
  const [activeComment, setActiveComment] = useState({})
  // get comments
  useEffect(() => {
    getComments()
  }, [])

  // mobile comment reply
  function setNewActiveComment(comment) {
    // let indexArray = comments.map(comment => comment.comment_id)
    // let index = indexArray.indexOf(comment_id)
    // let comment = comments[index]
    setActiveComment(comment)
  }
  function setReplyActive(bool) {
    toggleReplyActive(bool)
  }

  // get time for dates
  let newDate = new moment()
  async function getComments() {
    // console.log("getting comments")
    try {
      let url = `/api/beam/${props.gallery_id}/comments`
      let res = await fetch(url)
      let json = await res.json()
      if (json.success) {
        // console.log(json)
        setComments(json.comments)
        setCount(json.count)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // creating new comments
  const [newComment, setNewComment] = useState("")
  function changeNewComment(e) {
    if (newComment.length < 240) {
      setNewComment(e.target.value)
    }
  }
  // posting as the owner

  async function submitComment(e) {
    e.preventDefault()
    let url = `/api/beam/${props.gallery_id}/comment/add`
    try {
      let res = await fetch(url, {
        body: JSON.stringify({
          comment: newComment,
        }),
        mode: "cors",
        credentials: "include",
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      })
      let json = await res.json()
      // console.log(json)
      if (json.success) {
        resetCommentForm()
        getComments()
      }
    } catch (err) {
      console.log(err)
    }
  }
  function resetCommentForm() {
    setNewComment("")
  }
  // sorting
  const [sortMenu, toggleSortMenu] = useState(false)
  const [sortBy, setSortBy] = useState("new")
  const [sorted, setSorted] = useState([])
  useEffect(() => {
    // sort on comment change
    console.log("RUNNING SORT")
    if (comments.length == 0) return
    if (sortBy == "new") {
      sortNew(comments)
    }
    if (sortBy == "old") {
      sortOld(comments)
    }
    if (sortBy == "top") {
      sortTop(comments)
    }
  }, [comments, sortBy])
  const sorts = ["top", "new", "old"]
  function sortNew(comments) {
    let array = Object.values(comments)
    let sorted = array.sort(
      (a, b) => new Date(b.comment_date) - new Date(a.comment_date)
    )
    console.log(sorted)

    setSorted(sorted)
  }
  function sortOld(comments) {
    let array = Object.values(comments)
    let sorted = array.sort(
      (a, b) => new Date(a.comment_date) - new Date(b.comment_date)
    )
    console.log(sorted)

    setSorted(sorted)
  }
  function sortTop(comments) {
    let array = Object.values(comments)
    let sorted = array.sort((a, b) => b.score - a.score)
    console.log(sorted)

    setSorted(sorted)
  }

  return (
    <div className="mt-8 text-left mb-24" id="comments">
      <div id="add-comment-container">
        <Form
          onSubmit={(e) => submitComment(e)}
          className="flex flex-col mb-4 relative"
          style={{
            borderRadius: "8px",
          }}
        >
          {/* conditional to only allow commenting when logged in */}
          {props.signedIn ? (
            <div className="flex flex-col relative">
              <label
                htmlFor="comment-input"
                className="text-sm font-bold opacity-50"
              >
                Add Comment
              </label>
              <InputArea
                onChange={(e) => changeNewComment(e)}
                value={newComment}
                name="new-comment"
                id="comment-input"
                rows="4"
                className=""
              ></InputArea>
              <Hr></Hr>
              <span className="text-xs mt-2 font-bold opacity-25">
                {newComment.length} / 240
              </span>
              <br />
              <div
                id="comment-fairness"
                className="text-xs py-2 px-4 opacity-50 absolute bottom-0 left-0"
              >
                Keep it fun and fair!
              </div>
              <Submit
                active={newComment.replace(/\.[^/.]+$/, "").length > 0}
                disabled={newComment.replace(/\.[^/.]+$/, "").length == 0}
                type="submit"
                value="Post"
                className="font-bold"
              />
            </div>
          ) : (
            <div>
              <a className="font-bold hover:text-green-400" href="/login">
                Log in
              </a>{" "}
              or{" "}
              <a className="font-bold hover:text-green-400" href="/signup">
                sign up
              </a>{" "}
              to leave a comment.
            </div>
          )}
        </Form>
      </div>
      <div id="comment-list" className="">
        {
            count > 0 &&
          <div className="flex flex-row justify-between">
            <div className="my-4 font-bold">{count} comments</div>
            <div id="comments-sort-by" className="my-4 flex flex-row">
              {/* <h3>Sort By</h3> */}
              <div className="ml-3 relative">
                <button
                  className="outline-none focus:outline-none"
                  onClick={(e) => toggleSortMenu(!sortMenu)}
                >
                  <div className="inline-block font-bold mr-2">{sortBy}</div>
                  <i className="fas fa-sort-down"></i>
                </button>
                {sortMenu && (
                  <SortMenu
                    setSortBy={setSortBy}
                    sortBy={sortBy}
                    sorts={sorts}
                    toggleMenu={toggleSortMenu}
                  ></SortMenu>
                )}
              </div>
            </div>
          </div>
        }

        <Hr></Hr>

        {sorted.map((comment, index) => {
          if (comment.reply_id == null) {
            return (
              <Comment
                setActiveComment={setNewActiveComment}
                setReplyActive={setReplyActive}
                key={`root-comment-${index}`}
                owner={props.owner}
                refresh={getComments}
                commentObj={comment}
                signedIn={props.signedIn}
                toggleSignUpOverlay={props.toggleSignUpOverlay}
              ></Comment>
            )
          }
        })}
        {/* if no comments, display this */}
        {sorted.length === 0 && (
          <div className="text-center text-2xl py-6 opacity-75 font-bold">
            Be the first to comment!
          </div>
        )}
      </div>
      <MobileCommentReply
        setReplyActive={setReplyActive}
        active={replyActive}
        comment={activeComment}
      ></MobileCommentReply>
    </div>
  )
}

function SortMenu(props) {
  return (
    <div className="absolute text-left right-0">
      <div
        className="overlay fixed top-0 bottom-0 left-0 right-0 opacity-0 z-0"
        onClick={(e) => props.toggleMenu(false)}
      ></div>
      <ul
        className="relative z-20"
        style={{
          minWidth: "140px",
          top: "100%",
        }}
      >
        {props.sorts.map((sortString) => {
          return (
            <li
              className="px-4 py-3 w-full hover:bg-gray-400 text-left"
              style={{
                color: `${props.sortBy === sortString ? "green" : "black"}`,
              }}
            >
              <button
                onClick={(e) => {
                  props.setSortBy(sortString)
                  props.toggleMenu(false)
                }}
                className="w-full font-extrabold text-sm text-left"
              >
                {sortString}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
function mapStateToProps(state){

}
export default connect(mapStateToProps)(Comments)

const Form = styled.form`
  /* background: #373737; */
  background: ${props => props.theme.background_3};
  padding: 1.4rem 1rem;
  border: 1px solid rgba(100, 100, 100, 0.3);
`
const InputArea = styled.textarea`
  padding-top: 1rem;
  resize: none;
  background: transparent;
  outline: none;
  border: none;
  width: 100%;
`
const Submit = styled.input`
  background: ${(props) =>
    props.active ? colors.success : colors.backgroundLight};
  padding: 8px 16px;
  color: white;
  align-self: flex-end;
  border-radius: 8px;
`

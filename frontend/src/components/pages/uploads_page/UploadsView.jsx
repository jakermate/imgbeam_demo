import React, { useEffect, useState } from "react"
import Supergrid from "../../SuperGrid"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { connect } from "react-redux"
import SigninPlaceholder from "../../SignInPlaceholder"
function UploadsView(props) {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    getUploads()
  }, [])
  async function getUploads() {
    try {
      let url = `/api/account/posts`
      let res = await fetch(url, {
        credentials: "include",
      })
      if (res.status == 200) {
        setPosts(await res.json())
      }
    } catch (err) {
      console.log(err)
    }
  }
  if (!props.signedIn) {
    return (
      <div className="mx-4">
        <SigninPlaceholder
          icon={"fas fa-photo-video"}
          subheader={"Sign in to view your contributions."}
          header={"Uploads"}
        ></SigninPlaceholder>
      </div>
    )
  } else
    return (
      <div className="mx-4">
        <div>
          <NewPost></NewPost>
        </div>
        <Supergrid insert={NewPost} galleries={posts}></Supergrid>
      </div>
    )
}
function NewPost() {
  const history = useHistory()
  return (
    <div>
      <NewButton onClick={(e) => history.push("/new")}>
        <div className="mr-3">
          <i className="fas fa-plus"></i>
        </div>
        <div>New Post</div>
      </NewButton>
    </div>
  )
}
const NewButton = styled.button`
  background: ${(props) => props.theme.background_1};
  border: ${(props) => `1px solid ${props.theme.border}`};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  margin-top: 32px;
  :hover{
    color: ${props => props.theme.textFaded};
    background: ${props => props.theme.background_3};
  }
`
function mapStateToProps(state) {
  return {
    signedIn: state.app_state_reducer.signedIn,
    account: state.account_reducer.account,
  }
}

export default connect(mapStateToProps)(UploadsView)

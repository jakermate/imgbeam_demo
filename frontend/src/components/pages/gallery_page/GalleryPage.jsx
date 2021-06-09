import React, { useEffect, useState } from "react"
import ImageContainer from "./ImageContainer"
import { Redirect, useHistory, Link } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import ImageFocus from "./ImageFocus"
import { Hr } from "../../Sidebar"
import Badge from "../../Badge"
import VideoContainer from "./VideoContainer"
import Tags from "./Tags"
import colors from "../../../theme/colors"
import Comments from "./Comments"
import moment from "moment"
import MoonLoader from "react-spinners/MoonLoader"
import ShareComponent from "./ShareComponent"
import UnfollowAlert from "../../UnfollowAlert"
import { Helmet } from "react-helmet"
import ReportView from "./ReportOverlay"
import { ToastContainer, toast } from "react-toastify"
import cookie from "js-cookie"
import parseViews from "../../parseViews"
import { connect } from "react-redux"
import { toggleSignUpOverlay } from "../../../state/store/actions/index"
import "react-toastify/dist/ReactToastify.css"
function GalleryPage(props) {
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)
  const [recieved, setRecieved] = useState(false)
  const [user, setUser] = useState(null)
  const [report, toggleReport] = useState(false)
  const [favorites, setFavorites] = useState(0)
  const [share, toggleShare] = useState(false)
  useEffect(() => {
    fetchData()
    checkIfFavorited()
    getVote()
    getFavorites()
  }, [])
  function setCookie() {
    // set view limiter
    cookie.set(props.match.params.gallery_id, "", {
      expires: 0.5,
    })

    // set recent list
    let recent = cookie.get("recent")
    let recentStringArray = []
    if (recent) {
      recentStringArray = [...JSON.parse(recent)]
      console.log(recentStringArray)
    }
    if (!recentStringArray.includes(props.match.params.gallery_id)) {
      recentStringArray.push(props.match.params.gallery_id)
    }
    if (recentStringArray.length > 100) {
      let difference = recentStringArray.length - 100
      for (let i = 0; i < difference; i++) {
        recentStringArray.shift()
      }
      recentStringArray.slice()
    }
    cookie.set("recent", JSON.stringify(recentStringArray))
  }

  async function fetchData() {
    console.log("requesting gallery")
    try {
      let res = await fetch(`/api/beam/${props.match.params.gallery_id}`, {
        credentials: "include",
      })
      if (res.status == 200) {
        let json = await res.json()
        console.log(json)
        setError(false)
        receiveData(json)
        setRecieved(true)
        getUser(json.username)
        setCookie()
      } else {
        console.log(res.status)
        setError(true)
      }
    } catch (err) {
      console.log(err)
      setError(true)
    }
  }
  async function getFavorites() {
    let url = `/api/beam/${props.match.params.gallery_id}/favoritescount`
    try {
      let res = await fetch(url)
      if (res.status == 200) {
        let json = await res.json()
        console.log(json)
        setFavorites(json)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // for setting arrangemenet and other client-side view settings
  function receiveData(json_data) {
    // check ownership
    setData(json_data)
  }
  // get user data (inc avatar)
  useEffect(() => {
    if (data?.username) {
      getUser(data.username)
    }
  }, [data])
  async function getUser(username) {
    let url = `/api/user/${username}`
    try {
      let res = await fetch(url)
      let json = await res.json()
      setUser(json)
      // console.log(json)
    } catch (err) {
      console.log(err)
    }
  }

  // votes
  const [voted, setVoted] = useState(false)
  const [voteType, setVoteType] = useState(false)
  async function getVote() {
    let url = `/api/beam/${props.match.params.gallery_id}/vote`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "get",
      })
      if (res.status == 500) {
        return
      }
      let json = await res.json()
      if (json.voted) {
        console.log(json)
        setVoted(true)
        setVoteType(json.type)
        fetchData()
      } else {
        setVoted(false)
        fetchData()
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function upvote() {
    if (voteType && voted) {
      deleteVote()
      return
    }
    let url = `/api/beam/${props.match.params.gallery_id}/upvote`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "post",
      })
      console.log(res.status)
      if (res.status == 401) {
        props.toggleSignUpOverlay(true)
      }
      getVote()
    } catch (err) {
      console.log(err)
    }
  }
  async function downvote() {
    if (!voteType && voted) {
      deleteVote()
      return
    }
    let url = `/api/beam/${props.match.params.gallery_id}/downvote`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "post",
      })
      console.log(res.status)
      if (res.status == 401) {
        props.toggleSignUpOverlay(true)
      }
      getVote()
    } catch (err) {
      console.log(err)
    }
  }
  async function deleteVote() {
    let url = `/api/beam/${props.match.params.gallery_id}/vote`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "delete",
      })
      console.log(res.status)
      if (res.status == 401) {
        props.toggleSignUpOverlay(true)
      }
      getVote()
    } catch (err) {
      console.log(err)
    }
  }

  const [focused, setFocused] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  // focus image on click
  function focusImage(image) {
    if (window.innerWidth > 600) {
      setFocused(image)
      setShowOverlay(true)
    }
  }
  function closeFocus() {
    console.log("closing focus")
    setShowOverlay(false)
  }

  // gallery menu
  const [menu, setMenu] = useState(false)

  // follows
  const [following, setFollowing] = useState(false)
  const [unfollowAlert, toggleUnfollowAlert] = useState(false)
  function unfollow(e) {
    toggleUnfollowAlert(true)
  }
  async function follow() {
    toggleUnfollowAlert(false)
    let url = `/api/user/${data.username}/follow`
    try {
      let res = await fetch(url, {
        method: "post",
        credentials: "include",
      })
      if (res.status == 401) {
        console.log("Unauthorized")
        props.toggleSignUpOverlay()
        return
      }
      if (res.status == 200) {
        let json = await res.json()
        console.log(json)
        setFollowing(json)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // get follow status
  async function getFollowing() {
    console.log("fetching follow status")
    try {
      let url = `/api/user/${data.username}/following`
      let res = await fetch(url, {
        credentials: "include",
      })
      if (res.status == 200) {
        let json = await res.json()
        setFollowing(json)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if (data) {
      getFollowing()
    }
  }, [data])
  const [signInAlert, setSignInAlert] = useState(false)

  // anchors
  function navigateToComments() {
    console.log("sdsds")
    document.getElementById("comments-wrapper").scrollIntoView()
  }

  // favorite
  const [favorited, setFavorited] = useState(false)

  async function favorite() {
    console.log("favoriting")
    let url = `/api/beam/${props.match.params.gallery_id}/favorite`
    try {
      let res = await fetch(url, {
        method: "POST",
      })
      if (res.status == 200) {
        toast(
          `${favorited ? "Removed from favorites" : "Added to favorites!"}`,
          {
            position: "bottom-right",
            hideProgressBar: true,
            autoClose: 1000,
          }
        )
      }
      if (res.status == 401) {
        props.toggleSignUpOverlay()
      }
      checkIfFavorited()
      getFavorites()
    } catch (err) {
      console.log(err)
    }
  }
  async function checkIfFavorited() {
    let url = `/api/beam/${props.match.params.gallery_id}/favorite`
    try {
      let res = await fetch(url)
      if (res.status == 200) {
        setFavorited(true)
        return
      }
      if (res.status == 401) {
        setFavorited(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // RENDER
  if (error) {
    return <div className="text-white font-bold mt-24">error</div>
  } else if (!data) {
    return (
      <div
        className="w-full pt-24 flex flex-col justify-center items-center mx-auto"
        style={{
          zIndex: 99,
        }}
      >
        <MoonLoader size={20} color="white"></MoonLoader>
      </div>
    )
  } else
    return (
      <Root
        className="relative  pt-12"
        id="gallery-page"
        style={{
          zIndex: 99,
        }}
      >
        {/* META TAGS FOR GALLERY SPECIFIC INFORMATION */}
        <Helmet>
          <meta charset="utf-8" />
          <title>{`${data.title} - ImgBeam, Capital of Memeland`}</title>
          <meta name="description" content={`${data.description}`} />
          <meta name="image" content={data.images[0].path} />
          {/* <!-- Schema.org for Google --> */}
          <meta
            itemprop="name"
            content={`${data.title} - ImgBeam, Capital of Memeland`}
          />
          <meta itemprop="description" content={`${data.description}`} />
          <meta itemprop="image" content={data.images[0].path} />
          {/* <!-- Twitter --> */}
          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:title"
            content={`${data.title} - ImgBeam, Capital of Memeland`}
          />
          <meta name="twitter:description" content={`${data.description}`} />
          <meta name="twitter:image:src" content={data.images[0].path} />
          {/* <!-- Open Graph general (Facebook, Pinterest & Google+) --> */}
          <meta
            name="og:title"
            content={`${data.title} - ImgBeam, Capital of Memeland`}
          />
          <meta name="og:description" content={`${data.description}`} />
          <meta name="og:image" content={data.images[0].path} />
          <meta name="og:type" content="website" />
        </Helmet>
        <ToastContainer></ToastContainer>
        {/* unfollow alert */}
        {unfollowAlert && (
          <UnfollowAlert
            username={data.username}
            cancel={toggleUnfollowAlert}
            unfollow={follow}
          ></UnfollowAlert>
        )}
        {/* right sticky controls */}
        <div
          className="absolute h-full z-50  top-0"
          style={{
            paddingTop: "64px",
            right: "32px",
          }}
        >
          <GalleryControls
            toggleShare={toggleShare}
            data={data}
          ></GalleryControls>
        </div>
        <GalleryPageElement
          id="app-gallery"
          className="container mx-auto text-left  justify-center  flex flex-col relative"
        >
          {/* focused image overlay */}
          {showOverlay && (
            <ImageFocus
              image={focused}
              gallery_id={props.match.params.gallery_id}
              closeFocus={closeFocus}
            ></ImageFocus>
          )}

          <div
            id="content-wrap"
            className="relative flex flex-1 mx-auto container flex-col "
            style={{
              maxWidth: "780px",
            }}
          >
            <div
              id="info-wrap"
              className="mx-auto"
              style={{
                width: "100%",
              }}
            >
              <div className="title-wrap mb-4">
                <div className=" title" style={{}}>
                  {data.title}
                </div>
              </div>
              <div
                className="flex flex-row"
                style={{
                  height: "48px",
                }}
              >
                <div className="left flex flex-row flex-1 items-center">
                  <div
                    className="avatar-wrap h-full mr-2"
                    style={{
                      borderRadius: "100%",
                      overflow: "hidden",
                      width: "38px",
                      height: "38px",
                      boxShadow: '2px 2px 4px -2px rgba(0,0,0,.6)'
                    }}
                  >
                    <Link to={`/user/${data.username}`}>
                      <img
                        src={data.avatar_lq}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                    </Link>
                  </div>
                  <div>
                    <div className="flex flex-row items-center text-sm">
                      <Link to={`/user/${data.username}`}>
                        <div className="mr-2 username">{data.username}</div>
                      </Link>
                    </div>
                    <div className="views-and-time">{data.views} views</div>
                  </div>
                  <div className="ml-4">
                    <FollowButton
                      id="follow-button"
                      followed={following}
                      onClick={(e) => follow()}
                    >
                      {following ? "Following" : "Follow"}
                    </FollowButton>
                  </div>
                </div>
                <div className="right flex flex-row items-center">
                  <div className="mr-4">
                    <Interaction
                      active={favorited}
                      onClick={(e) => favorite()}
                      className="flex flex-row items-center"
                    >
                      <i
                        className={`${
                          favorited ? "fas" : "far"
                        } fa-heart block`}
                      ></i>
                      {}
                      <div className="fav-text ml-2">
                        {favorited ? favorites : "Favorite"}
                      </div>
                    </Interaction>
                  </div>
                  <div
                    className="flex flex-row justify-end"
                    style={
                      {
                        // minWidth: '100px'
                      }
                    }
                  >
                    {(!voted || (voted && voteType)) && (
                      <Interaction
                        active={voted && voteType}
                        onClick={(e) => upvote()}
                        className="flex flex-row items-center mr-2"
                      >
                        <i
                          className={`${
                            voted && voteType ? "fas" : "far"
                          } fa-thumbs-up block`}
                        ></i>
                        {voted && voteType && (
                          <div className="text ml-2">
                            {data.upvotes - data.downvotes + 1}
                          </div>
                        )}
                      </Interaction>
                    )}

                    {(!voted || (voted && !voteType)) && (
                      <InteractionNegative
                        active={voted && !voteType}
                        onClick={(e) => downvote()}
                        className="flex flex-row items-center"
                      >
                        <i
                          className={`${
                            voted && !voteType ? "fas" : "far"
                          } fa-thumbs-down block`}
                        ></i>
                        {voted && !voteType && (
                          <div className="text ml-2">
                            {data.upvotes - data.downvotes + 1}
                          </div>
                        )}
                      </InteractionNegative>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col  relative w-full mt-4" style={{}}>
              {/* cover media */}
              {recieved && data.images[0].media_type === "video" && (
                <VideoContainer
                  string={data.images[0].path}
                  key={`gallery-image-0`}
                  image={data.images[0]}
                  description={data.images[0].description}
                  focusImage={focusImage}
                ></VideoContainer>
              )}
              {recieved && data.images[0].media_type === "image" && (
                <ImageContainer
                  string={data.images[0].path}
                  image={data.images[0]}
                  gallery={data.images[0].gallery_id}
                  focusImage={focusImage}
                  description={data.images[0].description}
                  key={`gallery-image-0`}
                />
              )}
              {/* Description goes between cover media and the rest of the gallery */}
              <div className="description">
                {data.description && (
                  <div className="text-lg font-semibold">
                    {data.description}
                  </div>
                )}
                <div className="flex flex-row mt-6">
                  <div className="count">{data.images.length} items</div>
                  <div className="date">
                    - Posted {moment(data.date_created).fromNow()}
                  </div>
                </div>
              </div>
              <div id="tags-wrapper">
                <Tags gallery_id={props.match.params.gallery_id}></Tags>
              </div>
              {/* Render rest of media */}
              {recieved &&
                data.images.map((imgObj, index) => {
                  if (index == 0) return null
                  if (imgObj.media_type === "video") {
                    return (
                      <VideoContainer
                        string={imgObj.path}
                        key={`gallery-image-${index}`}
                        image={imgObj}
                        description={imgObj.description}
                        focusImage={focusImage}
                      ></VideoContainer>
                    )
                  } else
                    return (
                      <ImageContainer
                        string={imgObj.path}
                        image={imgObj}
                        gallery={imgObj.gallery_id}
                        focusImage={focusImage}
                        description={imgObj.description}
                        key={`gallery-image-${index}`}
                      />
                    )
                })}
            </div>

            {share && (
              <ShareComponent
                gallery={data}
                toggleShare={toggleShare}
              ></ShareComponent>
            )}
            <div id="comments-wrapper">
              {data.comments_enabled && (
                <Comments
                  owner={data.username}
                  toggleSignUpOverlay={props.toggleSignUpOverlay}
                  signedIn={props.signedIn}
                  gallery_id={props.match.params.gallery_id}
                ></Comments>
              )}
            </div>
            <div id="more-like-this"></div>
          </div>
        </GalleryPageElement>
        {report && <ReportView gallery={data}></ReportView>}
      </Root>
    )
}
const Root = styled.div`
  margin-top: ${(props) => props.theme.navbar_height};
  background-color: ${(props) => props.theme.background_2};
`
const AvatarRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 60px;
  /* background: ${colors.backgroundMediumDark}; */
`

function GalleryControls(props) {
  const history = useHistory()
  return (
    <div
      className="sticky flex flex-col"
      style={{
        top: "64px",
        padding: "24px 10px",
      }}
    >
      <ControlButton
        action={()=>document.getElementById('comments').scrollIntoView()}
        string={"leave a comment"}
        icon={"fas fa-comment-alt"}
      >
        <Badge value={props.data.comment_count}></Badge>
      </ControlButton>
      <ControlButton
        action={props.toggleShare}
        string={"share gallery"}
        icon={"fas fa-share"}
      ></ControlButton>
      <ControlButton
        action={""}
        string={"copy link"}
        icon={"fas fa-link"}
      ></ControlButton>
      <ControlButton
        action={""}
        string={"download"}
        icon={"fas fa-download"}
      ></ControlButton>
      <ControlButton
        action={""}
        string={"report"}
        icon={"fas fa-flag"}
      ></ControlButton>

      <Hr></Hr>
      <div className="mb-4"></div>
      {props.data.owner && (
        <ControlButton
          action={(e) => history.push(`/edit/beam/${props.data.gallery_id}`)}
          string={"edit"}
          icon={"fas fa-edit"}
        ></ControlButton>
      )}
    </div>
  )
}

function ControlButton(props) {
  return (
    <ControlButtonElement
      active={props.active}
      hoverColor={props.hoverColor}
      aria-label={props.string}
      name={props.string}
      title={props.string}
      onClick={props.action}
    >
      <div>
        <i
          className={`${props.icon} icon`}
          style={{
            fontSize: "16px",
          }}
        ></i>
      </div>
      {props.children}
    </ControlButtonElement>
  )
}
function SignInPopover() {
  return <div>s</div>
}
const ControlButtonElement = styled.button`
  display: flex;
  border-radius: 8px;
  position: relative;
  margin-bottom: 16px;
  border: ${(props) => `1px solid ${props.theme.border}`};
  height: 42px;
  width: 42px;
  .icon {
    color: ${(props) => props.theme.icons};
  }
  background: ${(props) => props.theme.background_3};
  color: ${(props) =>
    props.active ? props.theme.secondary : props.theme.text};
  /* border: 1px solid #0a0606; */
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const GalleryPageElement = styled.div`
  /* background: linear-gradient(to top right, #212121, #333) */
  padding: 0 64px;
  .date {
    color: ${(props) => props.theme.text};
    opacity: 0.5;
    font-weight: bold;
    font-size: 14px;
  }
  .count {
    margin-right: 16px;
    font-size: 14px;
    color: ${(props) => props.theme.text};
    opacity: 0.5;
    font-weight: bold;
  }
  .title {
    font-size: 28px;
    font-weight: 600;
    color: ${(props) => props.theme.text};
  }
  .views-and-time {
    font-size: 12px;
    color: ${(props) => props.theme.textFaded};
  }
  .username{
    font-weight:900;
    letter-spacing: -1px;
    color: ${props => props.theme.tertiary};
  }
`

const FollowButton = styled.div`
  color: ${(props) => (!props.followed ? "white" : props.theme.textFaded)};
  cursor: pointer;
  background: ${(props) =>
    !props.followed
      ? `linear-gradient(to top right, ${props.theme.tertiary}, ${props.theme.success})`
      : "transparent"};
  border-radius: 8px;
  font-size: 12px;
  position: relative;
  font-weight: bold;
  padding: 6px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${(props) => `1px solid ${props.theme.border}`};
  flex-grow: 1;
`

const OptionButton = styled.button`
  border-radius: 3px;
  height: 32px;
  padding: 8px 12px;
  color: ${(props) => props.theme.secondary};
  i {
    /* opacity: 0.5; */
  }
  :hover {
    opacity: 0.5;
  }
`
const GalleryMenuButton = styled(OptionButton)`
  color: ${(props) => props.theme.icons};
`
const Interaction = styled.button`
  transition: all 0.2s linear;
  color: ${(props) =>
    props.active ? props.theme.secondary : props.theme.text};
  background: ${(props) => props.theme.background_3};
  border-radius: 8px;
  padding: 8px 12px;
  height: 42px;
  .text {
    font-size: 14px;
    font-weight: 900;
  }
  :hover {
    background: ${(props) => props.theme.background_4};
  }
  i {
    font-size: 12px;
  }
  .fav-text {
    font-size: 12px;
    font-weight: bold;
  }
`
const InteractionNegative = styled(Interaction)`
  color: ${(props) => (props.active ? props.theme.error : props.theme.text)};
`
function mapStateToProps(state) {
  return {
    signUpOverlay: state.app_state_reducer.signUpOverlay,
  }
}
const mapDispatchToProps = {
  toggleSignUpOverlay,
}
export default connect(mapStateToProps, mapDispatchToProps)(GalleryPage)

import React, { useState, useEffect } from "react"
import avatarDefault from "./avatar.png"
import styled from "styled-components"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import defaultbg from "./user_bg.jpg"
import bear from "../gallery_page/404Gorilla_alt.svg"
import comma from "comma-number"
import theme from "../../../theme/colors"
import PostsComponent from "./PostsComponent"
import CommentsComponent from "./CommentsComponent"
import FollowingList from "./FollowingList"
import MoonLoader from "react-spinners/MoonLoader"
import AboutView from "./AboutView"
import BackdropSelect from "./BackdropSelect"
import AvatarSelect from './AvatarSelect'
import { Helmet } from "react-helmet"
export default function UserPage(props) {
  const [backdropMenu, toggleBackdropMenu] = useState(false)
  const [avatarMenu, toggleAvatarMenu] = useState(false)

  const [error, setError] = useState(false)
  const [data, setData] = useState({
    title: "",
    galleries: [],
    total_points: 0,
  })
  const [received, setReceived] = useState(false)
  const userAPI = "/api/user"
  useEffect(() => {
    fetchData()
    getFollowing()
  }, [])

  async function getFollowing() {
    try {
      let url = `/api/user/${props.match.params.username}/following`
      let res = await fetch(url, {
        credentials: "include",
      })
      if (res.status == 200) {
        setFollowing(await res.json())
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function fetchData() {
    console.log(`${userAPI}${props.match.params.username}`)
    try {
      let res = await fetch(`${userAPI}/${props.match.params.username}`, {
        credentials: "include",
        mode: "cors",
      })
      console.log(res)
      let json = await res.json()
      console.log(json)
      setError(false)
      setData(json)
      setReceived(true)
    } catch (err) {
      console.log(err)
      setError(true)
      setReceived(true)
    }
  }
  // following
  // follows
  const [following, setFollowing] = useState(false)
  async function follow() {
    let url = `/api/user/${props.match.params.username}/follow`
    try {
      let res = await fetch(url, {
        method: "post",
        credentials: "include",
      })
      if (res.status == 401) {
        console.log("Unauthorized")
        alert("Please log in or register to do that.")
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

  if (!received) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center">
        <MoonLoader color={"white"}></MoonLoader>
      </div>
    )
  }
  if (received && error) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center">
        <div className="404-cont rounded-full bg-green-400 px-24 py-24">
          <img className="ml-8" src={bear} alt="" width="300" />
          <h2 className="font-bold text-5xl  mt-6">404</h2>
          <div className="text-xl">
            Something seems to have gone wrong...
          </div>
        </div>
      </div>
    )
  } else
    return (
      <UserPageElement
        style={{
          minHeight: "calc(100vh)",
        }}
      >
      <Helmet>
      <meta charset="utf-8" />
          <title>{`${data.username} - Imgbeam, Capital of Memeland`}</title>
          <meta name="description" content={`${data.description}`} />
          <meta name="image" content={data.avatar} />
          {/* <!-- Schema.org for Google --> */}
          <meta
            itemprop="name"
            content={`${data.username} - Imgbeam, Capital of Memeland`}
          />
          <meta itemprop="description" content={`${data.description}`} />
          <meta itemprop="image" content={data.avatar} />
          {/* <!-- Twitter --> */}
          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:title"
            content={`${data.username} - Imgbeam, Capital of Memeland`}
          />
          <meta name="twitter:description" content={`${data.description}`} />
          <meta name="twitter:image:src" content={data.avatar} />
          {/* <!-- Open Graph general (Facebook, Pinterest & Google+) --> */}
          <meta
            name="og:title"
            content={`${data.username} - Imgbeam, Capital of Memeland`}
          />
          <meta name="og:description" content={`${data.description}`} />
          <meta name="og:image" content={data.avatar} />
          <meta name="og:type" content="website" />
      </Helmet>
        <div id="user-header-wrap" style={{

        }}>
          {data.owner ? (
            <Banner
              onClick={(e) => toggleBackdropMenu(true)}
              className="backdrop-image relative block  z-10"
              style={{
                height: "calc(100vw / 5)",
                width: "100%",
                backgroundImage: `url(${data.backdrop || defaultbg})`,
                backgroundPosition: `center`,
                backgroundSize: "cover",
              }}
            >
              <div
                className="absolute overlay top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center"
                style={{
                  background:
                    "linear-gradient(to top, rgba(170,170,170,.3), rgba(170,170,170,0)",
                }}
              >
              <BorderContainer className="flex flex-col items-center justify-center">
                <div className="font-extrabold text-white">Change Banner</div>

              </BorderContainer>
              </div>
            </Banner>
          ) : (
            <div
              className="backdrop-image block  z-10"
              style={{
                height: "calc(100vw / 5)",
                width: "100%",
                background: `url(${data.backdrop || defaultbg})`,
                backgroundSize: "cover",
                backgroundPosition: `center`,
              }}
            ></div>
          )}

          <div
            id="user-page-avatar-info"
            className="container mx-auto py-3"
            style={{}}
          >
            <div className="flex flex-row pt-4 px-32">
              <div className="flex flex-row justify-between items-center">
                {/* header content */}
                <div className="avatar-left mr-4" style={{}}>
                  {/* avatar button conditional */}
                  {data.owner ? (
                    <Avatar
                      onClick={e => toggleAvatarMenu(true)}
                      className=" flex-row hidden overflow-hidden relative z-10 sm:flex items-start pt-2 justify-between "
                      style={{
                        backgroundImage: `url(${data.avatar || avatarDefault})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        height: "100px",
                        width: "100px",
                        borderRadius: "100%",
                      }}
                    >
                      <div
                        className="overlay absolute top-0 bottom-0 left-0 right-0 z-20 "
                        style={{
                          // background: "rgba(170,170,170,.3)",
                          background: 'linear-gradient(to top, rgba(255,255,255,.4), rgba(255,255,255,0)'

                        }}
                      >
                        <div
                          className="absolute right-0 left-0 bottom-0 font-bold text-xs "
                          style={{
                            height: "30px",
                          }}
                        >
                          Choose
                        </div>
                      </div>
                    </Avatar>
                  ) : (
                    <div
                      className=" flex-row hidden overflow-hidden relative z-10 sm:flex items-start pt-2 justify-between "
                      style={{
                        background: `url(${data.avatar || avatarDefault})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        height: "100px",
                        width: "100px",
                        borderRadius: "100%",
                      }}
                    ></div>
                  )}
                </div>
              </div>
              <div className="flex flex-grow flex-row justify-between items-center">
                <div className="username-right text-left">
                  <div>
                    <h2 className="text-3xl font-bold">{data.username}</h2>
                  </div>
                  <div
                    className="name-sub flex flex-col "
                    style={{
                      color: `${theme.textFaded}`,
                      fontSize: "14px",
                    }}
                  >
                    <div className="mr-2">{data.followers.length || 0} {(data.followers && data.followers.length) > 1 ? 'followers' : 'follower'}</div>
                  </div>
                </div>
                {
                  // only show interactions if not you
                }
                <div
                  className=""
                  style={{}}
                >
                  {!data.owner && (
                    <div className="px-6 interactions-right  flex flex-row items-center">
                      <div className="message-wrap mr-3">
                        <Link
                          to={`/messages/${data.username}`}
                          className=" flex items-center justify-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: `${theme.backgroundLightest}`,
                            borderRadius: "100%",
                          }}
                        >
                          <i className="fas fa-envelope block"></i>
                        </Link>
                      </div>
                      <div>
                        {!following ? (
                          <button
                            className="px-8 py-2 font-bold"
                            onClick={(e) => follow(e)}
                            style={{
                              background: `${theme.success}`,
                              height: "40px",
                              borderRadius: "26px",
                            }}
                          >
                            Follow
                          </button>
                        ) : (
                          <button
                            className="px-8  py-2 font-bold"
                            onClick={(e) => follow(e)}
                            style={{
                              height: "40px",
                              borderRadius: "26px",
                              background: `${theme.backgroundLightest}`,
                            }}
                          >
                            Unfollow
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Nav
          id="user-page-nav"
          className="z-50 relative nav md:sticky py-2"
          style={{
            // boxShadow: "0 2px 4px rgba(0,0,0,.4)",
          }}
        >
          <div
            className="container mx-auto "
            id="user-page-nav"
            style={{}}
          >
            <ul className="flex flex-row  mx-auto justify-center">
              <Link to={`/user/${props.match.params.username}`}>
                <NavButton
                  className="px-4 py-2 font-extrabold"
                  active={
                    window.location.pathname ==
                    `/user/${props.match.params.username}`
                  }
                >
                  Galleries
                </NavButton>
              </Link>
              <Link to={`/user/${props.match.params.username}/comments`}>
                <NavButton
                  className="px-4 py-2 font-extrabold"
                  active={window.location.href.includes("comments")}
                >
                  Comments
                </NavButton>
              </Link>
              <Link to={`/user/${props.match.params.username}/following`}>
                <NavButton
                  className="px-4 py-2 font-extrabold"
                  active={window.location.href.includes("following")}
                >
                  Following
                </NavButton>
              </Link>
              <Link to={`/user/${props.match.params.username}/about`}>
                <NavButton
                  className="px-4 py-2 font-extrabold"
                  active={window.location.href.includes("about")}
                >
                  About
                </NavButton>
              </Link>
            </ul>
          </div>
        </Nav>
        <div
          id="user-page-content-wrapper"
          className="flex flex-col relative z-20 container mx-auto py-6 "
        >
          <div
            id="user-activity-column"
            className="relative container"
            style={{
              minHeight: 'calc(80vh - 200px)'
            }}
          >
            <Route
              path={`/user/${props.match.params.username}`}
              exact
              render={() => (
                <PostsComponent
                  username={props.match.params.username}
                ></PostsComponent>
              )}
            ></Route>
            <Route
              path={`/user/${props.match.params.username}/comments`}
              render={() => (
                <CommentsComponent
                  username={props.match.params.username}
                ></CommentsComponent>
              )}
            ></Route>
            <Route
              path={`/user/${props.match.params.username}/following`}
              render={() => (
                <FollowingList
                  username={props.match.params.username}
                ></FollowingList>
              )}
            ></Route>
            <Route
              path={`/user/${props.match.params.username}/about`}
              render={() => (
                <AboutView
                  user={data}
                  username={props.match.params.username}
                ></AboutView>
              )}
            ></Route>
          </div>
        </div>
        {backdropMenu && (
          <BackdropSelect
            pulldata={fetchData}
            backdrop={data.backdrop}
            avatar={data.avatar}
            toggleMenu={toggleBackdropMenu}
          ></BackdropSelect>
        )}
        {
          avatarMenu &&
          <AvatarSelect
             pulldata={fetchData}
            backdrop={data.backdrop}
            avatar={data.avatar}
            toggleMenu={toggleAvatarMenu}
          ></AvatarSelect>
        }
      </UserPageElement>
    )
}

const Nav = styled.div`
  top: ${props => props.theme.navbar_height};
`
const UserPageElement = styled.div`
  .nav{
    background: ${props => props.theme.background_2}
  }
`
const Li = styled.li`
  display: inline-block;
  margin: 0 12px;
  border-radius: 8px;
  padding: 10px 16px;
  background: ${(props) => (props.active ? "#555" : "#232323")};
  transform: ${(props) => (props.active ? "scale(1.1)" : "scale(1)")};
  font-size: ${(props) => (props.active ? "24px" : "22px")};
  overflow: visible;
  transition: all 0.3s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  cursor: pointer;
  :hover {
    background: #555;
    opacity: 0.2;
  }
`
const NavButton = styled.li`
  color: ${(props) => (props.active ? props.theme.success : theme.textFaded)};
border-radius: 8px;
  background-color: ${(props) =>
    props.active ? props.theme.background_3 : "none"};
  :hover {
    opacity: .7;
  }
`
const BorderContainer = styled.div`
  border: ${props => `2px dashed ${props.theme.border}`};
  padding: 32px;
  position: absolute;
  border-radius: 12px;
  top: 10px;
  right: 10px;
  bottom: 10px;
  left: 10px;
`

const Avatar = styled.button`
  .overlay {
    transition: all .2s ease-in-out;
    opacity: 0;
  }
  :hover {
    .overlay {
      opacity: 1;
    }
  }
`
const Banner = styled.button`
  .overlay {
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }
  :hover {
    .overlay {
      opacity: 1;
    }
  }
`

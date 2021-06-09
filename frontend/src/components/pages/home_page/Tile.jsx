import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import moment from "moment"
import colors from "../../../theme/colors"
export default function Tile(props) {
  const [playing, setPlaying] = useState(false)
  useEffect(()=>{
    if(props.gallery.images[0].media_type == 'video'){
        if(playing){
          document.getElementById(`video-${props.gallery.gallery_id}`).play()
          return
      }
      document.getElementById(`video-${props.gallery.gallery_id}`).pause()
      document.getElementById(`video-${props.gallery.gallery_id}`).currentTime = 0


    }
  },[playing])
  useEffect(() => {
    if (props.gallery.images[0] == null) {
      return
    }
  }, [])
  if(props.gallery.images.length == 0){
    return <div id={`tile-${props.gallery.gallery_id}`} ></div>
  }
  else return (
    <TileWrapper
      id={`tile-${props.gallery.gallery_id}`}
      singleton={props.gallery.singleton}
      className="mb-8 relative  flex flex-col  overflow-hidden"
      style={{
        height: `${props.tileMode ? props.gallery.height : 260}px`,
        // boxShadow: "2px 2px 8px rgba(0,0,0,.6)",
        maxHeight: '600px'
      }}
    >
      <Link
        to={`/beam/${props.gallery.gallery_id}`}
        className="relative flex-1 flex flex-col overflow-hidden"
      >
        <TileEl
          onMouseEnter={e => setPlaying(true)}
          onMouseLeave={e => setPlaying(false)}

          className="tile-component shadow-md flex flex-col flex-1 relative  justify-start overflow-hidden "
          style={{
            overflow: "hidden",
          }}
        >
          <div
            className="tile-image-wrap overflow-hidden w-full relative text-center "
            style={{
              zIndex: 40,
              boxShadow: "0 0 8px rgba(0,0,0,.5)",
              // borderTopRightRadius: "8px",
              // borderTopRightLeft: "8px",
              height: `${props.gallery.images[0].height / props.gallery.images[0].width * 240}px`,
              maxHeight: '560px'
            }}
          >
            <div  className="overlay absolute top-0 bottom-0 left-0 right-0" style={{
              zIndex: 1
            }}></div>

            {props.gallery.images[0]?.media_type == "image" ? (
              <img
                className="image  bg-black"
                src={
                  props.gallery.images[0]?.path_lq ||
                  props.gallery.images[0]?.path
                }
                alt=""
                // onError={e => {
                //   e.target.src = null
                //   e.target.src = props.gallery.images[0]?.path
                // }}
                loading="lazy"
                style={{
                  height: `${props.gallery.images[0].height / props.gallery.images[0].width * 240}px`,
                  width: "240px",
                  border: "none",
                  outline: "none",
                  // borderRadius: "8px",
                }}
              />
            ) : (
              <video
              id={`video-${props.gallery.gallery_id}`}
                loop
                muted
                height={"100%"}
                width={"100%"}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  // borderRadius: "8px",
                  background: "black",
                }}
              >
                <source src={props.gallery.images[0]?.path_lq}></source>
              </video>
            )}
            {/* item count */}
            {!props.gallery.singleton && (
              <div className="opacity-50 p-1 text-xs ml-3 absolute bottom-0 right-0">
                <div
                  className="p-2"
                  style={{
                    background: "rgba(0,0,0,.4)",
                    borderRadius: "6px",
                    // boxShadow: '1px 1px 3px rgba(0,0,0,.4)'
                  }}
                >
                  <div>{props.gallery.images.length}</div>
                </div>
              </div>
            )}
          </div>
          <div
            className="tile-content flex-grow flex flex-row justify-between pb-3 pt-3 text-white text-left px-2"
            style={{
              // background: "rgba(70,70,70,1)",
              zIndex: 99,
            }}
          >
            {props.avatars !== false && (
              <div
                className="tile-avatar-wrap relative"
                style={{
                  width: "50px",
                }}
              >
                <div
                  className="tile-avatar bg-black rounded-full mr-3"
                  style={{
                    height: "40px",
                    width: "40px",
                    backgroundImage: `url(${props.gallery.avatar_lq})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>
              </div>
            )}

            <div
              className="w-full tile-info-wrap"
              style={{
                lineHeight: 1,
              }}
            >
              <div className="tile-title-wrap" style={{
                fontSize: '14px'
              }}>
                <span
                  className="font-extrabold relative"
                  style={{
                    zIndex: 100,
                    wordBreak: "break-word",
                    overflow: "ellipsis",
                    WebkitLineClamp: 2,
                    fontSize: 14,
                  }}
                >
                  {props.gallery.title}
                </span>
              </div>
              <div
                className="tile-user-wrap mt-2"
                style={{
                  color: `${colors.textFaded}`,
                }}
              > 
              {
                props.usernames !== false &&
                <div className="hover:text-white" style={{
                  fontSize: 12
                }}>
                  <Link to={`/user/${props.gallery.username}`}>
                    {props.gallery.username}
                  </Link>
                </div>
              }
                
                <div className="mt-1 " style={{
                  fontSize: 12
                }}>
                  {parseViews(props.gallery.views)} views
                  {/* {moment(props.gallery.date_created).fromNow()} */}
                </div>
              </div>

              
            </div>
          </div>
        </TileEl>
      </Link>
    </TileWrapper>
  )
}

const TileEl = styled.div`
  height: 200px;
  overflow: hidden;
  /* background: black; */

  .overlay {
    opacity: 0;
    background: rgba(255,255,255,.3);
  }
  .image {
    /* transform: scale(1.01); */
    transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  }
  .video {
    /* border-radius: 8px; */
    transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  }

  :hover {
    box-shadow: 0 0 12px #6134da;
    .overlay{
      opacity: .2
    }
    .image {
      transform: scale(1.2);
    }
    .video {
      transform: scale(1.2);
    }
  }

  .react-player {
    height: 100%;
  }
  .react-player video {
    position: relative;
    left: 0;
    top: 0;
    transform: none;
    object-fit: cover;
  }
`

const TileWrapper = styled.div`
  position: relative;
  /* border-radius: 8px; */
  /* background: #353535; */
  /* box-shadow: 0 0 6px rgba(0,0,0,.4); */
  z-index: 2;
  ::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background: white;
    opacity: 0;
    pointer-events: none;
    transition: all 0.1s linear;
  }

  .title {
    padding-left: 0px;
    transition: all 0.2s linear;
  }
  /* @media (max-width: 640px) {
    width: 100%;
    height: 460px;
  }
  @media (min-width: 640px) {
    height: 260px;
  } */
  :hover {
    .title {
      padding-left: 8px;
    }
    :after {
      /* opacity: 0.1; */
    }
    .favorites-wrapper {
      opacity: 1;
    }
  }
  .favorites-wrapper {
    opacity: 0;
    transition: all 0.1s linear;
  }
`

function parseViews(number) {
  if (number > 1000000) {
    number = number.toString()
    number = number.slice(0, -6)
    number += "m"
  } else if (number > 1000) {
    number = number.toString()
    number = number.slice(0, -3)
    number += "k"
  }
  return number
}

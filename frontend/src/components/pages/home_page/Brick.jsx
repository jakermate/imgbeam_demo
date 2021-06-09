import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { useInView } from 'react-intersection-observer'
export default function Brick(props) {
  let width = props.gallery.images[0].width
  let height = props.gallery.images[0].height
  const { ref, inView, entry } = useInView({
    threshold: .5
  });
  // useEffect(()=>{
  //   if(!props.gallery) return
  //   if(props.gallery.images[0].media_type !== "video") return
  //   if(inView) document.getElementById(`video-${props.gallery.gallery_id}`).play()
  //   if(!inView)document.getElementById(`video-${props.gallery.gallery_id}`).pause()
  // },[inView])
  return (
    <BrickStyle className="relative mb-4 ">
      <div
        onDragStart={(e) =>
          props.setDragged ? props.setDragged(e.currentTarget.id) : null
        }
        draggable={props.draggable}
        onDrop={(e) => console.log("beign dropped")}
        id={`brick-${props.gallery.gallery_id}`}
        className="bg-white relative"
        style={{
          overflow: "hidden",
          paddingTop: `${(height / width) * 100 || 100}%`,
        }}
      >
        <Link
          to={`/beam/${props.gallery.gallery_id}`}
          className="h-full block absolute  top-0 right-0 left-0 bottom-0"
          style={
            {
              // maxHeight: props.gallery.images[0].height
            }
          }
        >
          <div className="absolute overlay top-0 left-0 right-0 bottom-0 z-10 flex flex-col justify-end">
            <div
              className="p-4"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,.4))",
              }}
            >
            <div className="content w-full flex flex-row">
            <div
                className="mr-3"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "100%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={props.gallery.avatar_lq}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="text-sm font-extrabold">
                {props.gallery.username}
              </div>
            </div>
              
            </div>
          </div>
          {props.gallery.images[0].media_type == "image" ? (
            <div
              className="media-container media absolute top-0 bottom-0 left-0 right-0"
              style={{}}
            >
              <img
                src={props.gallery.images[0].path_lq}
                className="absolute block object-cover top-0 left-0 right-0 bottom-0"
                style={{
                  width: "100%",
                  height: "100%",
                  //   maxHeight: "600px",
                }}
                alt=""
              />
              <div className="absolute bottom-0 right-0 z-50 p-3">
                {!props.gallery.singleton ? (
                  <div
                    className="px-2 py-1 text-white text-xs rounded-md"
                    style={{
                      background: `rgba(0,0,0,.5)`,
                    }}
                  >
                    {props.gallery.images.length}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="absolute media-container media object-cover top-0 left-0 right-0 bottom-0"
            >
              <video
                ref={ref}
                id={`video-${props.gallery.gallery_id}`}
                src={props.gallery.images[0].path_lq}
                preload="none"
                muted
                loop
                autoPlay={inView}
                onError={(e) =>
                  document
                    .getElementById(`video-${props.gallery.gallery_id}`)
                    .parentElement.remove()
                }
                className="absolute object-cover top-0 left-0 right-0 bottom-0"
                style={{
                  width: "100%",
                  height: "100%",
                  // maxHeight: "600px",
                }}
              ></video>
              <div className="absolute bottom-0 right-0 pr-3 pb-2 opacity-50">
                <i className="fas fa-video"></i>
              </div>
            </div>
          )}
          {props.favoriteMode && <FavoritesOverlay></FavoritesOverlay>}
        </Link>
      </div>
      <Link to={`/beam/${props.gallery.gallery_id}`}>
      <div
        className="brick-info items-start flex-col"
        style={{
          display: `${props.favoriteMode ? "none" : "flex"}`,
        }}
      >
        <div className="title text-left mt-2">{props.gallery.title}</div>
        <div className="brick-stats mt-1 flex flex-row">
          <div className="flex flex-row items-center mr-3">
            <i class="fas fa-caret-square-up mr-1 fa-sm"></i>
            <div className="text-xs font-extrabold">
              {props.gallery.upvotes - props.gallery.downvotes + 1 || 0}
            </div>
          </div>
          <div className="flex flex-row items-center">
            <i class="fas fa-eye mr-1 fa-sm"></i>
            <div className="text-xs font-extrabold">{props.gallery.views}</div>
          </div>
        </div>
      </div>
        </Link>
    </BrickStyle>
  )
}
function FavoritesOverlay(props) {
  return (
    <FavoriteControls className="absolute  z-50 left-0 top-0 bottom-0 right-0">
      <div className="top-0 left-0 right-0 favorite-controls flex flex-row justify-between">
        <div>
          <button className="p-3" onClick={(e) => e.preventDefault()}>
            <i className="far fa-square text-white"></i>
          </button>
        </div>
        <div>
          <button className="p-3" onClick={(e) => e.preventDefault()}>
            <i className="fas fa-trash text-white"></i>
          </button>
        </div>
      </div>
    </FavoriteControls>
  )
}
const FavoriteControls = styled.div`
  background-color: rgba(0, 0, 0, 0);
  .favorite-controls {
    visibility: hidden;
  }
  :hover {
    background-color: rgba(255, 255, 255, 0.1);
    .favorite-controls {
      visibility: visible;
    }
  }
`
const BrickStyle = styled.div`
  /* max-height: 600px; */
  /* box-shadow: 0 0 8px rgba(0,0,0,.3); */
  /* border: ${(props) => `1px solid ${props.theme.border}`}; */
  box-shadow: 0 4px 8px -4px rgba(0,0,0,.6);
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px;
  .overlay {
    color: white;
    transition: all 0.3s linear;
    font-weight: bold;
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px);
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0.7) 100%
    );
  }
  .media-container {
    /* border-radius: 8px; */
    overflow: hidden;
  }
  .media {
    transition: all 0.2s cubic-bezier(0.68, -0.3, 0.32, 1.3);
  }
  .brick-info {
    transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    height: 64px;
    overflow: hidden;
    background: ${(props) => props.theme.background_3};
    padding: 2px 12px;
    /* border-bottom-left-radius: 8px; */
    /* border-bottom-right-radius: 8px; */
  }
  .brick-stats {
    color: ${(props) => props.theme.icons_2};
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.text};
  }
  :hover {
    .overlay {
      opacity: 1;
      transform: translateY(0);
    }
    /* .brick-info {
      height: 42px;
      margin-top: 8px;
      padding: 4px 12px;
    } */
    .media {
      transform: scale(1.1);
    }
  }
`

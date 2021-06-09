import React from "react"
import Player from "react-player"
import { Link } from "react-router-dom"
import styled from "styled-components"
export default function PickTile(props) {
  return (
    <Link
      to={`/beam/${props.gallery.gallery_id}`}
      className="mr-4 mb-4"
      style={{
        width: "200px",
        boxShadow: '2px 2px 8px rgba(0,0,0,.4)'
      }}
    >
      <Tile
        className="bg-black shadow-lg relative mr-2 overflow-hidden"
        style={{
          width: "200px",
          height: "120px",
          borderRadius: "4px",
        }}
      >
        <div className="overlay absolute top-0 bottom-0 left-0 right-0"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 image-container overflow-hidden">
          {props.gallery.images[0].media_type == "image" ? (
            <ImageView src={props.gallery.images[0].path}></ImageView>
          ) : (
            <VideoView src={props.gallery.images[0].path}></VideoView>
          )}
        </div>
      </Tile>
      <div
        className="w-full bg-gray-700 pl-2 pb-2 rounded-b-md text-left font-bold py-1 overflow-hidden text-sm"
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.gallery.title}
        <div className="text-xs text-gray-500">{props.gallery.username}</div>
      </div>
    </Link>
  )
}
function ImageView(props) {
  return <img className="object-cover w-full h-full" src={props.src} alt="" />
}
function VideoView(props) {
  return (
    <Player
      playing
      muted
      width={"100%"}
      height={"100%"}
      url={props.src}
    ></Player>
  )
}
const Tile = styled.div`
  video {
    object-fit: cover;
  }
`

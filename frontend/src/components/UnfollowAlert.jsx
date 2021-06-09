import React, { useState, useEffect } from "react"
import styled, {keyframes} from 'styled-components'
export default function UnfollowAlert(props) {
  return (
    <Alert
      id="unfollow-alert"
      className="fixed top-0 h-screen w-full right-0 left-0 flex flex-col justify-center items-center"
      style={{
        zIndex: 9999,
      }}
    >
      <div
        onClick={e=>props.cancel(false)}
        className="overlay fixed w-full top-0 bottom-0 right-0 left-0"
        style={{
          background: "rgba(0,0,0,.8)",
        }}
      ></div>
      <div
        className="relative text-white"
        style={{
          width: "250px",
          background: "#373737",
        }}
      >
        <div className="mx-6 my-5 text-sm opacity-75">
          You are about to unfollow {props.username}
        </div>
        <hr className="opacity-25" />
        <div className="my-4 text-sm">
          <button
            className="text-gray-500 mr-12 font-bold"
            onClick={(e) => props.cancel(false)}
          >
            Cancel
          </button>
          <button className="text-red-600 font-bold" onClick={(e) => props.unfollow()}>
            Unfollow
          </button>
        </div>
      </div>
    </Alert>
  )
}
const fadein = keyframes`
    from{
        opacity:0
    }
    to{
        opacity: 1
    }
`
const Alert = styled.div`
    opacity: 0;
    animation: ${fadein} .1s linear forwards;
`
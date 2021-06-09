import React, { useEffect, useState } from "react"
import UploadComponent from "./upload_component/UploadComponent"
import styled, { keyframes } from "styled-components"
import { useHistory } from "react-router-dom"
import CancelOverlay from "./CancelOverlay"
import theme from '../theme/colors'
export default function NewPostOverlay(props) {
  let history = useHistory()
  useEffect(() => {
    checkIfLoggedIn()
    document.title = "New Upload"
  }, [])
  async function checkIfLoggedIn() {
    let url = `/api/loggedin`
    try {
      let res = await fetch(url)
      if (res.status == 401) {
        window.location.href = "/login"
      }
    } catch (err) {
      console.log(err)
    }
  }
  const [cancelOverlay, toggleCancelOverlay] = useState(false)
  function cancel() {
    toggleCancelOverlay(true)
  }
  function goback() {
    history.goBack()
  }
  function toggleOverlayOff() {
    toggleCancelOverlay(false)
  }

  return (
    <div
      className="top-0 bottom-0 left-0 right-0 fixed flex flex-col justify-center items-center "
      style={{
        zIndex: 1000,
        background: "rgba(0,0,0,.8)",
      }}
    >
      {cancelOverlay && (
        <CancelOverlay
          goback={goback}
          toggleOverlayOff={toggleOverlayOff}
        ></CancelOverlay>
      )}

      <div className="overlay z-0 fixed top-0 bottom-0 left-0 right-0" onClick={e => cancel()}>

      </div>
      <Panel
        id="new-post-panel"
        className=" relative py-2  z-50 px-2"
      >
        <div className="cancel-container p-6 absolute top-0 right-0">
          <button
            onClick={(e) => cancel()}
            className=" outline-none text-white "
            style={
              {
                width: '50px',
                height: '50px',
                borderRadius: '100%',
                backgroundColor: 'rgba(255,255,255,.2)'
              }
            }
          >
            <i className="fas fa-times fa-lg"></i>
          </button>
        </div>
        <div id="upload-intro" className=" p-2">
          <h1 className="text-xl text-white font-extrabold">New Post</h1>
          <p className="text-white text-sm">
            Upload your media to imgbeam for free, and share it with the world.
          </p>
        </div>

        <UploadComponent cancelUpload={goback}></UploadComponent>
        <Bottom>
          <div className="supported text-white mt-6 max-w-md">
            <h4 className="opacity-50">supported formats</h4>
            <div className="text-xs opacity-25">
              .jpg, .jpeg, .png, .gif, .apng, .tiff, .tif, .bmp, .xcf, .webp,
              .mp4, .mov, .avi, .webm, .mpeg, .flv, .mkv, .mpv, .wmv
            </div>
          </div>
        </Bottom>

        
      </Panel>
      {/* agreement */}
      <div
          id="agreement"
          className="mt-6 text-xs absolute left-0 right-0 bottom-0 text-white pb-4"
        >
          By uploading to imgbeam, you agree to abide by imgbeams's
          <a
            href="/termsofuse"
            target="_blank"
            rel="noopener"
            className="text-green-400 font-bold pl-1"
          >
            terms of service
          </a>
        </div>
    </div>
  )
}
const enter = keyframes`
    from{
        transform: translateY(300px);
        opacity: 0;
    }
    to{
        transform: translateY(0px);
        opacity: 1;
    }
`
const Bottom = styled.div`
  animation-delay: 0.5s;
  animation: ${enter} 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
`
const Panel = styled.div`
  background: ${theme.backgroundMedium};
  border-radius: 26px;
  /* max-height: calc(100vh - 200px); */
`

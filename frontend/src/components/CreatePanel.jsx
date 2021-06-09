import React, { useState } from "react"
import colors from "../theme/colors"
import styled from "styled-components"
import { connect } from "react-redux"
import {
  toggleCreatePanel,
  addFile,
  startUpload,
  resetTransferState,
} from "../state/store/actions/index"

function CreatePanel(props) {
  const [title, setTitle] = useState("")

  function requestTransfer(e) {
    if (props.uploading) {
      console.log("upload already in progress")
      return
    }
    if (props.filesToDo.length > 0) {
      console.log("starting transfer")
      // set title
      props.startUpload(title)
      return
    }
    console.log("no files selected")
  }

  function addFileToState(newFile) {
    let reader = new FileReader()
    reader.onload = function (e) {
      newFile.typeString = returnType(newFile.type)
      newFile.url = e.target.result
      props.addFile(newFile)
    }
    reader.readAsDataURL(newFile)
  }
  return (
    <CreateOverlay
      createPanel={props.createPanel}
      className="fixed top-0 bottom-0 left-0 right-0"
    >
      <div
        className="overlay fixed top-0 bottom-0 left-0 right-0 z-10"
        style={{
          background: "rgba(0,0,0,.9)",
          //   pointerEvents: 'none',
          display: `${props.createPanel ? "block" : "none"}`,
        }}
      ></div>
      <Panel
        id="create-post-panel"
        show={props.createPanel}
        className=" flex flex-col justify-between items-start"
        style={{}}
      >
        <div
          className="top-control flex flex-col w-full items-center mb-12"
          style={{}}
        >
          <div
            id="create-post-header"
            style={{
              width: "calc(100% - 60px)",
            }}
            className="text-center font-bold text-lg mt-6 w-full flex-grow"
          >
            <h3>New Post</h3>
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <label htmlFor="create-post-title" className="font-bold mb-3">
            {/* Title */}
          </label>
          <input
            className="px-2 w-full py-1 outline-none focus:outline-none mx-8"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            id="create-post-title"
            style={{
              background: "rgba(0,0,0,.2)",
            }}
          />
        </div>
        <div className="drag-drop w-full">
          <label
            htmlFor="file-input"
            className="w-full py-3 flex flex-col items-center"
            style={{
              backgroundColor: `${colors.backgroundDark}`,
            }}
          >
            <div>Select File</div>

            <input
              onChange={(e) => addFileToState(e.target.files[0])}
              id="file-input"
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp,.mp4,.mov,.avi,.webm,.mpeg,.flv,.mkv,.mpv,.wmv"
            />
          </label>
        </div>
        <div
          id="create-post-cover-preview"
          className="w-full "
          style={{
            height: "300px",
          }}
        >
          {props.filesToDo.length > 0 && (
            props.filesToDo[0].typeString === "video" ?
            <video src={props.filesToDo[0].url} style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}></video>
              :
              <img alt={'Cover'} src={props.filesToDo[0].url} style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}></img>
          )}
        </div>
        <div id="create-panel-other-photos" className="flex flex-row flex-wrap w-full overflow-y-auto" style={{}}>
          {props.filesToDo.map((file, indx) => {
            if (indx > 0) {
              return (
                <div
                  className="w-1/3"
                  style={{
                    height: "100px",
                  }}
                >
                  <img
                    src={file.url}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt=""
                  />
                </div>
              )
            }
          })}
        </div>
        
        <div
          className="post-controls flex flex-col px-8 w-full pt-4"
          style={{}}
        >
          <div className=" w-full">
            <UploadStartButton
              disabled={props.filesToDo.length == 0 || title.length == 0}
              onClick={(e) => requestTransfer(e)}
              className="px-8 outline-none focus:outline-none w-full mb-2 py-1 text-sm"
              style={{
                background: `${colors.success}`,
                borderRadius: "3px",
              }}
            >
              Post
            </UploadStartButton>
          </div>
          <div className="mb-4 w-full">
            <button
              className=" py-1 px-8 w-full text-sm outline-none focus:outline-none"
              onClick={(e) => {
                props.toggleCreatePanel()
                props.resetTransferState()
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Panel>
    </CreateOverlay>
  )
 
}

const types = {
  video: [".mp4",".mov",".avi",".webm",".mpeg",".flv",".mkv",".mpv",".wmv"],
  image: [".jpg",".jpeg",".png",".gif",".apng",".tiff",".tif",".bmp",".xcf",".webp"]
}
const UploadStartButton = styled.button`
  color: white;
`
function returnType(typeString){
  if(typeString.includes("video")){
    return "video"
  }
  return "image"
}
const CreateOverlay = styled.div`
  z-index: ${(props) => (props.createPanel ? 998 : 1)};
`
const Panel = styled.div`
  position: absolute;
  transition: all 0.1s linear;
  z-index: 1000;
  top: 62px;
  bottom: 0;
  width: 400px;
  right: 0px;
  background: ${props => props.theme.background_2};
  transform: translateX(${(props) => (props.show ? "0" : "400")}px);
`
function mapStateToProps(state) {
  return {
    createPanel: state.app_state_reducer.createPanel,
    filesToDo: state.transfer_reducer.filesToDo,
    uploading: state.transfer_reducer.uploading,
    signedIn: state.app_state_reducer.signedIn
  }
}
const mapDispatchToProps = {
  toggleCreatePanel,
  addFile,
  resetTransferState,
  startUpload,
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePanel)

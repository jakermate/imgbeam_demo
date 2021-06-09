import React, { useState, useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import { useHistory } from "react-router-dom"
import colors from "../theme/colors"
export default function DropAnywhere() {
  const [dragging, setDragging] = useState(0)
  const [files, setfiles] = useState(null)
  useEffect(() => {
    window.addEventListener("dragenter", dragEnter)
    window.addEventListener("dragleave", dragLeave)
    return () => {
      window.removeEventListener("dragenter", dragEnter)
      window.removeEventListener("dragleave", dragLeave)
    }
  }, [dragging])
  //   useState(() => {
  //     console.log(dragging)
  //   }, [dragging])
  const [filePresent, setFilePresent] = useState(false)
  function dragEnter(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.types.includes("Files")) {
      setDragging((old) => old + 1)
    }
  }
  function dragLeave(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.types.includes("Files")) {
      setDragging((old) => old - 1)
    }
  }
  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    // setDragging(0)
    // check file sizes to prevent too many from being held
    console.log(e.dataTransfer.files)
    if (!checkSize([...e.dataTransfer.files])) {
      console.log("files too big")
      return
    }
    // set files
    setfiles([...e.dataTransfer.files])
    console.log(e.dataTransfer.files[0])
  }
  const [size, setSize] = useState(0)
  function checkSize(fileArray) {
    // in bytes
    let size = 0
    fileArray.forEach((file) => {
      size += file.size
    })
    setSize(size)
    if (size / 1000000 > 80) {
      return false
    }
    return true
  }

  // get file urls on file update callback
  const [urls, setUrls] = useState([])
  useEffect(() => {}, [urls])
  useEffect(() => {
    if (!files) return
    let array = []
    for (let i in files) {
      let reader = new FileReader()
      reader.onload = (newFile) => {
        array.push(newFile.target.result)
      }
      reader.readAsDataURL(files[i])
    }
    setUrls(array)

    // get title panel
    toggleTitlePanel(true)
  }, [files])
  const [title, setTitle] = useState("")
  const [titlePanel, toggleTitlePanel] = useState(false)

  const [uploading, toggleUploading] = useState(false)
  const history = useHistory()
  // submit post
  async function submit() {
    // build req body
    let data = new FormData()
    files.forEach((file, index) => {
      data.append(`file_${index}`, file)
    })
    data.append("title", title)

    try {
      toggleUploading(true)
      let res = await fetch("/api/upload/create", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        body: data,
      })
      console.log(res.status)
      if (res.status == 500) {
        toggleUploading(false)
        // setError(true)
        return
      }
      if (res.status == 400) {
        // toast("Select a file to upload.", { position: "bottom-center" })
        toggleUploading(false)
      }
      // if success, redirect to gallery
      if (res.status == 200) {
        // setError(false)
        toggleUploading(false)
        cancel()
        let json = await res.json()
        history.push(`/beam/${json.gallery_id}`)
      }
    } catch (err) {
      // setError(true)
      toggleUploading(false)
      console.log(err)
      console.log("Error during upload.")
    }
  }

  function cancel() {
    setfiles(null)
    setDragging(0)
    toggleTitlePanel(false)
    setFilePresent(false)
    setTitle("")
    toggleUploading(false)
    setSize(0)
  }
  return (
    <div
      id="drop-zone"
      className="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center"
      style={{
        // pointerEvents:'none',
        background: "rgba(0,0,0,.7)",
        zIndex: dragging === 0 ? 0 : 9999,
        display: dragging === 0 ? "none" : "flex",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        cancel()
      }}
    >
      {titlePanel ? (
        <TitlePanel
          length={files.length}
          size={size}
          cancel={cancel}
          submit={submit}
          title={title}
          setTitle={setTitle}
        ></TitlePanel>
      ) : (
        <DropTarget
          id="quick-post-drop-zone"
          className="relative text-white flex flex-col items-center justify-center"
          onDragEnter={(e) => {
            setFilePresent(true)
            e.currentTarget.classList.add("active")
            console.log("enter")
          }}
          onDragLeave={(e) => {
            setFilePresent(false)
            e.currentTarget.classList.remove("active")
            console.log("leave")
          }}
          onDrop={(e) => handleDrop(e)}
          style={{
            boxShadow: "2px 2px 8px rgba(0,0,0,.4)",
            borderRadius: "16px",
            minWidth: "420px",
            minHeight: "220px",
          }}
        >
          {!filePresent ? (
            <div
              style={{
                pointerEvents: "none",
              }}
            >
              <div>
                <i className="fas fa-bullseye fa-3x mb-4"></i>
              </div>
              <div className="font-bold text-sm">
                {window.location.pathname.includes("edit") ? (
                  <div>Drop to Add Image</div>
                ) : (
                  <div>Drop Here To Quick-Post</div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                pointerEvents: "none",
              }}
              className="font-extrabold"
            >
              <div>
                <i className="fas fa-pastafarianism fa-4x mb-4"></i>
              </div>
              <div>RELEASE THE KRAKEN</div>
            </div>
          )}
        </DropTarget>
      )}
    </div>
  )
}
function TitlePanel(props) {
  return (
    <TitlePanelElement
      className="flex flex-col items-center justify-between text-white px-8 py-5"
      style={{
        minWidth: "420px",
        minHeight: "260px",
      }}
    >
      <div className="flex flex-col font-extrabold">
        Title your post.
        <input
          className="text-white font-bold mt-3 px-2 py-2 w-full outline-none"
          style={{
            backgroundColor: `${colors.backgroundLightest}`,
            borderRadius: "16px",
          }}
          value={props.title}
          onChange={(e) => props.setTitle(e.target.value)}
          type="text"
          placeholder="Title"
        />
        <div className="opacity-50 mt-3 text-xs">
          Uploading {props.length} files ({(props.size / 1000000).toFixed(1)}MB)
        </div>
      </div>

      <div className="flex flex-row">
        <button className="px-8 py-3" onClick={(e) => props.cancel()}>
          Cancel
        </button>
        <button
          style={{
            background: `${colors.success}`,
            borderRadius: "16px",
          }}
          className="px-8 py-3"
          onClick={(e) => props.submit()}
        >
          Post
        </button>
      </div>
    </TitlePanelElement>
  )
}
const DropTarget = styled.div`
  transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  background-color: ${colors.backgroundDark};

  &.active {
    transform: scale(1.2);
    background-color: ${colors.backgroundMedium};
  }
`
const TitlePanelElement = styled.div`
  transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  background-color: ${colors.backgroundMedium};
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  border-radius: 16px;
`

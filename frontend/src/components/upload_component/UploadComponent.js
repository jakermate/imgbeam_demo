import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { useHistory } from "react-router-dom"
import MoonLoader from "react-spinners/MoonLoader"
import { ToastContainer, toast } from "react-toastify"

export default function UploadComponent(props) {
  const history = useHistory()
  const [error, setError] = useState(false)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [fileURLs, setFileURLs] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  function on_select(e) {
    // console.log(e.target.files)

    let newFiles = [...files]
    newFiles.push(e.target.files[0])
    setFiles(newFiles)

    let fileReader = new FileReader()
    fileReader.readAsDataURL(e.target.files[0])
    fileReader.onload = function (file) {
      let newFileUrls = [...fileURLs]
      newFileUrls.push(file.target.result)
      setFileURLs(newFileUrls)
    }
  }

  // useEffect(() => {
  //   console.log(fileURLs)
  // }, [fileURLs])
  useEffect(() => {
    console.log(files)
  }, [files])
  function on_drop(e) {
    e.stopPropagation()
    e.preventDefault()
    console.log("drop in dropzone")
    let file = e.dataTransfer.files[0]
    validate_file(file)
  }
  // make sure file is right format and size before auto-upload
  function validate_file(file) {
    let maxSizeImage = 20000000 // this is Bytes
    let maxSizeVideo = 40000000
    let vidLength = 90
    console.log(file.size)
    console.log(file.name)
    console.log(file.type)
    if (file.size < maxSizeImage) {
      // setFile(file)
    }
  }
  async function createPost() {
    toast.dismiss()
    toast.clearWaitingQueue()
    // file presence check
    if (files.length == 0) {
      toast("No files to upload.", {
        position: "bottom-center",
      })
      return
    }
    // file size check
    let size = 0
    files.forEach(file=>{
      size += file.size
    })
    // greater than 50 mb
    console.log(size)
    if((size / 1000000) > 50){
      toast("Uploads can not be larger than 50mb.", {
        position: "bottom-center",
      })
      return
    }

    // title check
    if (title == "") {
      toast("A title is required.", {
        position: "bottom-center",
      })
      return
    }
    // build req body
    let data = new FormData()
    files.forEach((file, index) => {
      data.append(`file_${index}`, file)
    })
    data.append("title", title)
    data.append("description", description)

    try {
      setUploading(true)
      let res = await fetch("/api/upload/create", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        body: data,
      })
      console.log(res.status)
      if (res.status == 500) {
        setUploading(false)
        setError(true)
        return
      }
      if (res.status == 400) {
        toast("Select a file to upload.", { position: "bottom-center" })
        setUploading(false)
      }
      // if success, redirect to gallery
      if (res.status == 200) {
        setError(false)
        setUploading(false)
        let json = await res.json()
        history.push(`/beam/${json.gallery_id}`)
      }
    } catch (err) {
      // setError(true)
      setUploading(false)
      console.log(err)
      console.log("Error during upload.")
    }
  }
  // remove file
  function remove(index){
    let oldFiles = [...files]
    let oldFileURLs = [...fileURLs]
    let removed = oldFiles.splice(index, 1)
    let removedURLs = oldFileURLs.splice(index, 1)
    setFiles(oldFiles)
    setFileURLs(oldFileURLs)
 
  }



  if (uploading) {
    return (
      <div className="flex flex-col px-8 py-8 justify-center items-center">
      <h3 className="font-extrabold py-3">Processing</h3>
        <MoonLoader size={20}></MoonLoader>
      </div>
    )
  } else if (error) {
    return (
      <div className="my-8 text-white flex flex-col justify-center items-center">
        <h2 className="text-3xl font-extrabold text-white">
          Error during file upload.
        </h2>
        <div className="mt-8">
          <button
            className="text-xl font-bold py-3 px-5 bg-green-400"
            onClick={(e) => createPost()}
          >
            Try Again
          </button>
          <button
            className="font-extrabold text-sm py-3 block  px-5 opacity-50"
            onClick={(e) => props.cancelUpload()}
          >
            Cancel Upload
          </button>
        </div>
      </div>
    )
  } else
    return (
      <div className=" mx-auto " style={{}}>
        <UploadComponentDiv className="px-6 text-white py-2 mx-auto max-w-2xl  flex flex-col">
          <section id="new-post-form" className="flex flex-col text-white">
            <div
              className="w-full mb-4 flex flex-row"
              style={{
                background: "rgba(255,255,255,.3)",
                borderRadius: "26px",
              }}
            >
              <TitleInput
                className="px-4 py-3 flex-grow outline-none placeholder-gray-900 focus:outline-none w-full"
                type="text"
                autoFocus
                maxLength={128}
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="close-icon flex flex-col items-center justify-center w-12">
                {title.length > 0 && (
                  <button
                    className="w-full h-full opacity-75"
                    onClick={(e) => setTitle("")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            <textarea
              className="px-4 py-3 mb-4 outline-none placeholder-gray-900 focus:outline-none w-full"
              type="text"
              maxLength={1024}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                background: "rgba(255,255,255,.3)",
                borderRadius: "26px",
              }}
            />
          </section>
          <section id="upload-things">
            <UploadButton
              className=" p-2  w-full flex-col flex items-center justify-center"
              style={{}}
            >
              <label
                htmlFor="file-input"
                className="items-center  justify-center cursor-pointer w-full h-full flex flex-col py-4"
                style={{
                  borderRadius:'26px',
                  background: "rgba(255,255,255,.1)",
                }}
              >
                <div className="flex flex-row justify-start w-full">
                  <div className="px-6">
                    <i class="fas fa-file-image fa-3x"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="text-xl font-bold">Explore Files</h4>
                    <div className="tet-sm">
                      Select one or multiple image/video files.
                    </div>
                  </div>
                </div>
              </label>
              <input
                type="file"
                className="absolute hidden"
                style={{ zIndex: -1 }}
                name="file-upload"
                onChange={(e) => on_select(e)}
                id="file-input"
                accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp,.mp4,.mov,.avi,.webm,.mpeg,.flv,.mkv,.mpv,.wmv"
              />
            </UploadButton>
            <section id="submit-control">
            <SubmitButton
              className="w-full font-extrabold py-3 mt-4  "
              onClick={(e) => createPost()}
              // disabled={files.length == 0}
            >
              Post
            </SubmitButton>
          </section>
            <div className="w-full mt-6 flex flex-row flex-wrap ">
              {files.length > 0 && (
                <h2 className="font-extrabold text-xl text-center w-full">
                  {files.length} files selected
                </h2>
              )}

              {files &&
                fileURLs.map((fileURL, index) => {
                  return (
                    <FileTile key={`file-upload-${index}`}>
                      <div
                        key={`media-upload-image-preview-${index}`}
                        className="m-2 relative object-cover "
                        style={{
                          width: "180px",
                          height: "100px",
                          boxShadow: '2px 2px 12px rgba(0,0,0,.5)'

                          // border: "1px solid white",
                        }}
                      >
                        {/* remove button */}
                        <div className="absolute top-0 right-0 z-50 hidden remove-button" style={{
                           top: '-20px',
                            right: '-20px',
                        }} >
                        <button className="p-2 remove-circle" onClick={e => remove(index)}
                          style={{
                           
                            borderRadius: '100%',
                            width: '40px',
                            height: '40px',
                            background: 'rgba(255,255,255,.5)'
                          }}
                        >
                          <i className="fas fa-times"></i>

                        </button>
                        </div>
                        <div className="overlay absolute top-0 bottom-0 left-0 right-0 hover:bg-white opacity-25 z-10" style={{
                        }}></div>
                        {
                          files[index].type.includes("image") ?
                          <img
                          className="object-cover"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          src={fileURL}
                          alt=""
                        />
                        :
                        <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
                        <i className="fas fa-film block fa-2x"></i>
                        </div>
                        }
                       
                      </div>
                      <div className="file-info flex flex-col">
                        <h4
                          className="font-bold"
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          {files[index].name}
                        </h4>
                        <h6
                          className=" opacity-50 font-bold"
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          {readableBytes(files[index].size)}
                        </h6>
                      </div>
                    </FileTile>
                  )
                })}
            </div>
          </section>

         
        </UploadComponentDiv>
        <ToastContainer limit={1}></ToastContainer>
      </div>
    )
}
const enter = keyframes`
  from{
    transform: scale(.4);
    opacity:0;
  }
  to{
    transform: scale(1);
    opacity:1;
  }
`
const UploadComponentDiv = styled.div`
  animation: ${enter} 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
  #drop-target-container {
  }
  #drop-zone {
  }
  #drop-target-image {
  }
`
const UploadButton = styled.div`
  border: 1px dashed rgba(255, 255, 255, 0.5);
  border-radius: 26px;
`
const SubmitButton = styled.button`
  background: #38cc77;
  /* box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4); */
  border-radius: 26px;
`
const TitleInput = styled.input`
  position: relative;
  background: transparent;
  height: 50px;
`

function readableBytes(bytes) {
  let byteString = bytes.toString()
  let ext = "Bytes"
  // console.log(bytes.toString())
  if (byteString.length > 3) {
    ext = "KB"
    bytes = bytes / 1000
  }
  if (byteString.length > 6) {
    ext = "MB"
    bytes = bytes / 1000
  }

  return bytes.toFixed(1).toString() + " " + ext
}

const FileTile = styled.div`
  :hover{
    .remove-button{
      display: block;
    }
  }
  .remove-circle{
    :hover{
      background: rgba(255,255,255,1)
    }
  }
`
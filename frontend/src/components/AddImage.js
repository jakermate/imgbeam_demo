import React, { useEffect } from "react"
import Dropzone from "react-dropzone"
import Drop from "react-dropzone"
export default function AddImage() {
  useEffect(() => {
    document.getElementById("file-input").onchange = function () {
      document.getElementById("upload-form").submit()
    }
  }, [])
  return (
    <div className="bg-white mt-24 rounded-md px-6 py-8 mx-auto max-w-2xl text-black">
      <form
        action="/upload/add?gallery=dGbjLhWG"
        id="upload-form"
        method="POST"
        encType="multipart/form-data"
        className="relative"
      >
        <label htmlFor="file-input" className="font-bold cursor-pointer">
          Pick Something to Upload
        </label>
        <input
          type="file"
          className="absolute hidden"
          style={{ zIndex: -1 }}
          name="file-upload"
          id="file-input"
          accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp,.mp4,.mov,.avi,.webm,.mpeg,.flv,.mkv,.mpv,.wmv"
        />
        {/* <button type="submit" value="" className="bg-purple-500 text-white font-bold rounded-lg px-8 py-4">Add</button> */}
      </form>
      <div>or</div>
      <Dropzone noClick onDrop={file => console.log(file)}>
        {({ getRootProps, getInputProps }) => (
          <div className="bg-gray-300 rounded-lg px-4 py-8 mt-6">
            <div {...getRootProps()}>
              <input {...getInputProps()} id="drag-file-input" />
              <p>Drag File Here</p>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  )
}

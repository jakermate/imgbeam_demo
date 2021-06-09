import React, { useState } from "react"
import colors from "../../../theme/colors"
import backdrop_default from "../../../default_background.jpg"
import Loader from "react-spinners/RingLoader"
export default function BackdropSelect(props) {
  const [file, setFile] = useState(null)
  const [url, setURL] = useState('')
  const [processing, setProcessing] = useState(false)
  function setBackdropFile(e){
    let newFile = e.target.files[0]
    console.log(newFile)
    setFile(newFile)
    let reader = new FileReader()
    reader.readAsDataURL(newFile)
    reader.onload = function(file){
      
      setURL(file.target.result)

    }
  }
  async function sendBackdrop() {
    setProcessing(true)
    let form = new FormData()
    form.append("backdrop", file)
    try {
      let url = `/api/account/settings/backdrop/update`
      let res = await fetch(url, {
        credentials: "include",
        method: "POST",
        body: form,
      })
      if (res.status === 200) {
        props.pulldata()
        props.toggleMenu(false)
      }
    } catch (err) {
      console.log(err)
      setProcessing(false)
    }
  }
  if (processing) {
    return (
      <div
        className="fixed text-white top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center"
        style={{
          zIndex: 99,
        }}
      >
        <div
          className="overlay fixed top-0 bottom-0 left-0 right-0 z-0"
          onClick={(e) => props.toggleMenu(false)}
          style={{
            background: "rgba(0,0,0,.7)",
          }}
        ></div>
        <div
          className="panel z-10 overflow-hidden flex flex-col items-center justify-center"
          style={{
            borderRadius: "26px",
            minWidth: '260px',
            minHeight: '160px',
            backgroundColor: `${colors.backgroundMedium}`,
          }}
        >
        <Loader color={'white'} ></Loader>
        </div>
      </div>
    )
  }
  else return (
    <div
      className="fixed text-white top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 99,
      }}
    >
      <div
        className="overlay fixed top-0 bottom-0 left-0 right-0 z-0"
        onClick={(e) => props.toggleMenu(false)}
        style={{
          background: "rgba(0,0,0,.7)",
        }}
      ></div>
      <div
        className="panel z-10 overflow-hidden"
        style={{
          borderRadius: "26px",
          backgroundColor: `${colors.backgroundMedium}`,
        }}
      >
        <div
          className="py-2 font-extrabold flex flex-col items-center justify-center"
          style={{
            background: `rgba(80,80,80,.1)`,
            borderRadius: "26px",
            height: "50px",
          }}
        >
          <div>Choose Banner</div>
        </div>
        <div
          className="mx-8"
          style={{
            borderRadius: "26px",
            boxShadow: " 2px 2px 8px rgba(0,0,0,.3)",
          }}
        >
          <div id="banner-preview">
            <div
              className="mt-4 overflow-hidden"
              style={{
                maxWidth: "420px",
                minWidth: "420px",
                borderTopLeftRadius: "26px",
                borderTopRightRadius: "26px",
              }}
            >
              <img
                src={url === "" ? (props.backdrop || backdrop_default) : url }
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: `${url === "" ? 'grayscale(1)': 'grayscale(0)'}`

                }}
              />
            </div>
          </div>
          <div
            className="flex flex-row font-bold text-sm overflow-hidden justify-between"
            style={{
              minHeight: "120px",
              borderBottomLeftRadius: "26px",
              borderBottomRightRadius: "26px",
            }}
          >
            <div className="flex-grow w-1/2">
              <label
                htmlFor="backdrop-select"
                className="text-white flex-col w-full h-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(70,70,70,.4)",
                }}
              >
                Select
              </label>
              <input
                type="file"
                name="backdrop-select"
                className="hidden"
                id="backdrop-select"
                onChange={(e) => setBackdropFile(e)}
              />
            </div>
            <div className="flex-grow w-1/2">
              <label
                htmlFor="backdrop-select"
                className=" text-white flex-col w-full h-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(70,70,70,.3)",
                }}
              >
                <div
                  className="px-12 py-8"
                  style={{
                    border: "1px dashed rgba(170,170,170,.4)",
                    borderBottomRightRadius: "16px",
                  }}
                >
                  Drop Here
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="control-wrap text-white flex-row flex justify-end items-center mr-8 mb-4">
          <button
            onClick={(e) => props.toggleMenu(false)}
            className="font-extrabold my-3 py-3 px-4 mx-3 opacity-50"
            style={{
              color: `${colors.textFaded}`,
            }}
          >
            cancel
          </button>
          <button
            onClick={(e) => sendBackdrop()}
            disabled={file == null ? true : false}
            className="font-extrabold px-8 py-2"
            style={{
              backgroundColor: `${colors.success}`,
              borderRadius: "26px",
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

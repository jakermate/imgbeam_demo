import React, { useState } from "react"
import colors from "../../../theme/colors"
import avatar_default from "./avatar.png"
import Loader from "react-spinners/RingLoader"
import styled from "styled-components"
export default function AvatarSelect(props) {
  const [file, setFile] = useState(null)
  const [url, setURL] = useState("")
  const [processing, setProcessing] = useState(false)

  function setAvatarFile(e) {
    let newFile = e.target.files[0]
    console.log(newFile)
    setFile(newFile)
    let reader = new FileReader()
    reader.readAsDataURL(newFile)
    reader.onload = function (file) {
      setURL(file.target.result)
    }
  }
  async function updateAvatar(e) {
    setProcessing(true)
    let formdata = new FormData()
    formdata.append("avatar", file)
    try {
      let res = await fetch("/api/account/settings/avatar/update", {
        method: "POST",
        credentials: "include",
        body: formdata,
      })
      if (res.status === 200) {
        props.pulldata()
        props.toggleMenu(false)
      }
    } catch (err) {
      setProcessing(false)
      console.log(err)
    }
  }
//   function applyFilter(){
//     import('jimp').then((jimp)=>{
//         console.log(file)
//        let j = jimp.default
//        j.read(url).then(v =>{
//            console.log('loaded')
//             v.grayscale()
//        })
//     })
//   }
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
            minWidth: "260px",
            minHeight: "160px",
            backgroundColor: `${colors.backgroundMedium}`,
          }}
        >
          <Loader color={"white"}></Loader>
        </div>
      </div>
    )
  } else
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
            <div>Choose Avatar</div>
          </div>
          <div
            className="mx-8"
            style={{
              borderRadius: "26px",
              //   boxShadow: " 2px 2px 8px rgba(0,0,0,.3)",
            }}
          >
            <div id="avatar-preview">
              <div
                className="mt-4 overflow-hidden relative flex flex-col items-center justify-center"
                style={{
                  width: "360px",
                  height: "200px",

                  borderTopLeftRadius: "26px",
                  borderTopRightRadius: "26px",
                }}
              >
                <div
                  className="circle absolute overflow-hidden"
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "100%",
                    zIndex: 9,
                    border: "4px solid rgba(255,255,255,.5)",
                  }}
                >
                  {/* inner image */}
                  <img
                    src={url === "" ? props.avatar || avatar_default : url}
                    alt=""
                    style={{
                      height: "100%",
                      // width: 'auto',
                      objectFit: "cover",
                      filter: `${url === "" ? "grayscale(1)" : "grayscale(0)"}`,
                    }}
                  />
                </div>

                {/* out image  */}
                <img
                  src={url === "" ? props.avatar || avatar_default : url}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    boxShadow: "2px 2px 5px rgba(0,0,0,.4)",
                    objectFit: "contain",
                    opacity: .2,
                    filter: `${url === "" ? "grayscale(1)" : "grayscale(0)"}`,
                  }}
                />
              </div>
            </div>
            <div
              className="flex flex-row mt-5 font-bold text-sm overflow-hidden justify-between"
              style={{
                minHeight: "120px",
                borderRadius: "26px",
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
                  onChange={(e) => setAvatarFile(e)}
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
                      borderRadius: "16px",
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
            <Confirm
              onClick={(e) => updateAvatar()}
              disabled={file == null ? true : false}
              className="font-extrabold px-8 py-2"
              style={{
                borderRadius: "26px",
              }}
            >
              Confirm
            </Confirm>
          </div>
        </div>
      </div>
    )
}
const Confirm = styled.button`
  background: ${(props) => (props.disabled ? "#69696966" : colors.success)};
  color: ${(props) => (props.disabled ? "#030101" : "white")};
`

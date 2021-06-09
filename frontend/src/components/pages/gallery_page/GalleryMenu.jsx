import React from "react"
import styled from "styled-components"
export default function GalleryMenu(props) {
  let prepend = process.env.MODE == "production" ? "" : "http://localhost:8888"
  function requestArchive(props) {
    console.log("requesting zip for " + props.gallery_id)
    let url = `/api/beam/${props.gallery_id}/zip`
    try {
      let res = fetch(url)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <MenuEl
      show={props.show}
      className="relative text-sm text-black "
    >
      <div onClick={e=>props.close(false)} className="click-overlay  fixed top-0 h-screen w-screen left-0 right-0 " style={{
        zIndex: 1
      }}></div>
      <ul className="whitespace-no-wrap bg-white  relative z-10 text-left font-bold" style={{
        borderRadius: '12px'
      }}>
        {props.gallery.singleton ? (
          <a href={`${prepend}/api/beam/${props.gallery_id}/download`} download >
            <li className="py-3 mr-3 px-3">
              <i className="fas fa-file-archive mr-3 opacity-25 w-4 ml-2"></i>{" "}
              Download
            </li>
          </a>
        ) : (
          <a href={`${prepend}/api/beam/${props.gallery_id}/zip`} download>
            <li className="py-3 mr-3 px-3">
              <i className="fas fa-file-archive mr-3 opacity-25 w-4 ml-2"></i>{" "}
              Download All
            </li>
          </a>
        )}

        <li className="" onClick={e => props.report(true)}>
        <button className="py-3 mr-3 px-3 w-full text-left">
          <i className="fas fa-flag mr-3 opacity-25 w-4 ml-2"></i> Report

        </button>
        </li>
      
      </ul>
    </MenuEl>
  )
}
const MenuEl = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  right:0;
  top: 100%;
  z-index: 999;
`

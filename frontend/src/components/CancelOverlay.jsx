import React from "react"

export default function CancelOverlay(props) {
  console.log(props)
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center"
      style={{
        zIndex: 999,
      }}
    >
      <div
        className="overlay absolute top-0 left-0 right-0 bottom-0"
        onClick={(e) => props.toggleOverlayOff()}
        style={{
          zIndex: 1,
          background: "rgba(0,0,0,.7)",
          // pointerEvents: "none",
        }}
      ></div>
      <div
        className="relative p-2 pb-4 text-white "
        style={{
          zIndex: 2,
          minWidth: "300px",
          background: "rgba(60,60,60,1)",
          borderRadius: "26px",
          boxShadow: "2px 2px 4px rgba(0,0,0,.3)",
        }}
      >
        <div className="px-4 font-bold py-6">Discard your new post?</div>
        <hr className="opacity-25 mx-6" />
        <div className="pt-6">
          <button
            className="mx-3  py-2 text-sm font-extrabold hover:opacity-75  w-32 focus:outline-none"
            onClick={(e) => props.toggleOverlayOff()}
            style={{
              color: "#2ecc71",
              borderRadius: '26px',
              height: '50px',
              background: 'rgba(255,255,255,.2)'
            }}
          >
            finish post
          </button>
          <button
            className="mx-3 font-extrabold py-2 hover:opacity-75 w-32 focus:outline-none"
            onClick={(e) => props.goback()}
            style={{
              background: "#e74c3c",   
              borderRadius: "26px",
              height: '50px',
              boxShadow: "2px 2px 4px rgba(0,0,0,.3)",
            }}
          >
            discard
          </button>
        </div>
      </div>
    </div>
  )
}

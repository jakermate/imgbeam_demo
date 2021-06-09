import React from "react"

export default function SignUpButton(props) {
  return (
    <a
      href={`/signup${props.redirect}`}
      tabIndex={3}
      className="px-4 py-1 mx-2 border-box text-sm font-extrabold  border-transparent hover:opacity-75 flex flex-col items-center justify-center"
      style={{
        // background: "rgb(74, 212, 147)",
        width: "120px",
      }}
    >
      <div>Sign Up</div>
    </a>
  )
}

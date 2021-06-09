import React from "react"
import colors from "../theme/colors"
export default function SignInButton(props) {
  return (
    <div className="" style={{}}>
      <a
        href="/login"
        className="px-3 w-full text-center py-1 text-sm inline-flex justify-center items-center flex-row"
        style={{
          backgroundColor: `${colors.success}`,
          color: `white`,
          borderRadius: '8px'
        }}
      >
        {/* <div>
          <i className="fas fa-sign-in-alt mr-4"></i>
        </div> */}
        <div className="font-bold px-8">Sign In</div>
      </a>
    </div>
  )
}

import React from "react"
import logo from "./logo.svg"
import "./App.css"
import imgbeam from "./imgbeam.png"
import "../src/css/main.css"
import Form from "./Form"
function App() {
  return (
    <div
      className="App text-white flex flex-col h-screen justify-center"
    >
      <div
        id="login-content"
        className="max-w-3xl mx-auto py-8"
        style={{
          width: "330px",
          borderRadius: '3px'

        }}
      >
        <div className="text-center flex items-center justify-center mb-4">
          <a href="//imgbeam.com">
            <img
              src={imgbeam}
              alt=""
              style={{
                height: "30px",
              }}
            />
          </a>
        </div>
        <div id="subtitle" className="mb-4 text-xs">
          sign in
        </div>
        <Form></Form>
      </div>

      <div
        id="login-content"
        className="max-w-3xl mx-auto py-3 mt-3"
        style={{
          width: "330px",
          background: "#373737",
          borderRadius: '3px'

        }}
      >
        <div
          class="flex flex-col justify-center items-center"
          style={{
            background: "#373737",
            borderRadius: '3px'
          }}
        >
          <div class="text-xs text-white">
            Don't have an account?
          </div>
          <a href="/signup" class=" font-bold mt-2 mb-2 text-xs" style={{
            color: "#3498db"
          }}>
            Register
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 mb-2 mr-4">
        <ul className="flex flex-row">
          <li className="mx-1 px-1">
            <a href="/termsofuse">terms of use</a>
          </li>
          <li className="mx-1 px-1">
            <a href="/privacypolicy">privacy</a>
          </li>
          <li className="mx-1 px-1">
            <a href="/about">about</a>
          </li>
          <li className="mx-1 px-1">
            <a href="/support">support</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default App

import React, { useEffect, useState } from "react"
import styled from 'styled-components'
import { validate } from "uuid"
export default function Form() {
  const [redirect, setRedirect] = useState('')
  const [valid, setValid] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  useEffect(()=>{
    let urlparams = new URLSearchParams(window.location.search)

    if(urlparams.has('redirect') && urlparams.get('redirect') !== '/'){
      setRedirect('?redirect='+urlparams.get('redirect'))
    }
    document.getElementById('login-input').focus()
  },[])
  useEffect(()=>{
    console.log(redirect)
  },[redirect])
  useEffect(()=>{
    if(password.length > 6 && username.length > 0){
      setValid(true)
      return
    }
    setValid(false)
  }, [password, username])
  return (
    <div
      id="form-container"
      class="flex container mx-auto max-w-2xl flex-col justify-center align-center text-black"
      style={{
        
      }}
    >
      <form
        action={`/login${redirect}`}
        // onSubmit={e=>requestLogin(e)}
        method="POST"
        class="flex flex-col max-w-2xl mx-auto"
      >
        <div
          id="login-form-panel"
          class=" flex flex-col mt-4"
          style={{
            // background: "#eee",
            width: '300px'
          }}
        >
          <Input
            id="login-input"
            className=" border-gray-300 outline-none focus:outline-none  px-4 py-1 mb-2"
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
            tabIndex={1}
            name="username"
            placeholder="username or email"
          />
          <Input
            className=" border-gray-300 outline-none focus:outline-none  px-4 py-1 mb-2"
            onChange={e => setPassword(e.target.value)}
            value={password}
            tabIndex={2}
            type="password"
            name="password"
            placeholder="password"
          />
        </div>
        <div id="login-control-sub-panel" className="mt-4">
          <button
            disabled={!valid}
            className="px-4 w-full text-sm font-bold hover:opacity-50  mb-8 py-1 text-white"
            type="submit"
            tabIndex={3}
            style={{
              opacity: `${valid ? 1 : .2}`,
              borderRadius: '3px',
              background: '#3498db',
            }}
          >
            Login
          </button>
          <div id="forgot-password">
            <a href="/password/forgot" className="text-xs" style={{
              color: "#3498db"
            }}>Forgot password?</a>
          </div>
        </div>
      </form>
    </div>
  )
}
const Input = styled.input`
  border: 2px solid rgba(0,0,0,0);
  font-size: 14px;
  color: white;
  background: rgba(255,255,255,.1);
  border-radius: 3px;
  :hover{
    opacity: .8;
  }
  :focus{
    border-color: #3498db;
  }
  ::active,:focus{
    outline: none;
  }
`
import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import imgbeam from "./imgbeam.png"
export default function Form() {
  // all validation should happen server side

  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [usernameValid, setUsernameValid] = useState(false)
  useEffect(() => {
    check_username()
  }, [username])
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [emailValid, setEmailValid] = useState(false)
  useEffect(() => {
    check_email()
  }, [email])
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [passwordsValid, setPasswordsValid] = useState(false)
  const [passwordsError, setPasswordsError] = useState("")
  useEffect(() => {
    checkPassword()
  }, [password, password2])
  const check_username = function () {
    // console.log("checking")
    fetch(`/checkusername?username=${username}`, {
      mode: "cors",
    })
      .then((res) => res.json())
      .then((json) => {
        setUsernameValid(json.valid)
        setUsernameError(json.message)
      })
  }
  function check_email() {
    fetch(`/checkemail?email=${email}`, {
      mode: "cors",
    })
      .then((res) => res.json())
      .then((json) => {
        setEmailValid(json.valid)
        setEmailError(json.message)
      })
  }
  function checkPassword() {
    fetch(`/passwordcheck?p1=${password}&p2=${password2}`, {
      mode: "cors",
    }).then((res) =>
      res.json().then((json) => {
        // console.log(json)
        setPasswordsValid(json.valid)
        setPasswordsError(json.message)
      })
    )
  }
  async function submit() {
    try {
      let data = {
        username: username,
        email: email,
        password: password,
        password2: password2,
      }
      let res = await fetch("/signup", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (res.status == 409) {
        console.log("Invalid Credentials")
        return
      }
      if (res.status == 200) {
        console.log("Success, redirecting.")
        // redirect to login
        window.location.replace(`/signupsuccess?email=${email}`)
      }
      if (res.status == 500) {
        console.log("Server error.")
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="mx-auto text-white">
      <div
        id="signup-form-panel"
        style={{
          width: "350px",
          borderRadius: "3px",
          background: "#373737",
        }}
        className="mt-2 bg-white max-w-lg  px-8 py-8"
      >
        <div
          id="logo-container"
          class="container mx-auto items-center flex justify-center"
        >
          {/* <h1 class="text-3xl text-center mb-3 font-bold">
       imgbeam
      </h1> */}
          <img
            src={imgbeam}
            alt=""
            className="block mb-3"
            style={{
              width: "220px",
            }}
          />
        </div>
        <div id="register-label" className="text-xs font-bold mb-6">
          register with email
        </div>
        <form
          action="/signup"
          method="POST"
          className="flex relative flex-col max-w-2xl mx-auto text-sm mx-6"
        >
          <div className="w-full relative">
            <label
              className="hidden mb-1 font-bold text-xs text-gray-700"
              htmlFor="username"
            >
              Username
            </label>
            <UsernameInput
              valid={usernameValid}
              className="border-2 w-full border-gray-300  px-4 py-1 mb-1 bg-gray-300 placeholder-gray-600 focus:bg-gray-100 focus:outline-none "
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              value={username}
              placeholder="username"
              required
              style={{
                borderRadius: "3px",
              }}
            />
            <div className="absolute right-0 top-0 w-full">
              {username.length > 0 && !usernameValid && (
                <Error message={usernameError}></Error>
              )}
            </div>
          </div>
          <div className="w-full relative">
            <label
              className="hidden mb-1 font-bold text-xs text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="border-2 w-full border-gray-300  px-4 py-1 mb-1 bg-gray-300 placeholder-gray-600 focus:bg-gray-100 focus:outline-none "
              type="text"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              value={email}
              required
              style={{
                borderRadius: "3px",
              }}
            />
            <div className="absolute right-0 top-0 w-full">
              {email.length > 0 && !emailValid && (
                <Error message={emailError}></Error>
              )}
            </div>
          </div>
          <div className="w-full relative">
            <label
              className="hidden mb-1 font-bold text-xs text-gray-700"
              htmlFor="password"
            >
              Password
            </label>

            <input
              className="border-2 w-full border-gray-300  px-4 py-1 mb-1 bg-gray-300 placeholder-gray-600 focus:bg-gray-100 focus:outline-none "
              type="password"
              name="password"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "3px",
              }}
            />
            <div className="absolute right-0 top-0 w-full">
              {password.length > 0 &&
                !passwordsValid &&
                passwordsError !== "Passwords do not match." && (
                  <Error message={passwordsError}></Error>
                )}
            </div>
          </div>
          <div className="w-full relative">
            <label
              className="hidden mb-1 font-bold text-xs text-gray-700"
              htmlFor="retype-password"
            >
              Confirm Password
            </label>

            <input
              className="border-2 w-full border-gray-300  px-4 py-1  bg-gray-300 placeholder-gray-600 focus:bg-gray-100 focus:outline-none "
              type="password"
              value={password2}
              name="retype-password"
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="retype password"
              required
              style={{
                borderRadius: "3px",
              }}
            />
            <div className="absolute right-0 top-0 w-full">
              {password2.length > 0 &&
                !passwordsValid &&
                passwordsError === "Passwords do not match." && (
                  <Error message={passwordsError}></Error>
                )}
            </div>
          </div>
        </form>
        <Button
          className="px-4 font-bold mt-4 mb-2 py-1 w-full text-white text-sm"
          type="submit"
          onSubmit={(e) => submit()}
          onClick={(e) => submit()}
          disabled={!usernameValid || !emailValid || !passwordsValid}
          style={{
            borderRadius: "3px",
          }}
        >
          Let me in!
        </Button>
        <div id="warnings" className="text-xs mt-6 mx-6">
          By making an account, I agree to the{" "}
          <a
            href="/termsofuse"
            className="font-bold"
            style={{
              color: "#3498db",
            }}
          >
            terms and conditions
          </a>{" "}
          set for by <span className="font-bold">imgbeam</span>
        </div>
      </div>

      <div
        id="or-sign-in"
        className="w-full mb-6 flex flex-col justify-center items-center"
      >
        <div className="text-xs mb-2 mt-4">already have a imgbeam account?</div>
        <a
          href="/login"
          className=" font-bold text-sm"
          style={{
            color: "#3498db",
          }}
        >
          Log In
        </a>
      </div>
    </div>
  )
}

// error tag
function Error(props) {
  return (
    <ErrorContainer
      className="absolute font-bold px-4 py-1 bg-red-400 text-white"
      style={{
        left: "100%",
        whiteSpace: "nowrap",
      }}
    >
      {props.message}
    </ErrorContainer>
  )
}

const UsernameInput = styled.input`
  /* border-color: ${(props) => (props.valid ? "green" : "red")}; */
  &:focus {
    border-color: rgba(99, 179, 237);
  }
`
const fadein = keyframes`
  from{
    opacity: 0;
    transform: scale(1.6) translateX(0px);
  }
  to{
    opacity: 1;
    transform: scale(1) translateX(40px);
  }
`
const ErrorContainer = styled.div`
  animation: ${fadein} 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
`
const Button = styled.button`
  background: #3498db;
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
`

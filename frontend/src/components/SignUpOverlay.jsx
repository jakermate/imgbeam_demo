import React from "react"
import { Link } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { connect } from "react-redux"
import spaceship from "../spaceship.png"
import { toggleSignUpOverlay } from "../state/store/actions/index"
function SignUpOverlay(props) {
  return (
    <div
      className="fixed px-6 pt-24 top-0 left-0 right-0 bottom-0 text-sm flex flex-col items-center"
      style={{
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => props.toggleSignUpOverlay()}
        className="overlay fixed top-0 left-0 bottom-0 right-0 w-screen h-screen z-10"
        style={
          {
            // background: 'rgba(0,0,0,.6)'
          }
        }
      ></div>
      <Panel className="z-20 relative flex flex-col" style={{}}>
        <header className="w-full header">
          <div>
            {/* <img
              src={imgbeam_logo}
              alt=""
              srcset=""
              style={{
                height: "48px",
              }}
            /> */}
            <div className="mt-2 font-extrabold title">
              Beam me up!
            </div>
            <div className="description mt-2 leading-5">
              Sign in or sign up to vote or favorite posts.
            </div>
          </div>
          
          <div className="mt-4">
          <a
              className="inline-block sign-up-link font-bold"
              href={`/signup?redirect=${window.location.pathname}`}
            >
              Sign Up
            </a>
            <a
              className="inline-block font-bold ml-6"
              href={`/login?redirect=${window.location.pathname}`}
            >
              Sign In
            </a>
          </div>
        </header>
      </Panel>
    </div>
  )
}
const enter = keyframes`
  from{
    opacity:0;
    transform: translateY(60px);
  }
  to{
    opacity:1;
    transform: translateY(0px);
  }
`
const Panel = styled.div`
  opacity: 0;
  animation: ${enter} 0.2s linear forwards;
  border-radius: 8px;
  background: ${(props) =>
    `linear-gradient(to top right, ${props.theme.success}, ${props.theme.secondary})`};
  text-align: left;
  width: 100%;
  margin: 64px 32px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.6);
  color: white;

  overflow: hidden;
  .warning {
    border: ${(props) => `2px solid ${props.theme.warning}`};
    color: ${(props) => props.theme.warning};
    border-radius: 8px;
    padding: 3px 8px;
  }
  .sign-up-link{
    border-radius: 8px;
    box-shadow: 4px 4px 6px rgba(0,0,0,.6);
    background: ${props => `linear-gradient(to top right, ${props.theme.tertiary}, ${props.theme.success})`};
    padding: 10px 16px;
  }
  header {
    padding: 32px 50% 32px 48px;
    background: url(${spaceship});
    background-position: 80% -200%;
    background-size: 30%;
    background-repeat: no-repeat;
    line-height: 1;
    /* background-color: ${(props) => props.theme.background_4}; */
    .title{
    font-size: 22px;

    }
  }
  @media (min-width: 800px) {
    width: 520px;
    margin: 64px auto 0 auto;
  }
`
function mapStateToProps(state) {
  return {
    signUpOverlay: state.app_state_reducer,
  }
}
const mapDispatchToProps = {
  toggleSignUpOverlay,
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUpOverlay)

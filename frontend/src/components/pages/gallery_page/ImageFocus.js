import React, { useEffect } from "react"
import { toast } from "react-toastify"
import styled, {keyframes} from "styled-components"
import {toggleFocusView} from '../../../state/store/actions/index'
import {connect} from 'react-redux'

let prepend = process.env.MODE == "production" ? "" : "http://localhost:8888"
function ImageFocus(props) {
  console.log(props)
  useEffect(() => {
    document.addEventListener("keydown", close)
    document.body.classList.add("noscroll")
   
    return () => {
      document.body.classList.remove("noscroll")
      document.removeEventListener("keydown", close)
    }
  }, [])
  function close(e) {
    if (e.keyCode === 27) {
      props.toggleFocusView()
    }
  }
  function copyLink(e) {
    e.preventDefault()
    let url = props.focusPath
    let node = document.createElement("input")
    document.body.appendChild(node)
    node.value = url
    node.select()
    document.execCommand("copy")
    toast("Link copied to clipboard.", {
      position: "bottom-right",
    })
    document.body.removeChild(node)
  }
  return (
    <Root
      className="fixed top-0 left-0 right-0 bottom-0"
      style={{
        zIndex: 2000,
      }}
    >
      <div
        id="overlay-bg"
        className="overlay-bg absolute top-0 left-0 right-0 bottom-0 "
        onClick={(e) => props.toggleFocusView()}
        style={{
          zIndex: 1,
        }}
      ></div>
      <Content
        id="overlay-content"
        className="overlay absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center p-16"
      >
        <div
          className="image-container mx-24 relative  h-full flex flex-col justify-center items-center"
          style={{
            zIndex: 2,
          }}
        >
          <div
            id="focus-click-overlay"
            className="fixed top-0 left-0 right-0 w-screen h-screen overlay z-10"
            onClick={(e) => props.toggleFocusView()}
            style={{
              opacity: 0.8,
              cursor: "pointer",
            }}
          ></div>
          <div
            className="my-32 relative z-20 "
            style={{
              maxHeight: '100%'
            }}
          >
           
              <img
                src={props.focusPath}
                alt=""
                onClick={(e) => props.toggleFocusView()}
                className="object-contain block w-full h-full"
                style={{
                  cursor: "zoom-out",
                  objectFit: 'contain',
                  maxHeight: '100%',
                  maxWidth: '100%'
                }}
              />

            <div className="focus-action-wrapper pt-4 flex flex-row mx-auto justify-center">
              <LinkButton
                href={`${props.focusPath}`}
                title="Direct Link"
                className="mx-4 block"
              >
                <div
                  className="h-full flex flex-row items-center justify-center px-4 text-sm font-bold"
                  style={{
                  }}
                >
                  View Full Res
                </div>
              </LinkButton>
              <LinkButton
                href=""
                className="block"
                id="image-focus-copy-direct-link"
                onClick={(e) => copyLink(e)}
              >
                <div
                  className="h-full flex flex-row items-center justify-center px-4 text-sm font-bold"
                  style={{
                  }}
                >
                  Copy Direct Link
                </div>
              </LinkButton>
              <LinkButton
                href={`${prepend}/api/beam/${props.focusGallery}/download`}
                className="mx-4 block"
                download
                title="Download"
              >
                <div>
                  <i className="fas fa-cloud-download-alt  mx-4"></i>
                </div>
              </LinkButton>
            </div>
          </div>
        </div>
      </Content>
    </Root>
  )
}
const enter = keyframes`
  from{
    opacity:0;
    transform: scale(.5)
  }
  to{
    opacity:1;
    transform: scale(1);
  }
`
const Root = styled.div`
  opacity: 0;
  transform: scale(.5);
  animation: ${enter} .1s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
  color: ${props => props.theme.text};
  .overlay-bg{
    background: ${props => props.theme.background_1};
  }
`
const LinkButton = styled.a`
  margin: 0 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${props => props.theme.background_3};
  
  :hover {
    opacity: .4;
  }
`
const Content = styled.div`
`
const mapDispatchToProps = {
  toggleFocusView
}
function mapStateToProps(state){
  return{
    focusPath: state.app_state_reducer.focusPath,
    focusGallery: state.app_state_reducer.focusGallery

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ImageFocus)
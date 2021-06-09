import React, { useEffect } from "react"
import { toast } from "react-toastify"
import SocialLink from "../../SocialLink"
import styled, {keyframes} from "styled-components"
export default function ShareComponent(props) {
  useEffect(() => {
    document.body.classList.add("noscroll")
    return () => {
      document.body.classList.remove("noscroll")
    }
  }, [])
  function copyLink(e) {
    e.preventDefault()
    let url = window.location.href
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
  function generateEmbedCode() {}
  function embedMarkup() {
    return <iframe src={`${window.location.href}`} frameborder="0"></iframe>
  }

  function facebook() {
    let url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
    window.open(url, "_blank")
  }
  function twitter() {
    let url = `https://twitter.com/share?text=${props.gallery.title}&url=${window.location.href}`
    window.open(url, "TwitterWindow", "width=600,height=900")
  }
  function reddit() {
    let url = `https://www.reddit.com/submit?url=${window.location.href}`
    window.open(url, "__blank")
  }
  console.log(props)
  return (
    <ShareView
      id="share-section"
      className="fixed flex flex-col items-center justify-center top-0 bottom-0 left-0 right-0"
      style={{
        zIndex: 1000,
      }}
    >
      <div
        className="overlay cursor-pointer fixed top-0 left-0 right-0 bottom-0 z-10"
        onClick={(e) => props.toggleShare(false)}
      ></div>
      <div className="overlay cursor-pointer pointer-events-none fixed top-0 left-0 right-0 bottom-0 z-0"></div>
      <Panel>
        <SocialLink
          action={twitter}
          background={"rgb(29, 161, 242)"}
          string={"twitter"}
          icon={"fa-twitter"}
        ></SocialLink>
        <SocialLink
          action={reddit}
          background={"#FF5700"}
          string={"reddit"}
          icon={"fa-reddit"}
        ></SocialLink>
        <SocialLink
          action={facebook}
          background={"#3b5998"}
          string={"facebook"}
          icon={"fa-facebook"}
        ></SocialLink>
      </Panel>
    </ShareView>
  )
}
const enter = keyframes`
  from {
    opacity:0;
  }
  to{
    opacity: 1;
  }
`
const ShareView = styled.div`
  opacity: 0;
  transition: all .2s linear;
  animation: ${enter} .2s linear forwards;
  .overlay {
    background: rgba(0, 0, 0, 0.6);
  }
`
const Panel = styled.div`
  background-color: ${(props) => props.theme.background_1};
  z-index: 99;
  position: relative;
  color: ${(props) => props.theme.text};
  border-radius: 8px;
`

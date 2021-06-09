import React, { useState, useEffect } from "react"
import colors from "../theme/colors"
import qr from "../imgbeam_btc_address.png"
import styled from "styled-components"
import { Link, useHistory, useLocation } from "react-router-dom"
import SignInButton from "./SignInButton"
import { connect } from "react-redux"
import throttle from 'lodash/throttle'
import { toggleCreatePanel, toggleSidebar, addFile, setFiles } from "../state/store/actions/index"
function Sidebar(props) {
  const location = useLocation()

  return (
    <SideBarElement
      sidebar={props.sidebar}
      className="fixed left-0 top-0 bottom-0 text-left "
      style={{
        width: "240px",
        // paddingTop: "56px",
        marginTop: '56px',
        zIndex: 997,
      }}
    >
    {/* <div className="panel"> */}
      <Section>
        <DropHere addFile={props.addFile}></DropHere>

        <LiHref
          active={location.pathname == "/create"}
          string={"New Post"}
          link={"/new"}
          icon={"fas fa-plus"}
        ></LiHref>
      </Section>
      <Hr />
      <Section>
        <Li
          active={location.pathname == "/uploads"}
          link={"/uploads"}
          string={"My Uploads"}
          icon={"fas fa-images"}
        ></Li>
      </Section>
      <Hr />
      <Section className>
        <Li
          active={location.pathname == "/"}
          link={"/"}
          string={"Home"}
          icon={"fas fa-home"}
        ></Li>
        {/* <Li
          active={location.pathname == "/new"}
          link={"/new"}
          string={"New"}
          icon={"fas fa-rss"}
        ></Li> */}

        {/* <Li
          active={location.pathname == "/picks"}
          link={"/picks"}
          string={"For You"}
          icon={"fas fa-user"}
        ></Li>
        <Li
          active={location.pathname == "/tags"}
          link={"/tags"}
          string={"Tags"}
          icon={"fas fa-tags"}
        ></Li> */}
      </Section>
      <Hr />

      {!props.signedIn && (
        <div>
          <Section>
            <SignInBox></SignInBox>
          </Section>
          <Hr />
        </div>
      )}

      <Section>
        <Li
          active={location.pathname == "/following"}
          link={"/following"}
          string={"Following"}
          icon={"fas fa-list"}
        ></Li>

        <Li
          active={location.pathname == "/favorites"}
          link={"/favorites"}
          string={"Favorites"}
          icon={"fas fa-heart"}
        ></Li>
        <Li
          active={location.pathname == "/history"}
          link={"/history"}
          string={"History"}
          icon={"fas fa-history"}
        ></Li>
      </Section>
      <Hr />
      <Section>
        <LogIn></LogIn>
      </Section>
      <Section>
        <Li
          active={location.pathname == "/settings"}
          link={"/settings"}
          string={"Settings"}
          icon={"fas fa-cog"}
        ></Li>
        <Li
          active={location.pathname == "/support"}
          link={"/support"}
          string={"Help"}
          icon={"fas fa-question-circle"}
        ></Li>
        <Li
          active={location.pathname == "/feedback"}
          link={"/feedback"}
          string={"Feedback"}
          icon={"fas fa-comments"}
        ></Li>
        <Li
          active={location.pathname == "/donate"}
          link={"/donate"}
          string={"Donate"}
          icon={"fas fa-dollar-sign"}
        ></Li>
      </Section>
      {props.signedIn && <Hr />}
      {props.signedIn && (
        <Section>
          <LiHref
            active={location.pathname == "/logout"}
            link={"/logout"}
            string={"Sign Out"}
            icon={"fas fa-sign-out-alt"}
          ></LiHref>
        </Section>
      )}
      <Hr />
      <Section>
        <Footer></Footer>
      </Section>
      {/* </div> */}
    </SideBarElement>
  )
}
function Section(props) {
  return <div className="my-2">{props.children}</div>
}
function Li(props) {
  return (
    <Link
      to={props.link}
      className={`flex list-item flex-row items-center outline-none focus:outline-none`}
      style={{
        minHeight: "42px",
      }}
    >
      <ItemContent active={props.active}>
        <div
          active={props.active}
          className="mr-3 ml-1 flex flex-col items-center justify-center"
          style={{
            minWidth: "40px",
            height: "24px",
          }}
        >
          <Icon
            active={props.active}
            className={`${props.icon} icon`}
            style={{
              opacity: `${props.active ? 1 : 0.5}`,
            }}
          ></Icon>
        </div>
        <div className="text-sm font-bold item-string">{props.string}</div>
      </ItemContent>
    </Link>
  )
}
function LiHref(props) {
  return (
    <a
      href={props.link}
      className={`flex list-item flex-row items-center outline-none focus:outline-none  ${
        props.active ? "bg-white bg-opacity-25" : ""
      }`}
      style={{
        minHeight: "42px",
      }}
    >
      <ItemContent active={props.active}>
        <div
          active={props.active}
          className="mr-3 ml-1 flex flex-col items-center justify-center"
          style={{
            minWidth: "40px",
            height: "24px",
          }}
        >
          <i
            className={`${props.icon} icon`}
            style={{
              opacity: `${props.active ? 1 : 0.5}`,
            }}
          ></i>
        </div>
        <div className="text-sm font-bold item-string">{props.string}</div>
      </ItemContent>
    </a>
  )
}
function LiButton(props) {
  return (
    <button
      onClick={(e) => props.action()}
      className={`flex list-item w-full flex-row items-center outline-none focus:outline-none  ${
        props.active ? "bg-white bg-opacity-25" : ""
      }`}
      style={{
        minHeight: "42px",
      }}
    >
      <ItemContent active={props.active}>
        <div
          active={props.active}
          className="mr-3 ml-1 flex flex-col items-center justify-center"
          style={{
            minWidth: "40px",
            height: "24px",
          }}
        >
          <i
            className={`${props.icon} icon`}
            style={{
              opacity: `${props.active ? 1 : 0.5}`,
            }}
          ></i>
        </div>
        <div className="text-sm font-bold item-string">{props.string}</div>
      </ItemContent>
    </button>
  )
}
const Icon = styled.i`
  color: ${(props) => (props.active ? props.theme.success : props.theme.icons)};
`
const ItemContent = styled.div`
  color: ${(props) => (props.active ? props.theme.success : props.theme.icons)};
  .item-string {
    transition: all 0.1s linear;
  }
  display: flex;
  flex-direction: row;
  padding: 6px 4px;
  border-radius: 8px;
  flex-grow: 1;
  align-items: center;
  justify-content: start;
  margin: 0 8px;
  .icon {
    transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    transform: ${(props) => (props.active ? "scale(1.2)" : "none")};
  }
  :hover {
    background: ${(props) => props.theme.background_3};
    .icon {
      color: ${(props) => props.theme.success};
    }
    .item-string {
      transform: translateX(6px);
    }
  }
`
export function Hr(props) {
  return (
    <HrEl
      className="mx-4"
      style={
        {
          // opacity: 0.1,
        }
      }
    />
  )
}
const HrEl = styled.hr`
  border-color: ${(props) => props.theme.border};
`
function LogIn(props) {
  return <div></div>
}
function DropHere(props) {
  const history = useHistory()
  function ignore(e){
    e.preventDefault()
    e.stopPropagation()
  }
  useEffect(() => {
    window.addEventListener('drop',ignore)
    window.addEventListener('dragover',ignore)
    return () => {
      window.removeEventListener('drop', ignore)
      window.removeEventListener('dragover', ignore)

    }
  }, [])
  let dragoverThrottle = throttle(dragOver, 50)
  function dragOver(e){
    e.preventDefault()
    e.stopPropagation()
  }
  function onDrop(e){
    e.preventDefault()
    e.stopPropagation()
    if(isDropValid(e)){
      // add to global state and redirec to newpost
      console.log('valid')
      addFileToState(e.dataTransfer.files[0])
      history.push('/new')
    }
  }
  function isDropValid(e){
    if(e.dataTransfer.items[0].kind == 'file' && e.dataTransfer.items[0].type.includes('image' || 'video')){
      console.log(e.dataTransfer.items[0])
      // if(e.dataTransfer.items[0])
      return true
    }
    return false
  }
  function addFileToState(newFile) {
    let reader = new FileReader()
    reader.onload = function (e) {
      newFile.typeString = returnType(newFile.type)
      newFile.url = e.target.result
      props.addFile(newFile)
    }
    reader.readAsDataURL(newFile)
  }
  function returnType(typeString){
    if(typeString.includes("video")){
      return "video"
    }
    return "image"
  }
  return (
    <DropRoot
      onDragOver={e => dragoverThrottle(e)}
      onDrop={e => onDrop(e)}
      className="flex flex-col justify-center items-start"
      style={{
        minHeight: "120px",
      }}
    >
      <BorderBox className="ml-8">
        <div className="mx-8 my-6 flex flex-col items-center ">
          <div>
            <i className="fab fa-dropbox fa-lg opacity-50 mb-3 icon"></i>
          </div>
          <div className="text-xs opacity-50">Drop Media Here</div>
        </div>
      </BorderBox>
    </DropRoot>
  )
}
const DropRoot = styled.div`
  margin: 12px 0;
  transition: all 0.2s linear;
  /* background-color: ${(props) => props.theme.background_1}; */
`
const BorderBox = styled.div`
  transition: all 0.2s linear;
  border: ${(props) => `2px dashed ${props.theme.border}`};
  border-radius: 8px;
  cursor: pointer;
  .icon {
    transition: all 0.2s linear;
  }
  :hover {
    border-color: ${(props) => props.theme.secondary};
    .icon {
      transform: scale(1.2);
      color: ${(props) => props.theme.secondary};
    }
  }
`
function Footer(props) {
  return (
    <div className="w-full">
      <div
        className={` text-xs flex flex-col justify-center items-start z-50  w-full`}
        style={{}}
      >
        <div id="home-copy" className="text-xs opacity-50">
          &copy; 2021 Imgbeam
        </div>
      </div>
    </div>
  )
}
function SignInBox(props) {
  return (
    <div className="px-6 py-4">
      <div className="text-sm mb-2">Sign in to post, vote, and share.</div>
      <SignInButton></SignInButton>
    </div>
  )
}

// styles
const SideBarElement = styled.div`
  transition: all 0.2s linear;
  left: ${(props) => (props.sidebar ? 0 : "-225px")};
  overflow-y: hidden;
  overflow-x: visible;
  background-color: ${(props) => props.theme.background_2};
 .panel{
   border-radius: 8px;
   box-shadow: 4px 4px 8px rgba(0,0,0,.3);
   background: ${props => props.theme.background_3};
 }
  :hover {
    overflow-y: scroll;
  }
  ::-webkit-scrollbar {
    position: absolute;
  }
`

function mapStateToProps(state) {
  return {
    createPanel: state.app_state_reducer.createPanel,
    sidebar: state.app_state_reducer.sidebar,
    signedIn: state.app_state_reducer.signedIn,
  }
}
const mapDispatchToProps = {
  toggleCreatePanel,
  toggleSidebar,
  addFile,
  setFiles
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)

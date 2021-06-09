import React, { useEffect, useState } from "react"
import imgbeam from "../../imgbeam_text_white.png"
import Searchbar from "../Searchbar"
import Badge from '../Badge'
import { useHistory, useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import AccountMenu from "./accountmenu/AccountMenu"
import DropDownMenu from "./DropDownMenu"
import Avatar from "./Avatar"
import colors from "../../theme/colors"
import AppMenu from "./AppMenu"
import SignInButton from "../SignInButton"
import SignUpButton from "../SignUpButton"
import icon from '../../icon_full_res.png'
import { connect } from "react-redux"
import {
  toggleCreatePanel,
  toggleSidebar,
} from "../../state/store/actions/index"
import Tooltip from "../Tooltip"
function LoginSignin(props) {
  const routerLocation = useLocation()
  let location = routerLocation.pathname
  let redirect = "?redirect=" + window.location.pathname
  console.log(location)

  return (
    <div
      id="sign-in-sign-up-container"
      className=" flex flex-row items-center justify-end"
      style={{
        height: "50px",
      }}
    >
      <div>
        <SignInButton></SignInButton>
      </div>
      <div>
        <SignUpButton redirect={redirect}></SignUpButton>
      </div>
    </div>
  )
}

function AccountBar(props) {
  const history = useHistory()
  const [accountMenu, toggleAccountMenu] = useState(false)
  const [helper, toggleHelper] = useState(false)
  return (
    <div className="flex flex-row items-center justify-end">
      <div id="notifications-and-alerts" className="">
        <OptionButton
          disabled={props.createPanel}
          string={"New Post"}
          background
          icon={`fa-plus`}
          action={()=> history.push('/new')}
        ></OptionButton>
        <OptionButton
          string={"Messages"}
          icon={`fa-envelope`}
          // action={}
        ></OptionButton>
        <OptionButton
          string={"Notifications"}
          icon={`fa-bell`}
          // action={}
        >
          <Badge value={props.notifications.length} background={'red'}></Badge>
        </OptionButton>
      </div>
      <div id="avatar-container" className="relative">
        <Avatar
          notifications={props.notifications}
          toggleAccountMenu={toggleAccountMenu}
          account={props.account}
        ></Avatar>
        {accountMenu && (
          <AccountMenu
            toggleAccountMenu={toggleAccountMenu}
            account={props.account}
          ></AccountMenu>
        )}
      </div>
    </div>
  )
}

function OptionButton(props) {
  function showToolTip(e){
    e.currentTarget.querySelector('.tooltip').classList.add('tooltip-active')
  }
  function hideToolTip(e){
    e.currentTarget.querySelector('.tooltip').classList.remove('tooltip-active')

  }
  return (
    <OptionButtonRoot background={props.background} disabled={props.disabled} onMouseEnter={e => showToolTip(e)} onMouseLeave={e => hideToolTip(e)} onClick={e => props.action()}>
      <div>
        <i className={`fas ${props.icon}`}></i>
      </div>
      {props.children}
      <Tooltip string={props.string}></Tooltip>
    </OptionButtonRoot>
  )
}
const OptionButtonRoot = styled.button`
  transition: all 0.1s linear;
  margin-right: 12px;
  position: relative;
  width: 48px;
  height: 32px;
  background: ${props => props.background ? `linear-gradient(to top right, ${props.theme.success}, ${props.theme.tertiary})` : 'transparent'};
  border-radius: 8px;
  box-shadow: 0 2px 4px -2px rgba(0,0,0,.4);
  border: ${props => `1px solid ${props.theme.border}`};
  color: ${props => props.background ? 'white' : props.theme.icons};
  opacity: ${props => props.disabled ? .3 : 1};
  :hover {
    background-color: ${props => props.theme.background_3};
  }
`
// main export
function Navbar(props) {
  // dropdown control
  const [dropDown, toggleDropDown] = useState(false)
  useEffect(() => {
    if (dropDown) {
      window.addEventListener("keydown", dropdownKeys)
      return
    }
    window.removeEventListener("keydown", dropdownKeys)
  }, [dropDown])
  function dropdownKeys(e) {
    console.log("keys")
  }

  function menuButton(e) {
    props.toggleSidebar()
  }

  const brandLink = (
    <Link
      to="/"
      id="brand-image-link"
      className="hidden pr-3 ml-3 relative outline-none focus:outline-none py-1 sm:flex flex-row rounded-lg"
    >
      <div
        className="flex flex-row  logo relative items-center justify-center"
        style={{
          height: "24px",
          borderRadius: "26px",
        }}
      >
        <div className="mr-2">
          <img src={icon} alt="" srcset="" width="24" style={{

          }} />
        </div>
        <img
          src={imgbeam}
          style={{
            filter: `${props.theme === 'theme_light' ? 'invert()' : 'none' }`
          }}
          alt="imgbeam | share your world."
          className="h-6 mt-1"
        />
      </div>
      {props.appMenu && <AppMenu toggleAppMenu={props.toggleAppMenu}></AppMenu>}
    </Link>
  )

  return (
    <NavbarEl
      className=" px-6 flex  w-full flex-col items-center justify-center fixed"
      style={{
        zIndex: 999,
        top: "0px",
      }}
    >
      <div id="nav-content-wrap" className="w-full  relative mx-auto">
        <div
          id="nav-content-top"
          className="flex flex-row relative justify-between mx-auto"
         
        >
          <div
            className="flex brand-container flex-row py-1 items-center"
            
          >
            
            <BrandButton
              id="nav-apps-button"
              className="flex flex-row pr-2 items-center justify-center"
              style={{}}
            >
              <div>{brandLink}</div>
           
            </BrandButton>
          </div>

          <Searchbar></Searchbar>

          <div
            id="nav-or-signup"
            className="flex flex-row items-center cursor-pointer"
            style={{
              transition: "all .4s cubic-bezier(0.68, -0.6, 0.32, 1.6)",
              minWidth: "300px",
            }}
          >
            {props.checkedIn && (
              <div className="w-full" style={{}}>
              
                {props.signedIn ? (
                  <AccountBar
                    toggleCreatePanel={props.toggleCreatePanel}
                    createPanel={props.createPanel}
                    notifications={props.notifications}
                    account={props.account}
                  ></AccountBar>
                ) : (
                  <LoginSignin></LoginSignin>
                )}
              </div>
            )}
          </div>

          {/*  drop down menu from bottom of top navbar row */}
          {dropDown && <DropDownMenu></DropDownMenu>}
        </div>
      </div>
    </NavbarEl>
  )
}

const NavbarEl = styled.div`
  height: 64px;
  border-color: ${props => props.theme.border};
  border-bottom-width: 1px;
  transition: all .2s linear;
  background-color: ${props => props.theme.background_1};
  @media(min-width: 600px){
    min-width: 225px;
  }
`



const BrandButton = styled.button`
  /* background: ${colors.backgroundLightest}; */
  .logo {
    transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  }
  .icon {
    transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  }
  :hover {
    background: rgba(170, 170, 170, 0);
    .icon {
      transform: scale(0.8);
      filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
      /* text-shadow: 0 0 4px rgba(0,0,0,.4); */
    }
    .logo {
      transform: scale(1.1);
    }
  }
`
const press = keyframes`
  from{
    opacity: 0;
    transform: scale(.3);
  }
  to{

    opacity: 1;
    transform: scale(1);
  }
`
const ActionButton = styled.button`
  position: relative;
  transition: all .2s linear;
  width: 32px;
  height: 32px;
  color: ${props => props.theme.icons};
  border-radius: 8px;
  background-color: ${props => props.theme.background_2};
  :hover{
  background-color: ${props => props.theme.background_3};

  }
  .animate {
    :after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      opacity: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 100%;
      animation: ${press} 0.2s linear forwards;
    }
  }
`
function mapStateToProps(state) {
  return {
    createPanel: state.app_state_reducer.createPanel,
    sidebar: state.app_state_reducer.sidebar,
    account: state.account_reducer.account,
    signedIn: state.app_state_reducer.signedIn,
    checkedIn: state.app_state_reducer.checkedIn,
    theme: state.app_state_reducer.theme,
    notifications: state.app_state_reducer.notifications
  }
}
const mapDispatchToProps = {
  toggleCreatePanel,
  toggleSidebar,
}
export default connect(mapStateToProps, mapDispatchToProps)(Navbar)

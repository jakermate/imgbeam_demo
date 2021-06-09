import React, { useState, useEffect, useLayoutEffect } from "react"
import "./css/main.css"
import "animate.css"
import FocusView from "./components/pages/gallery_page/ImageFocus"
import Navbar from "./components/navbar/Navbar"
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"
import PageRouter from "./components/PageRouter"
import LoginOverlay from "./components/login_overlay/LoginOverlay"
import styled from "styled-components"
import { ThemeProvider } from "styled-components"
import theme from "./theme/theme"
import SettingsView from "./components/SettingsView"
import { connect } from "react-redux"
import GalleryPage from "./components/pages/gallery_page/GalleryPage"
import NewPostView from './components/new_post/NewPostView'
import SignUpOverlay from './components/SignUpOverlay'
import Donate from './components/pages/donate_page/DonateView'
import {
  signIn,
  toggleSidebar,
  signOut,
  setNotifications,
  setAccount,
  setCheckedIn,
  toggleTheme,
  toggleSignUpOverlay
} from "./state/store/actions/index"
import TransferIndicator from "./components/TransferIndicator"
import TransferToast from "./components/TransferToast"
import CompletedJobs from "./components/CompletedJobs"
import { throttle } from "lodash"
function App(props) {
  // session state
  const [loginOverlay, toggleLoginOverlay] = useState(false)
  const [appMenu, toggleAppMenu] = useState(false)
  const throttledResize = throttle(resizer, 100)
  function resizer(){
    console.log('resize')
    if(window.innerWidth < 600){
      props.toggleSidebar(false)
    }
  }
  // interval polling
  useEffect(() => {
    checkLoggedIn()
    getAccount()
    getNotifications()
    // window.addEventListener('resize', throttledResize)
    return function cleanup() {
      // window.removeEventListener('resize', throttledResize)
    }
  }, [])

 

  // poll server to update client state of loggedin
  async function checkLoggedIn() {
    try {
      let res = await fetch("/api/loggedin")
      if (res.status === 200) {
        props.signIn()
      }
      if (res.status === 401) {
        props.signOut()
      }
      props.setCheckedIn(true)
    } catch (err) {
      // console.log(err)
    }
  }
  async function getAccount() {
    try {
      let res = await fetch("/api/account", {
        credentials: "include",
      })
      let json = await res.json()
      console.log(json)
      console.log(props)
      props.setAccount(json)
    } catch (err) {
      console.log(err)
    }
  }
  // notifications
  async function getNotifications() {
    try {
      let res = await fetch(`/api/notifications/get/all`, {
        credentials: "include",
      })
      console.log('getting notifications')
      if (res.ok) {
        let json = await res.json()
        console.log(json)
        props.setNotifications(json)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // setup theme

  let themeObject = theme[props.theme]
  console.log(themeObject)
  return (
    <ThemeProvider theme={themeObject}>
      <AppElement
        scroll={loginOverlay}
        className="min-h-screen text-center relative"
        style={
          {
            // background: 'rgba(30,30,30,1)'
          }
        }
      >
        {/* overlays */}
        {loginOverlay && (
          <LoginOverlay close={toggleLoginOverlay}></LoginOverlay>
        )}
        <Router
          style={{
            position: "relative",
          }}
        >
          {/* Navbars */}
          <Navbar
            appMenu={appMenu}
            toggleAppMenu={toggleAppMenu}
            account={props.account}
          ></Navbar>

          {/* panels */}
          {/* <SideBar></SideBar> */}
          {/* <CreatePanel></CreatePanel> */}

          {/* Image Focus */}
          {props.focus && <FocusView></FocusView>}

          <Switch>
            <Route
              path="/settings"
              render={() => <SettingsView></SettingsView>}
            ></Route>
            {/* Router */}
            <Route
              exact
              path="/beam/:gallery_id"
              render={(routerProps) => (
                <GalleryPage
                  signedIn={props.signedIn}
                  toggleLoginOverlay={props.toggleLoginOverlay}
                  key={routerProps.match.params.gallery_id}
                  {...routerProps}
                ></GalleryPage>
              )}
            ></Route>
            <Route path="/new" render={()=><NewPostView></NewPostView>}></Route>
            <Route
              path="/donate"
              render={() => (
                <Donate
                ></Donate>
              )}
            ></Route>
            <Route
              path="/"
              render={() => (
                <PageRouter
                  account={props.account}
                  toggleLoginOverlay={toggleLoginOverlay}
                ></PageRouter>
              )}
            ></Route>
           
          </Switch>

          {/* file transfer indications */}
          <TransferIndicator></TransferIndicator>
          <TransferToast></TransferToast>
          <CompletedJobs></CompletedJobs>
          {/* Popups */}
          {
            props.signUpOverlay &&
          <SignUpOverlay></SignUpOverlay>

          }
        </Router>
      </AppElement>
    </ThemeProvider>
  )
}
const AppElement = styled.div`
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.background_1};
`

function mapStateToProps(state) {
  return {
    createMenu: state.app_state_reducer.createMenu,
    sidebar: state.app_state_reducer.sidebar,
    account: state.account_reducer.account,
    signedIn: state.app_state_reducer.signedIn,
    uploading: state.transfer_reducer.uploading,
    focus: state.app_state_reducer.focusView,
    focusPath: state.app_state_reducer.focusPath,
    theme: state.app_state_reducer.theme,
    signUpOverlay: state.app_state_reducer.signUpOverlay
  }
}
const mapDispatchToProps = {
  signIn,
  signOut,
  setAccount,
  setCheckedIn,
  toggleTheme,
  toggleSidebar,
  toggleSignUpOverlay,
  setNotifications
}
export default connect(mapStateToProps, mapDispatchToProps)(App)

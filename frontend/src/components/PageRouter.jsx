import React, { useState } from "react"
import {
  BrowserRouter as Router,
  Link,
  Route,
  useHistory,
} from "react-router-dom"
import Sidebar from './Sidebar'
import FollowingView from "./pages/following_page/FollowingPage"
import Gallery_page from "./pages/gallery_page/GalleryPage.jsx"
import user_page from "./pages/user_page/UserPage.jsx"
import gallery_edit from "./pages/gallery_edit/GalleryEdit.jsx"
import leaderboard_page from "./pages/leaderboard_page/LeaderBoardPage"
import NewPostOverlay from "./NewPostOverlay"
import HistoryView from "./pages/history_page/HistoryView"
import Account from "./pages/account_page/AccountPage"
import ResultsPage from "./pages/results_page/ResultsPage"
import TagResults from "./pages/tag_page/TagResults"
import UserResults from "./pages/users_page/UserResults"
import NotificationView from "./pages/notification_view/NotificationView"
import HomePage from "./pages/home_page/HomePage.jsx"
import UploadsView from "./pages/uploads_page/UploadsView"
import colors from "../theme/colors"
import styled from "styled-components"
import NewPage from "./pages/new_page/NewPage"
import { signIn, signOut } from "../state/store/actions/index"
import { connect } from "react-redux"
import FavoritesView from "./pages/favorites_page/FavoritesView"
function PageRouter(props) {
  const [globalGrid, setGlobalGrid] = useState([])
  // global state
  function setGlobalGalleries(galleriesFromHomePage) {
    setGlobalGrid(galleriesFromHomePage)
  }
  const [scrollPosition, setScrollPosition] = useState(0)
  return (
    <RouterStyle
      className="text-left  pt-16 relative"
      style={{
        zIndex: 997,
        marginLeft: `${props.sidebar ? "240px" : "15px"}`,
        minHeight: "calc(100vh)",
      }}
    >
      {/* home tiles page with sorting mechanism */}
      <Route
        path="/"
        exact
        render={(routerProps) => (
          <HomePage
            globalGalleries={globalGrid}
            scrollPosition={scrollPosition}
            setScrollPosition={setScrollPosition}
            setGlobalGalleries={setGlobalGalleries}
          ></HomePage>
        )}
      ></Route>
      {/* <Route
        path="/new"
        exact
        render={(routerProps) => <NewPage></NewPage>}
      ></Route> */}
      {/* user view routes with posts/comments sub views */}
      <Route path="/user/:username" component={user_page}></Route>
      <Route path="/u/user/:username" component={user_page}></Route>
      {/* gallery views */}
      <Route
        exact
        path="/edit/beam/:gallery_id"
        component={gallery_edit}
      ></Route>
      {/* <Route
        exact
        path="/beam/:gallery_id"
        render={(routerProps) => (
          <Gallery_page
            signedIn={props.signedIn}
            toggleLoginOverlay={props.toggleLoginOverlay}
            key={routerProps.match.params.gallery_id}
            {...routerProps}
          ></Gallery_page>
        )}
      ></Route> */}
      {/* settings */}
      <Route
        path="/account"
        render={(props) => <Account {...props}></Account>}
      ></Route>
      {/* My Uploads */}
      <Route
        path="/uploads"
        exact
        render={() => <UploadsView signedIn={props.signedIn}></UploadsView>}
      ></Route>
      {/* Leaderboards */}
      <Route path="/leadboard/:type" exact component={leaderboard_page}></Route>
      {/* Notifications */}
      <Route
        path="/notifications"
        exact
        render={() => (
          <NotificationView signedIn={props.signedIn}></NotificationView>
        )}
      ></Route>
      {/* Following */}
      <Route
        path="/following"
        exact
        render={() => <FollowingView signedIn={props.signedIn}></FollowingView>}
      ></Route>
      {/* Favorites */}
      <Route
        path="/favorites"
        exact
        render={() => <FavoritesView signedIn={props.signedIn}></FavoritesView>}
      ></Route>
      {/* History */}
      <Route
        path="/history"
        exact
        render={() => <HistoryView signedIn={props.signedIn}></HistoryView>}
      ></Route>
      {/* search results */}
      <Route
        path="/search/:searchString"
        
        render={(props) => (
          <ResultsPage {...props} key={Date.now()}></ResultsPage>
        )}
      ></Route>
       {/* <Route
        path="/search"
        
        render={(props) => (
          <SearchHome {...props} key={Date.now()}></SearchHome>
        )}
      ></Route> */}
      {/* Tag Results */}
      <Route
        path="/tag/:tagstring"
        exact
        render={(props) => (
          <TagResults key={Date.now()} {...props}></TagResults>
        )}
      ></Route>
      {/* User Search Results */}
      <Route
        path="/users/:userstring"
        render={(props) => <UserResults {...props}></UserResults>}
      ></Route>
      {/* new post */}
      <Route
        path="/create"
        exact
        render={() => {
          return <NewPostOverlay signedIn={props.signedIn}></NewPostOverlay>
        }}
      ></Route>
    </RouterStyle>
  )
}

function mapStateToProps(state) {
  return {
    createMenu: state.app_state_reducer.createMenu,
    sidebar: state.app_state_reducer.sidebar,
    account: state.account_reducer.account,
    signedIn: state.app_state_reducer.signedIn,
  }
}
const mapDispatchToProps = {
  signIn,
  signOut,
}

const RouterStyle = styled.div`
  transition: all .2s linear; 
  background-color: ${(props) => props.theme.background_2};
`
export default connect(mapStateToProps, mapDispatchToProps)(PageRouter)

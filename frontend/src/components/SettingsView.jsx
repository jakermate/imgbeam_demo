import React from "react"
import styled from "styled-components"
import { Switch, Route, Link } from "react-router-dom"
export default function SettingsView(props) {
  return (
    <Settings className="flex flex-row min-h-screen text-left relative">
      <SettingsSidebar></SettingsSidebar>
      <SettingsContent id="settings-content">
      <Switch>
        <Route to="/account"></Route>
        <Route to="/application"></Route>
        <Route to="/notifications"></Route>
        <Route to="/privacy"></Route>
      </Switch>
      </SettingsContent>
     
    </Settings>
  )
}
const SettingsContent = styled.div`
    margin-left: 240px;
    min-height: 100vh;
    flex-grow: 1;
    background: ${props => props.theme.background_1}
`
function ItemView(){
  return (
    <section></section>
  )
}
// settings sidebar
function SettingsSidebar() {
  return (
    <Sidebar id="settings-sidebar">
      <div
        id="settings-title"
        className="text-lg font-semibold"
        style={{
          paddingLeft: "24px",
          paddingBottom: "24px",
        }}
      >
        <h3>SETTINGS</h3>
      </div>
      <ul>
        <SidebarItem string={"Account"} link={"/settings"}></SidebarItem>
        <SidebarItem string={"Application"} link={"/settings/application"}></SidebarItem>
        <SidebarItem string={"Notifications"} link={"/settings/notifications"}></SidebarItem>
        <SidebarItem string={"Privacy"} link={"/settings/privacy"}></SidebarItem>
      </ul>
    </Sidebar>
  )
}
function SidebarItem(props) {
  return (
    <li>
      <Link to={props.link}>
        <Item>{props.string}</Item>
      </Link>
    </li>
  )
}
const Item = styled.div`
  display: block;
  width: 100%;
  padding: 12px 24px;
  cursor: pointer;
  :hover {
    background: ${(props) => props.theme.background_1};
  }
`
const Settings = styled.div`
  margin-top: ${(props) => props.theme.navbar_height};
`
const Sidebar = styled.div`
  padding: 24px 0;
  width: 240px;
  position: fixed;
  z-index: 9999;
  left: 0;
  background-color: ${(props) => props.theme.background_3};
  height: ${(props) => `calc(100vh - ${props.theme.navbar_height})`};
`

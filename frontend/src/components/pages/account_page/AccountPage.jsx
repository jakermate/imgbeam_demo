import React, { useEffect, useState } from "react"
import { Redirect, Route, Link } from "react-router-dom"
import EmailPassword from "./EmailPassword"
import AccountInfo from "./Settings"
import Notifications from "./Notifications"
import styled from "styled-components"
import AvatarSelect from "./AvatarSelect"
import DeactivateComponent from "./DeactivateComponent"
import {Hr} from '../../Sidebar'
export default function AccountPage(props) {
  useEffect(() => {
    getAccount()
    document.title = 'Your Account'
  }, [])
  const [account, setAccount] = useState(null)
  const [avatarSelect, toggleAvatarSelect] = useState(false)
  async function getAccount() {
    let url = `/api/account`
    try {
      let res = await fetch(url, {
        credentials: "include",
      })
      let json = await res.json()
      setAccount(json)
    } catch (err) {
      console.log(err)
    }
  }
  if (account == null) {
    return <div></div>
  } else
    return (
      <div className="text-left relative">
        {avatarSelect && <AvatarSelect toggleAvatarSelect={toggleAvatarSelect}></AvatarSelect>}
        <div className="container mx-auto max-w-5xl my-8 flex  px-6 lg:px-0 flex-row">
          <div
            id="account-left-nav"
            style={{
              width: "200px",
            }}
          >
            <ul className="text-sm">
              <Li active={props.location.pathname == "/account"}>
                <Link to={`/account`}>Your Account</Link>
              </Li>
              <Li active={props.location.pathname.includes("emailpassword")}>
                <Link to={`/account/emailpassword`}>Email and Password</Link>
              </Li>
              <Li active={props.location.pathname.includes("deactivate")}>
                <Link to={`/account/deactivate`}>Deactivate Account</Link>
              </Li>
            </ul>
          </div>
          <div id="account-right-settings" className="flex-1 ml-12">
            {/* router */}
            <Route
              exact
              path={`/account`}
              render={(props) => (
                <AccountInfo {...props} user={account} toggleAvatarSelect={toggleAvatarSelect}></AccountInfo>
              )}
            ></Route>
            
            <Route
              exact
              path={`/account/emailpassword`}
              render={(props) => (
                <EmailPassword {...props} user={account}></EmailPassword>
              )}
            ></Route>
            <Route
              esact
              path={`/account/deactivate`}
              render={() => (
                <DeactivateComponent
                  username={props.match.params.username}
                ></DeactivateComponent>
              )}
            ></Route>
          </div>
        </div>
      </div>
    )
}
const Li = styled.li`
  color: ${(props) => (props.active ? props.theme.success : props.theme.text)};
  margin-bottom: 0.6rem;
`

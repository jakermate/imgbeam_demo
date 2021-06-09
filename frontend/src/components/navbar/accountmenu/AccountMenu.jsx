import React, { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import ThemeToggle from "../../ThemeToggle"
import { Redirect, useHistory } from "react-router-dom"
import { connect } from "react-redux"
import { Hr } from "../../Sidebar"
import {toggleTheme} from '../../../state/store/actions/index'

function AccountMenu(props) {
  const history = useHistory()
  const [themeMenu, toggleThemeMenu] = useState(false)
  useEffect(() => {
    console.log(props)
  }, [])

  return (
    <AccountMenuEl
      id="account-menu"
      className="relative"
      style={{
        zIndex: 999,
      }}
    >
      <div
        className="overlay fixed top-0 left-0 w-screen h-screen"
        onClick={(e) => props.toggleAccountMenu(false)}
      ></div>
      <Panel className="relative shadow-md ">
        {themeMenu ? (
          <ThemeSelect toggleTheme={props.toggleTheme} theme={props.theme} toggleThemeMenu={toggleThemeMenu}></ThemeSelect>
        ) : (
          <ul className="flex flex-col items-start w-full">
            <Section>
              <AccountInfo account={props.account}></AccountInfo>
            </Section>
            <Section>
              <Hr></Hr>
            </Section>
            <Section>
              <Item
                action={() => history.push(`/user/${props.account.username}`)}
                icon={"fa-user"}
                string={"Profile"}
              ></Item>
              <Item icon={"fa-envelope"} string={"Messages"}></Item>
            
            </Section>
            <Section>
              <Hr></Hr>
            </Section>
            <Section>
              <Item
                icon={`${props.theme === "theme_light" ? "fa-sun" : "fa-moon"}`}
                string={"Theme"}
                action={() => toggleThemeMenu(true)}
              >
                <button className="flex flex-col items-center justify-center mr-2">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </Item>
              {/* <ThemeToggle></ThemeToggle> */}
              <Item
                action={() => history.push("/settings")}
                icon={"fa-cog"}
                string={"Settings"}
              ></Item>
            </Section>
            <Section>
            <Hr></Hr>

            </Section>

            <Section>
            <Item
                action={() => (window.location.href = "/logout")}
                icon={"fa-sign-out-alt"}
                string={"Sign Out"}
              ></Item>
            </Section>
          </ul>
        )}
      </Panel>
    </AccountMenuEl>
  )
}
const Panel = styled.div``
function AccountInfo(props) {
  return (
    <div className="w-full text-left p-4">
      <div className="flex flex-row">
        <div className="mr-4">
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "100%",
              overflow: "hidden",
            }}
          >
            <img
              src={props.account.avatar}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
        <div>
          <div className="font-bold text-lg leading-6 username">
            {props.account.username}
          </div>
          <div className="text-sm leading-5 email">{props.account.email}</div>
        </div>
      </div>
    </div>
  )
}
function ThemeSelect(props) {
  return (
    <div>
      <Section>
        <Item icon={"fa-arrow-left"} string="Theme" action={e => props.toggleThemeMenu(false)}></Item>
      </Section>
      <Hr></Hr>
      <Section>
        <Item color={"#f1c40f"} icon={"fa-sun"} string={"Light Theme"} action={e => props.toggleTheme("theme_light")}>
          <div>
            {props.theme === "theme_light" && (
              <i className="fas fa-check-circle check"></i>
            )}
          </div>
        </Item>
        <Item color={"#9b59b6"} icon={"fa-moon"} string={"Dark Theme"} action={e => props.toggleTheme("theme_dark")}>
          <div>
            {props.theme === "theme_dark" && (
              <i className="fas fa-check-circle"></i>
            )}
          </div>
        </Item>
      </Section>
    </div>
  )
}
function Section(props) {
  return <SectionEl>{props.children}</SectionEl>
}
const SectionEl = styled.div`
  /* border-bottom-width: 1px; */
  width: 100%;
  padding: 8px 0;
  /* border-color: ${(props) => props.theme.border}; */
  .email {
    color: ${(props) => props.theme.text_light};
  }
`
const enter = keyframes`
    from{
        height: 0;
        opacity: 1;
        transform: translateY(-100px);
    }
    to{
        height: auto;
        opacity:1;
        transform: translateY(0);
    }
`
function Item(props) {
  return (
    <ItemEl color={props.color} onClick={(e) => props.action(e)} className="px-3">
      <div className="flex item-content flex-row items-center justify-start">
        <div
          className="icon-holder flex flex-col items-center justify-center mr-4"
          style={{
            width: "32px",
          }}
        >
          <i
            className={`icon block fas ${props.icon} `}
            style={{
              fontSize: "20px",
            }}
          ></i>
        </div>
        <div className="text-sm font-semibold">{props.string}</div>
        <div className="ml-auto">{props.children}</div>
      </div>
    </ItemEl>
  )
}
const ItemEl = styled.li`
  :hover {
    .icon {
      color: ${(props) => props.color || props.theme.secondary};
    }
  }
  .check{
    color: ${props => props.theme.icons};
  }
  .icon {
    color: ${(props) => props.theme.icons_2};
  }
  .item-content {
    padding: 8px 8px;
    border-radius: 8px;
    :hover {
      background-color: ${(props) => props.theme.background_3};
    }
  }
`
const AccountMenuEl = styled.div`
  position: absolute;
  right: 0;
  width: 300px;
  top: 110%;
  color: ${(props) => props.theme.text};
  /* box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.4); */
  background: ${(props) => props.theme.background_1};
  min-width: 180px;
  animation: ${enter} 0.1s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  border-radius: 8px;
  overflow: hidden;
  border: ${(props) => `1px solid ${props.theme.border}`};
`
const Li = styled.li`
  width: 100%;
  text-align: left;
  font-weight: bold;
  display: block;
  a {
    padding: 4px 12px;
    display: block;
  }
  :hover {
    opacity: 0.5;
  }
`
function mapStateToProps(state) {
  return {
    account: state.account_reducer.account,
    theme: state.app_state_reducer.theme,
  }
}
const mapDispatchToProps = {
  toggleTheme
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountMenu)

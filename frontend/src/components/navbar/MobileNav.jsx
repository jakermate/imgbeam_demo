import React, { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import imgbeam from "../../imgbeam.png"
import SearchBar from "../Searchbar"
import Avatar from './Avatar'
import AccountMenu from './accountmenu/AccountMenu'
export default function MobileNav(props) {
  const [menu, toggleMenu] = useState(false)
  const [accountMenu, toggleAccountMenu] = useState(false)

  return (
    <div className="w-full flex flex-col md:hidden relative z-30 text-white" style={{
      background: 'rgb(30,30,30)'
    }}>
      <div className="w-full h-16 mobile-nav-content flex flex-row items-center justify-between">
        <div className="w-16" style={{}}>
          <div className="mobile-nav-menu-buttons text-white">
              <button className={`text-white hamburger hamburger--squeeze ${menu && 'is-active'}`} type="button" onClick={(e) => toggleMenu(!menu)}>
                <span className="hamburger-box flex items-center justify-center">
                  <span className="hamburger-inner block"></span>
                </span>
              </button>
          </div>
        </div>
        <div className="mobile-nav-logo">
   <a href="/" className="">
        
          <img
            src={imgbeam}
            alt=""
            style={{
              height: "16px",
            }}
          />
          </a>
        </div>
        <div className="w-16">
          {props.signedIn ? (
            <Avatar account={props.account} toggleAccountMenu={toggleAccountMenu}></Avatar>
          ) : (
            <div className="pr-3">
              <a href="/login" className="font-bold " style={{
                  color: 'rgb(52,165,218)'
              }}>
                Log In
              </a>
            </div>
          )}
        </div>
      </div>
      {menu && <Menu></Menu>}
      {accountMenu && (
          <AccountMenu
            toggleAccountMenu={toggleAccountMenu}
            account={props.account}
          ></AccountMenu>
        )}
    </div>
  )
}

function Menu(props) {
  return (
    <MenuElement className="w-full">
      <Content className="w-full text-left">
        <li className="w-full mb-3">
          <SearchBar></SearchBar>
        </li>
        <li className="w-full px-4 py-2 text-sm font-bold">
          <a href="/about">About</a>
        </li>

        <li className="w-full px-4 py-2 text-sm font-bold">
          <a href="/terms">Terms of Service</a>
        </li>
      </Content>
    </MenuElement>
  )
}
const enter = keyframes`
    from{
        height: 0;
    }
    to{
        height: 140px;
    }
`
const opacity = keyframes`
    from{
        oapcity:0;
    }
    to{
        opacity: 1;
    }
`
const MenuElement = styled.div`
  height: 0;
  animation: ${enter} 0.2s linear forwards;
`
const Content = styled.ul`
  opacity: 0;
  animation: ${opacity} 0.2s linear forwards;
`

import React, { useState } from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"
import throttle from "lodash/throttle"
import cookie from "js-cookie"
import {connect} from 'react-redux'
import {setSearch} from '../state/store/actions/index'
function Searchbar(props) {
 
  const searchRegex = /^[@#A-Za-z0-9 ]{1}[A-Za-z0-9 ]{0,}$/
  const history = useHistory()
  const [searchValue, setSearchValue] = useState("")
  const [focused, setFocused] = useState(false)
  function handleSearchValueChange(searchString) {
    if (searchString == null || searchString == "") {
      setSearchValue("")
      return
    }
    if (searchRegex.test(searchString)) {
      console.log("special")
      setSearchValue(searchString)
      return
    }
  }
  // watch global search and update local state
  useEffect(()=>{
    setSearchValue(props.search)
  },[props.search])
  function handleEnter(e) {
    if (e.keyCode == 13) {
      submitSearch()
    }
    if (e.keyCode == 27) {
      unfocusSearch()
    }
  }
  async function submitSearch(e) {
    // determine search type
    let searchString = searchValue

    // if tag search
    if (searchValue.charAt(0) == "#") {
      history.push(`/tag/${searchString.replace(/#/g, "")}`)
    }
    // if user search
    else if (searchValue.charAt(0) == "@") {
      history.push(`/users/${searchString.replace(/@/g, "")}`)
    } else {
      history.push(`/search/${searchString}`)
    }
    unfocusSearch()
  }
  let throttleSearch = throttle(onTypeSearch, 400)
  useEffect(() => {
    if (searchValue.length > 0) {
      throttleSearch()
    }
    if (searchValue.length == 0) {
      toggleBox(false)
      setResults(null)
    }
  }, [searchValue])
  function sanitizeSuggestionSearch(searchString) {
    searchString = searchString.replace("#", "")
    searchString = searchString.replace("@", "")
    return searchString
  }
  async function onTypeSearch(e) {
    let searchString = sanitizeSuggestionSearch(searchValue)
    console.log("searching " + searchString)
    let url = `/api/search/suggest?search=${searchString}`
    try {
      let res = await fetch(url)
      let json = await res.json()
      // console.log(json)
      if (res.status == 200) {
        setResults(json)
      }
    } catch (err) {
      console.log(err)
    }
  }
  function focusSearch(e) {
    document.getElementById("search-input").focus()
  }
  // active state
  const [results, setResults] = useState(null)
  const [box, toggleBox] = useState(false)
  useEffect(() => {
    console.log(results)
    if (results !== null) {
      toggleBox(true)
      return
    }

    toggleBox(false)
  }, [results])
  function unfocusSearch() {
    console.log("unfocus")
    document.getElementById("search-input").blur()
    toggleBox(false)
  }
  return (
    <div className="relative flex-1 flex items-center justify-center ml-2 mr-2  text-sm ">
      <SearchBarElement
        id="search-form-style"
        focused={focused}
        className="flex flex-row w-full my-1 items-center outline-none focus:outline-none md:w-full"
        onClick={(e) => focusSearch()}
        style={{
          cursor: "text",
          borderRadius: "8px",
          maxWidth: "480px",
        }}
      >
        <div className="w-full relative h-full px-4 py-2">
          <SearchInput
            id="search-input"
            type="text"
            tabIndex={1}
            className="w-full h-full bg-transparent  outline-none "
            name="search"
            autoComplete={"off"}
            placeholder="Search for topics, @users, or #tags!"
            value={searchValue}
            onKeyDown={(e) => handleEnter(e)}
            onChange={(e) => handleSearchValueChange(e.target.value)}
            onFocus={(e) => setFocused(true)}
            onBlur={(e) => setFocused(false)}
          />
          {/* dropdown */}
          {(box &&
            (results.galleries.length ||
              results.tags.length ||
              results.users.length)) ? (
              <DropDown
                id="search-drop"
                className="w-full text-left text-sm  mt-2 left-0 right-0  absolute "
              >
                <div
                  className="dropdown-overlay fixed top-0 left-0 right-0 w-screen h-screen z-10"
                  onClick={(e) => unfocusSearch()}
                  style={{}}
                ></div>
                <div
                  className="relative z-20"
                >
                  {results.galleries.length > 0 && (
                    <div id="search-dropdown-galleries" className="">
                      <DropdownTitle string={"Galleries"}></DropdownTitle>
                      <div className="flex flex-col mb-3">
                        {results.galleries.map((gallery, index) => {
                          if (index < 3)
                            return (
                              <Link
                                onClickCapture={(e) => unfocusSearch()}
                                to={`/beam/${gallery.gallery_id}`}
                                key={`search-box-gallery-result-${gallery.gallery_id}`}
                              >
                                <Item
                                  icon={"fa-images"}
                                  string={gallery.title}
                                ></Item>
                              </Link>
                            )
                        })}
                      </div>
                    </div>
                  )}

                  {results.users.length > 0 && (
                    <div id="search-dropdown-users" className="">
                      <DropdownTitle string={"Users"}></DropdownTitle>
                      <div className="flex flex-col mb-3">
                        {results.users.map((user, index) => {
                          if (index < 3)
                            return (
                              <Link
                                onClickCapture={(e) => unfocusSearch()}
                                key={`search-box-user-result-${user.username}`}
                                to={`/user/${user.username}`}
                              >
                                <Item
                                  user
                                  icon={"fa-user"}
                                  avatar={user.avatar_lq}
                                  string={user.username}
                                ></Item>
                              </Link>
                            )
                        })}
                      </div>
                    </div>
                  )}
                  {results.tags.length > 0 && (
                    <div id="search-dropdown-tags" className="">
                      <DropdownTitle string={"Tags"}></DropdownTitle>

                      <div className="flex flex-col mb-3">
                        {results.tags.map((tag, index) => {
                          if (index < 3)
                            return (
                              <Link
                                onClickCapture={(e) => unfocusSearch()}
                                to={`/tag/${tag.name.replace(" ", "_")}`}
                                key={`search-box-tag-result-${index}`}
                              >
                                <Item
                                  icon={"fa-hashtag"}
                                  string={tag.name}
                                ></Item>
                              </Link>
                            )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </DropDown>
            )
            :
            <div></div>
            }
            
        </div>
        {searchValue.length > 0 && (
          <div
            className="h-full p-1 flex flex-col items-center justify-center"
            id="search-clear cursor-pointer"
            onClick={(e) => setSearchValue("")}
          >
            <button className="block">
              <i className="fas fa-times opacity-50 fa-lg"></i>
            </button>
          </div>
        )}

        <SearchButton
          type="submit"
          onClick={(e) => submitSearch(e)}
          onSubmit={(e) => submitSearch(e)}
          className=" font-bold px-4"
        >
          <i className="fas fa-search fa-lg opacity-25"></i>
        </SearchButton>
      </SearchBarElement>
    </div>
  )
}
function Item(props) {
  return (
    <ItemView className="flex flex-row justify-start  items-center">
      {props.user ? (
        <div
          className="mr-2 avatar flex flex-col relative overflow-hidden items-center justify-center"
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "100%",
          }}
        >
          {props.avatar !== null && (
            <img
              className="block absolute top-0 bottom-0 left-0 right-0 z-20"
              src={props.avatar}
              alt={`${props.username}'s avatar`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
          <i className={`icon fas ${props.icon} block z-10 relative`}></i>
        </div>
      ) : (
        <div className="mr-2 flex flex-col items-center justify-center" style={{
          width: '26px',
          height: '26px'
        }}>
          <i className={`icon fas ${props.icon} block z-10 relative`}></i>
        </div>
      )}

      <div className="title">{props.string}</div>
    </ItemView>
  )
}
const ItemView = styled.div`
  padding: 6px 10px;
  :hover {
    background: ${(props) => props.theme.background_3};
    border-radius: 8px;
  }
  .title {
    font-weight: 600;
  }
  .avatar {
    background: ${(props) => props.theme.background_3};
  }
  .icon {
    font-size: 16px;
    color: ${(props) => props.theme.textFaded};
  }
`
function DropdownTitle(props) {
  return (
    <div
      className="ml-2 mb-2"
      style={{
        fontSize: "16px",
        fontWeight: 700,
      }}
    >
      {props.string}
    </div>
  )
}
const DropDown = styled.div`
  transition: all 0.2s linear;
  top: 100%;
  background: ${(props) => props.theme.background_1};
  border-width: 1px;
  border-radius: 8px;
  padding: 12px 8px;
  width: 220px;
  border-color: ${(props) => props.theme.border};
`
const SearchBarElement = styled.div`
  background: ${(props) => props.theme.background_3};
  /* border-color: ${(props) => props.theme.border};
  border-width: 1px; */
`
const SearchButton = styled.button``
const SearchInput = styled.input`
  font-weight: 500;
  opacity: 0.7;
  :focus,
  :active {
    opacity: 1;
  }
`
const mapDispatchToProps = {
  setSearch
}
function mapStateToProps(state){
  return{
    search: state.app_state_reducer.search

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Searchbar)
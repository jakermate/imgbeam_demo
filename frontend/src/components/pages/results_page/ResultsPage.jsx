import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import MoonLoader from "react-spinners/MoonLoader"
import Helmet from "react-helmet"
import color from "../../../theme/colors"
import Supergrid from "../../SuperGrid"
import ActionButton from "../../ActionButton"
import styled from "styled-components"
import {connect} from 'react-redux'
import {setSearch} from '../../../state/store/actions/index'
function ResultsPage(props) {
  let history = useHistory()
  useEffect(() => {
    submitSearch()
    setSearchString(props.match.params.searchString)
    props.setSearch(props.match.params.searchString)
  }, [])
  const [searchString, setSearchString] = useState("")
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(true)
  async function submitSearch() {
    let from = results.length
    let to = from + 40
    let searchString = props.match.params.searchString
    console.log("searching " + searchString)
    let url = `/api/search/results/${searchString}`
    try {
      let res = await fetch(url)
      let json = await res.json()
      console.log(json)
      if (res.status == 200) {
        setResults(json)
        setSearching(false)
      }
    } catch (err) {
      console.timeLog(err)
      setSearching(false)
    }
  }
  function search() {
    history.push(`/search/${searchString}`)
  }

  const [sortMethod, setSortMethod] = useState("top")
  const [sortOrder, setSortOrder] = useState("newest")
  const [sortMenu, toggleSortMenu] = useState(false)
  const [OrderMenu, toggleOrderMenu] = useState(false)

  function sortByNew() {
    setResults(
      [...results].sort(
        (a, b) => new Date(b.date_created) - new Date(a.date_created)
      )
    )
    setSortOrder("newest")
  }
  function sortByOld() {
    setResults(
      [...results].sort(
        (a, b) => new Date(a.date_created) - new Date(b.date_created)
      )
    )
    setSortOrder("oldest")
  }
  useEffect(() => {
    console.log(results)
  }, [results])
  if (searching) {
    return (
      <div className="flex flex-col min-h-screen items-center pt-32">
        <Helmet>
          <meta charset="utf-8" />
          <title>{`${props.match.params.searchString} - Search Imgbeam`}</title>
          <meta
            name="description"
            content={`Search Imgbeam for pictures and videos about anything and everything.`}
          />
          <meta name="image" content={"https://www.imgbeam.com/splash.png"} />
          {/* <!-- Schema.org for Google --> */}
          <meta itemprop="name" content={`Search Imgbeam`} />
          <meta
            itemprop="description"
            content={`Search Imgbeam for pictures and videos about anything and everything.`}
          />
          <meta
            itemprop="image"
            content={"https://www.imgbeam.com/splash.png"}
          />
          {/* <!-- Twitter --> */}
          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:title"
            content={`${props.match.params.searchString} - Search Imgbeam`}
          />
          <meta
            name="twitter:description"
            content={`Search Imgbeam for pictures and videos about anything and everything.`}
          />
          <meta
            name="twitter:image:src"
            content={"https://www.imgbeam.com/splash.png"}
          />
          {/* <!-- Open Graph general (Facebook, Pinterest & Google+) --> */}
          <meta
            name="og:title"
            content={`${props.match.params.searchString} - Search Imgbeam`}
          />
          <meta
            name="og:description"
            content={`Search Imgbeam for pictures and videos about anything and everything.`}
          />
          <meta
            name="og:image"
            content={"https://www.imgbeam.com/splash.png"}
          />
          <meta name="og:type" content="website" />
        </Helmet>
        <MoonLoader size={20} color={`white`}></MoonLoader>
      </div>
    )
  } else
    return (
      <div className=" w-full " style={{}}>
        <Helmet>
          <meta charset="utf-8" />
          <title>{`${props.match.params.searchString} - Search Imgbeam`}</title>
          <meta
            name="description"
            content={`Search Imgbeam for pictures and videos about anything and everything.`}
          />
          <meta name="image" content={"https://www.imgbeam.com/splash.png"} />
          {/* <!-- Schema.org for Google --> */}
          <meta
            itemprop="name"
            content={`${props.match.params.searchString} - Search Imgbeam`}
          />
          <meta
            itemprop="description"
            content={`Search Imgbeam for pictures and videos about anything and everything.`}
          />
          <meta
            itemprop="image"
            content={"https://www.imgbeam.com/splash.png"}
          />
          {/* <!-- Twitter --> */}
          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:title"
            content={`${props.match.params.searchString} - Search Imgbeam`}
          />
          <meta
            name="twitter:description"
            content={`Search Imgbeam for pictures and videos about anything and everything.`}
          />
          <meta
            name="twitter:image:src"
            content={"https://www.imgbeam.com/splash.png"}
          />
          {/* <!-- Open Graph general (Facebook, Pinterest & Google+) --> */}
          <meta
            name="og:title"
            content={`${props.match.params.searchString} - Search Imgbeam`}
          />
          <meta
            name="og:description"
            content={`Search Imgbeam for pictures and videos about anything and everything.`}
          />
          <meta
            name="og:image"
            content={"https://www.imgbeam.com/splash.png"}
          />
          <meta name="og:type" content="website" />
        </Helmet>
        <div className="text-xl flex flex-col justify-center items-center text-center">
          <Header >
            {/* <div className="w-full search-banner bg-red-300 h-10">
              <div className="header-title">
                Search Imgbeam
              </div>
            </div> */}
            <div className="container mx-auto">
              <div
                id="search-page-bar"
                className="mx-auto flex pt-12 flex-col items-center"
                style={{
                  maxWidth: "720px",
                  width: "100%",
                }}
              >
                <SearchBar
                  search={search}
                  updateSearchString={setSearchString}
                  searchString={searchString}
                ></SearchBar>
              </div>

              <div>
                <h1 className="search-title">
                  {props.match.params.searchString.charAt(0).toUpperCase() +
                    props.match.params.searchString.slice(1)}
                </h1>
                <h2 className="breakdown">
                  Browse {results.length} {props.match.params.searchString}{" "}
                  results
                </h2>
                <div className="text-sm mt-6">
                  <div>Sorting by date</div>
                  {/* <div>
                  <button id="button-sort-method">{sortMethod}</button>
                </div>
                <div>
                  <button id="button-sort-order">{sortOrder}</button>
                </div> */}
                  <div className="flex flex-row mt-2">
                    <ActionButton
                      disable={sortOrder === "oldest"}
                      action={(e) => sortByNew()}
                      string={"Newest"}
                    ></ActionButton>
                    <div className="mr-4"></div>
                    <ActionButton
                      disable={sortOrder === "newest"}
                      action={(e) => sortByOld()}
                      string={"Oldest"}
                    ></ActionButton>
                  </div>
                </div>
              </div>
            </div>
          </Header>
          {results?.length > 0 && <Supergrid galleries={results}></Supergrid>}
        </div>
      </div>
    )
}
const Header = styled.header`
width: 100%;
  .breakdown {
    font-size: 16px;
    font-weight: 600;
    color: ${(props) => props.theme.textFaded};
  }
  .search-title {
    margin-top: 24px;
    font-size: 32px;
    font-weight: bold;
  }
`

function SortByMenu(props) {
  return (
    <div
      className="absolute"
      style={{
        top: "100%",
      }}
    >
      <div
        onClick={(e) => props.close()}
        className="overlay fixed top-0 bottom-0 left-0 right-0"
        style={{
          background: "rgba(0,0,0,0)",
        }}
      ></div>
      <div
        className="panel"
        style={{
          borderRadius: "26px",
          // backgroundColor: `${color.backgroundMedium}`,
        }}
      >
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  )
}
function SearchBar(props) {
  return (
    <SearchBarView
      onClick={(e) => document.getElementById("search-page-input").focus()}
    >
      <div className="mx-3">
        <i class="fas fa-search icon"></i>
      </div>
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") props.search()
        }}
        id="search-page-input"
        type="text"
        className="flex-1"
        value={props.searchString}
        onChange={(e) => props.updateSearchString(e.target.value)}
      />
      <div className="h-full">
        <SearchButton>Search</SearchButton>
      </div>
    </SearchBarView>
  )
}
const SearchBarView = styled.div`
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  padding: 10px 14px;
  cursor: text;
  height: 56px;
  font-size: 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  background: ${(props) => props.theme.background_1};
  box-shadow: 3px 3px 18px rgba(0, 0, 0, 0.07);
  /* border: ${(props) => `1px solid ${props.theme.border}`}; */
  .icon {
    color: ${(props) => props.theme.icons};
    opacity: 0.6;
    font-size: 16px;
    padding: 4px;
  }
  input {
    background: transparent;
    font-size: 16px;
    font-weight: 500;
    :focus,
    :active {
      outline: none;
    }
  }
`
const SearchButton = styled.button`
  background: ${props => props.theme.background_1};
  border: ${props => `1px solid ${props.theme.border}`};
  color: ${props => props.theme.text};
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  height: 100%;
  width: 80px;
  :hover{
    background: ${props => props.theme.background_3}
  }
`
function OrderByMenu(props) {
  return (
    <div
      className="absolute"
      style={{
        top: "100%",
      }}
    >
      <div
        onClick={(e) => props.close()}
        className="overlay fixed top-0 bottom-0 left-0 right-0"
        style={{
          background: "rgba(0,0,0,0)",
        }}
      ></div>
      <div
        className="panel"
        style={{
          borderRadius: "26px",
          backgroundColor: `${color.backgroundMedium}`,
        }}
      >
        <ul className="flex flex-col-reverse">
          <li>
            <button>Today</button>
          </li>
          <li>
            <button>Week</button>
          </li>
          <li>
            <button>Month</button>
          </li>
          <li>
            <button>Year</button>
          </li>
          <li>All</li>
        </ul>
      </div>
    </div>
  )
}
const mapDispatchToProps = {
  setSearch
}
function mapStateToProps(state){
  return{

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ResultsPage)
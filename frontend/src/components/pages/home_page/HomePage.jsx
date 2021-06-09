import React, { useState, useEffect, useRef } from "react"
import MoonLoader from "react-spinners/MoonLoader"
import styled from "styled-components"
import triangle from "../../../triangle_icon.png"
import SuperGrid from "../../SuperGrid"
import SortMenu from './SortMenu'
export default function HomePage(props) {
  const [activeMode, setActiveMode] = useState("trending")
  // const throttleScroll = throttle(scrollHandler, 100)
  // const throttleScroll2 = throttle(scrollHandler2, 300)
  const modes = ['trending', 'new', 'alltime']
  const [sortMenu, toggleSortMenu] = useState(false)
  function scrollHandler2() {
    let pageheight = document.body.scrollHeight
    let windowheight = window.innerHeight
    let windowPosition = window.scrollY
    props.setScrollPosition(windowPosition)
    if (pageheight < windowPosition + windowheight + 400) {
      if (!gettingMoreGalleries && !noMoreRef.current) {
        getMore()
        console.log("getting more")
      }
    }
  }

  useEffect(() => {
    getMore()
    console.log("galleries already present")

    document.title = "Imgbeam - The Nexus of all things Interweb"
    document.addEventListener("scroll", scrollHandler2)

    return () => {
      document.removeEventListener("scroll", scrollHandler2)
    }
  }, [])

  // mounting completion
  const [mounted, setMounted] = useState(false)

  // get most-trending slice
  const [noMore, setNoMore] = useState(false)
  let noMoreRef = useRef(noMore)
  noMoreRef.current = noMore
  const [galleries, setGalleries] = useState([])
  let trendingRef = useRef(galleries)
  trendingRef.current = galleries

  // callback for when activeMode changes
  useEffect(() => {
    reset()
  }, [activeMode])
  function reset() {
    setGettingMoreGalleries(false)
    setGalleries([])
    setNoMore(false)
  }
  useEffect(() => {
    if (galleries.length === 0) {
      getMore()
    }
  }, [galleries])
  async function getGalleries() {
    if (noMore) {
      return
    }
    console.log("getting galleries from " + activeMode)
    let from = trendingRef.current.length
    let to = from + 60
    let url = `/api/trending/${activeMode}?from=${from}&to=${to}`
    console.log("fetching " + from + " " + to)
    try {
      let res = await fetch(url)
      let json = await res.json()
      if (res.status === 200) {
        if (json.length === 0) {
          setNoMore(true)
          setGettingMoreGalleries(false)
          return
        }
        // console.log('NEW GALLERIES ' + from + ' ' + to)
        // make sure galleries not already in trending
        let newGalleries = json.filter((newGallery) => {
          let isNew = true
          galleries.forEach((oldGallery) => {
            if (oldGallery.gallery_id === newGallery.gallery_id) {
              isNew = false
            }
          })
          return isNew
        })
        console.log(newGalleries)
        setGalleries([...galleries, ...newGalleries])
        setGettingMoreGalleries(false)
        if (!mounted) {
          setMounted(true)
        }
      }
    } catch (err) {
      console.log(err)
      setGettingMoreGalleries(false)
    }
  }
  // trigger get more function
  const [gettingMoreGalleries, setGettingMoreGalleries] = useState(false)
  function getMore() {
    // exit out if allready in process of fetching and updating page
    if (gettingMoreGalleries == true || noMore) {
      return
    }
    setGettingMoreGalleries(true)
  }
  useEffect(() => {
    if (gettingMoreGalleries) {
      getGalleries()
    }
  }, [gettingMoreGalleries])

  return (
    <Home
      id="app-home"
      className="min-h-screen relative px-4"
      style={{
        zIndex: 1,
      }}
    >
      <div>
        <h1 className="text-center font-bold text-4xl mt-4 relative z-10">
          {/* ImgBeam <span className="opacity-50">(v0.3.1)</span> */}
        </h1>
        <h2 className="text-center headline relative z-10 opacity-50">
          Avoiding copyright infringement since 2021.
        </h2>
      </div>

      {/* <Background></Background> */}
      <div className="controls w-full flex flex-row justify-between items-center">
        <SortButton modes={modes} sortMenu={sortMenu}  action={toggleSortMenu} string={"Trending"} icon={"fa-fire"}></SortButton>
        {/* <SortButton string={"Sort"} icon={"fa-sort"}></SortButton> */}
      </div>
      <div className="trending-container z-10  mx-auto relative" style={{}}>
        <div className="flex flex-row justify-start">
          {mounted ? (
            <SuperGrid
              // title={"Trending"}
              galleries={galleries}
              getMore={getGalleries}
            ></SuperGrid>
          ) : (
            <MoonLoader color={"white"} size={30}></MoonLoader>
          )}
        </div>
        <div
          id="getting-more"
          className="w-full py-16 flex flex-col justify-center items-center"
        >
          {galleries.length > 0 && gettingMoreGalleries && (
            <MoonLoader color={"white"} size={30}></MoonLoader>
          )}
        </div>
      </div>
    </Home>
  )
}
function SortButton(props) {
  return (
    <SortButtonView onClick={e => props.action(!props.sortMenu)}>
      <div className="mr-3">{props.string}</div>
      <div>
        <i className={`fas ${props.icon} icon`}></i>
      </div>
      {
        props.sortMenu &&
      <SortMenu options={props.modes} sortMenu={props.sortMenu} toggleMenu={props.action}></SortMenu>

      }
    </SortButtonView>
  )
}
const SortButtonView = styled.button`
  border: ${(props) => `1px solid ${props.theme.border}`};
  border-radius: 8px;
  height: 32px;
  display: flex;
  position: relative;
  font-size: 14px;
  color: ${(props) => props.theme.text};
  padding: 4px 8px;
  font-weight: 600;
  flex-direction: row;
  align-items: center;
  :hover {
    background: ${(props) => props.theme.background_1};
  }
  .icon {
    font-size: 16px;
    color: ${(props) => props.theme.icons};
  }
`
function Background() {
  return (
    <div className="w-full absolute left-0 right-0 px-64 z-0">
      <div
        className=""
        style={{
          width: "100%",
          maxWidth: "1024px",
          top: "-200px",
        }}
      ></div>
      <img src={triangle} alt="" style={{}} />
    </div>
  )
}
const Home = styled.div`
  .headline{
    font-weight: 900;
    font-size: 22px;
    letter-spacing: -1🤖px;
  }
`

import React, { useEffect, useState, useRef, useLayoutEffect } from "react"
import Tile from "./Tile"
import throttle from "lodash/throttle"
import styled, { keyframes } from "styled-components"
import MobileShare from "../gallery_page/MobileShare"
import colors from "../../../theme/colors"

export default function HomeGrid(props) {
  const [sortMenu, toggleSortMenu] = useState(false)
  let throttledResizeHandler = throttle(resizeHandler, 400)
  let throttledRenderHandler = throttle(render_scroll_handler, 300)
  const [columns, setColumns] = useState(getColumns())

  useEffect(() => {
    // resize handler
    window.addEventListener("resize", resizeHandler)
    // resizeHandler()
    // scroll handler
    window.addEventListener("scroll", render_scroll_handler)
    return () => {
      // resize handler
      window.removeEventListener("resize", resizeHandler)
      // scroll handler
      window.removeEventListener("scroll", render_scroll_handler)
    }
  })
  function resizeHandler() {
    // console.log('window resize')
    if (getColumns() !== columns) {
      setColumns(getColumns())
    }
  }
  function getColumns() {
    let width = window.innerWidth
    let newColumns = parseInt((width / 380).toFixed(0))
    if (newColumns > 5) {
      newColumns = 5
    }
    // if (width < 640) {
    //   console.log("mobile")
    //   newColumns = 1
    // }
    // console.log(newColumns)
    return newColumns
  }
  // rearrange grid when column number state changes
  const [grid, setGrid] = useState([])
  useEffect(() => {
    get_rendered()
  }, [grid])
  useEffect(() => {
    createGrid(props.galleries)
  }, [columns, props.galleries])
 
  function createGrid(galleries) {
    let cols = columns
    let grid = []
    for (let i = 0; i < cols; i++) {
      grid[i] = new Array()
    }
    galleries.forEach((gallery, index) => {
      // get tile height
      let h = gallery.images[0]?.height
      let w = gallery.images[0]?.width
      let aspect = h / w
      if (isNaN(aspect)) {
        aspect = 1
      }
      let height = aspect * 240 + 84
      if(height > 600){
        height = 600
      }
      // get columns heights
      let heights = []
      grid.forEach((columnArray) => {
        let h = getColumnHeight(columnArray)
        heights.push(h)
      })
      // console.log('heights:' + heights)
      // get shortest column
      let shortest = 0
      heights.forEach((h, index) => {
        // instan return if first index
        if (index === 0) {
          return
        }
        if (h < heights[shortest]) {
          shortest = index
        }
      })
      gallery.height = height
      // append gallery to the shortest column in grid array
      grid[shortest].push(gallery)
    })
    setGrid(grid)
  }

  function getColumnHeight(columnArray) {
    let h = 0
    columnArray.forEach((tileObject) => {
      h += tileObject.height
    })
    return h
  }

  // efficiency engine
  const [rendered, setRendered] = useState(["VF9nbhsV"])
  const [direction, setDirection] = useState(true)
  const [scrollYState, setScrollYState] = useState(0)


  function render_scroll_handler() {
    console.log('handling')
    // get scroll position relative to last
    // let scrolled = window.scrollY
    // // console.log(scrollYRef.current + ' - ' + scrolled)
    // setScrollYState(scrolled)
    get_rendered()
  }

  // tile share
  const [shareMenu, toggleShareMenu] = useState(false)
  const [share_id, setShare_id] = useState("")
  function share(gallery_id) {
    toggleShareMenu(true)
    setShare_id(gallery_id)
  }
  function closeShareMenu() {
    toggleShareMenu(false)
  }

  function get_rendered() {
    let renderList = []
    // console.log('getting render list')
    grid.forEach((column) => {
      let done = false
      column.forEach((gallery) => {
        // console.log('getting el ' + `tile-${gallery.gallery_id}`)
        let el = document.getElementById(`tile-${gallery.gallery_id}`)
        let bounding = el.getBoundingClientRect()
        if (
          bounding.top > -2000 &&
          bounding.bottom < window.innerHeight + 2000
        ) {
          renderList.push(gallery.gallery_id)
          return true
        }
      })
    })
    setRendered(renderList)
  }

  // useEffect(() => {
  //   get_rendered()
  // }, [scrollYState])

  // tile display mode
  const [tileMode, setTileMode] = useState(true)

  return (
    <div className="overflow-x-visible relative">
      {/* TRENDING GALLERIES */}
      <div>
        {/* <div className="text-left  flex-row py-3 hidden md:flex font-extrabold relative z-20">
          <button
            className="flex flex-row items-center justify-center relative px-6 py-2"
            onClick={(e) => toggleSortMenu(!sortMenu)}
            style={{
              background: !sortMenu
                ? `${colors.backgroundDark}`
                : "rgba(60,60,60,1)",
              boxShadow: "2px 2px 4px rgba(0,0,0,.4)",
              borderRadius: "26px",
              height: "40px",
              minWidth: "145px",
            }}
          >
            <h2 className="font-extrabold text-left flex-1">
              {props.activeMode}
            </h2>
            <i className="fas ml-4 fa-sort-down fa-lg pb-1"></i>
            {sortMenu && (
              <SortMenu
                active={props.activeMode}
                setActiveMode={props.setActiveMode}
                toggleSortMenu={toggleSortMenu}
              ></SortMenu>
            )}
          </button>
          <button
            className="tiling-button-container relative ml-3 flex flex-col items-center justify-center"
            onClick={(e) => setTileMode(!tileMode)}
            style={{
              width: "40px",
              height: "40px",
              background: `${colors.backgroundDark}`,
              borderRadius: "100%",
              boxShadow: "2px 2px 3px rgba(0,0,0,.3)",
            }}
          >
           
          </button>
        </div> */}

        {/* grid render */}

        {grid === []
          ? grid.map((col, indx) => {
              return (
                <div
                  id="grid-column-container"
                  key={`home-grid-column-${indx}`}
                  className="mx-2 sm:mx-0 mt-4 md:mt-0"
                  style={{
                    float: "left",
                    width: columns == 1 ? "calc(100% - 16px)" : "240px",
                    marginLeft: `${indx !== 0 ? "16px" : 0}`,
                  }}
                ></div>
              )
            })
          : grid.map((col, indx) => {
              return (
                <div
                  id={`grid-column-container-${indx}`}
                  key={`home-grid-column-${indx}`}
                  className="mx-2 sm:mx-0 mt-4 md:mt-0"
                  style={{
                    float: "left",
                    width: columns == 1 ? "calc(100% - 16px)" : "240px",
                    marginLeft: `${indx !== 0 ? "16px" : 0}`,
                  }}
                >
                  {col.map((gallery, index) => {
                    if (rendered.includes(gallery.gallery_id)) {
                      return (
                        <Tile
                          tile={`tile-id-${indx}-${index}`}
                          key={`home-grid-gallery-tile-${gallery.gallery_id}`}
                          gallery={gallery}
                          // share={share}
                          tileMode={tileMode}
                        ></Tile>
                      )
                    } else
                      return (
                        <PlaceHolder
                          tile={`tile-id-${indx}-${index}`}
                          key={`home-grid-gallery-tile-${gallery.gallery_id}`}
                          gallery={gallery}
                          tileMode={tileMode}
                        ></PlaceHolder>
                      )
                  })}
                </div>
              )
            })}
      </div>
      {shareMenu && (
        <MobileShare gallery_id={share_id} close={closeShareMenu}></MobileShare>
      )}
    </div>
  )
}

function SortMenu(props) {
  return (
    <div
      className="py-1 absolute left-0 right-0 overflow-hidden"
      style={{
        top: "100%",
      }}
    >
      <div
        className="overlay fixed top-0 z-10 bottom-0 right-0 left-0 bg-transparent"
        onClick={(e) => props.toggleSortMenu(false)}
      ></div>
      <div
        className="text-base font-bold py-1 text-left relative z-20"
        style={{
          background: "rgba(30,30,30,1)",
          borderRadius: "26px",
        }}
      >
        <ul>
          <ListItem
            onClick={(e) => props.setActiveMode("trending")}
            active={props.active == "trending"}
            className="py-2 px-4 text-opacity-50 hover:bg-white hover:bg-opacity-25"
          >
            trending
          </ListItem>
          <ListItem
            onClick={(e) => props.setActiveMode("new")}
            active={props.active == "new"}
            className="py-2 px-4 text-opacity-50 hover:bg-white hover:bg-opacity-25"
          >
            new
          </ListItem>
          <ListItem
            onClick={(e) => props.setActiveMode("picks")}
            active={props.active == "picks"}
            className="py-2 px-4 text-opacity-50 hover:bg-white hover:bg-opacity-25"
          >
            just for you
          </ListItem>
        </ul>
      </div>
    </div>
  )
}
const ListItem = styled.li`
  overflow: hidden;
  color: ${(props) => (props.active ? "white" : "rgba(255,255,255,.5)")};
`

function PlaceHolder(props) {
  const [color, setColor] = useState("black")

  useEffect(() => {
    // getCommentCount()
    let random = Math.floor(Math.random() * 5)
    switch (random) {
      case 0:
        setColor(
          "linear-gradient(37deg, rgba(36,158,24,0.38139005602240894) 0%, rgba(179,0,255,0.4458158263305322) 100%)"
        )
        break
      case 1:
        setColor(
          "linear-gradient(37deg, rgba(158,24,24,0.38139005602240894) 0%, rgba(0,212,255,0.4458158263305322) 100%)"
        )
        break
      case 2:
        setColor(
          "linear-gradient(37deg, rgba(250,38,202,0.38139005602240894) 0%, rgba(255,166,0,0.4458158263305322) 100%)"
        )
        break
      case 3:
        setColor(
          "linear-gradient(37deg, rgba(245,255,0,0.4458158263305322) 0%, rgba(81,250,38,0.38139005602240894) 100%)"
        )
        break
      case 4:
        setColor(
          "linear-gradient(37deg, rgba(124,0,255,0.4458158263305322) 0%, rgba(38,250,237,0.38139005602240894) 100%)"
        )
        break
      default:
        setColor(
          "linear-gradient(37deg, rgba(255,255,255,.44), rgba(0,0,0,.44))"
        )
    }
  }, [])
  return (
    <div
      id={`tile-${props.gallery.gallery_id}`}
      className="mb-8 relative flex flex-col  overflow-hidden"
      style={{
        borderRadius: "8px",
        background: `${color}`,

        height: `${props.tileMode ? props.gallery.height : 260}px`,
        width: "100%",
      }}
    >
      <div
        className="tile-placeholder-media-container flex-grow"
        style={{
          width: "100%",
          borderRadius: "8px",
          minHeight:'50%'
        }}
      >
        
      </div>
      <div className="tile-placeholder-info pt-2 flex flex-row">
          <div
            style={{
              width: "50px",
              height: '80px'
            }}
          >
            {/* <div
              className="tile-placeholder-avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "100%",
                background: `${color}`,
              }}
            ></div> */}
          </div>
          {/* <div className="tile-placeholder-title-wrap flex-grow">
              <div className="" style={{
                height: '14px',
                width: '100px',
                background: `${color}`
              }}>

              </div>
              <div className="mt-2" style={{
                height: '14px',
                width: '60px',
                background: `${color}`
              }}>

              </div>
          </div> */}
        </div>
    </div>
  )
}
const enter = keyframes`
  from{
    opacity: 0;
    transform: scale(0);
  }
  to{
    opacity: 1;
    transform: scale(1);
  }
`
const TileToggle = styled.div`
  animation: ${enter} 0.3s linear forwards;
`

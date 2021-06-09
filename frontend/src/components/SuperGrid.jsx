import React, { useState, useEffect } from "react"
import Tile from "./pages/home_page/Tile"
import throttle from "lodash/throttle"
import { connect } from "react-redux"
import Brick from "./pages/home_page/Brick"
import styled from "styled-components"
import { toggleSidebar } from "../state/store/actions/index"
function SuperGrid(props) {
  const [top, setTop] = useState(true)

  const throttler = throttle(resizeHandler, 200)
  useEffect(() => {
    window.addEventListener("resize", throttler)
    document.addEventListener("scroll", scrollHandler)

    return () => {
      document.removeEventListener("scroll", scrollHandler)
      window.removeEventListener("resize", throttler)
    }
  }, [])
  // navigation
  function goToTop() {
    window.scrollTo(0, 0)
  }
  function scrollHandler() {
    if (window.scrollY < 50) {
      setTop(true)
    }
    if (window.scrollY > 50) {
      setTop(false)
    }
    // backgroundRef.current.style.top = `-${window.scrollY}px`
  }
  function resizeHandler() {
    if (window.innerWidth < 600) {
      console.log("window")
      props.toggleSidebar(false)
    }
    if (getColumns !== columns) {
      setColumns(getColumns)
    }
  }
  useEffect(() => {
    resizeHandler()
  }, [props.sidebar])
  const [columns, setColumns] = useState(getColumns())
  function getColumns() {
    let width = window.innerWidth - (props.sidebar ? 225 : 0) - 64
    let newColumns = parseInt((width / 300).toFixed(0))
    // if (newColumns > 5) {
    //   newColumns = 5
    // }
    if (width < 640) {
      console.log("mobile")
      newColumns = 1
    }
    // console.log(newColumns)
    return newColumns
  }
  // rearrange grid when column number state changes
  const [grid, setGrid] = useState([])

  useEffect(() => {
    placeTiles(props.galleries)
  }, [columns])
  useEffect(() => {
    placeTiles(props.galleries)
  }, [props.galleries])
  function placeTiles(galleries) {
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
      let height = aspect
      let info_height = height * 0.3

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
        // instant return if first index
        if (index === 0) {
          return
        }
        if (h < heights[shortest]) {
          shortest = index
        }
      })
      // if(height > 600) height = 600
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
  return (
    <div
      className="relative mt-6 w-full flex flex-row justify-center"
      id="super-grid"
      style={{
        paddingTop: `${props.title ? "48px" : "0"}`,
      }}
    >
      <div
        id="grid-title"
        className="absolute top-0 mx-auto text-xl font-bold flex flex-row justify-between"
        style={{
          width: columns == 1 ? "calc(100% - 16px)" : `${columns * 256}px`,
           
        }}
      >
        <div className="font-extrabold">{props.title}</div>
      </div>
      {/* grid render */}

      {grid === []
        ? grid.map((col, indx) => {
            return (
              <div
                id="grid-column-container"
                key={`home-grid-column-${indx}`}
                className="mx-2 sm:mx-0 "
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
                id="grid-column-container"
                key={`home-grid-column-${indx}`}
                className="mx-2 sm:mx-0 mt-4 md:mt-0 flex-0"
                style={{
                  float: "left",
                  width: columns == 1 ? "calc(100% - 16px)" : "240px",
                  
                  marginLeft: `${indx !== 0 ? "16px" : 0}`,
                }}
              >
                {col.map((gallery, index) => {
                  return (
                    <Brick
                      favoriteMode={props.favoritesMode}
                      setDragged={props.setDragged}
                      draggable={props.draggable}
                      usernames={props.usernames}
                      avatars={props.avatars}
                      tile={`tile-id-${indx}-${index}`}
                      key={`home-grid-gallery-tile-${gallery.gallery_id}`}
                      gallery={gallery}
                    ></Brick>
                  )
                })}
              </div>
            )
          })}
      {/* to top button */}
      <TopButtonContainer
        id="top-button"
        className={`relative z-50 ${!top ? "block" : "hidden"}`}
        top={top}
      >
        <TopButton onClick={(e) => goToTop()}>
          <i className="fas fa-angle-double-up mx-3"></i>
        </TopButton>
      </TopButtonContainer>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    sidebar: state.app_state_reducer.sidebar,
  }
}

const TopButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 10px;
`
const TopButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  padding: 8px;
  color: black;
  background: white;
`

const mapDispatchToProps = {
  toggleSidebar,
}
export default connect(mapStateToProps, mapDispatchToProps)(SuperGrid)

import React, { useEffect, useState, useRef } from "react"
import colors from "../../../theme/colors"
import styled, { keyframes } from "styled-components"
import {connect} from 'react-redux'

function ArrangementView(props) {
  const [arrangement, setArrangement] = useState([])
  const [dragPosition, setDragPosition] = useState(null)
  const [element, setElement] = useState(null)
  useEffect(() => {
    setArrangement(props.images)
  }, [])
  useEffect(() => {
    if (!element) setDragPosition(null)
  }, [element])
  useEffect(() => {
    console.log(dragPosition)
  }, [dragPosition])
  function dragStart(e, index) {
    // e.preventDefault()
    // e.stopPropagation()
    e.currentTarget.classList.add("dragging")
    setElement(index)
  }
  function dragEnd(e) {
    // e.preventDefault()
    // e.stopPropagation()
    e.currentTarget.classList.remove("dragging")
    setElement(null)
  }
  function dragging(e, index) {
    e.preventDefault()
    setDragPosition(index)
    // console.log('to drop on position ' + index)
  }
  function drop(e) {
    e.preventDefault()
    // now change array order
    moveTo(element, dragPosition)
  }
  function moveTo(element, target_position) {
    console.log("need to move " + element + " to " + target_position)
    let image = arrangement[element]
    let newArrangement = [...arrangement]
    newArrangement.splice(element, 1)
    newArrangement.splice(target_position, 0, image)
    setArrangement(newArrangement)
  }
  function moveUp(index) {
    if (index == arrangement.length - 1) return
    setArrangement((oldArrangement) => {
      let newArrangement = [...oldArrangement]
      let item = newArrangement.splice(index, 1)[0]
      newArrangement.splice(index + 1, 0, item)
      return newArrangement
    })
  }
  function moveDown(index) {
    if (index == 0) return // prevent moving outside of array range
    setArrangement((oldArrangement) => {
      let newArrangement = [...oldArrangement]
      let item = newArrangement.splice(index, 1)[0]
      newArrangement.splice(index - 1, 0, item)
      return newArrangement
    })
  }
  async function updateArrangement() {
    let url = `/api/beam/edit/${props.gallery_id}/arrangement`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(arrangement),
      })
      if(res.status === 200){
        props.refreshData()
        props.toggle(false)
      }
      console.log(res.status)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    console.log(arrangement)
  }, [arrangement])
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center  p-32"
      style={{
        zIndex: 9999,
        marginLeft: `${props.sidebar ? '240px' : 0}`
        // background: "rgba(0,0,0,.7)",
      }}
    >
      <div
        className="fixed top-0 bottom-0 left-0 right-0"
        onClick={(e) => props.toggle(false)}
        style={{
          zIndex: "0",
          background: "rgba(0,0,0,.6)",
        }}
      ></div>
      <Panel
        onDrop={e => e.preventDefault()}
        id="arrangement-panel"
        className="my-24 mx-24 py-6 px-16 w-full h-full flex flex-col"
        style={{
          zIndex: 99,
          backgroundColor: `${colors.backgroundDark}`,
          borderRadius: "3px",
          boxShadow: "0 0 14px rgba(0,0,0,.5)",
        }}
      >
        <div className="arrangement-title mb-4">
          <h3 className="font-bold text-lg">Drag to rearrange</h3>
        </div>
        <div className="tile-container flex flex-row flex-wrap flex-grow">
          {arrangement.map((imageObj, index) => {
            return (
              <div
                className="position py-4 px-4"
                id={`arrangement-position-${index}`}
                onDragOver={(e) => dragging(e, index)}
                key={`arrangement-preview-${imageObj.file_name}`}
              >
              
                <Tile
                  draggable={true}
                  activeForDrop={dragPosition === index}
                  cover={index === 0}
                  onDragStart={(e) => dragStart(e, index)}
                  onDragEnd={(e) => dragEnd(e)}
                  onDrop={(e) => drop(e)}
                  id={`arrangement-tile-${index}`}
                  className=" flex flex-col draggable-tile"
                >
                  <div
                    className="image-holder w-32 h-24 bg-black relative"
                    style={{
                      boxShadow: "0 0 8px rgba(0,0,0,.6)",
                    }}
                  >
                    <img
                      src={imageObj.path_lq}
                      alt=""
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                
                  {/* <div className="button-wrap mt-4 flex flex-row w-full items-center justify-between">
                    <div className="w-50 flex flex-row justify-start">
                      {index !== 0 && (
                        <button
                          className="rounded-full h-6 w-6 flex flex-col justify-center items-center"
                          onClick={(e) => moveDown(index)}
                          style={{
                            background: `${colors.backgroundLightest}`,
                          }}
                        >
                          <i className="fas fa-chevron-left block"></i>
                        </button>
                      )}
                    </div>
                    {index === 0 && (
                      <div className="font-bold text-xs">cover image</div>
                    )}
                    <div className="w-50 flex flex-row justify-end">
                      {index !== arrangement.length - 1 && (
                        <button
                          className="rounded-full h-6 w-6 flex flex-col justify-center items-center"
                          onClick={(e) => moveUp(index)}
                          style={{
                            background: `${colors.backgroundLightest}`,
                          }}
                        >
                          <i className="fas fa-chevron-right block"></i>
                        </button>
                      )}
                    </div>
                  </div> */}
                </Tile>
                {
                    index === 0 &&
                    <div className="text-sm font-extrabold mt-3">
                      cover
                    </div>
                  }
              </div>
            )
          })}
        </div>

        <div id="arrangement-control" className="flex flex-row justify-end">
          <button
            onClick={(e) => props.toggle(false)}
            className="px-6 py-1 font-bold mr-8"
            style={{
              borderRadius: '3px',
              color: `${colors.backgroundLight}`,
            }}
          >
            Cancel
          </button>
          <button
            onClick={(e) => updateArrangement()}
            className="px-6 py-1 font-bold"
            style={{
              borderRadius: "3px",
              background: `${colors.success}`,
            }}
          >
            Confirm
          </button>
        </div>
      </Panel>
    </div>
  )
}
const Tile = styled.div`
  cursor: grab;
  .dragging {
    cursor: grabbing;
  }
  .image-holder {
    border: ${(props) =>
      props.activeForDrop ? "2px solid rgba(255,255,255,.4)" : "2px solid transparent"};
      border-radius:4px;
      overflow:hidden;
    /* border-color: ${(props) => (props.cover ? colors.success : "transparent")}; */
    border-width: 2px;
    :after{
      content: '';
      position: absolute;
      top:0;
      bottom:0;
      left:0;
      right:0;
      background: ${(props) => (props.activeForDrop ? "rgba(255,255,255,.1)" : "transparent")};
      z-index: 9;

    }
  }
  .button-wrap {
    opacity: 0;
    transition: all 0.05s linear;
  }
  :hover {
    .button-wrap {
      opacity: 1;
    }
  }
`
const enter = keyframes`
  from{
    opacity: 0;
    transform: scale(.5);
  }
  to{
    opacity: 1;
    transform: scale(1);
  }
`
const Panel = styled.div`
  opacity: 0;
  transform: scale(0.5);
  animation: ${enter} 0.1s linear forwards;
`

function mapStateToProps(state){
  return{
    sidebar: state.app_state_reducer.sidebar
  }
}
export default connect(mapStateToProps)(ArrangementView)
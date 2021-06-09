import React, { useEffect, useRef } from "react"
import styled from "styled-components"
export default function ImageMenu(props) {
  const ref = useRef()
  useEffect(() => {
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  })
  function handleClick(e) {
    if (e.target !== ref.current && e.target.parentNode !== ref.current) {
      props.toggleMenu(false)
    }
  }
  function deleteImage() {
    let image = props.image
  }
  return (
    <Menu className="absolute text-left right-0 text-sm bg-gray-900" ref={ref}>
      <ul>
      <Li>
      <a target="_blank">Make First</a>
      
      </Li>
      <Li>
      <a href={`${props.path}`} target="_blank">View Full Resolution</a>
      
      </Li>
      <Li>
      <a href={`${props.path}`} download>Download Full Resolution</a></Li>
        <Li className="">Share</Li>
        <Li
          className="text-red-600"
          onClick={(e) => props.deleteImage(props.image_id, props.image_name)}
        >
          Delete
        </Li>
      </ul>
    </Menu>
  )
}
const Menu = styled.div`
  border-radius: 12px;
  padding: 0.8rem 1.4rem;
  top: 100%;
  font-family: inherit;
`
const Li = styled.li`
    margin: 12px 0;
    white-space: nowrap;
    opacity: .7;
    :hover{
        opacity: 1
    }
`

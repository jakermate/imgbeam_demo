import React from "react"
import defaultAvatar from "./avatar.png"
import styled from "styled-components"
export default function Avatar(props) {
  console.log(props)
  return (
    <AvatarEl className="flex flex-row items-center relative justify-center text-white"
        onClick={(e) => props.toggleAccountMenu((old) => !old)}
    >
   
      
      <div
        id="avatar-image-container"
        className="overflow-hidden relative"
        style={{
          borderRadius: '100%',
          width: '36px',
          height:'36px',
          // transform: props.active ? "scale(1.2)" : "scale(1)",
          backgroundImage: `url(${props.account.avatar || defaultAvatar})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "all .3s cubic-bezier(0.68, -0.6, 0.32, 1.6)",
        }}
      >
        <div className="chevron-container flex items-center justify-center absolute top-0 bottom-0 left-0 right-0 opacity-0" style={{
          background: 'rgba(255,255,255,.3)'
        }}>
        <i className="fas block fa-chevron-down"></i>
        </div>
      </div>
      
    </AvatarEl>
  )
}
const AvatarEl = styled.div`
  padding: 6px 16px;
  transition: all .1s linear;
  border: 1px solid transparent;
  :hover{
    /* box-shadow: 1px 1px 3px rgba(0,0,0,.3); */
      /* border: 1px solid  rgba(100,100,100,.1); */
      .chevron-container{
      opacity: 1;

    }
  }

`


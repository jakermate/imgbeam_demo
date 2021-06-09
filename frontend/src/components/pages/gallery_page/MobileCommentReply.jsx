import React, {useEffect} from "react"
import styled, {keyframes} from "styled-components"
export default function MobileCommentReply(props) {
    useEffect(()=>{
        console.log(props)
    },[])

    if(!props){
        return(
            <div></div>
        )
    }
  else return (
    <Container active={props.active} className="fixed top-0 bottom-0 right-0 left-0 block md:hidden">
      <div className="overlay fixed top-0 bottom-0 left-0 right-0 bg-black opacity-50"></div>
      
      <Popup active={props.active} className="bg-black">
        <div>
            <div className="top-control">
                <button onClick={e => props.setReplyActive(false)}>close</button>
            </div>
          <h3 className="text-white">{props.comment.message}</h3>
        </div>
      </Popup>
    </Container>
  )
}
const enter = keyframes`
    from{
        bottom: -100vh;
    }
    to{
        bottom: 0%
    }
`
const Popup = styled.div`
  position: fixed;
  height: 90vh;
  width: 100%;
  left: 0;
  z-index: 9999;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  /* bottom: ${(props) => (props.active ? "0%" : "-100vh")}; */
  transition: all 1s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  animation: ${enter} .3s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
`
const Container = styled.div`
  display: ${(props) => (props.active ? "block" : "none")};
`

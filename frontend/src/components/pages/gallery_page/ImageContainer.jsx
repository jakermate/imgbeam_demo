import React from "react"
import fallbackImageAlt from "./404Gorilla_alt.svg"
import {toggleFocusView, setFocusPath} from '../../../state/store/actions/index'
import {connect} from 'react-redux'
import styled from "styled-components"
function ImageContainer(props) {
  function setFocus(){
    props.setFocusPath({focusPath: props.string, focusGallery: props.gallery})
    props.toggleFocusView()
  }
  return (
    <ImageContainerEl onClick={e => setFocus()} className="image-panel overflow-hidden w-full mb-6 relative shadow-xl" style={{
      cursor: "zoom-in",
    }}>
      <div className="image-vessel bg-black relative" style={{
        width:"100%",
        // paddingBottom: `${(props.image.height /props.image.width * 100).toFixed(1)}%`
      }}>
        <img
          className="gallery-image mx-auto object-contain"
          onError={(e) => {
            e.target.src = fallbackImageAlt
            e.target.alt = "404 Image By Beebsmon"
            e.target.style.width = "200px"
          }}
          src={props.string}
          alt=""
          style={{
            maxWidth:'100%',
            // width: `${props.image.width}px`,
            // height: '100%',
            // objectFit:'contain'
          }}
        />
      </div>
      {
        props.image.width > 0 &&
        <div className="image-info opacity-25 p-4">
          {props.image.width} x {props.image.height}
        </div>
      }
     

      <DescriptionContainer
        className=""
        shown={props.description}
      >
        
        <div className="image-description-container text-white p-6">
          {props.description}
        </div>
      </DescriptionContainer>
    </ImageContainerEl>
  )
}
const ImageContainerEl = styled.div`
border-radius: 8px;
  .image-info{
    background-color: ${props => props.theme.background_3};
  }
`
const DescriptionContainer = styled.div`
  display: ${(props) => (props.shown ? "block" : "none")};
`
function mapStateToProps(state){
  return{
    focusPath: state.app_state_reducer.focusPath
  }
}
const mapDispatchToProps = {
  toggleFocusView,
  setFocusPath
}
export default connect(mapStateToProps, mapDispatchToProps)(ImageContainer)
import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import Menu from "./ImageMenu"
export default function ImageContainer(props) {
  const [menu, toggleMenu] = useState(false)
  const inputRef = useRef()
  const [newDescription, setNewDescription] = useState('')
  const [editing, toggleEditing] = useState(false)
  function deleteImage(){
    
  }
  function edit() {
    setNewDescription(props.description)
    toggleEditing(true)
  }
  useEffect(()=>{
    if(editing){
        inputRef.current.focus()
    }
  }, [editing])
  function doneEditing(e){
    toggleEditing(false)
    changeDescription()
  }
  function on_enter_key(e){
    if(e.keyCode == 13){
        inputRef.current.blur()
    }
  }
  async function changeDescription(){
    let updatedDescription = newDescription
    
    let url = `/beam/api/edit/${props.gallery_id}/description?description=${updatedDescription}&image_id=${props.image_id}`
    try {
      let res = await fetch(url, {
        method: "post",
        credentials: "include",
        mode: "cors",
      })
      let json = await res.json()
      console.log(json)
      if (json.success) {
        console.log("Description updated.")
        props.updateGallery()
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <ImageContainerEl className="mb-4 relative">
      <div className="overlay absolute opacity-0 top-0 left-0 right-0 bottom-0">
          <div className="image-delete-button absolute top-0 right-0">
            <button className="p-4" onClick={e => props.deleteImage(props.image_id, props.image_name)}>
            <i className="fas fa-times text-white fa-2x"></i>
            </button>
          </div>
      </div>
      <div className="image-wrapper">
        <img src={props.path} alt={props.description || props.path} />
        <div
          className="menu-button"
          onClick={(e) => {
            toggleMenu((old) => !old)
          }}
        >
          <i className="fas fa-ellipsis-h"></i>
          {menu && (
            <Menu
              path={props.path}
              toggleMenu={toggleMenu}
              deleteImage={props.deleteImage}
              image_name={props.image_name}
              image_id={props.image_id}
            ></Menu>
          )}
        </div>
      </div>
      <div
        onClick={(e) => edit(e)}
        className="description-edit py-8 text-left px-4 overflow-x-hidden"
        style={{
          cursor: "pointer",
        }}
      >
        {editing ? (
          <Input onKeyDown={e=> on_enter_key(e)} onChange={e=>setNewDescription(e.target.value)} value={newDescription} onBlur={e=>doneEditing()} ref={inputRef} type="text" />
        ) : (
          props.description || 
          <div className="w-full flex flex-col justify-center items-center">
          <i className="fas fa-pencil-alt"></i>
          </div>
        )}
      </div>
    </ImageContainerEl>
  )
}
const ImageContainerEl = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 0 24px rgba(0,0,0,.3);
  .overlay{
    z-index:99;
  }
  :hover{
    .overlay{
      opacity: 1;
    }
  }
  div.image-wrapper {
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
    div.menu-button {
      transition: all 0.1s linear;
      border-radius: 100%;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 99;
      height: 40px;
      margin-right: 10px;
      margin-bottom: 10px;
      opacity: 0.6;
      position: absolute;
      bottom: 0;
      right: 0;
      font-weight: 900;
      :hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
`
const Input = styled.input`
    outline: none;
    border: none;
    width: 100%;
    margin-right: 1rem;
    background: transparent;
`
import { scale } from "jimp"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import SuperGrid from "../../SuperGrid"
import SignInPlaceholder from '../../SignInPlaceholder'
export default function FavoritesView(props) {
  const [favorites, setFavorites] = useState([])
  const [folders, setFolders] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    getFolders()
  }, [])
  
  async function getFolders() {
    let url = `/api/account/favorites/folders`
    try {
      let res = await fetch(url, {
        credentials: "include",
      })
      if (res.status == 200) {
        setFolders(await res.json())
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function getFolder() {
    let url = `/api/account/favorites/folders/${active}`
    // console.log("getting " + active)
    try {
      let res = await fetch(url, {
        credentials: "include",
      })
      if (res.status == 200) {
        let json = await res.json()
        // console.log(json)
        setFavorites(json)
      }
    } catch (err) {}
  }
  useEffect(() => {
   getFolder()
  }, [active])
  const [dropFolder, setDropFolder] = useState(null)
  const [dragged, setDragged] = useState(null)
  // useEffect(() => {
  //   // console.log(dragged)
  // }, [dragged])
  // useEffect(() => {
  //   console.log(dropFolder)
  // }, [dropFolder])
  function onDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    let split = dragged.split('-')
    let gallery_id = split[1]
    // console.log(
    //   "need to move favorite  " + gallery_id + " into folder id: " + dropFolder
    // )
    moveToFolder(gallery_id)
  }
  async function moveToFolder(gallery_id){
    // get favorite id from gallery_id
    let url = `/api/account/favorites/move/${gallery_id}/${dropFolder}`
    try {
      let res = await fetch(url, {
        credentials: 'include',
        method: "PUT"
      })
      if(res.status == 200){
        getFolder()
      }
    } catch (err) {
      console.log(err)
    }
  }
  if(props.signedIn)
  return (
    <div className="mx-4">
      <Folders
        active={active}
        onDrop={onDrop}
        setDropFolder={setDropFolder}
        setActive={setActive}
        getFolders={getFolders}
        folders={folders}
      ></Folders>
      <SuperGrid
        favoritesMode
        draggable
        setDragged={setDragged}
        galleries={favorites}
        title={folders[folders.map((folder)=> folder.folder_id).indexOf(active)] ? folders[folders.map((folder)=> folder.folder_id).indexOf(active)].name : "Uncategorized"}
      ></SuperGrid>
    </div>
  )
  else return(
    <div className="text-white">
            <SignInPlaceholder header={`Keep a list of what you like.`} icon={`fas fa-heart`} subheader={`Sign in save and organize your favorite posts.`}></SignInPlaceholder>
          
        </div>
  )
}
function Folders(props) {
  return (
    <div className="flex flex-row pt-8  overscroll-x-auto">
      <Folder
        active={props.active == null}
        folderObject={
          props.folderObject || {
            name: "Uncategorized",
            folder_id: null,
          }
        }
        setDropFolder={props.setDropFolder}
        onDrop={props.onDrop}
        setActive={props.setActive}
        getFolders={props.getFolders}
      ></Folder>
      <AddFolder getFolders={props.getFolders}></AddFolder>

      {props.folders.map((folderObject) => {
        return (
          <div>
            <Folder
              active={props.active === folderObject.folder_id}
              onDrop={props.onDrop}
              key={`favorites-folder-${folderObject.name}`}
              setActive={props.setActive}
              folderObject={folderObject}
              getFolders={props.getFolders}
              setDropFolder={props.setDropFolder}
            ></Folder>
          </div>
        )
      })}
    </div>
  )
}
function Folder(props) {
  useEffect(()=>{
    setNameString(props.folderObject.name)
  },[])
  const [nameString, setNameString] = useState("")
  const [editing, toggleEditing] = useState(false)
  async function deleteFolder(folder_id) {
    let url = `/api/account/favorites/folders/delete?id=${folder_id}`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "DELETE",
      })
      if (res.status == 200) {
        props.getFolders()
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function renameFolder() {
    toggleEditing(false)
    if(nameString === props.folderObject.name) return
    let url = `/api/account/favorites/folders/${props.folderObject.folder_id}/${nameString}`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "PUT",
      })
      if (res.status == 200) {
        props.getFolders()
      }
    } catch (err) {
      console.log(err)
    }
  }
  function draggingOver(e) {
    e.stopPropagation()
    e.preventDefault()
    props.setDropFolder(props.folderObject.folder_id)
  }
  const [count, setCount] = useState(0)
  function validateName(e){
    if(nameString.length < 48){
      setNameString(e.target.value)
    }
  }
  useEffect(() => {
    // console.log(count)
    if (count == 1) {
      document
        .getElementById(`folder-${props.folderObject.folder_id}`)
        .classList.add("animate__shakeY")
    }
    if (count == 0) {
      document
        .getElementById(`folder-${props.folderObject.folder_id}`)
        .classList.remove("animate__shakeY")
    }
  }, [count])
  function interceptEnter(e){
    if(e.keyCode === 13){
      document.getElementById(`favorite-folder-input-${props.folderObject.folder_id}`).blur()
    }
  }
  useEffect(()=>{
    if(editing){
      if(document.getElementById(`favorite-folder-input-${props.folderObject.folder_id}`)){
        document.getElementById(`favorite-folder-input-${props.folderObject.folder_id}`).focus()
      }
    }
  },[editing])
  return (
    <FolderHolder
        active={props.active}

      onDrop={(e) => props.onDrop(e)}
      onDragLeave={(e) => setCount(count - 1)}
      onDragEnter={(e) => setCount(count + 1)}
      onDragOver={(e) => draggingOver(e)}
    >
      <FolderElement
        active={props.active}

        id={`folder-${props.folderObject.folder_id}`}
        className="animate__animated "
        onClick={(e) => {
          props.setActive(props.folderObject.folder_id)
        }}
      ></FolderElement>
      <div className="folder-info flex flex-row items-center pt-4">
      {
        !editing ? 
        <div
        onClick={e => toggleEditing(true)}
        className="name w-full text-center font-bold"
        style={{
          fontSize: "11px",
          cursor: "pointer"
        }}
      >
        {props.folderObject.name}
      </div>
      :
      <input id={`favorite-folder-input-${props.folderObject.folder_id}`} type="text" onKeyDown={e => interceptEnter(e)} onChange={e => validateName(e)} value={nameString} onBlur={e => renameFolder(e)} />
      }
        
       
      </div>
    </FolderHolder>
  )
}
function AddFolder(props) {
  async function createFolder(e) {
    let url = `/api/account/favorites/folders`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "POST",
      })
      if (res.status == 200) {
        props.getFolders()
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <FolderHolder className="self-stretch px-4 flex flex-col items-center justify-start">
      <AddFolderEl
        className="flex flex-col items-center justify-center"
        onClick={(e) => createFolder(e)}
      >
        <i className="fas fa-plus opacity-50"></i>
      </AddFolderEl>
    </FolderHolder>
  )
}

const FolderHolder = styled.div`
  /* padding: 12px 24px; */
  width: 120px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: start;
  color: ${props => props.active ? props.theme.text : 'rgba(140,140,140,1)'};
  input{
    background: transparent;
    font-size: 12px;
    max-width: 160px;
    outline:none;
    text-align: center;
    :focus{
      outline: none;
    }
  }
`
const AddFolderEl = styled.button`
  width: 82px;
  height: 64px;
  background: ${props => props.theme.background_3};
  border-radius: 8px;
`
const FolderElement = styled.button`
  width: 82px;
  height: 64px;
  background: ${props => props.theme.success};
  box-shadow: 2px 2px 6px rgba(0,0,0,.4);
  transform: ${props => props.active ? 'scale(1.2)' : 'scale(1)'};
  opacity: ${props=> props.active ? 1 : .5};
  border-radius: 8px;
  :hover{
    transform: scale(1.09);
  }
  .animate__animated.animate__shakeY  {
  }
  :after{
    content: '';
    position: absolute;
    top: -6px;
    left:0;
    border-radius: 8px;
    width: 40px;
    height: 20px;
    background: ${props => props.theme.success};

  }
`

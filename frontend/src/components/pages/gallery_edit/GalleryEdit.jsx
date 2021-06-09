import React, { useEffect, useState } from "react"
import ImageContainer from "./ImageContainer"
import { Redirect, useHistory } from "react-router-dom"
import styled from "styled-components"
import VideoContainer from "../gallery_page/VideoContainer"
import moment from "moment"
import MoonLoader from "react-spinners/MoonLoader"
import theme from "../../../theme/colors"
import ArrangementView from "../gallery_page/ArrangementView"
import {Hr} from '../../Sidebar'
export default function GalleryEdit(props) {
  const [error, setError] = useState(false)
  const [gallery, setGallery] = useState({
    title: "",
    images: [],
    username: "",
  })
  const history = useHistory()
  const [tags, setTags] = useState([])
  const [recieved, setRecieved] = useState(false)
  let prepend = process.env.MODE === "production" ? "" : "http://localhost:8888"

  // get initial data on load
  useEffect(() => {
    fetchData()
    getTags()
    getFavorites()
    getLikes()
  }, [])
  async function fetchData() {
    console.log("requesting gallery")
    try {
      let res = await fetch(`/api/beam/${props.match.params.gallery_id}`, {
        credentials: "include",
      })
      let json = await res.json()
      console.log(json)
      setError(false)
      setGallery(json)
      setRecieved(true)
    } catch (err) {
      console.log(err)
      setError(true)
      setRecieved(true)
    }
  }

  //tags
  const [newTagActive, setNewtagActive] = useState(false)
  const [newTag, setNewTag] = useState("")
  function makeNewTag(e) {
    setNewtagActive(true)
  }
  useEffect(() => {
    console.log(newTagActive)
  }, [newTagActive])
  async function onBlurTag(e) {
    setNewtagActive(false)
    if (e.target.value.replace(/\.[^/.]+$/, "").length > 0) {
      // upload
      let url = `/api/beam/edit/${props.match.params.gallery_id}/tags/add?tag=${newTag}`
      setNewTag("") // reset string
      try {
        let res = await fetch(url, {
          method: "post",
          mode: "cors",
          credentials: "include",
        })
        console.log(res.status)
        if (res.status == 200) {
        }
        getTags()
      } catch (err) {
        console.log(err)
      }
    }
  }
  async function deleteTag(tagString) {
    console.log("request to delete " + tagString)
    let url = `/api/beam/edit/${props.match.params.gallery_id}/tags/remove?tag=${tagString}`
    try {
      let res = await fetch(url, {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
      })
      if (res.status == 200) {
        getTags()
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if (newTagActive) {
      document.getElementById("new-tag-input").focus()
    }
  }, [newTagActive])
  function tag_press_enter(e) {
    if (e.keyCode == 13) {
      document.getElementById("new-tag-input").blur()
    }
  }

  // get tags
  async function getTags() {
    console.log("getting tags")
    try {
      let res = await fetch(`/api/beam/${props.match.params.gallery_id}/tags`, {
        credentials: "include",
        mode: "cors",
        method: "get",
      })
      if (res.status === 200) {
        let tags = await res.json()
        setTags(tags)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    console.log(tags)
  }, [tags])
  // callback for when data is set to state
  useEffect(() => {
    document.title = gallery.title + ` by ${gallery.username}`
  }, [gallery])
  function triggerFileInput(e) {
    document.getElementById("new-image-input").click()
  }

  // get likes
  const [likes, setLikes] = useState([])
  async function getLikes() {
    let url = `/api/beam/${props.match.params.gallery_id}/likes`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "get",
        mode: "cors",
      })
      let json = await res.json()
      if (json.success) {
        console.log(json.likes)
        setLikes(json.likes)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // new file uplaod
  const [file, setFile] = useState()

  useEffect(() => {
    console.log("file loaded")
    // send file
    if (file) {
      addImage(file)
    }
  }, [file])
  async function addImage(file) {
    let data = new FormData()
    data.append("file", file)
    try {
      let res = await fetch(
        `/api/beam/edit/${props.match.params.gallery_id}/images/add`,
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: data,
        }
      )
      // if success, redirect to gallery
      console.log(res.status)
      fetchData()
      setFile(null)
    } catch (err) {
      console.log(err)
    }
  }

  // delete image
  function deleteImage(image_id, image_name) {
    console.log("deleting " + image_id)
    // display are you sure box
    if (window.confirm("Are you sure you want to delete?")) {
      // run delete
      request_image_delete(image_id, image_name)
    } else {
      console.log("Aborted.")
    }
  }
  async function request_image_delete(image_id, image_name) {
    // abort if only 1 image
    if (gallery.images.length == 1) {
      alert("Gallery must contain at least one image.")
      return
    }
    let url = `/api/beam/edit/${props.match.params.gallery_id}/images/remove?image_id=${image_id}&image_name=${image_name}`
    try {
      let res = await fetch(url, {
        mode: "cors",
        credentials: "include",
        method: "post",
      })
      if (res.status == 200) {
        console.log("Image removed.")
        fetchData()
      }
    } catch (err) {
      console.log(error)
    }
  }

  async function request_gallery_delete(e) {
    if (!window.confirm("Are you sure you want to delete?")) {
      return
    }
    let url = `/api/beam/edit/${props.match.params.gallery_id}/delete`
    try {
      let res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      })
      // redirect on success
      if (res.status === 200) {
        history.push(`/user/${gallery.username}`)
      }
      console.log(res.status)
    } catch (err) {
      console.log(err)
    }
  }

  // edit title
  const [editTitle, setEditTitle] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  function toggleTitleEdit() {
    setNewTitle(gallery.title)
    setEditTitle(true)
  }
  useEffect(() => {
    if (editTitle) {
      document.getElementById("title-edit").focus()
    }
  }, [editTitle])
  function title_pressed_enter(e) {
    if (e.keyCode == 13) {
      document.getElementById("title-edit").blur()
    }
  }
  function updateTitle(e) {
    setEditTitle(false)
    changeTitle()
  }
  async function changeTitle(e) {
    let updatedTitle = newTitle

    let url = `/api/beam/edit/${props.match.params.gallery_id}/title?title=${updatedTitle}`
    try {
      let res = await fetch(url, {
        method: "post",
        credentials: "include",
        mode: "cors",
      })
      if (res.status === 200) {
        fetchData()
      }
    } catch (err) {
      console.log(err)
    }
  }

  function doneEditing() {
    props.history.push(`/beam/${props.match.params.gallery_id}`)
  }

  // get favorites
  const [favorites, setFavorites] = useState(0)
  async function getFavorites() {
    try {
      let res = await fetch(
        `/api/beam/${props.match.params.gallery_id}/favoritescount`
      )
      let json = await res.json()
      // console.log(json.favorites)
      setFavorites(json.favorites)
    } catch (err) {
      console.log(err)
    }
  }

  // arrangement

  // Arrangement
  const [arranging, toggleArranging] = useState(false)

  // if error, display 404
  if (error) {
    return <div>not found</div>
  }
  // if not yet received, display spinner
  else if (!recieved) {
    return (
      <div className="flex h-screen w-full flex-col justify-center items-center">
        <MoonLoader color={"white"}></MoonLoader>
        {/* <div>
          Finding...
        </div> */}
      </div>
    )
  }

  // markup
  else
    return (
      <View
        className="pt-24 mx-4 relative"
        id="post-edit-page"
        style={{
          zIndex: 99,
        }}
      >
        {gallery.owner === false && (
          <Redirect to={`/beam/${props.match.params.gallery_id}`}></Redirect>
        )}

        <div className="flex relative flex-col container mx-auto">
          <div
            className="flex flex-row  relative mx-auto box-border  pb-12 "
            style={{}}
          >
            <div
              id="edit-post-info"
              className="edit-meta  sm:mr-6 text-left sticky"
              style={{
                maxWidth: "340px",
                minWidth: "260px",
                position: "-webkit-sticky",
                position: "sticky",
                top: "90px",
                alignSelf: "flex-start",
              }}
            >
              <MetaInfo className="flex flex-row relative ">
                <div className="px-4 md:px-0 pb-6 relative z-10">
                  {!editTitle ? (
                    <TitleClick
                      onClick={(e) => toggleTitleEdit()}
                      className="text-2xl font-bold"
                      style={{ cursor: "text" }}
                      title="Click to edit title."
                    >
                      {gallery.title || (
                        <span className="opacity-75">add a title</span>
                      )}
                    </TitleClick>
                  ) : (
                    <TitleEdit
                      id="title-edit"
                      onKeyDown={(e) => title_pressed_enter(e)}
                      onBlur={(e) => updateTitle(e)}
                      className="text-2xl outline-none font-bold bg-transparent"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    ></TitleEdit>
                  )}

                  <h3 className="text-xs opacity-50 font-bold">
                    {moment(gallery.date_created).format("MMMM Do YYYY")}
                  </h3>

                  <div id="post-edit-description" className="mt-6">
                    {gallery.description}
                  </div>
                </div>
              </MetaInfo>

              <MetaInfo id="edit-tags-section" className="mt-3">
                {/* <h2 className="text-sm font-bold ">TAGS</h2> */}

                <div id="tags-section" className="mb-3">
                  {tags &&
                    tags.map((tag, indx) => {
                      return (
                        <Tag key={`edit-tag-${indx}`} className="" style={{}}>
                          <div
                            className="delete-tag-button"
                            onClick={(e) => deleteTag(tag.name)}
                          >
                            <i className="fas fa-minus-circle fa-lg"></i>
                          </div>
                          <div className="text-xs">{tag.name}</div>
                        </Tag>
                      )
                    })}
                  {/* limit total number of tags */}
                  {tags.length < 20 && (
                    <AddTag
                      style={{}}
                      className="mr-5 "
                      active={newTagActive}
                      onClick={(e) => makeNewTag(e)}
                      // onBlur={(e) => setNewtagActive(false)}
                    >
                      {!newTagActive ? (
                        <i className="fas fa-plus" style={{}}></i>
                      ) : (
                        <TagInput
                          id="new-tag-input"
                          type="text"
                          name="new-tag"
                          style={{}}
                          onBlur={(e) => onBlurTag(e)}
                          onKeyDown={(e) => tag_press_enter(e)}
                          onChange={(e) => setNewTag(e.target.value)}
                          value={newTag}
                        />
                      )}
                    </AddTag>
                  )}
                </div>
              </MetaInfo>
              <div id="edit-post-controls-list" className="mt-8 relative">
                <ul className="text-sm">
                  <li className="my-1 py-1 flex flex-row items-center ">
                    {gallery.singleton ? (
                      <a
                        className="flex flex-row items-center w-full"
                        href={`${prepend}/api/beam/${props.match.params.gallery_id}/download`}
                        download
                      >
                        <Item
                          icon={"fa-save"}
                          string={"Download Gallery"}
                        ></Item>
                      </a>
                    ) : (
                      <a
                        className="flex flex-row items-center w-full"
                        href={`${prepend}/api/beam/${props.match.params.gallery_id}/zip`}
                        download
                      >
                        <Item
                          icon={"fa-save"}
                          string={"Download Gallery"}
                        ></Item>
                      </a>
                    )}
                  </li>
                  <li className="my-1 py-1 font-bold ">
                    <Item
                      string={"Rearrange Media"}
                      icon={"fa-random"}
                      action={toggleArranging}
                    ></Item>
                  </li>
                  <li className="my-1 py-1 font-bold ">
                    <Item
                      icon={"fa-trash"}
                      string={"Delete Gallery"}
                      action={request_gallery_delete}
                    ></Item>
                  </li>
                </ul>
              </div>
              <Hr className=""></Hr>

              <div
                className="mt-8 flex flex-row items-center"
                style={{
                  height: "32px",
                }}
              >
                <PrimaryActionButton
                  className="px-8 self-stretch py-1 w-full text-xs font-extrabold"
                  onClick={(e) => doneEditing()}
                  style={{
                    maxWidth: "200px",
                  }}
                >
                  Finish Editing
                </PrimaryActionButton>
                <PrimaryActionButton className="ml-3 self-stretch px-3">
                  <i className="fas fa-chevron-down"></i>
                </PrimaryActionButton>
              </div>
            </div>

            <div
              className="edit-content mt-12 sm:mt-0  pb-12"
              style={{
                maxWidth: "680px",
              }}
            >
              <div id="gallery-columns">
                {recieved &&
                  gallery.images.map((imageObj, index) => {
                    if (imageObj.media_type === "image") {
                      return (
                        <ImageContainer
                          image_id={imageObj.image_id}
                          image_name={imageObj.file_name}
                          deleteImage={deleteImage}
                          path={imageObj.path}
                          updateGallery={fetchData}
                          description={imageObj.description}
                          key={`gallery-image-${index}`}
                          gallery_id={props.match.params.gallery_id}
                        />
                      )
                    } else {
                      return (
                        <VideoContainer
                          image_id={imageObj.image_id}
                          image_name={imageObj.file_name}
                          deleteImage={deleteImage}
                          string={imageObj.path}
                          key={`gallery-image-${index}`}
                          description={imageObj.description}
                          gallery_id={props.match.params.gallery_id}
                        ></VideoContainer>
                      )
                    }
                  })}
              </div>
              <div className="add-content-container">
                <Button
                  className="float-right px-12 py-1 text-sm font-bold "
                  onClick={(e) => triggerFileInput(e)}
                  title="Add new media"
                >
                  <div className="font-bold text-sm">New</div>
                  {/* <i className="fas fa-image fa-lg"></i> */}
                </Button>
                <input
                  type="file"
                  name=""
                  onChange={(e) => setFile(e.target.files[0])}
                  id="new-image-input"
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
        {arranging && (
          <ArrangementView
            toggle={toggleArranging}
            gallery_id={gallery.gallery_id}
            toggleArranging={toggleArranging}
            refreshData={fetchData}
            images={gallery.images}
          ></ArrangementView>
        )}
      </View>
    )
}

function Item(props) {
  return (
    <ItemEl color={props.color} onClick={(e) => props.action(e)} className="">
      <div className="flex item-content flex-row items-center justify-start">
        <div
          className="icon-holder flex flex-col items-center justify-center mr-4"
          style={{
            width: "32px",
          }}
        >
          <i
            className={`icon block fas ${props.icon} `}
            style={{
              fontSize: "20px",
            }}
          ></i>
        </div>
        <div className="text-sm font-semibold">{props.string}</div>
        <div className="ml-auto">{props.children}</div>
      </div>
    </ItemEl>
  )
}
const ItemEl = styled.button`
  width: 100%;
  :hover {
    .icon {
      color: ${(props) => props.color || props.theme.secondary};
    }
  }
  .check {
    color: ${(props) => props.theme.icons};
  }
  .icon {
    color: ${(props) => props.theme.icons_2};
  }
  .item-content {
    padding: 8px 8px;
    border-radius: 8px;
    :hover {
      background-color: ${(props) => props.theme.background_3};
    }
  }
`
const View = styled.div`
  color: ${(props) => props.theme.text};
`
const MetaInfo = styled.div``
const Button = styled.button`
  position: relative;
  color: white;
  overflow: hidden;
  border-radius: 3px;
  /* border-radius: 26px; */
  background: ${theme.success};
`
const Tag = styled.div`
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 1rem;
  display: inline-block;
  position: relative;
  padding: 10px 18px;
  font-weight: bolder;
  border-radius: 8px;
  box-shadow: ${props => `4px 4px 18px ${props.theme.background_4}`};
  border: ${props => `1px solid ${props.theme.border}`};
  transition: all 0.2s ease-in;
  :hover {
    div.delete-tag-button {
      display: block;
      right: -10px;
      top: 0;
    }
  }
  .delete-tag-button {
    display: ${(props) => (props.active ? "block" : "none")};
    position: absolute;
  }
`

const TitleClick = styled.h1`
  &:hover {
    opacity: 0.75;
  }
`
const TitleEdit = styled.input`
  overflow: visible;
  width: 100%;
`

const AddTag = styled.button`
  padding: 10px 24px;
  opacity: 0.3;
  display: inline-block;
  border-radius: 26px;
  transition: all 0.2s ease-in;

  input {
    border: none;
    outline: none;
    width: auto;
  }
`
const PrimaryActionButton = styled.button`
  border-radius: 8px;
  background: ${theme.success};
  color: white;
`
const TagInput = styled.input`
  background: ${(props) => props.theme.background_4};
  padding: 3px;
`
const IconContainer = styled.div`
  width: 24px;
  display: flex;
  margin-right: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

import React, { useEffect, useState } from "react"
import styled from "styled-components"
import {Link} from 'react-router-dom'
import colors from "../../../theme/colors"
import { Header } from "../account_page/Settings"
export default function HistoryView(props) {
  const [history, setHistory] = useState([])
  useEffect(() => {
    fetchGalleries()
  }, [])

  async function fetchGalleries() {
    let url = `/api/account/history`
    try {
      let res = await fetch(url, {
        credentials: "include",
      })
      if (res.status === 200) {
        let json = await res.json()
        console.log(json)
        setHistory(json)
      }
    } catch (err) {
      console.log(err)
    }
  }
  function sortIntoDays(galleries) {}
  return (
    <div className="container mx-auto pl-3  flex flex-row">
      <div className="flex-grow" id="history-list">
        <Header title={"Viewing History"}></Header>

        <ul className="mt-8 pb-6">
          {history &&
            history.map((gallery, index) => {
              return (
                <HistoryItem
                  key={`history-item-${gallery.gallery_id}`}
                  gallery={gallery}
                ></HistoryItem>
              )
            })}
        </ul>
      </div>
      <PermissionsPanel
        id="history-permissions"
        className="sticky pl-4 hidden md:block"
        style={{
          width: "320px",
          top: "64px",
          height: "calc(100vh - 64px)",
        }}
      >
        <Header title={"History Permissions"}></Header>
      </PermissionsPanel>
    </div>
  )
}
function HistoryItem(props) {
  return (
    <ListItem className="">
      <div
        className="h-full mr-4"
        style={{
          width: "220px",
        }}
      >
        <Link to={`/beam/${props.gallery.gallery_id}`}>
          {props.gallery.images[0].media_type == "image" ? (
            <img
              className=""
              src={props.gallery.images[0].path_lq}
              alt=""
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <video
              src={props.gallery.images[0].path_lq}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            ></video>
          )}
        </Link>
      </div>
      <Link to={`/beam/${props.gallery.gallery_id}`}>
        <div className="flex flex-col">
          <div className="history-item-title font-bold text-lg">
            {props.gallery.title}
          </div>
          <div
            className="history-item-poster text-sm flex flex-row"
            style={{
            }}
          >
            <div className="mr-4">{props.gallery.username}</div>
            <div>{props.gallery.views} views</div>
          </div>
          <div
            className="history-item-description mt-8 text-sm "
            style={{
            }}
          >
            {props.gallery.description}
          </div>
        </div>
      </Link>
    </ListItem>
  )
}
function DateHeader(props) {
  return <div></div>
}
const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  height: 140px;
  margin-bottom: 16px;
`
const PermissionsPanel = styled.div`
  background-color: ${props => props.theme.background_3};
`
import React, { useEffect, useState } from "react"
import ReactPlayer from "react-player"
import color from "string-to-color"
import styled from "styled-components"
import SuperGrid from "../../SuperGrid"
export default function TagResults(props) {
  const [galleries, setGalleries] = useState([])
  useEffect(() => {
    getGalleries()
  }, [])
  const [looking, setLooking] = useState(true)
  useEffect(() => {
    document.title = "#" + props.match.params.tagstring + " - imgbeam"
  })

  async function getGalleries() {
    setLooking(true)
    let tagString = props.match.params.tagstring
    let url = `/api/search/tags?tag=${tagString}`
    try {
      let res = await fetch(url)
      let json = await res.json()
      console.log(json)
      if (json) {
        setGalleries(json)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLooking(false)
    }
  }
  if (looking) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{
          width: "100%",
          height: "400px",
        }}
      >
        <div className="text-white font-bold text-sm">Searching for tag.</div>
      </div>
    )
  } else
    return (
      <div className="text-white">
        <div
          id="tag-results-header"
          className="py-12"
          style={{
            background: `linear-gradient(to bottom, ${color(
              props.match.params.tagstring
            )}55, ${color(props.match.params.tagstring)}00`,
          }}
        >
          <h2 className="font-bold text-5xl">
            <span className="opacity-50">#</span>
            {props.match.params.tagstring.replace("_", " ")}
          </h2>
          <h4>{galleries.length} galleries.</h4>
        </div>
        <SuperGrid usernames={true} avatars={true} galleries={galleries}></SuperGrid>
        
      </div>
    )
}
const Tile = styled.div`
  video {
    object-fit: cover;
  }
`

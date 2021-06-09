import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Tag from "./Tag"
export default function PopularTags(props) {
  const [tags, setTags] = useState([])
  useEffect(() => {
    getTags()
  }, [])
  async function getTags() {
    let url = `/trending/api/tags`
    try {
      let res = await fetch(url)
      let json = await res.json()
      console.log(json.tags)
    } catch (err) {
      console.log(err)
    }
  }
  if (!tags.length) {
    return <div></div>
  } else
    return (
      <div>
        <div>
          <h2>Popular Tags</h2>
        </div>
        <div className="flex flex-row">
          {tags.map((tag) => {
            return <Tag tag={tag}></Tag>
          })}
        </div>
      </div>
    )
}

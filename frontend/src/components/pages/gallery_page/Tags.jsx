import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import stc from "string-to-color"
export default function Tags(props) {
  useEffect(() => {
    getTags()
  }, [])
  const [tags, setTags] = useState([])
  async function getTags() {
    let url = `/api/beam/${props.gallery_id}/tags`
    try {
      let res = await fetch(url)
      let json = await res.json()
      if (res.status === 200) {
        setTags(json)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div id="tag-list" className="flex mt-6 mb-4 flex-row justify-start flex-wrap">
      {tags.map((tag, indx) => {
        return (
          <Link key={`gallery-tags-key-${indx}`} to={`/tag/${tag.name.replace(/ /g, "_")}`} className="">
            <Tag className="text-xs bg-opacity-50" color={`${stc(tag.name)}44`}>#{tag.name}</Tag>
          </Link>
        )
      })}
    </div>
  )
}
const Tag = styled.div`
  cursor: pointer;
  margin-bottom: 10px;
  padding: 8px 16px;
  margin-right: 1rem;
  display: inline-block;
  position: relative;
  border-radius: 8px;
  white-space: nowrap;
  background: ${(props) => props.color};
  text-transform: uppercase;
  font-weight: bolder;
  transition: all 0.2s ease-in;
  :hover {
    background: ${props => props.theme.background_3};
  }
`

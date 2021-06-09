import React, { useState, useEffect } from "react"
import MoonLoader from "react-spinners/MoonLoader"
import { Link } from "react-router-dom"
import styled from "styled-components"
export default function NewlyPosted(props) {
  const [newGalleries, setNewGalleries] = useState([])
  useEffect(() => {
    getMore()
  }, [])
  async function getMore() {
    let from = newGalleries.length
    let to = from + 10
    let url = `/trending/api/new?from=${from}&to=${to}`
    try {
      let res = await fetch(url)
      let json = await res.json()
      if (json.success) {
        console.log(json)
        setNewGalleries([...newGalleries, ...json.galleries])
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="mt-12 w-full">
      <div className="text-sm font-bold my-3 w-full">New Posts</div>
      <div
        id="newly-posted-list"
        className="flex flex-col justify-center w-full"
      >
        {newGalleries.length > 0 ? (
          <ul>
            {newGalleries.map((gallery) => {
              return (
                <ListItem className="mb-3 relative">
                  <Link
                    to={`/beam/${gallery.gallery_id}`}
                    className="relative block hover:border-opacity-25 border-opacity-0 border-2 border-gray-400"
                  >
                    <div className="overlay absolute top-0 left-0 bottom-0 right-0 ">
                      <div className="absolute top-0 items-center flex flex-col justify-center left-0 bottom-0 right-0 z-10" style={{
                          background:'rgba(0,0,0,.8)'
                      }}>
                      <div className="text-xs font-bold text-white z-20">
                        <div className="relative">{gallery.title}</div>
                        <div className="relative">{gallery.description}</div>
                      </div>
                      </div>
                     
                    </div>
                    <div
                      className="overflow-hidden relative"
                      style={{
                        height: "130px",
                      }}
                    >
                      {gallery.images[0]?.media_type === "image" ? (
                        <img
                          className="w-full h-full object-cover"
                          src={gallery.images[0]?.path}
                          alt=""
                          srcset=""
                        />
                      ) : (
                        <video
                          className="object-cover"
                          width={"100%"}
                          height={"100%"}
                          muted
                          autoPlay
                          src={`${gallery.images[0]?.path}`}
                        ></video>
                      )}
                    </div>
                  </Link>
                </ListItem>
              )
            })}
          </ul>
        ) : (
          <div className="flex-1 items-center flex flex-col pt-16">
            <MoonLoader></MoonLoader>
          </div>
        )}
      </div>
    </div>
  )
}
const ListItem = styled.li`
  .overlay {
    opacity: 0;
    transition: all 0.1s linear;
  }
  :hover {
    .overlay {
      opacity: 1;
    }
  }
`

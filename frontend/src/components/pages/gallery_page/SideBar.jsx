import React, { useEffect, useState } from "react"
import MoonLoader from "react-spinners/MoonLoader"
import parseViews from "../parseViews.js"
import { Link } from "react-router-dom"
import styled from "styled-components"
import moment from "moment"
export default function SideBar(props) {
  useEffect(() => {
    getTrending()
    getTags()
  }, [])
  const [hot, setHot] = useState([])
  const [fetching, setFetching] = useState(false)
  async function getTrending() {
    let from = hot.length
    let to = from + 20
    console.log("getting from " + from + " to " + to)
    let url = `/trending/api/main?from=${from}&to=${to}`
    try {
      setFetching(true)
      let res = await fetch(url)
      console.log(res)
      let json = await res.json()
      setFetching(false)
      console.log(json)
      if (json.success) {
        setHot((old) => [...old, ...json.galleries])
      }
    } catch (err) {
      setFetching(false)
      console.group(err)
    }
  }
  function getMore() {
    getTrending()
  }

  // trending tags
  const [tags, setTags] = useState([])
  async function getTags() {
    let url = `/trending/api/tags?from=0&to=10`
    try {
      let res = await fetch(url)
      let json = await res.json()
      console.log(json)
      if (json.success) {
        setTags(json.tags)
      }
    } catch (err) {
      console.log(err)
    }
  }
  if (hot.length == 0) {
    return (
      <div>
        <MoonLoader size={20}></MoonLoader>
      </div>
    )
  } else
    return (
      <div
        className="text-left w-full"
        style={{
          width: "180px",
        }}
      >
        {tags.length > 0 ? (
          <div id="hot-tags" className="font-extrabold opacity-75">
            <div>
              <i className="fas fa-tag mr-2"></i> Trending Tags
            </div>
            <div className="tags-list"></div>
          </div>
        ) : (
          <div></div>
        )}
        <Bar className="" style={{}}>
          <h2
            className="font-bold mb-3 py-2 pl-3"
            style={{
              // background: "#373737",
            }}
          >
            <i className="fab fa-hotjar text-orange-500 mr-2 mt-2 "></i> Hot
            Right Now
          </h2>
          {/* <hr className="opacity-25" /> */}
          <HotScroll
            id="side-bar-hot-container"
            className=""
            style={{
              maxHeight: "500px",
              overflowY: "scroll",
            }}
          >
            {hot.map((gallery, index) => {
              return (
                <ListItem
                  key={`side-bar-hot-key-${index}`}
                  className="mb-2 relative  hover:opacity-50"
                >
                  <Link
                    to={`/beam/${gallery.gallery_id}`}
                    className="relative flex flex-row"
                  >
                    <div
                      className="h-full"
                      style={{
                        width: "100px",
                      }}
                    >
                      <div
                        className="overflow-hidden w-full p-1 relative"
                        style={{
                          height: "110px",
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
                            className="object-cover h-full w-full"
                            width={"100%"}
                            height={"100%"}
                            muted
                            autoPlay
                            src={`${gallery.images[0]?.path}`}
                          ></video>
                        )}
                      </div>
                    </div>
                    <div
                      className="ml-2 flex-1 mt-3"
                      style={{
                        wordBreak: "break-word",
                      }}
                    >
                      <div className="side-bar-tile-title leading-4 text-sm font-bold">
                        {gallery.title}
                      </div>
                      <div className="text-xs mt-1 leading-5">
                        {gallery.username}
                      </div>
                      <div className="text-xs">
                        <span>{parseViews(gallery.views)} views</span> -{" "}
                        <span className="">
                          {moment(gallery.date_created).fromNow()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </ListItem>
              )
            })}
          </HotScroll>
        </Bar>

        {/* <div
          id="side-bar-get-more"
          className="w-full flex flex-col items-center justify-center"
        >
          {fetching ? (
            <MoonLoader></MoonLoader>
          ) : (
            <button
              className="px-2 w-full py-2 hover:opacity-50"
              onClick={(e) => getMore()}
              style={{
                background: '#373737'

              }}
            >
              <div>
                <i className="fas fa-chevron-down"></i>
              </div>
            </button>
          )}
        </div> */}
        
        <div
          className="mt-12  px-4 py-3"
          style={{
            // background: "#373737",
            border: "1px solid #373737"
          }}
        >
          <h2 className="font-bold text-sm">
            Have a suggestion for imgbeam? Hit us up!
          </h2>
          <h4 className="text-green-400 mt-3">
            <a href="mailto: jakemillerdev@gmail.com">
              <div className="bg-transparent border-2 border-green-400 border-opacity-75 px-2 py-2 rounded-md justify-center flex flex-col items-center">
                <i class="fas fa-paper-plane"></i> Contact
              </div>
            </a>
          </h4>
        </div>
      </div>
    )
}
const Bar = styled.div`
position: relative;
::after{
    content:'';
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    pointer-events: none;
    /* background: linear-gradient(to top, #222222 0%, #22222200 20%); */
  }
`
const ListItem = styled.div`
  /* background: #373737; */

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
const HotScroll = styled.div`
  position: relative;

  scrollbar-color: #373737 rgba(0, 0, 0, 0);
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0);
    margin-left: 40px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
`

import React, { useEffect, useState } from "react"
import moment from "moment"

export default function UserView(props) {
  async function delete_image(image_id, gallery_id) {
    let verify = window.confirm("Delete image")
    if (!verify) {
      return
    }
    let url = `/admin/user/${props.user.user_id}/image/delete/${image_id}/${gallery_id}`
    console.log(url)
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "delete",
      })
      let json = await res.json()
      console.log(json)
      if (json.success) {
        //   props.getUserID(props.user.user_id)
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function delete_gallery(gallery_id) {
    let verify = window.confirm("Delete gallery?")
    if (!verify) {
      return
    }
    let url = `/admin/user/${props.user.user_id}/gallery/delete/${gallery_id}`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "delete",
      })
      console.log(res.status)
      if (res.status == 200) {
        document.getElementById(
          `user-gallery-${gallery_id}`
        ).innerHTML = `${gallery_id} DELETED`
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (!props.user) {
    return <div>No User</div>
  } else
    return (
      <div className="px-4 py-6 bg-gray-300 text-left">
        <div>
          <h2 className="text-xl font-bold">
            User: <span className="text-green-500">{props.user.username}</span>
          </h2>
          <h4>
            User ID: <em>{props.user.user_id}</em>
          </h4>
          <p>
            User Since: {moment(props.user.date_created).format("MMM d yyyy")}
          </p>
        </div>
        <div
          id="user-control"
          className="mt-6 px-12 py-6 test-white bg-gray-500"
        >
          <button
            onClick={(e) => props.deleteRequest()}
            className="px-4 py-1 bg-purple-500 text-white"
          >
            Delete User
          </button>
          <button onClick={(e) => props.banEmail()} className="ml-12">
            Ban User
          </button>
        </div>
        <div id="user-galleries">
          {props.user.galleries.map((gallery, index) => {
            return (
              <div
                id={`user-gallery-${gallery.gallery_id}`}
                key={`user-gallery-${gallery.gallery_id}`}
                className="mx-4 my-2 bg-gray-700 p-4 text-white"
              >
                <h1>title: {gallery.title}</h1>
                <h3>id: {gallery.gallery_id}</h3>
                <p>items: {gallery.images.length}</p>
                <div className="gallery-image-container flex flex-row flex-wrap my-4">
                  {gallery.images.map((image) => {
                    return (
                      <div className="mx-1 bg-gray-800 shadow-md p-3">
                        <div>
                          <div className="mt-2">
                            filename: {image.file_name}
                          </div>
                          <div className="mt-2">
                            originalname: {image.original_name}
                          </div>
                          <div className="desc font-bold mt-3 mb-4 text-xs">
                            {image.description}
                          </div>
                        </div>
                        {/* lq or thumbnail */}
                        <a href={`${image.path_lq}`} className="py-1"  target="_blank">
                          <span className="py-1 text-sm font-bold">LQ Version</span>
                          {image.media_type === "image" ? (
                            <img width="200" src={`${image.path_lq}`} alt="" />
                          ) : (
                            <video
                              width="200"
                              autoplay
                              muted
                              src={`${image.path_lq}`}
                            ></video>
                          )}
                        </a>
                        {/* full res */}
                        <a href={`${image.path}`}  className="py-1" target="_blank">
                        <span className="py-1 text-sm font-bold">Full Quality Version</span>

                          {image.media_type === "image" ? (
                            <img width="200" src={`${image.path}`} alt="" />
                          ) : (
                            <video
                              width="200"
                              autoplay
                              muted
                              src={`${image.path}`}
                            ></video>
                          )}
                        </a>
                        <div className="mt-1">
                          <button
                            onClick={(e) =>
                              delete_image(image.image_id, image.gallery_id)
                            }
                            className="px-3 py-1 bg-red-600"
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="gallery-controls">
                  <hr className="my-6" />
                  <button
                    onClick={(e) => delete_gallery(gallery.gallery_id)}
                    className="bg-red-600 px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
}

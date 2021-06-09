import React, { useEffect, useState } from "react"
import SuperGrid from '../../SuperGrid'
export default function PostsComponent(props) {
  useEffect(() => {
    getPosts()
  }, [])
  const [posts, setPosts] = useState([])
  async function getPosts() {
    let from = posts.length
    let to = from + 100
    let url = `/api/user/${props.username}/galleries?from=${from}&to=${to}`
    try {
      let res = await fetch(url)
      if (res.status === 200) {
        let json = await res.json()
        console.log(json)
        setPosts([...posts, ...json])
      }
    } catch (err) {
      console.log(err)
    }
  }
  function copy(e, urlString) {
    e.preventDefault()
    let input = document.createElement("textarea")
    document.body.appendChild(input)
    input.value = urlString
    // input.style.visibility = 'hidden'
    input.select()
    document.execCommand("copy")
    document.body.removeChild(input)
  }

  if (!posts.length) {
    return (
      <div className="text-white font-bold py-24">
        <h2 className="text-2xl  opacity-75 ">Well, this is awkward...</h2>
        <h4 className="opacity-50 text-base">there are no posts</h4>
      </div>
    )
  } else
    return (
      <div className="text-white container mx-auto flex items-center justify-center">
        <SuperGrid usernames={false} galleries={posts} avatars={false}></SuperGrid>
      </div>
    )
}

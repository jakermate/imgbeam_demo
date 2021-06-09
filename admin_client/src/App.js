import "./App.css"
import React, { useState, useEffect } from "react"
import DeleteConfirm from "./DeleteConfirm"
import UserView from "./UserView"
import ReportView from './ReportView'
function App() {
  const [users, getUsers] = useState(null)
  const [username, setUsername] = useState("")
  const [id, setId] = useState("")
  const [email, setEmail] = useState("")

  const [searchMode, setSearchMode] = useState("user")
  const [loggedIn, setLoggedIn] = useState(false)
  // search galleries by title
  const [titleSearch, setTitleSearch] = useState("")
  const [galleries, setGalleries] = useState([])
  useEffect(()=>{
    console.log(galleries)
  }, [galleries])
  useEffect(() => {
    amILoggedIn()
    window.onbeforeunload = function(){
      return "Are you sure you wish to go back?"
    }
  }, [])
  async function amILoggedIn() {
    let url = `/admin/authenticated`
    try {
      let res = await fetch(url, {
        credentials: "include",
        mode: "cors",
      })
      console.log(res.status)
      if (res.status == 200) {
        setLoggedIn(true)
        return
      }
      setLoggedIn(false)
    } catch (err) {
      console.log(err)
    }
  }
  async function findGallery(e) {
    e.preventDefault()
    let url = `/admin/gallery/title/${titleSearch}`
    try {
      let res = await fetch(url, {
        credentials: "include",
        mode: "cors",
      })
      let json = await res.json()
      console.log(json)
      if (json.success) {
        setGalleries(json.galleries)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function findUsername(e) {
    e.preventDefault()
    let url = `/admin/user/username/${username}`
    try {
      let res = await fetch(url, {
        credentials: "include",
        mode: "cors",
      })
      let json = await res.json()
      console.log(json)
      if (json.success) {
        setUser(json.user)
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function findUserID(e) {
    e.preventDefault()
    let url = `/admin/user/id/${id}`
    try {
      let res = await fetch(url, {
        credentials: "include",
        mode: "cors",
      })
      let json = await res.json()
      console.log(json)
      setUser(json)
    } catch (err) {
      console.log(err)
    }
  }
  async function findEmail(e) {
    e.preventDefault()
    let url = `/admin/user/email/${email}`
    try {
      let res = await fetch(url, {
        credentials: "include",
        mode: "cors",
      })
      let json = await res.json()
      console.log(json)
      if (json.success) {
        setUser(json.user)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // mode
  const [activeMode, setActiveMode] = useState('search')
  function toggleContent(string){
    setActiveMode(string)
  }

  // deletions
  const [deleteOverlay, setDeleteOverlay] = useState(false)
  function deleteRequest() {
    setDeleteOverlay(true)
  }
  function cancelDelete() {
    setDeleteOverlay(false)
  }
  async function deleteUser() {
    setDeleteOverlay(false)
    let url = `/admin/user/${user.user_id}/delete`
    try {
      let res = await fetch(url, {
        credentials: "include",
        mode: "cors",
        method: "delete",
      })
      let json = await res.json()
      console.log(json)
      if (json.success) {
        setUser(null)
        console.log("user deleted")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const [user, setUser] = useState(null)
  return (
    <div className="App flex flex-row min-h-screen">
      <Sidebar toggleContent={toggleContent} mode={activeMode} ></Sidebar>
      <div id="main-content" className="flex-1" style={{
        background: '#eee'
      }}>
        <header className="App-header text-left py-4 px-3">
          <div
            id="logged-in-container"
            className="text-2xl font-bold p-6 text-white"
          >
            {loggedIn ? <div className="text-green-200">Authenticated</div> : <div className="text-yellow-300">Not Authorized</div>}
          </div>
          <div className="mx-auto container">
            {!loggedIn && <LoginForm></LoginForm>}
          </div>
        </header>
        {/* conditional page renders */}
      {
        activeMode === 'search' &&
        <div className="text-left bg-gray px-12 py-6">
          <div>
            <ul className="flex flex-row">
              <li className="mr-3">
                <button
                  className="text-lg font-bold"
                  onClick={(e) => setSearchMode("user")}
                >
                  Find User
                </button>
              </li>
              <li className="mr-3">
                <button
                  className="text-lg font-bold"
                  onClick={(e) => setSearchMode("gallery")}
                >
                  Find Gallery
                </button>
              </li>
            </ul>
          </div>
          {searchMode === "user" && (
            <div>
              <form
                onSubmit={(e) => findUsername(e)}
                className="flex flex-col max-w-xl"
              >
                <label htmlFor="username">username</label>
                <input
                  className="bg-black text-white px-2 py-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  name="username"
                  id="username"
                />
                <input type="submit" value="Submit" />
              </form>
              <form
                onSubmit={(e) => findUserID(e)}
                className="flex flex-col max-w-xl"
              >
                <label htmlFor="user_id">user_id</label>
                <input
                  className="bg-black text-white px-2 py-2"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  type="text"
                  name="user_id"
                  id="user_id"
                />
                <input type="submit" value="Submit" />
              </form>
              <form
                onSubmit={(e) => findEmail(e)}
                className="flex flex-col max-w-xl"
              >
                <label htmlFor="email">email</label>
                <input
                  className="bg-black text-white px-2 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  name="email"
                  id="email"
                />
                <input type="submit" value="Submit" />
              </form>
              {/* user results */}
         
              <UserView
                getUserID={findUserID}
                deleteRequest={deleteRequest}
                user={user}
              ></UserView>
            </div>
          )}
          {searchMode === "gallery" && (
            <div>
              <form onSubmit={(e) => findGallery(e)}>
                <input
                  type="text"
                  value={titleSearch}
                  onChange={(e) => setTitleSearch(e.target.value)}
                />
                <input type="submit" value="Search" />
              </form>
              {/* gallery results */}
              {galleries.map((gallery) => {
                return <div>{gallery.title}</div>
              })}
            </div>
          )}
        </div>
      }
      {
        activeMode === "reports" && 
        <ReportView></ReportView>
      }
        
        {deleteOverlay && (
          <DeleteConfirm
            cancel={cancelDelete}
            confirmDelete={deleteUser}
          ></DeleteConfirm>
        )}
      </div>
    </div>
  )
}
function LoginForm() {
  return (
    <div className="" style={{
      width: '350px'
    }}>
      <form className="flex max-w-xl flex-col" action="/login" method="POST">
        <input
          className="my-1 px-3 py-1 text-sm"
          type="text"
          name="username"
          id="username"
        />
        <input
          className="my-1 px-3 py-1 text-sm"
          type="password"
          name="password"
          id="password"
        />
        <input className="my-1 bg-purple-500" type="submit" value="Login" />
      </form>
    </div>
  )
}

function Sidebar(props) {
  return (
    <div
      className=""
      style={{
        width: "300px",
      }}
    >
    <div id="sidebar-content" className="fixed ">
    <div className="title text-xl font-bold mb-4 p-3">
        Admin Control
      </div>
      <ul className="text-left font-bold w-full">
        <li className={`p-2 font-bold  hover:opacity-75 cursor-pointer w-full ${props.mode === "search" && "opacity-50"}`}>
          <button onClick={e => props.toggleContent('search')}>Search</button>
        </li>
        <li className={`p-2 font-bold  hover:opacity-75 cursor-pointer w-full ${props.mode === "reports" && "opacity-50"}`}>
          <button onClick={e => props.toggleContent('reports')}>Reports</button>
        </li>
        <li className={`p-2 font-bold  hover:opacity-75 cursor-pointer w-full ${props.mode === "messages" && "opacity-50"}`}>
          <button onClick={e => props.toggleContent('messages')}>Messages</button>
        </li>
      </ul>
    </div>
      
    </div>
  )
}

export default App

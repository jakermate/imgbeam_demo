import React, { useEffect, useState } from "react"
import moment from "moment"
export default function UserResults(props) {
  const [users, setUsers] = useState([])
  useEffect(() => {
    getUsers()
  }, [])
  async function getUsers() {
    let userString = props.match.params.userstring
    let url = `/search/users?user=${userString}`
    try {
      let res = await fetch(url)
      let json = await res.json()
      console.log(json)
      if (json.success) {
        setUsers(json.users)
      }
    } catch (err) {
      console.log()
    }
  }
  return (
    <div className="text-white container mx-auto max-w-5xl mt-8">
      <h2 className="font-bold text-2xl">
        User Search for {props.match.params.userstring}
      </h2>
      <div className="user-list text-left ">
        <ul
          className="mt-8"
          style={{
            background: "#373737",
          }}
        >
          {users.map((userObject, index) => {
            return (
              <li className="" key={`user-result-list-key-${index}`}>
                <a
                  href={`/user/${userObject.username}`}
                  className="p-3 hover:opacity-75 block"
                >
                  <div className="flex flex-row">
                    <div
                      className="avatar-container bg-green-500"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                    ></div>
                    <div className="info-container ml-3">
                      <h3 className="font-bold ">{userObject.username}</h3>
                      <p className="text-xs opacity-50">
                        Member since{" "}
                        {moment(userObject.date_created).format("MMM d yyyy")}
                      </p>
                      {/* rank and points */}
                      <div className="rank text-xs opacity-50">{userObject.rank} - {userObject.points || 0} pts</div>
                    </div>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

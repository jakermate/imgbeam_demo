import React, {useState} from "react"

export default function AddToFolder(props) {
    const [folders, setFolders] = useState([])
  async function getFolders() {}
  async function moveToFolder(folder_id) {
    // get favorite id from gallery_id
    let url = `/api/account/favorites/move/${props.gallery_id}/${folder_id}`
    try {
      let res = await fetch(url, {
        credentials: "include",
        method: "PUT",
      })
      console.log(res.status)
      if (res.status == 200) {
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <ul>
        {
            folders.map((folder)=>{
                <li>
                <button onClick={e => moveToFolder(folder.folder_id)}>
                    {folder.name}

                </button>
                </li>
            })
        }
      </ul>
    </div>
  )
}

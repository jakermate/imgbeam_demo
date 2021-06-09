import React, {useState} from "react"
import styled, {keyframes} from 'styled-components'
export default function AvatarSelect(props) {
  function setAvatar(e){
    let newFile = e.target.files[0]
    console.log(newFile)
    setFile(newFile)
    let reader = new FileReader()
    reader.readAsDataURL(newFile)
    reader.onload = function(file){
      
      setURL(file.target.result)

    }
  }
  const [file, setFile] = useState(null)
  const [url, setURL] = useState('')
  async function updateAvatar(e){
    let formdata = new FormData()
    formdata.append('avatar', file)
    try{
      let res = await fetch("/api/account/settings/avatar/update", {
        method: "POST",
        credentials: "include",
        body: formdata,
      })
      if(res.status == 200){
        props.toggleAvatarSelect()
      }

    }
    catch(err){
      console.log(err)
    }
  }
  return (
    <div
      className="fixed top-0  left-0 w-screen h-screen flex flex-col justify-center items-center"
      style={{
        background: "rgba(0,0,0,.7)",
      }}
    >
      <div
        onClick={(e) => props.toggleAvatarSelect(false)}
        className="overlay fixed top-0 left-0 w-screen h-screen z-10"
        style={{}}
      ></div>
      <Modal
        className="bg-gray-700 p-4 z-20"
        style={{
          borderRadius: '4px',
          width: '300px'
        }}
      >
        {/* <h4 className="font-bold text-center">Avatar Select</h4> */}
        <div id="avatar-file-explorer" className="border-dashed relative  w-full">
          <InputButton htmlFor="avatar-file" className=" w-full block p-3">Choose from your device.</InputButton>
          <input className="absolute hidden" type="file" name="avatar-file" onChange={e => setAvatar(e)} accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp" id="avatar-file"/>
        </div>
        <div id="avatar-select-preview" className="w-full">
          {
            file &&
            <img src={url} alt="" width={'100%'} style={{
              borderRadius:'4px'
            }} />
          
          }
        </div>
        <div className="avatar-grid grid grid-cols-3" style={{
            width: '300px'
        }}></div>
        <SaveButton disabled={!file} onClick={e => updateAvatar(e)} className="py-3 px-8 mt-3 w-full shadow-lg font-extrabold">Save</SaveButton>
      </Modal>
    </div>
  )
}
const InputButton = styled.label`
  background: rgba(255,255,255,.1);

` 
const SaveButton = styled.button`
  border-radius: 4px;
  background: ${props => !props.disabled ? 'rgb(52, 124, 218)' : 'gray'} ;
  opacity: ${props => !props.disabled ?  1: .4} ;


`
const enter = keyframes`
  from{
    transform: scale(1.4);
    opacity: 0;
  }
  to{
    transform: scale(1);
    opacity: 1;
  }
`
const Modal = styled.div`
  opacity: 0;
  animation: .1s ${enter} linear forwards;
`
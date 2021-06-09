import React, { useState } from "react"
import colors from '../../../theme/colors'
import styled from 'styled-components'
export default function ReportOverlay(props) {
  async function sendReport(gallery_id) {
      let url = `/api/beam/${gallery_id}/report`
      try{
        let res = await fetch(url, {
            credentials: 'include',
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                reason: reason
            })
        })
        console.log(res.status)
      }
      catch(err){
          console.log(err)
      }
     
  }
  const [reason, setReason] = useState("")
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 999,
      }}
    >
      <div
        className="overlay fixed bg-black top-0 left-0 right-0 bottom-0 z-0"
        style={{
          opacity: 0.75,
        }}
      ></div>
      <div
        className="panel text-white z-50"
        style={{
          background: "rgba(60,60,60,1)",
          borderRadius: "26px",
        }}
      >
        <div className="py-2" style={{
            borderTopLeftRadius: '26px',
            borderTopRightRadius: '26px',
            background: `${colors.backgroundLight}`
        }}>
          <h3 className="text-lg font-bold">Report Post</h3>
          <p className="text-sm ">"{props.gallery.title}"</p>
        </div>
        <div id="report-content" className="px-6 py-8 flex flex-col ">
          <Select
            defaultValue={""}
            name="report-reason-select"
            id="report-reason"
            onChange={(e) => setReason(e.target.value)}
            value={reason}
            className="outline-none focus:outline-none px-8"
          >
            <option value="Adult/Pornographic Content">
              Adult/Pornographic Content
            </option>
            <option value="Spam, Scam, Advertising">
              Spam, Scam, Advertising
            </option>
            <option value="Hate Speech, Discrimination, Illegal Content">
              Hate Speech, Discrimination, Illegal Content
            </option>
            <option value="Other">Other</option>
            {reason === "Other" && (
              <div id="report-other-reason">
                <textarea name="" id="" cols="30" rows="10"></textarea>
              </div>
            )}
       
          </Select>
          <button onClick={e => sendReport(props.gallery.gallery_id)} className="py-4 px-8 mt-8  text-xs font-bold text-white" style={{
                background: `${colors.error}`,
                borderRadius: '26px',
                whiteSpace: 'nowrap'
            }}>Send Report</button>
        </div>
      </div>
    </div>
  )
}
const Select = styled.select`
    background: ${colors.backgroundLight};
    padding: 6px 10px;
`
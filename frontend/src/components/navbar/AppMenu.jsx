import React from "react"
import theme from '../../theme/colors'
export default function AppMenu(props) {
  return (
    <div className="absolute text-left" style={{
        top: '100%',
        right: '-50%'
    }}>
      <div className="fixed top-0 bottom-0 left-0 right-0 z-0" onClick={e=>props.toggleAppMenu(false)}></div>
      <div className="panel z-10 bg-black" style={{
          color: 'white',
          borderRadius: '16px',
          background: `${theme.backgroundLight}`
      }}>
        <ul>
          <li className="py-4 px-6">
            <a href="/">Imgbeam</a>
          </li>
          <li className="py-4 px-6">
            <a href="/BeamStash">BeamStash</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

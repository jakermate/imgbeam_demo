import React from 'react'

export default function DefaultAvatar(props) {
    return (
        <div className="" style={{
            width: `${props.width}px`,
            height: `${props.height}px`,
            background: 'black',

        }}>
            <div className="font-extrabold uppercase text-lg text-white" style={{
                textShadow: '2px 2px 2px rgba(0,0,0,0)'
            }}>
                {props.username.charAt(0)}
            </div>
        </div>
    )
}

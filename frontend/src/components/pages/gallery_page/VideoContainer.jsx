import React from 'react'
import Player from 'react-player'
import styled from 'styled-components'
export default function VideoContainer(props) {
    return (
        <VideoWrapper className="mb-2 w-full video-wrapper relative bg-black" style={{
            maxHeight: 'calc(100vh - 200px)',
            width: '100%',

        }}>
             <video src={props.string} controls muted autoPlay loop style={{
                 width: '100%',
                 height: '100%',
                 objectFit:'contain'
             }} ></video>
        </VideoWrapper>
    )
}

const VideoWrapper = styled.div`
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 14px -4px rgba(0,0,0,.5);
    .react-player{
        outline:none !important;
        ::active,:focus{
            outline: none !important;
            border: none !important;
        }
    }
    .react-player video{
        width: 100%;
        height: 100%;
        object-fit: contain;
        ::active,:focus{
            outline: none !important;
            border: none !important;
        }
    }
    .no-outline{
        outline:none !important;
        border: none !important;
        ::active,:focus{
            outline: none !important;
            border: none !important;
        }
    }
`
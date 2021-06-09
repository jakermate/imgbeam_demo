import React from 'react'
import styled from 'styled-components'
export default function LikeComponent(props) {
    return (
        <div>
            <ul className="grid grid-rows-3 grid-cols-1 mt-12">
                <LikeButton active={props.likeType === 'c'} onClick={e=> props.sendLike('c')} className="rounded-full cursor-pointer shadow-md mb-1 border-2 border-red-400 h-6 w-6" title="cool"></LikeButton>
                <LikeButton active={props.likeType === 'f'} onClick={e=> props.sendLike('f')} className="rounded-full cursor-pointer shadow-md mb-1 border-2 border-green-400 h-6 w-6" title="funny"></LikeButton>
                <LikeButton active={props.likeType === 'i'} onClick={e=> props.sendLike('i')} className="rounded-full cursor-pointer shadow-md mb-1 border-2 border-blue-400 h-6 w-6" title="informative"></LikeButton>
            </ul>

                <div className="total-points text-center text-xs">
                    {props.likeTotal || 0} likes
                </div>
                <LikeButton active={props.likeType === 'd'} onClick={e=> props.sendLike('d')} className="rounded-full cursor-pointer shadow-md my-4 border-2 border-gray-500 h-6 w-6" title="dislike"></LikeButton>
        </div>
    )
}
const LikeButton = styled.li`
    background: ${props=> props.active && 'white'};
`
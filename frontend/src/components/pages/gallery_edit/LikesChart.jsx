import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
export default function LikesChart(props) {
    
    return (
        <div className="mt-8">
            <div className="points-breakdown">
                <div className="bar-flex flex flex-row items-end">
                    <Bar percent={(props.likes.c / props.likes.total) * 100} className="bg-red-400"></Bar>
                    <Bar percent={(props.likes.f / props.likes.total) * 100} className="bg-green-400"></Bar>
                    <Bar percent={(props.likes.i / props.likes.total) * 100} className="bg-blue-400"></Bar>
                </div>
            </div>
            <div id="likes-total" className="">
                {props.likes.total} Points
            </div>
        </div>
    )
}
const Bar = styled.div`
    height: ${props=>`${props.percent}px`};
    min-height: 30px;
    margin: 0 10px;
    width: 30px;
    border-radius: 16px;
`
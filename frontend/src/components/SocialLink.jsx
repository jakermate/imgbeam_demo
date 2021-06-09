import React from 'react'
import styled from 'styled-components'
export default function SocialLink(props) {
    return (
        <Root onClick={e => props.action()} background={props.background} className="px-6">
            <div className="mr-3">
                <i className={`fab ${props.icon}`}></i>
            </div>
            <div>
                {props.string}
            </div>
            <div></div>
        </Root>
    )
}
const Root = styled.button`
    display: flex;
    flex-direction: row;
    background-color: ${props => props.background};
    color: white;
    padding: 6px 16px;
    border-radius: 8px;
    margin-right: 12px;
    
`
import React from 'react'
import styled from 'styled-components'
export default function SortMenu(props) {
    return (
        <View id="sort-menu">
            <div className="overlay fixed top-0 bottom-0 left-0 right-0" onClick={e => props.toggleMenu(false)} style={{
                zIndex: 9999
            }}></div>
            <ul>
                {
                    props.options.map((option, index)=>{
                        return(
                            <li key={`option-${option}`}>
                                {option}
                            </li>
                        )
                    })
                }
            </ul>
        </View>
    )
}
const View = styled.div`
    background: ${props => props.theme.background_1};
    border-radius: 8px;
    text-align: left;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 9999;
    margin-top: 12px;
    border: ${props => `1px solid ${props.theme.border}`};
    box-shadow: 2px 2px 18px rgba(0,0,0,.1);
`
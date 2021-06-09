import React from 'react'
import colors from '../theme/colors'
import styled, {keyframes} from 'styled-components'
export default function Tooltip(props) {
    return (
        <ToolTip className="absolute tooltip-container" style={{
            bottom: '-50px',
            // left:0,
            // right:0
        }}>
            <div className="px-3 py-2 tooltip text-sm font-semibold" style={{
                whiteSpace: 'nowrap',
                borderRadius: '3px'
            }}>
                {props.string}
            </div>
        </ToolTip>
    )
}
const enter = keyframes`
    from{
        transform: translateY(-10px);
        opacity: 0;
    }
    to{
        transform: translateY(0px);
        opacity: 1;
    }
`
const ToolTip = styled.div`
color: ${props => props.theme.text};
    .tooltip{
        opacity: 0;
        animation: ${enter} .1s linear forwards;
        display:none;
        background: ${props => props.theme.background_1};
        border: ${props => `1px solid ${props.theme.border}`};
    }
    .tooltip-active{
        display: block;
    }
`
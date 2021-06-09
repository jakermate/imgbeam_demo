import React from 'react'
import styled from 'styled-components'
import colors from '../theme/colors'
export default function ActionButton(props) {
    return (
        <Root disable={props.disable} onClick={props.action} className="py-1 px-8">
            {props.string}
        </Root>
    )
}
const Root = styled.button`
    background: ${props => props.theme.background_1};
    border: ${props => `1px solid ${props.theme.border}`};
    font-size: 14px;
    font-weight: bold;
    border-radius: 3px;
    color: ${props => props.disabled ? props.theme.textFaded : props.theme.text};
`

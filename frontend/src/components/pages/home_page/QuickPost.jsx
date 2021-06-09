import React from 'react'
import theme from '../../theme/colors'
import styled from 'styled-components'
export default function QuickPost(props) {
    return (
        <QuickEl className="relative z-50 mx-auto" style={{
            background: `${theme.backgroundMedium}`,
            borderRadius: '26px'
        }}>
            quick post
        </QuickEl>
    )
}
const QuickEl = styled.div`
    @media(max-width: 960px){
        width: 960px;
    }
`

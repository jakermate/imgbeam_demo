import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {toggleTheme} from '../state/store/actions/index'
function ThemeToggle(props) {
    console.log(props)
    return (
        <div>
        <CheckBox htmlFor="theme_toggle" title="theme toggle" theme_string={props.theme_string}>
        <input checked={props.theme_string === "theme_light"} onChange={e => props.toggleTheme()} className="hidden" type="checkbox" name="theme_toggle" id="theme_toggle" style={{
            width: 0,
            height: 0
        }} />

        </CheckBox>
        </div>
    )
}
const CheckBox = styled.label`
    background-color: ${props => props.theme_string === "theme_light" ? props.theme.background_3 :  "black"};
    height: 20px;
    width: 34px;
    border-radius: 16px;
    display: block;
    input:checked{

    }
`
function mapStateToProps(state){
    return {
        theme_string: state.app_state_reducer.theme
    }
}
const mapDispatchToProps = {
    toggleTheme
}
export default connect(mapStateToProps, mapDispatchToProps)(ThemeToggle)

import React from "react"
import PropTypes from 'prop-types'
import SignInButton from "./SignInButton"
import styled from 'styled-components'
export default function SignInPlaceholder(props) {
  return (
    <Placeholder className="pt-32 text-center flex flex-col items-center">
      <div>
        <i className={`${props.icon} fa-4x opacity-50`}></i>
      </div>
      <div className="container mx-auto text-2xl font-bold pt-12 pb-3">
        {props.header}
      </div>
      <div className="signin-box text-sm">{props.subheader}</div>
      <div className="mt-8 ">
        <SignInButton></SignInButton>
      </div>
    </Placeholder>
  )
}
SignInPlaceholder.propTypes = {
  icon: PropTypes.string,
  header: PropTypes.string,
  subheader: PropTypes.string

}

const Placeholder = styled.div`
  color: ${props => props.theme.text};
`
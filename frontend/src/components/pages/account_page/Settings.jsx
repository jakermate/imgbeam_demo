import React from 'react'
import moment from 'moment'
export default function AccountInfo(props) {
    return (
        <div>
        <Row>
        <Header title={"Account"}></Header>
            <Subheader string={`Signed in as ${props.user.username} (${props.user.email})`}></Subheader>
        </Row>
        <Row>
        <Header title={"Member Since"}></Header>
            <Subheader string={`${moment(props.user.member_since).format('MMM D YYYY')}`}></Subheader>
        </Row>
  
        </div>
    )
}
export function Header(props){
    return (
        <div className="font-bold pt-4 pb-2">
            {props.title}
        </div>
    )
}
function Subheader(props){
    return (
        <div className="text-sm">
            {props.string}
        </div>
    )
}
function Row(props){
    return(
        <div className="mb-3">
            {props.children}
        </div>
    )
}
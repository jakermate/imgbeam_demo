import React from 'react'
import {connect} from 'react-redux'
import {clearAllNotifications, clearNotification} from '../state/store/actions/index'
import Placeholder from '../components/SignInPlaceholder'
import styled from 'styled-components'
function NotificationView(props) {
    return (
        <Root>
        {
            props.notifications.length === 0 &&

            <Placeholder header={'Notifications'} subheader={"Follow your favorites posters and receive notifications when they post new things."} icon={'fa-bell'}></Placeholder>
        }
        {
            props.notifications.map((notificationObject)=>{
                return (
                    <div>
                        {notificationObject.id}
                    </div>
                )
            })
        }
        </Root>
    )
}


//  style
const Root = styled.div`
    position: absolute;
    bottom: 100%;
`




//  state
function mapStateToProps(state){
    return{
        notifications: state.account_reducer.notifications
    }
}
const mapDispatchToProps = {
    clearAllNotifications,
    clearNotification
}
export default connect(mapStateToProps, mapDispatchToProps)(NotificationView)
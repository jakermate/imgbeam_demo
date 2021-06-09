import React from 'react'
import theme from '../../../theme/colors'
import moment from 'moment'
export default function AboutView(props) {
    return (
        <div className="container justify-center mx-auto text-left flex flex-row pt-4">
            <div id="user-about-description" className="" style={{
                flex: '2'
            }}>
                <h3 className="font-bold">Description</h3>
                <p className="mt-4">
                    {
                        props.user.description || <div className="" style={{
                            color: `${theme.textFaded}`
                        }}>
                            No Description Yet
                        </div>
                    }
                </p>
            </div>
            <div className="right-stats flex-1" style={{
                
            }}>
                <div className="date">
                    <h4>Member Since</h4>
                    <p>{moment(props.user.member_since).format('MMM D yyyy')}</p>
                </div>
                <div className="total-views mt-4">
                <h4>Total Views</h4>
                    <p>0</p>
                </div>
            </div>
        </div>
    )
}

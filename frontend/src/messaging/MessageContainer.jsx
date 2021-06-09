import React from 'react'
import moment from 'moment'
export default function MessageContainer(props) {
    return (
        <div className="container">
            <ul>
                {
                    props.conversation.map((messageObj) => {
                        return(
                            <li>
                                <div className="font-bold">
                                    {messageObj.username}

                                </div>
                                <div>
                                    {moment(messageObj.date_created).fromNow()}
                                </div>
                                <div>
                                    {messageObj.message}
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

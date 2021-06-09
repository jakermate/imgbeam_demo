import React from 'react'

export default function AvatarSelect(props) {
    const avatars = [
        'gorilla',
    'sloth',
    'reindeer',
    'shark',
    'owl'
    ]
    return (
        <div className="max-w-2xl rounded-md">
            {
                avatars.map(avatarString=>{
                    <div>
                        <div className="image-container">
                            
                        </div>
                        <div className="text-container">
                            {avatarString}
                        </div>
                    </div>
                })
            }
            
        </div>
    )
}

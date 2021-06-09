import React from 'react'

export default function MobileShare(props) {
    return (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50">
            {/* dark background overlay */}
            <div className="overlay fixed top-0 bottom-0 left-0 right-0 z-0 bg-black opacity-50" onClick={e => props.close()}></div>
            <div className="mobile-share-content absolute bottom-0 left-0 right-0 z-30 m-4">
                <div className="mobile-share-panel bg-white" style={{
                    borderRadius: '8px'
                }}>
                    Share
                </div>
            </div>
        </div>
    )
}

import React from 'react'

export default function DeactivateComponent(props) {
    return (
        <div>
            <div className="account-status-controls mt-8">
            <h2 className="font-bold text-lg">Delete Account</h2>

                <button className="bg-gray-800 mt-8 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold py-4 px-6">DELETE ACCOUNT</button>
            </div>
        </div>
    )
}

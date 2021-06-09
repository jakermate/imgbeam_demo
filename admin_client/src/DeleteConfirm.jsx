import React from 'react'

export default function DeleteConfirm(props) {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center">
            <div onClick={e=>props.cancel} className="overlay z-10 fixed top-0 left-0 w-full h-full bg-black"></div>
            <div className="bg-gray-100 px-4 py-6 relative z-20 flex flex-col" style={{
                width:'300px'
            }}>
                <div className="text-2xl font-bold">
                Delete user?
                </div> 
                <button onClick={e=>props.confirmDelete()} className="bg-red-600 px-4 py-2 mt-6">
                    DELETE
                </button>
                <button onClick={e=>props.cancel()} className="bg-gray-600 px-4 py-2 mt-6">
                    CANCEL
                </button>
            </div>
        </div>
    )
}

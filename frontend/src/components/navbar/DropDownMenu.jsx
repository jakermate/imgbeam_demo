import React, {useEffect} from 'react'

export default function DropDownMenu() {
    useEffect(()=>{
        console.log('drop')
    },[])
    return (
        <div className="absolute left-0 right-0 bg-pink-300">
            dropdown
        </div>
    )
}

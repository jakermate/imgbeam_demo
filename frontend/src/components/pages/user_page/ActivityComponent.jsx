import React, {useEffect, useState} from 'react'

export default function ActivityComponent() {
    useEffect(()=>{

    },[])
    const [activity, setActivity] = useState([])
    async function getActivity(){
        let from = activity.length
        let to = from + 20
    }
    return (
        <div>
            test
        </div>
    )
}

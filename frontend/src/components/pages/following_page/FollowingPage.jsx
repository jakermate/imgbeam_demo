import React, {useState, useEffect} from 'react'
import SignInPlaceholder from '../../SignInPlaceholder'
export default function FollowingPage(props) {
    const [following, setFollow] = useState([])
    async function onMount(){
        let url = `/api/account/following`
        try{
            let res = await fetch(url,{
                credentials: 'include'
            })
            if(res.status == 200){
                setFollow(await res.json())
            }
        }
        catch(err){

        }
    }

    if(props.signedIn) return(
        <div></div>
    )
    else return (
        <div className="text-white">
            <SignInPlaceholder header={`Don't miss what your friends are posting`} icon={`fas fa-list`} subheader={`Sign in to see new content from your favorite posters.`}></SignInPlaceholder>
          
        </div>
    )
}

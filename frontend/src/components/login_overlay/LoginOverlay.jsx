import React, {useEffect, useState} from 'react'
import logo from '../../imgbeam_logo.svg'
import bg1 from '../../bg_1.jpg'
import styled, {keyframes} from 'styled-components'
// this should display whenever an authenticated function is requested by a unauthenticated visitor
export default function LoginOverlay(props) {
    useEffect(()=>{
        document.addEventListener('scroll', handleScroll)
    },[])
    function handleScroll(e){
        e.preventDefault()
    }
 
    return (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center" style={{
            zIndex:9999,
        }}>
            <div onClick={e=> props.close(false)} className="overlay absolute top-0 bottom-0 left-0 right-0" style={{
                background: 'rgba(0,0,0,.7)',
                zIndex: 3,
            }}></div>
            <div  className="overlay absolute top-0 bottom-0 left-0 right-0" style={{
            pointerEvents:'none',
                zIndex: 2,
            }}></div>
            {/* modal */}
            <Panel className="bg-gray-800 shadow-lg relative text-white" style={{
                // background:'#373737'
                zIndex:4,
                borderRadius: '26px',
                overflow: 'hidden'
            }}>
                <div id="login-modal-logo" className="w-full px-16 py-8" style={{
                    background: `url(${bg1})`,
                    backgroundSize:'cover',
                    backgroundPosition:'center',
                }}>
                    <img src={logo} className="w-64 " alt="" style={{
                        filter:'drop-shadow(0 0 8px rgba(0,0,0,.8))'
                    }} />
                </div>
                <div className="my-8 px-6 text-white font-bold text-lg"><a href="/login" className="text-purple-400">Log In </a> to proceed with that action.</div>
                <form action="/login" method="POST" className=" flex flex-col w-full px-8 pb-4">
                    <InputStyle className="outline-none focus:outline-none mb-6" placeholder="username or email" type="text" name="username" id="login-overlay-login"/>
                    <InputStyle className="outline-none focus:outline-none mb-6" placeholder="password" type="password" name="password" id="logib-overlay-password"/>
                   <LoginButton type="submit">Log In</LoginButton>
                   <div className="text-gray-500 cursor-pointer mt-4 mb-4" onClick={e => props.close(false)}>cancel</div>
                </form>
            </Panel>
        </div>
    )
}
const InputStyle = styled.input`
    background: rgba(100,100,100,.1);
    border: 1px solid #373737;
    padding: 8px 10px;
    border-radius: 16px;

`

const intro = keyframes`
 from{
     transform: scale(.6);
     opacity: 0;
 }
 to{
    transform: scale(1);
     opacity: 1;
 }
`
const Panel = styled.div`
    animation: ${intro} .2s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;

`
const LoginButton = styled.button`
    background: linear-gradient(to right, #6134da , #8f71e2 );
    color: white;
    font-weight: bold;
    padding: 6px;
    border-radius: 16px;
`
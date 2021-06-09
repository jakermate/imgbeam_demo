import React from 'react'
import qr from '../../../imgbeam_btc_address.png'
import styled from 'styled-components'
import icon from '../../../triangle_icon.png'
export default function DonateView() {
    return (
        <View id="donate-view">
            <div className="flex flex-col items-center justify-center">
                {/* <div className="logo-wrap mb-16">
                    <div className="absolute">
                        imgbeam
                    </div>
                    <img src={icon} alt="" style={{
                        width: '240px'
                    }} />
                </div> */}
              <div className="headline">What to help support this site?</div>
              <div className="subheadline">Bitcoin helps use keep the servers running.</div>
              <div className="image-wrap mt-12 flex flex-col items-center ">
                <div className="text-xs font-semibold mb-6">Send a few Satoshis our way.</div>
                <img src={qr} alt="" style={{
                  width: '120px'
                }} />
              </div>
            </div>
        </View>
    )
}
const View = styled.div`
    margin-top: ${props => props.theme.navbar_height};
    padding-top: 64px;
    color: ${props => props.theme.text};
    .headline{
        font-size: 32px;
        font-weight: 900;
    }
    .subheadline{
        font-size: 14px;
        font-weight: bold;

    }
`
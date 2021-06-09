import React from 'react'
import {connect} from 'react-redux'
import colors from '../theme/colors'
function TransferIndicator(props) {
    let width = (((props.filesComplete.length / (props.filesToDo.length + props.filesComplete.length)) * 100).toFixed(0) || 0) + 20
    if(props.filesComplete.length == 0 && props.filesToDo.length == 0){
        width = 100
    }
    return (
        <div id="transfer-indicator" className="fixed bottom-0 left-0 right-0 flex flex-row justify-start" style={{
            height: '5px',
            zIndex: 10000,
            background: 'black',
            transitionDelay: '.3s',
            transition: 'all .5s linear',
            opacity: `${props.uploading ? 1: 0 }`
        }}>
            <div className="h-full  relative" style={{
                transition: `all .6s linear`,
                background: `${colors.success}`,
                width: `${width}%`
            }}>
            
            </div>
        </div>
    )
}
function mapStateToProps(state){
    return{
        uploading: state.transfer_reducer.uploading,
        currentFile: state.transfer_reducer.currentFile,
        filesToDo: state.transfer_reducer.filesToDo,
        filesComplete: state.transfer_reducer.filesComplete
    }
}
export default connect(mapStateToProps)(TransferIndicator)
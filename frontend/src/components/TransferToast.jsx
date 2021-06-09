import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import colors from "../theme/colors"
function TransferToast(props) {
  return (
    <ToastElement
      id="transfer-status"
      uploading={props.uploading}
      className="fixed left-0 mb-4 ml-8  text-sm font-bold flex flex-col items-center justify-center py-5"
      style={{
        width: "260px",
        marginLeft: `${props.sidebar ? "260px" : 0}`,
        zIndex: 9999,
        display: `${props.transferring ? "block" : "none"}`,
      }}
    >
      {/* Transferring {props.filesComplete.length + 1} / {props.filesToDo.length + props.filesComplete.length} files. */}
      Uploading {props.filesToDo.length + props.filesComplete.length} files
    </ToastElement>
  )
}
function mapStateToProps(state) {
  return {
    uploading: state.transfer_reducer.uploading,
    currentFile: state.transfer_reducer.currentFile,
    filesToDo: state.transfer_reducer.filesToDo,
    filesComplete: state.transfer_reducer.filesComplete,
    transferring: state.transfer_reducer.uploading,
    sidebar: state.app_state_reducer.sidebar,
  }
}
export default connect(mapStateToProps)(TransferToast)

const ToastElement = styled.div`
  transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);

  bottom: 0;
  bottom: ${(props) => (props.uploading ? 0 : "-160px")};
  background-color: ${props => props.theme.background_2};
`
function CompleteJob() {
  return <div></div>
}

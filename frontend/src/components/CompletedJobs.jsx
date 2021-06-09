import React from "react"
import { connect } from "react-redux"
import styled, { keyframes } from "styled-components"
import { useHistory } from "react-router-dom"
import colors from "../theme/colors"
import { clearJob } from "../state/store/actions/index"
function CompletedJobs(props) {
  console.log(props)
  return (
    <Root
      id="completed-jobs"
      style={{
        pointerEvents: "none",
        marginLeft: `${props.sidebar ? 260 : 0}px`,
      }}
    >
      {props.completedJobs.map((jobObj) => {
        return (
          <CompleteJob
            key={`complete-transfer-${jobObj.gallery_id}`}
            job={jobObj}
            clearJob={props.clearJob}
          ></CompleteJob>
        )
      })}
    </Root>
  )
}
function mapStateToProps(state) {
  console.log(state)
  return {
    completedJobs: state.transfer_reducer.completedJobs,
    sidebar: state.app_state_reducer.sidebar,
  }
}
function CompleteJob(props) {
  const history = useHistory()

  return (
    <JobRoot className="flex flex-row items-center">
      <div
        className="h-12 w-1 mr-3"
        style={{
          background: `${colors.success}`,
        }}
      ></div>
      <div>
        <i
          className="fas fa-check-circle mr-3 fa-lg"
          style={{
            color: `${colors.success}`,
          }}
        ></i>
      </div>
      <div className="text-left">
        <div className="font-bold text-sm">Post successful!</div>
      </div>
      <div
      className="flex flex-row"
        style={{
          marginLeft: "auto",
        }}
      >
        <div className="mr-2">
          <ActionButton
            string={"View"}
            action={(e) => {
              props.clearJob(props.job.gallery_id)
              history.push(`/beam/${props.job.gallery_id}`)
            }}
          ></ActionButton>
        </div>

        <div className="toast-close" style={{}}>
          <ActionButton
            icon={"fa-times"}
            action={(e) => props.clearJob(props.job.gallery_id)}
          ></ActionButton>
        </div>
      </div>
    </JobRoot>
  )
}
function ActionButton(props) {
  return (
    <ButtonView onClick={props.action}>
      {props.icon && <i className={`fas ${props.icon} icon`}></i>}
      {props.string && <div className="string">{props.string}</div>}
    </ButtonView>
  )
}
const ButtonView = styled.button`
font-size: 12px;
font-weight: 600;
  background: ${(props) => props.theme.background_1};
  border: ${(props) => `1px solid ${props.theme.border}`};
  border-radius: 8px;
  padding: 6px 14px;
`
const mapDispatchToProps = {
  clearJob,
}

const enter = keyframes`
    from{
        transform: translateY(200px);
    }
    to{
        transform: translateY(0px);

    }
`
const Root = styled.div`
  position: fixed;
  bottom: 10px;
  display: flex;
  color: white;
  flex-direction: row;
  left: 0;
  right: 0;
  z-index: 9999;
`
const JobRoot = styled.div`
  margin-right: 16px;
  position: relative;
  width: 280px;
  pointer-events: auto;
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.background_1};
  border-radius: 8px;
  padding: 6px;
  border: ${(props) => `1px solid ${(props) => props.theme.border}`};
  box-shadow: 3px 3px 18px rgba(0, 0, 0, 0.2);
  animation: ${enter} 0.3s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
`

export default connect(mapStateToProps, mapDispatchToProps)(CompletedJobs)

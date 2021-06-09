import React from "react"
import styled from "styled-components"
export default function Badge(props) {
  return (
    <View className="" background={props.background}>
      <div>{props.value || 0}</div>
    </View>
  )
}
const View = styled.div`
  width: 18px;
  height: 18px;
  position: absolute;
  border-radius: 100%;
  display: flex;
  font-size: 10px;
  justify-content: center;
  align-items: center;
  top: -6px;
  right: -6px;
  border: ${(props) => `1px solid ${props.theme.border}`};
  background-color: ${(props) =>
    props.background && props.value > 0
      ? props.background
      : props.theme.background_1};
`

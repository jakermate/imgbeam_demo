import React from 'react'
import stc from 'string-to-color'
import styled from 'styled-components'
export default function Tag(props) {
    return (
        <TagEl color={stc(props.tag.name)}>
            {props.tag.name}
        </TagEl>
    )
}
const TagEl = styled.div`
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 1rem;
  display: inline-block;
  position: relative;
  /* float: left; */
  padding: 10px 24px;
  background: ${(props) => props.color};
  /* background: linear-gradient(to top right, #121212, #212121); */
  text-transform: uppercase;
  font-weight: bolder;
  font-size: 0.8rem;
  color: white;
  border-radius: 12px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in;
  :hover {
    background: linear-gradient(to top right, #444, #212121);
  }
`
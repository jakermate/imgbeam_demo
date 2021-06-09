import React, { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { connect } from "react-redux"
import { useHistory } from "react-router-dom"
import imgbeam from '../../imgbeam_text_white.png'
import { Helmet } from "react-helmet"
import {
  startUpload,
  addFile,
  setFiles,
  removeFile,
  setTags,
  resetTransferState,
  setDescription,
  setTitle,
  cancelUpload,
} from "../../state/store/actions/index"
function NewPostView(props) {
  useEffect(() => {
    return () => {
      props.resetTransferState()
    }
  }, [])
  // const [title, setTitle] = useState("")
  const [tags, setTags] = useState([])
  const [tagString, setTagString] = useState("")

  // check if upload is valid and ready to transfer
  const [valid, setValid] = useState(false)
  useEffect(() => {
    if (props.filesToDo.length == 0) return
    let valid = true
    if (props.title.length === 0) valid = false
    if (props.filesToDo.length === 0) valid = false
    if (getSize() > 80) valid = false
    if (props.filesToDo.length > 40) valid = false
    console.log(valid)
    setValid(valid)
  }, [props.filesToDo, props.description, props.title])
  function getSize() {
    return (
      props.filesToDo
        .map((file) => file.size)
        .reduce((total, fileSize) => (total += fileSize)) / 1000000
    )
  }
  function tagLink(string) {
    console.log(string)
    if (!tags.includes(string)) {
      setTags([...tags, string])
    }
  }
  function addTag(e) {
    console.log(e.keyCode)
    // remove last tag if string empty and delete hit
    if (e.keyCode == 8 && tagString.length == 0) {
      let tags_array = [...tags]
      tags_array.splice(tags_array.length - 1, 1)
      setTags(tags_array)
    }
    if (e.keyCode === 13) {
      // check if tag already there
      if (tags.includes(tagString)) {
        setTagString("")
        return
      }
      setTags([...tags, tagString])
    }
  }
  function removeTag(tagString) {
    let index = tags.indexOf(tagString)
    let new_tags = [...tags]
    new_tags.splice(index, 1)
    setTags(new_tags)
  }
  useEffect(() => {
    setTagString("")
    // console.log(tags)
  }, [tags])
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    console.log(counter)
    if (counter > 0) {
      document.getElementById("drop-zone").classList.add("active")
      return
    }
    document.getElementById("drop-zone").classList.remove("active")
  }, [counter])
  if (props.uploading)
    return (
      <div>
        <HelmetEl></HelmetEl>

        <View>uploading</View>
      </div>
    )
  else
    return (
      <View
        className="mx-auto "
        onDragEnter={(e) => setCounter(counter + 1)}
        onDragLeave={(e) => setCounter(counter - 1)}
      >
        <HelmetEl></HelmetEl>
        <Banner>
          <div className="absolute left-0 bottom-0 top-0 flex flex-col items-center justify-center pl-3">
            <a href="/" className="block">
            <img src={imgbeam} alt="" style={{
              height: '32px'
            }}/>

            </a>
          </div>
          <h2 className="title">New Post</h2>
          {/* <h2 className="subtitle">Let's make this as easy as possible...</h2> */}
        </Banner>
        <div
          className="main-content mt-12 flex flex-col lg:flex-row container px-12 mx-auto"
          style={{
            maxWidth: "1080px",
            // overflowY: 'scroll',
            marginBottom: '64px'
          }}
        >
          <FileZone
            addFile={props.addFile}
            filesToDo={props.filesToDo}
            removeFile={props.removeFile}
          ></FileZone>
          <InfoZone
            addTag={addTag}
            tagLink={tagLink}
            tags={tags}
            setDescription={setDescription}
            removeTag={removeTag}
            tagString={tagString}
            setTagString={setTagString}
            title_value={props.title}
            setTitle={props.setTitle}
          ></InfoZone>
        </div>
        <FixedFooter
          startUpload={props.startUpload}
          valid={valid}
          title={props.title}
          files={props.filesToDo}
          cancelUpload={props.cancelUpload}
        ></FixedFooter>
      </View>
    )
}
function FileZone(props) {
  function addFileToState(newFile) {
    let reader = new FileReader()
    reader.onload = function (e) {
      newFile.typeString = returnType(newFile.type)
      newFile.url = e.target.result
      props.addFile(newFile)
    }
    reader.readAsDataURL(newFile)
  }
  function returnType(typeString) {
    if (typeString.includes("video")) {
      return "video"
    }
    return "image"
  }
  function checkFile(e) {
    console.log(e.dataTransfer)
    // if(e.dataTransfer.items[0].type.contains){
    //   console.log('file present')
    // }
  }
  function deleteFile(e, index) {
    e.stopPropagation()
    props.removeFile(index)
  }
  if (props.filesToDo[0]) console.log(props.filesToDo[0])
  return (
    <FileView>
      <div id="main-drop">
        <DropZone
          id="drop-zone"
          onDragOver={(e) => checkFile(e)}
          occupied={props.filesToDo[0]}
          onClick={(e) => document.getElementById("browse").click()}
        >
          {props.filesToDo.length > 0 && (
            <DeleteButton index={0} action={deleteFile}></DeleteButton>
          )}
          {props.filesToDo.length > 0 && (
            <div className="overlay absolute  top-0 bottom-0 left-0 right-0 z-10">
              {props.filesToDo[0].typeString == "image" ? (
                <img
                  src={props.filesToDo[0].url}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <video
                  src={props.filesToDo[0].url}
                  alt=""
                  muted
                  autoPlay
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                ></video>
              )}
            </div>
          )}
          
          {props.filesToDo[0] && (
            <div className="control-overlay z-50 absolute top-0 left-0 right-0 bottom-0">
              {/* <TrashButton></TrashButton> */}
            </div>
          )}

          <div className="absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center">
            <div className="relative">
              <i className="fas fa-cloud-upload-alt icon"></i>
            </div>
            <div className="font-bold text-2xl">Drop an Image or Video</div>
            <div>
              <BrowseLabel htmlFor="browse">
                or browse for a file
                <input
                  onChange={(e) => addFileToState(e.target.files[0])}
                  id="browse"
                  style={{
                    display: "none",
                  }}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp,.mp4,.mov,.avi,.webm,.mpeg,.flv,.mkv,.mpv,.wmv"
                />
              </BrowseLabel>
            </div>
            <div className="subhead">
              (20MB per file limit, up to 80MB per upload)
            </div>
          </div>
        </DropZone>
      </div>
      <div className="allowed mt-2">
        Accepted Formats
        <div className="allowed-sub">
          images (.jpg, .png, gif, .tif, .webp) videos (.mp4, .avi, .webm, .mov)
        </div>
      </div>
      {props.filesToDo[0] && <Summary filesToDo={props.filesToDo}></Summary>}
      <MoreImages
        length={props.filesToDo.length}
        id="more-images"
        className="mt-6"
      >
        <div className="flex flex-row flex-wrap">
          <NewMediaButton htmlFor="add-media">
            <input
              type="file"
              id="add-media"
              className="hidden"
              onChange={(e) => addFileToState(e.target.files[0])}
              style={{
                display: "none",
              }}
              accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp,.mp4,.mov,.avi,.webm,.mpeg,.flv,.mkv,.mpv,.wmv"
            />
            <div>
              <i className="fas fa-plus icon"></i>
            </div>
          </NewMediaButton>
          {props.filesToDo.map((file, index) => {
            if (index !== 0) {
              return (
                <MediaButton>
                  <DeleteButton
                    index={index}
                    action={deleteFile}
                  ></DeleteButton>
                  <img
                    src={file.url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </MediaButton>
              )
            }
          })}
        </div>
      </MoreImages>
    </FileView>
  )
}
function HelmetEl() {
  return (
    <Helmet>
      <meta charset="utf-8" />
      <title>{`New Post - ImgBeam, Capital of Memeland`}</title>
      <meta
        name="description"
        content={
          "Upload something new to ImgBeam. Share memes, find new wallpapers, get gifs, and more."
        }
      />
      <meta name="image" content={"https://imgbeam.com/splash.png"} />
      {/* <!-- Schema.org for Google --> */}
      <meta
        itemprop="name"
        content={`New Post - ImgBeam, Capital of Memeland`}
      />
      <meta
        itemprop="description"
        content={
          "Upload something new to ImgBeam. Share memes, find new wallpapers, get gifs, and more."
        }
      />
      <meta itemprop="image" content={"https://imgbeam.com/splash.png"} />
      {/* <!-- Twitter --> */}
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:title"
        content={`New Post - ImgBeam, Capital of Memeland`}
      />
      <meta
        name="twitter:description"
        content={
          "Upload something new to ImgBeam. Share memes, find new wallpapers, get gifs, and more."
        }
      />
      <meta
        name="twitter:image:src"
        content={"https://imgbeam.com/splash.png"}
      />
      {/* <!-- Open Graph general (Facebook, Pinterest & Google+) --> */}
      <meta
        name="og:title"
        content={`New Post - ImgBeam, Capital of Memeland`}
      />
      <meta
        name="og:description"
        content={`Upload something new to ImgBeam. Share memes, find new wallpapers, get gifs, and more.`}
      />
      <meta name="og:image" content={"https://imgbeam.com/splash.png"} />
      <meta name="og:type" content="website" />
    </Helmet>
  )
}
const MoreImages = styled.div`
  transition: all 0.2s linear;
  overflow-y: auto;
`


const NewMediaButton = styled.label`
  background-color: ${(props) => props.theme.background_2};
  border: ${(props) => `1px solid ${props.theme.border}`};
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 92px;
  height: 64px;
  .icon {
    transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    color: ${(props) => props.theme.secondary};
  }
  :hover {
    background-color: ${(props) => props.theme.background_2};
    .icon {
      transform: scale(1.5);
    }
  }
  margin-right: 16px;
  overflow: hidden;
`
const MediaButton = styled.button`
  background-color: ${(props) => props.theme.background_3};
  border-radius: 8px;
  display: flex;
  margin-bottom: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 92px;
  position: relative;
  height: 64px;
  margin-right: 16px;
  overflow: hidden;
`

const BrowseLabel = styled.label`
  cursor: pointer;
  font-weight: 700;
  color: ${(props) => props.theme.tertiary};
`
const DropZone = styled.div`
  transition: all 0.2s linear;
  cursor: pointer;
  background: ${props => `linear-gradient(to top right, ${props.theme.success}, ${props.theme.secondary})`};
  box-shadow: 0 8px 12px -8px rgba(0,0,0,.7);
  color: white;
    border-radius: 12px;
  display: flex;
  overflow: hidden;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.active {
    transform: scale(1.03);
    background: ${(props) => props.theme.background_2};
  }
  .control-overlay {
    transition: all 0.1s linear;
    display: none;
    opacity: 0;
  }
  :hover {
    .drop-info {
      opacity: 0.2;
    }
    .control-overlay {
      display: flex;
      opacity: 1;
    }
    .icon {
      transform: scale(1.3);
      opacity: 1;
      margin-bottom: 20px;
      color: white;
    }
  }
  .overlay {
    background-color: ${(props) => props.theme.background_2};
  }
  :after {
    padding-top: 75%;
    content: "";
    display: block;
  }
  .icon {
    opacity: 0;

    transition: all 0.3s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    font-size: 72px;
  }
  .subhead{
    font-weight: bold;
    color: white;
    opacity: .7;
  }
`
function Summary(props) {
  return (
    <SummaryView>
      <div className="bar">
        {props.filesToDo.length} items{" "}
        <span className="sizes">
          (
          {(
            props.filesToDo
              .map((file) => file.size)
              .reduce((total, fileSize) => (total += fileSize)) / 1000000
          ).toFixed(1) || 0}
          MB)
        </span>
      </div>
    </SummaryView>
  )
}
const SummaryView = styled.div`
  width: 100%;
  margin-top: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 600;
  .sizes {
    color: ${(props) => props.theme.textFaded};
  }
  .bar {
    padding: 12px;
    background: ${(props) => props.theme.background_2};
  }
`
const FileView = styled.div`
  flex: 1;
  overflow-y: auto;
  @media(min-width: 600px){
    margin-right: 32px;

  }

  .allowed{
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.textFaded};
  }
  .allowed-sub{
    font-size: 12px;
  }
`
function DeleteButton(props) {
  return (
    <DeleteButtonView
      className="delete-button"
      onClick={(e) => props.action(e, props.index)}
    >
      <i className="fas fa-times block"></i>
    </DeleteButtonView>
  )
}
const DeleteButtonView = styled.button`
  border-radius: 8px;
  position: absolute;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 12px;
  top: -10px;
  z-index: 99;
  right: -10px;
  border: ${(props) => `1px solid ${props.theme.border}`};
  background: ${(props) => props.theme.background_1};
`
function InfoZone(props) {
  return (
    <InfoView>
      <InputSection title={"Title"}>
        <InputWrap
          onChange={props.setTitle}
          value={props.title_value}
          placeholder={"Add a title"}
          type="text"
          id="title"
        />
      </InputSection>
      <InputSection title={"Tags"}>
        <InputWrap
          addTag={props.addTag}
          tags={props.tags}
          removeTag={props.removeTag}
          deleteTag={props.deleteTag}
          onChange={props.setTagString}
          value={props.tagString}
          type="text"
          id="tags"
        />
        <div id="suggest-tags" className="mt-6">
          <h3 className="font-bold small-header text-sm opacity-50">
            Suggestions
          </h3>
          <ul className="flex flex-row flex-wrap">
            <TagSuggestion onClick={(e) => props.tagLink("meme")}>
              meme
            </TagSuggestion>
            <TagSuggestion onClick={(e) => props.tagLink("movies")}>
              movies
            </TagSuggestion>
            <TagSuggestion onClick={(e) => props.tagLink("funny")}>
              funny
            </TagSuggestion>
            <TagSuggestion onClick={(e) => props.tagLink("sports")}>
              sports
            </TagSuggestion>
          </ul>
        </div>
      </InputSection>
      <InputSection title={"Description"}>
        <DescriptionInput
          value={props.description}
          placeholder={"Optional"}
          onChange={(e) => props.setDescription(e.target.value)}
        ></DescriptionInput>
      </InputSection>
    </InfoView>
  )
}
const TagSuggestion = styled.button`
  color: ${(props) => props.theme.success};
  margin-right: 8px;
`
const DescriptionInput = styled.textarea`
  background: ${(props) => props.theme.background_3};
  border-radius: 8px;
  width: 100%;
  padding: 8px;
  min-height: 120px;
  :focus,
  :active {
    outline: none;
  }
`
function InputWrap(props) {
  return (
    <InputView >
      {props.tags &&
        props.tags.map((tag) => {
          return (
            <Tag onClick={(e) => props.removeTag(tag)}>
              <div className="absolute flex cursor-pointer flex-col items-center justify-center overflow-hidden delete-overlay top-0 left-0 right-0 bottom-0">
                <i className="fas fa-times block"></i>
              </div>
              {tag}
            </Tag>
          )
        })}
      <input
        className="inline input"
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={(e) => (props.addTag ? props.addTag(e) : () => {})}
        value={props.value}
        placeholder={props.placeholder}
        type="text"
      />
    </InputView>
  )
}
const Tag = styled.div`
  .delete-overlay {
    opacity: 0;
    background: ${(props) => props.theme.warning};
  }
  background: ${(props) => props.theme.background_colored_2};
  border-radius: 3px;
  margin-right: 4px;
  position: relative;
  display: inline;
  padding: 4px 8px;
  color: white;
  :hover {
    .delete-overlay {
      opacity: 1;
    }
  }
`
const InputView = styled.div`
  /* max-width: 250px; */
  cursor: text;
  padding: 8px 12px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: row;
  border-radius: 8px;
  min-height: 48px;

  width: 100%;
  background: ${(props) => props.theme.background_3};
  input {
    margin-left: 8px;
    background: transparent;
    outline: none;
    width: 100%;
    ::active,
    :focus {
      outline: none;
    }
  }
`
function InputSection(props) {
  return (
    <fieldset className="py-3">
      <div className="font-bold mb-2">{props.title}</div>
      {props.children}
    </fieldset>
  )
}
const InfoView = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  @media(min-width: 600px){
    width: 340px;

  }
`
function FixedFooter(props) {
  const history = useHistory()
  function goBack() {
    history.goBack()
    props.cancelUpload()
  }
  return (
    <FooterView>
      <FooterControl className="justify-start">
        <CancelButton onClick={(e) => goBack(e)} className="flex relative">
          Cancel
        </CancelButton>
      </FooterControl>
      <div className="flex-1 hidden sm:flex flex-row  items-center justify-center">
        <div className="text-sm">
          Beam me up, Scotty!
          <i className="fas fa-user-astronaut colored fa-lg ml-4"></i>
        </div>
      </div>
      <FooterControl className="justify-end">
        <PostButton
          onClick={(e) => props.startUpload()}
          disabled={!props.valid}
          className="flex relative"
        >
          Submit to Imgbeam
        </PostButton>
      </FooterControl>
    </FooterView>
  )
}
const FooterView = styled.footer`
  position: fixed;
  padding: 0 24px;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  z-index: 99;
  height: 64px;
  background: ${(props) => props.theme.background_1};
  border-top: ${(props) => `1px solid ${props.theme.border}`};
  .colored {
    color: ${(props) => props.theme.success};
  }
`
const FooterControl = styled.div`
  width: 250px;
  display: flex;
  position: relative;
  align-items: center;
`
const CancelButton = styled.button`
  border: ${(props) => `1px solid ${props.theme.border}`};
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: bold;
`
const PostButton = styled.button`
  font-size: 14px;
  background: ${(props) => props.theme.success};
  color: white;
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  font-weight: bold;
  padding: 8px 14px;
  border-radius: 8px;
`
function mapStateToProps(state) {
  return {
    uploading: state.transfer_reducer.uploading,
    filesToDo: state.transfer_reducer.filesToDo,
    title: state.transfer_reducer.title,
    description: state.transfer_reducer.description,
  }
}
const mapDispatchToProps = {
  startUpload,
  addFile,
  setFiles,
  setTags,
  removeFile,
  setTitle,
  cancelUpload,
  resetTransferState,
  setDescription,
}
export default connect(mapStateToProps, mapDispatchToProps)(NewPostView)
const enter = keyframes`
  from{
    opacity:0;
    transform: translateY(-50px);
  }
  to{
    opacity:1;
    transform: translateY(0px);
  }
`
const Banner = styled.div`
  padding: 16px 0;
  background: ${(props) => props.theme.background_colored};
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: row;
  color: white;
  .title {
    opacity: 0;
    line-height: 1;
    animation: ${enter} 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
    animation-delay: 0.2s;
    font-size: 24px;
  }
  .subtitle {
    opacity: 0;
    animation: ${enter} 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
    animation-delay: 0.4s;
    font-size: 22px;
    color: ${(props) => props.theme.textFaded};
  }
`
const View = styled.div`
  z-index: 9999;
  max-width: 100vw;
  box-sizing: border-box;
  /* opacity: 0; */
  overflow-y: hidden;
  padding-bottom: 64px;
  position: absolute;
  width: 100vw;
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
  top:0;
  background: ${props => props.theme.background_1};
  /* animation: ${enter} 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards; */
  /* margin-top: ${(props) => props.theme.navbar_height}; */
`

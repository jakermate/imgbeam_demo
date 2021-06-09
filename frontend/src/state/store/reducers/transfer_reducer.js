import { v4 as uuid } from "uuid"
const initialState = {
  uploading: false,
  filesToDo: [],
  filesComplete: [],
  currentFile: 0,
  completedJobs: [],
  title: "",
  tags: [],
  description: ""
}
export default function transfer_reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_DESCRIPTION":
      return {...state, description: action.payload}
    case "RESET_TRANSFER_STATE":
      console.log("resetting transfer state")
      return { ...initialState }

    case "SET_TITLE":
      return {...state, title: action.payload}
    case "COMPLETE_UPLOAD":
      // add complete job object to state
      console.log(action.payload)
      console.log('trying to build completed jobs array')
      let complete_job = {gallery_id: action.payload, filesUploaded: [...state.filesComplete]}
      let completed_jobs_array = [...state.completedJobs, complete_job]
      
      return {...initialState,  completedJobs: completed_jobs_array}

    case "FILE_FAILURE":
      let id_of_failure = action.payload
      let file = returnFileFromId(id_of_failure, state.filesToDo)
      let index_of_failure = getIndex(id_of_failure, [...state.filesToDo])
      if (file.attempts > 0) {
        console.log("retrying file " + id_of_failure)
        file.attempts = file.attempts - 1
        let updated_array = decrement_file_attempts(index_of_failure, [
          ...state.filesToDo,
        ])
        return { ...state, filesToDo: updated_array }
      } else {
        console.log("ran out of atttempts for file " + id_of_failure)
        // remove file
        let newFilesToDo = returnArrayWithFileRemoved(
          id_of_failure,
          state.filesToDo
        )
        return { ...state, filesToDo: newFilesToDo }
      }

    case "START_UPLOAD":
      console.log("Upload state set to true")
      return { ...state, uploading: true}

    case "ADD_FILE":
      let processed_file = processFile(action.payload)
      return { ...state, filesToDo: [...state.filesToDo, processed_file]}
    case "REMOVE_FILE":
      let files_array_for_removal = [...state.filesToDo]
      let array_with_removed = returnArrayWithFileRemoved(action.payload, files_array_for_removal)
      return {...state, filesToDo: array_with_removed}
    case "NEXT_FILE":
      if (state.currentFile < state.filesToDo.length - 1) {
        return { ...state, currentFile: state.currentFile + 1 }
      }
      break
    case "SET_TAGS":
      return {...state, tags: action.payload}
    case "CLEAR_FILE":
      let id_to_clear = action.payload
      let new_file_array = [...state.filesToDo]
      let deleted = returnFileFromId(id_to_clear, new_file_array)
      let array_to_return = returnArrayWithFileRemoved(id_to_clear, new_file_array)
      return {
        ...state,
        filesToDo: array_to_return,
        filesComplete: [...state.filesComplete, deleted],
      }
    case "CANCEL_UPLOAD":
      return { ...initialState }
    case "CLEAR_JOB":
      console.log('clear job')
      return {...state, completedJobs: [...clearJob(action.payload, state.completedJobs)]}
    default:
      return state
  }
}

function returnFileFromId(file_id, array) {
  let file_id_array = array.map((file_object) => {
    return file_object.file_id
  })
  let index = file_id_array.indexOf(file_id)
  return array[index]
}
function returnArrayWithFileRemoved(id_of_failure, filesToDo) {
  let array = [...filesToDo]
  let index = getIndex(id_of_failure, filesToDo)
  array.splice(index, 1)
  return array
}
function getIndex(id, filesToDo) {
  let array = [...filesToDo]
  let file_id_array = array.map((file_object) => {
    return file_object.file_id
  })
  return file_id_array.indexOf(id)
}
function decrement_file_attempts(index, array) {
  let file = array[index]
  file.attempts = file.attempts - 1
  array[index] = file
  return array
}

function processFile(file) {
  file.id = uuid()
  file.attempts = 3
  return file
}

function clearJob(gallery_id, array){
  let id_array = array.map((job)=>{
    return job.gallery_id
  })
  let index = id_array.indexOf(gallery_id)
  array.splice(index, 1)
  return [...array]
}
class CompletedJob{
  constructor(gallery_id){
    this.gallery_id = gallery_id
  }
}
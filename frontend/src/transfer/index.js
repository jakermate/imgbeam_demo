import {
  setFiles,
  clearFileFromState,
  fileFailure,
  cancelUpload,
  toggleCreatePanel,
  completeUpload
} from "../state/store/actions/index"
import watch from "redux-watch"
import store from "../state/store/store"
// import store from "../state/store/store"
export default class UploadManager {
  constructor(){
    this.store = null
  }
  setWatcher(store){
    this.store = store
    let watcher = watch(store.getState, "transfer_reducer.uploading")
    store.subscribe(
      watcher((newVal, oldVal, objectPath) => {
        console.log("%s changed from %s to %s", objectPath, oldVal, newVal)
        // watches for uploading getting set to true, being transfers here
        if(newVal){
            this.startJob(store)
        }
        // cancel job if cahnges to uploading: false
        if(!newVal){
            this.cancelJob()

        }

      })
    )
  }

  cancelJob(){
    // this returns transfer state to initialState
    this.job = null
  }
  startJob(store){
    this.job = new Job(null, store)
  }
}

// state store informs the upload manager above when state changes to initiate aan upload.  It instantiates and stores a Job object from below, which manages the transfer and updating the stores state to stay in sync.  When it has no files left, it will update the store that uploading is complete (uploading value set to false).  The watcher in the Manager object will see this and clear out the job.
class Job {
  constructor(gallery_id = null, store) {
    console.log('initiating upload job')
    this.title = store.getState().transfer_reducer.title
    this.description = store.getState().transfer_reducer.description

    console.log('transfer title is ' + this.title)
    this.gallery_id = gallery_id
    this.files = []
    this.start()
  }
  start() {
    if (this.gallery_id == null) {
      console.log('starting job at create step')
      this.createNewPost()
    } else {
      console.log('starting job at append step')
      this.goToNextStep()
    }
  }
  getNextFile(){
    let state = store.getState()
    let file = state.transfer_reducer.filesToDo[0]
    console.log(state)
    return file
  }
  getTags(){
    let state = store.getState()
    let tags = state.transfer_reducer.tags
    return tags
  }
  async createNewPost() {
    console.log('creating new post')
    let file = this.getNextFile()
    let tags = this.getTags()
    // transfer started, close create menu
    store.dispatch(toggleCreatePanel())
    try {
      let data = new FormData()
      data.set("title", this.title)
      data.set("file", file)
      data.set("tags", JSON.stringify(tags))
      data.set("description", this.description)
      let url = "/api/upload/create"
      let res = await fetch(url, {
        credentials: "include",
        method: "POST",
        body: data,
      })

      if (res.status === 200) {
        console.log('post created')
        let json = await res.json()
        console.log('new gallery id ' + json.gallery_id)
        this.gallery_id = json.gallery_id
        this.goToNextStep(this.gallery_id)
      }
    } catch (err) {
      console.log(err)
      
    }
  }

  // handle looping through files to update
  async goToNextStep(last_file_id) {
    // clear out last file
    clearLastFile(last_file_id)

    // first check if any left to do
    let file = this.getNextFile()
    if(file){
      console.log(file)
      await this.addMedia(file)
      return
    }
    // end transfer if no more files
    this.onComplete(this.gallery_id)
    
  }

  // individual upload job
  async addMedia(file) {
    console.log('ADDING FILE')
    console.log(file)
    let data = new FormData()
    data.append('file', file)
    try {
      let url = `/api/beam/edit/${this.gallery_id}/images/add`
      let res = await fetch(url, {
        credentials: "include",
        method: "POST",
        body: data,
      })
      if (res.status == 200) {
        console.log('file upload success, now clearing')
        console.log(file.id)
        this.goToNextStep(file.id)
      } 
    } catch (err) {
      console.log(err)
      fileFailure(file.id)
    }
  }

  clearFile(file_id) {
    clearFileFromState(file_id)
  }

  onComplete(gallery_id){
    console.log('Transfer job complete')
    // restore initial state here
    store.dispatch(completeUpload(gallery_id))
  }
}

class File {
  constructor(file, index) {
    this.file = file
    this.index = index
    this.complete = false
  }
  getIndex() {
    return this.index
  }
  isComplete() {
    return this.complete
  }
}

function clearLastFile(id){
  store.dispatch(clearFileFromState())
}
export function toggleCreatePanel(payload) {
  return { type: "TOGGLE_CREATE", payload }
}
export function toggleSidebar(payload) {
  return { type: "TOGGLE_SIDEBAR", payload }
}
export function signIn(payload) {
  return { type: "SIGN_IN", payload }
}
export function signOut(payload) {
  return { type: "SIGN_OUT", payload }
}
export function setAccount(payload){
    return {type: "SET_ACCOUNT", payload}
}
export function startUpload(payload){
  return {type: "START_UPLOAD", payload}
}
export function completeUpload(payload){
  return {type: "COMPLETE_UPLOAD", payload}
}
export function cancelUpload(payload){
  return {type: "CANCEL_UPLOAD", payload}
}
export function setFiles(payload){
  return {type: "SET_FILES", payload}
}
export function addFile(payload){
  return {type: "ADD_FILE", payload}
}
export function removeFile(payload){
  return {type: "REMOVE_FILE", payload}
}
export function setCheckedIn(payload){
  return {type: "SET_CHECKED_IN", payload}
}
export function resetTransferState(payload){
  return {type: "RESET_TRANSFER_STATE", payload}
  
}
export function setTags(payload){
  return {type: "SET_TAGS", payload}
}
export function toggleNavbar(payload){
  return {type: "TOGGLE_NAVBAR", payload}
}
export function clearFileFromState(payload){
  return {type: "CLEAR_FILE", payload}
}
export function fileFailure(payload){
  return {type: "FILE_FAILURE", payload}
}
export function toggleFocusView(payload){
  return {type: "TOGGLE_FOCUS_VIEW", payload}
}
export function setFocusPath(payload){
  return {type: "SET_FOCUS_PATH", payload}
}
export function toggleTheme(payload){
  return {type: "TOGGLE_THEME", payload}
}
export function clearJob(payload){
  return {type: "CLEAR_JOB", payload}
}
export function clearAllNotifications(payload){
  return {type: "CLEAR_ALL_NOTIFICATIONS", payload}
}
export function clearNotification(payload){
  return {type: "CLEAR_NOTIFICATION", payload}
}
export function setNotifications(payload){
  return {type: "SET_NOTIFICATIONS", payload}
}
export function setTitle(payload){
  return {type: "SET_TITLE", payload}
}
export function toggleSignUpOverlay(payload){
  return {type: "TOGGLE_SIGN_UP_OVERLAY", payload}
}
export function setSearch(payload){
  return {type: "SET_SEARCH", payload}
}
export function setDescription(payload){
  return {type: "SET_DESCRIPTION", payload}
}
const initialState = {
  createPanel: false,
  sidebar: false,
  signedIn: false,
  checkedIn: false,
  focusView: false,
  focusPath: "",
  focusGallery: "",
  theme: "theme_dark",
  navbar: true,
  signUpOverlay: false,
  search: "",
  notifications: []
}
export default function app_state_reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return {...state, search: action.payload}
    case "SET_NOTIFICATIONS":
      return {...state, notifications: action.payload}
    case "SET_CHECKED_IN":
      return {...state, checkedIn: true}
    case "TOGGLE_CREATE":
      return { ...state, createPanel: !state.createPanel }
    case "TOGGLE_SIDEBAR":
      console.log(action.payload)
      if(typeof action.payload == 'boolean') return {...state, sidebar: action.payload}
      return { ...state, sidebar: !state.sidebar }
    case "SIGN_IN":
      return { ...state, signedIn: true }
    case "SIGN_OUT":
      return { ...state, signedIn: false }
    case "TOGGLE_FOCUS_VIEW":
      return { ...state, focusView: !state.focusView }
    case "TOGGLE_SIGN_UP_OVERLAY":
      return {...state, signUpOverlay: !state.signUpOverlay}
    case "SET_FOCUS_PATH":
      return {
        ...state,
        focusPath: action.payload.focusPath,
        focusGallery: action.payload.focusGallery,
      }
    case "TOGGLE_THEME":
      console.log('toggling theme')
      if(action.payload)  {
        localStorage.setItem('theme', action.payload)
        return{...state, theme: action.payload}
      }
       // if defined in payload from local storage
      if(state.theme === "theme_dark"){
        localStorage.setItem('theme', "theme_light")
        return {...state, theme: "theme_light"} // normal toggle
      } 
      localStorage.setItem('theme', "theme_dark")
      return {...state, theme: "theme_dark"}
    case "TOGGLE_NAVBAR":
      return {...state, navbar: !state.navbar}
    default:
      return state
  }
}

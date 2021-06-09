import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux'
import store from './state/store/store'
import * as serviceWorker from './serviceWorker';
import Manager from './transfer/index'
import {toggleTheme} from './state/store/actions/index'
import {ThemeProvider} from 'styled-components'
import theme from './theme/theme'
import watch from 'redux-watch'
class GlobalSettings{

}

const localStorage = window.localStorage
let themeString = localStorage.getItem("theme")
console.log("getting app state from storage")
if (themeString) {
  store.dispatch(toggleTheme(themeString))
} else {
  // if no preference, set default local storage to light
  localStorage.setItem("theme", "theme_light")
  store.dispatch(toggleTheme("theme_light"))
}


// set upload manager watcher
const manager = new Manager()
manager.setWatcher(store)

// render
ReactDOM.render(
  <React.StrictMode>
  <Provider store={store}>
    <App />

    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


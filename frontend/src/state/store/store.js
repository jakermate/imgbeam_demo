import {createStore} from 'redux'
import mainReducer from './reducers'
import Manager from '../../transfer/index'
const store =  createStore(mainReducer)
const manager = new Manager(store.getState)
export default store

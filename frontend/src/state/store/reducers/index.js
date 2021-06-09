import { combineReducers } from "redux";
import account_reducer from "./account_reducer";
import app_state_reducer from "./app_state_reducer";
import transfer_reducer from './transfer_reducer'
export default combineReducers({ account_reducer, app_state_reducer, transfer_reducer });

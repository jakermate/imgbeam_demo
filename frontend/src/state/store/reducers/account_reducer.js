const initialState = {
    account: {

    },
    notifications: [],
    follows: []
}
export default function account_reducer(state = initialState, action){
    switch(action.type){
        case "SET_ACCOUNT":
            return {...state, account: action.payload}
        case "SET_NOTIFICATIONS":
            return {...state, notifications: action.payload}
        case "CLEAR_ALL_NOTIFICATIONS":
            return {...state, notifications: []}
        case "CLEAR_NOTIFICATION":
            let new_notification_array = state.notifications
            // clear specific notification via ID

            return {...state, notifications: new_notification_array}
        default:
            return state
    }
}
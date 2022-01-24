import * as tabActionTypes from "./tabActions";

const initialState = {
    isMainModalVisible: false
}

const tabReducer = (state = initialState, action) => {
    switch(action.type) {
        case tabActionTypes.SET_MAIN_MODAL_VISIBILITY:
            return {
                ...state,
                isMainModalVisible: action.payload.isVisible
            }
            default:
                return state

    }
}

export default tabReducer;
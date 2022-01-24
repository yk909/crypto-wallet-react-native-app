export const SET_MAIN_MODAL_VISIBILITY = 'SET_MAIN_MODAL_VISIBILITY';

export const setMainModalVisibilitySuccess = (isVisible) => ({
    type: SET_MAIN_MODAL_VISIBILITY,
    payload: {isVisible}
})

export function setMainModalVisibility(isVisible) {
    return dispatch => {
        dispatch(setMainModalVisibilitySuccess(isVisible))
    }
}
export const initialState = {
    error: '',
    isAuthenticated: false,
    token: null,
    user: null
}

export const reducer = (state, action) => {
    switch(action.type) {
        case "USER_LOGIN":
            return {
                ...state,
                error: '',
                isAuthenticated: true,
                token: action.payload.token,
                user: action.payload.user
            }
        case "USER_LOGOUT":
            return {
                ...state,
                error: '',
                isAuthenticated: false,
                token: null,
                user: null
            }
        default:
            return state
    }
}

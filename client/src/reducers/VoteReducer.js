export const voteInitialState = {
    like: 0,
    dislike: 0
};

export const voteReducer = (state, action) => {
    switch (action.type) {
        case 'LIKES':
            return {...state, like: state.like + 1};
        case 'DISLIKES':
            return {...state, dislike: state.dislike - 1};
        default:
            return state;
    }
}
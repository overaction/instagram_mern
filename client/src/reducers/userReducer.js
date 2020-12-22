export const initialState = null;

export const reducer = (state,action) => {
    console.log(action.payload);
    switch(action.type) {
        case "USER":
            return action.payload
        case "CLEAR":
            return null
        case "UPDATE":
            return {
                ...state,
                followers: action.payload.followers,
                followings: action.payload.followings
            }
        case "UPDATE_PROFILE":
            return {
                ...state,
                pic: action.payload.pic
            }
        default:
            return state;
    }
}
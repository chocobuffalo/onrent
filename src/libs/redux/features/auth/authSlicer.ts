import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../uistore";




export interface AuthStateInterface {
    isLogin: boolean;
    profile: {
        name: string;
        email: string;
    };
}

export const initialAuth: AuthStateInterface = {
    isLogin:false,
    profile:{
        name:'',
        email:''
    }
}

const authSlicer = createSlice({
    name: 'auth',
    initialState: initialAuth,
    reducers:{
         getLogin: ( state, action ) =>{
            state.isLogin = action.payload
         },

    }
});

export const {getLogin} = authSlicer.actions;

export const selectProfile = ( state:RootState ) => (state.auth as AuthStateInterface).profile
export const selectAuth = ( state:RootState ) =>  (state.auth as AuthStateInterface).isLogin

export default authSlicer.reducer

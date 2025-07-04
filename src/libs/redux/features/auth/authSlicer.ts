import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";




export interface AuthState {
    isLogin: boolean;
    profile: {
        name: string;
        email: string;
    };
}

export const initialAuth: AuthState = {
    isLogin:false,
    profile:{
        name:'',
        email:''
    }
}

export const authSlicer = createSlice({
    name: 'auth',
    initialState: initialAuth,
    reducers:{
         getLogin: ( state, action ) =>{
            state.isLogin = action.payload
         },

    }
});

export const {getLogin} = authSlicer.actions;

export const selectProfile = ( state:RootState ) => (state.auth as AuthState).profile
export const selectAuth = ( state:RootState ) =>  (state.auth as AuthState).isLogin

export default authSlicer.reducer

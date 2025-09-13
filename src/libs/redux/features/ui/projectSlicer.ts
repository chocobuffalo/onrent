'use client';

import { createSlice } from "@reduxjs/toolkit";

const projectsSlicer = createSlice({
    name: 'projects',
    
    initialState: {
        projects: [],
    },
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
        }
    }
});

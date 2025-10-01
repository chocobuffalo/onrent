"use client";
import { filterInitialState } from "@/constants/states";
import { createSlice } from "@reduxjs/toolkit";

export const filterSlicer = createSlice({
  name: "filters",

  initialState: filterInitialState,
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setNeedProject: (state, action) => {
      state.needProject = action.payload;
    },
    setMinPrice: (state, action) => {
      state.rangePrice.min = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.rangePrice.max = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setFilters: (state, action) => {
      state = { ...state, ...action.payload };
    },
    setUserID: (state, action) => {
      state.userID = action.payload;
    },
    setPage: (state, action) => {
    state.page = action.payload;
    },
    setPageSize: (state, action) => {
        state.pageSize = action.payload;
    },
    setNationalOnly: (state, action) => {
        state.nationalOnly = action.payload;
    },
  },
});

export const {
  setStartDate,
  setEndDate,
  setMinPrice,
  setMaxPrice,
  setLocation,
  setType,
  setFilters,
  setUserID,
  setNeedProject,
  setPage,
  setPageSize,
  setNationalOnly
} = filterSlicer.actions;
export default filterSlicer.reducer;

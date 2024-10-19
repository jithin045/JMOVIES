import { createSlice } from "@reduxjs/toolkit";

const loadersSlice = createSlice({
    name: 'loaders',
    initialState: {
        loading: false,
    },
    reducers: {
        Showloading: (state) => {
            state.loading = true;
        },
        Hideloading: (state) => {
            state.loading = false;
        }
    }
})

export const { Showloading, Hideloading } = loadersSlice.actions;
export default loadersSlice.reducer;
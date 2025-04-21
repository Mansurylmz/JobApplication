import { configureStore } from "@reduxjs/toolkit";
import jobSlice from "./slices/jobSlice"

const store=configureStore({
    reducer:{
        jobSlice,
    }
})
export default store
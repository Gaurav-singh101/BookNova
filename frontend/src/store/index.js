import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth" ;

const store = configureStore({
    reducer: {
        auth: authReducer ,
    } ,    // Help to identify initial state and final state (User loggedin or not)
});

export default store ;
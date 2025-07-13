import { combineReducers, configureStore } from "@reduxjs/toolkit";
import walletSliceReducer from "./slice/wallet.slice";

const rootReducer = combineReducers({
  wallet: walletSliceReducer,
});

export default configureStore({
  reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

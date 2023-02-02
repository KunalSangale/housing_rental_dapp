import { configureStore } from '@reduxjs/toolkit'
import ethReducer from './slice/ethSlice'
export default configureStore({
  reducer: {eth:ethReducer},
})
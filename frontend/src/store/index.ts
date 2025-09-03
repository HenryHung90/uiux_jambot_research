import {configureStore} from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'

import alertLoadingReducer from './slices/alertLoadingSlice'
import userInfoReducer from "./slices/userInfoSlice";
import studentClassReducer from "./slices/studentClassSlice";


// 配置 store
const store = configureStore({
  reducer: {
    alertLoading: alertLoadingReducer,
    userInfo: userInfoReducer,
    studentClass: studentClassReducer,
  },
})

// 導出 RootState 和 AppDispatch 類型
export type RootState = ReturnType<typeof store.getState> // 用來描述整個狀態的型別
export type AppDispatch = typeof store.dispatch // 用來描述 dispatch 的型別


export const useAppDispatch = () => useDispatch<AppDispatch>() // 型別安全的 dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector // 型別安全的狀態選取

export default store

/*********************************************************
 * 用法範例：
 *
 * import {useAppDispatch, useAppSelector} from './store'
 * import {setSelectedImage} from './slices/imageSlice' 來自於 imageSlice 的 action creator
 *
 * const dispatch = useAppDispatch()
 * const state = useAppSelector(state => state.image.selectedImage)
 *
 * dispatch(setSelectedImage([ImageSource]))
 *
 * 所以簡單來說 useAppDispatch 可以控管整個專案的 dispatch
 * 在每一個 tsx 中都可以透過 宣告 dispatch = useAppDispatch 進而存取整個 Redux 的東西
 * 接著就可以用 useAppSelector 取得需要的 Redux 內容
 * 並且使用 dispatch呼叫來自 reducer 中建立的 reducers 是否正確
 * ********************************************************/

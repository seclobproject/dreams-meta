import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import authReducer from './authSlice';

import {
    addNewUserReducer,
    addNewUserByReferralReducer,
    editUserReducer,
    getAllUsersReducer,
    getUserDetailsReducer,
    getUsersByLevelReducer,
    sendJoiningRequestReducer,
    requestWithdrawalReducer,
    upgradeUserReducer,
} from './userSlice';

import {
    getAllUsersToAdminReducer,
    getUserDetailsToAdminReducer,
    getAllUsersInAutoPoolReducer,
    splitAutoPoolAmountReducer,
    getAutoPoolIncomeReducer,
    getRejoiningWalletAmountReducer,
    verifyUserReducer,
    getWithdrawRequestsReducer,
    manageWithdrawRequestsReducer,
    verifyUserForAdminReducer,
} from './adminSlice';

import { TypedUseSelectorHook, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    authReducer,
    addNewUserReducer,
    addNewUserByReferralReducer,
    editUserReducer,
    getAllUsersReducer,
    getUserDetailsReducer,
    getUsersByLevelReducer,
    getAllUsersToAdminReducer,
    getUserDetailsToAdminReducer,
    getAllUsersInAutoPoolReducer,
    splitAutoPoolAmountReducer,
    getAutoPoolIncomeReducer,
    getRejoiningWalletAmountReducer,
    sendJoiningRequestReducer,
    verifyUserReducer,
    requestWithdrawalReducer,
    getWithdrawRequestsReducer,
    manageWithdrawRequestsReducer,
    upgradeUserReducer,
    verifyUserForAdminReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;

export type IRootState = ReturnType<typeof rootReducer>;

export default store;

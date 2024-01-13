import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../Constants';

// Typescript codes to define type
// interface UserInfo {
//     email: string;
//     password: string;
// }

// interface AppState {
//     userInfo: UserInfo | null;
//     pending: boolean;
//     error: boolean;
// }
// Typescript codes to define type

// Redux action to add new user
export const addNewUser = createAsyncThunk('addNewUser', async (user: any) => {
    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.post(
        `${URL}/api/users`,
        {
            name: user.userName,
            email: user.email,
            password: user.password,
        },
        config
    );

    return response.data;
});

export const clearData = createAsyncThunk('logout', async () => {
    localStorage.removeItem('userInfo');
});

export const getAddNewUser = createSlice({
    name: 'getAddNewUser',
    initialState: {
        loading: false,
        data: null,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addNewUser.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(addNewUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(addNewUser.rejected, (state, action) => {
                state.loading = false;
                console.error('Error', action.payload);

                if (action.error.message === 'Request failed with status code 500') {
                    state.error = 'Please make sure you filled all the above details!';
                } else if (action.error.message === 'Request failed with status code 400') {
                    state.error = 'Email or Phone already used!';
                }
            });
    },
});

// Redux action to add new user with referral
export const addNewUserWithRefferal = createAsyncThunk('addNewUserWithRefferal', async (user: any) => {
    const config = {
        headers: {
            'content-type': 'application/json',
        },
    };

    const response = await axios.post(
        `${URL}/api/users/add-user-by-refferal`,
        {
            name: user.userName,
            email: user.email,
            password: user.password,
            sponser: user.userId,
        },
        config
    );

    return response.data;
});

export const addNewUserWithRefferalSlice = createSlice({
    name: 'addNewUserWithRefferalSlice',
    initialState: {
        loading: false,
        data: null,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addNewUserWithRefferal.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(addNewUserWithRefferal.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(addNewUserWithRefferal.rejected, (state, action) => {
                state.loading = false;
                console.error('Error', action.payload);

                if (action.error.message === 'Request failed with status code 500') {
                    state.error = 'Please make sure you filled all the above details!';
                } else if (action.error.message === 'Request failed with status code 400') {
                    state.error = 'Email or Phone already used!';
                }
            });
    },
});

export const addNewUserReducer = getAddNewUser.reducer;
export const addNewUserByReferralReducer = addNewUserWithRefferalSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../Constants';

// Redux action to edit user profile
export const getAllUsersToAdmin = createAsyncThunk('getAllUsers', async () => {
    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.get(`${URL}/api/admin/get-users`, config);

    return response.data;
});

export const getAllUsersSlice = createSlice({
    name: 'getAllUsersSlice',
    initialState: {
        loading: false,
        data: null,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsersToAdmin.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(getAllUsersToAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getAllUsersToAdmin.rejected, (state, action) => {
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


// Typescript codes to define type
interface UserInfo {
    name: string;
    email: string;
}

interface AppState {
    data: UserInfo | null;
    loading: boolean;
    error: string;
}

const initialStateOfUserDetails: AppState = {
    data: null,
    loading: false,
    error: ''
}
// Typescript codes to define type


// GET Single user details to admin by ID
export const getUserDetailsToAdmin = createAsyncThunk('getUserDetailsToAdmin', async (id: any) => {

    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.post(`${URL}/api/admin/get-user-to-admin`, { id }, config);

    return response.data;
});

export const getUserDetailsToAdminSlice = createSlice({
    name: 'getUserDetailsToAdminSlice',
    initialState: initialStateOfUserDetails,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetailsToAdmin.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(getUserDetailsToAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getUserDetailsToAdmin.rejected, (state, action) => {
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

export const getUserDetailsToAdminReducer = getUserDetailsToAdminSlice.reducer;
export const getAllUsersToAdminReducer = getAllUsersSlice.reducer;

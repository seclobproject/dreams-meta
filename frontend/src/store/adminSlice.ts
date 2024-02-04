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
    error: '',
};
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

// Get all users in autopool

// Typescript codes to define type
interface UserInfo {
    name: string;
    email: string;
    currentPlan: string;
}

interface AppState {
    data: UserInfo | null;
    loading: boolean;
    error: string;
}

const initialStateOfAutopoolUsers: AppState = {
    data: null,
    loading: false,
    error: '',
};
// Typescript codes to define type

export const getAllUsersInAutoPool = createAsyncThunk('getAllUsersInAutoPool', async () => {
    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.get(`${URL}/api/admin/get-autopool-users`, config);

    return response.data;
});

const getAllUsersInAutoPoolSlice = createSlice({
    name: 'getAllUsersInAutoPoolSlice',
    initialState: initialStateOfAutopoolUsers,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsersInAutoPool.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(getAllUsersInAutoPool.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getAllUsersInAutoPool.rejected, (state, action) => {
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

// Split autopool amount to everyone
export const splitAutopoolAmount = createAsyncThunk('splitAutopoolAmount', async () => {
    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.get(`${URL}/api/admin/split-autopool-income`, config);

    return response.data;
});

const splitAutoPoolAmountSlice = createSlice({
    name: 'splitAutoPoolAmountSlice',
    initialState: {
        loading: false,
        data: '',
        error: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(splitAutopoolAmount.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(splitAutopoolAmount.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(splitAutopoolAmount.rejected, (state, action) => {
                state.loading = false;
                console.error('Error', action.payload);
                state.error = true;
            });
    },
});

// Get the autopool amount
export const getAutoPoolAmount = createAsyncThunk('getAutoPoolAmount', async () => {
    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.get(`${URL}/api/admin/get-autopool-income`, config);

    return response.data;
});

const getAutoPoolIncomeSlice = createSlice({
    name: 'getAutoPoolIncomeSlice',
    initialState: {
        loading: false,
        data: '',
        error: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAutoPoolAmount.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(getAutoPoolAmount.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getAutoPoolAmount.rejected, (state, action) => {
                state.loading = false;
                console.error('Error', action.payload);
                state.error = true;
            });
    },
});

// Typescript codes to define type
interface UserInfo {
    rejoiningWallet: string;
}

interface AppState {
    data: UserInfo | null;
    loading: boolean;
    error: string;
}

const initialStateOfRejoiningWallet: AppState = {
    data: null,
    loading: false,
    error: '',
};
// Typescript codes to define type

// Get rejoining wallet amount present
export const getRejoiningWalletAmount = createAsyncThunk('getRejoiningWalletAmount', async () => {
    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.get(`${URL}/api/admin/get-rejoining-wallet`, config);

    return response.data;
});

const getRejoiningWalletAmountSlice = createSlice({
    name: 'getRejoiningWalletAmountSlice',
    initialState: initialStateOfRejoiningWallet,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRejoiningWalletAmount.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(getRejoiningWalletAmount.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getRejoiningWalletAmount.rejected, (state, action) => {
                state.loading = false;
                console.error('Error', action.payload);
                state.error = 'Something went wrong, please try again later';
            });
    },
});

// Verify user by admin
export const verifyUser = createAsyncThunk('verifyUser', async () => {
    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.get(`${URL}/api/admin/verify-user-payment`, config);

    return response.data;
});

const verifyUserSlice = createSlice({
    name: 'verifyUserSlice',
    initialState: {
        loading: false,
        data: '',
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(verifyUser.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(verifyUser.rejected, (state, action) => {
                state.loading = false;
                console.error('Error', action.payload);
                state.error = 'Something went wrong, please try again later';
            });
    },
});

// Get withdraw requests
export const getWithdrawRequests = createAsyncThunk('getWithdrawRequests', async () => {
    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.get(`${URL}/api/admin/get-withdrawal-requests`, config);

    return response.data;
});

const getWithdrawRequestsSlice = createSlice({
    name: 'getWithdrawRequestsSlice',
    initialState: {
        loading: false,
        data: '',
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getWithdrawRequests.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(getWithdrawRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getWithdrawRequests.rejected, (state, action) => {
                state.loading = false;
                console.error('Error', action.payload);
                state.error = 'Something went wrong, please try again later';
            });
    },
});

// Manage withdrawal request
export const manageWithdrawRequests = createAsyncThunk('manageWithdrawRequests', async (data: any) => {
    const { requestId, action, hash } = data;

    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.post(`${URL}/api/admin/manage-withdrawal-request`, { requestId, action, hash }, config);

    console.log(response.data);
    
    return response.data;
});

const manageWithdrawRequestsSlice = createSlice({
    name: 'manageWithdrawRequestsSlice',
    initialState: {
        loading: false,
        data: '',
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(manageWithdrawRequests.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(manageWithdrawRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(manageWithdrawRequests.rejected, (state, action) => {
                state.loading = false;
                console.error('Error', action.payload);
                state.error = 'Something went wrong, please try again later';
            });
    },
});

export const manageWithdrawRequestsReducer = manageWithdrawRequestsSlice.reducer;
export const getWithdrawRequestsReducer = getWithdrawRequestsSlice.reducer;
export const verifyUserReducer = verifyUserSlice.reducer;
export const getRejoiningWalletAmountReducer = getRejoiningWalletAmountSlice.reducer;
export const getAutoPoolIncomeReducer = getAutoPoolIncomeSlice.reducer;
export const splitAutoPoolAmountReducer = splitAutoPoolAmountSlice.reducer;
export const getAllUsersInAutoPoolReducer = getAllUsersInAutoPoolSlice.reducer;
export const getUserDetailsToAdminReducer = getUserDetailsToAdminSlice.reducer;
export const getAllUsersToAdminReducer = getAllUsersSlice.reducer;

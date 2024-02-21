import { Link } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, useAppDispatch, useAppSelector } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import { getUserDetails, requestWithdrawal } from '../store/userSlice';
import Swal from 'sweetalert2';

const Withdrawal = () => {
    const dispatch = useAppDispatch();

    const [amount, setAmount] = useState();
    const [walletAddress, setWalletAddress] = useState('');
    const [message, setMessage] = useState(false);

    const { data: userInfo } = useAppSelector((state: any) => state.getUserDetailsReducer);
    const { data: withdrawInfo } = useAppSelector((state: any) => state.requestWithdrawalReducer);

    useEffect(() => {
        dispatch(setPageTitle('Withdrawal'));
        dispatch(getUserDetails());

        if (withdrawInfo) {
            setMessage(true);
        }
    }, [dispatch, withdrawInfo]);

    setTimeout(() => {
        setMessage(false);
    }, 3000);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const submitHandler = async (type: number) => {
        if (type === 9) {
            Swal.fire({
                title: 'Are you sure?',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: 'Proceed',
                cancelButtonText: 'Cancel',
                padding: '1em',
                customClass: 'sweet-alerts',
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(requestWithdrawal({ amount, walletAddress }));
                }
            });
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center">
                <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl flex items-center mb-5">
                    <h2 className="text-lg font-semibold">Current wallet balance: {userInfo && userInfo.earning}</h2>
                </div>
                <form className="w-72 flex flex-col gap-3">
                    <input type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="Enter the amount to withdraw" className="form-input" required />
                    <input type="text" value={walletAddress} onChange={(e: any) => setWalletAddress(e.target.value)} placeholder="Wallet Address" className="form-input" required />
                    {userInfo && userInfo.showWithdraw && (
                        <button type="button" onClick={() => submitHandler(9)} className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white p-2 rounded-lg mt-6">
                            Submit
                        </button>
                    )}
                    {message && <div className="text-center">Submitted successfully!</div>}
                </form>
            </div>
        </div>
    );
};

export default Withdrawal;

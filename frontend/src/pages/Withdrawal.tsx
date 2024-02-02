import { Link } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, useAppDispatch, useAppSelector } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import IconHorizontalDots from '../components/Icon/IconHorizontalDots';
import IconEye from '../components/Icon/IconEye';
import IconBitcoin from '../components/Icon/IconBitcoin';
import IconEthereum from '../components/Icon/IconEthereum';
import IconLitecoin from '../components/Icon/IconLitecoin';
import IconBinance from '../components/Icon/IconBinance';
import IconTether from '../components/Icon/IconTether';
import IconSolana from '../components/Icon/IconSolana';
import IconCircleCheck from '../components/Icon/IconCircleCheck';
import IconInfoCircle from '../components/Icon/IconInfoCircle';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IconPencilPaper from '../components/Icon/IconPencilPaper';
import IconCoffee from '../components/Icon/IconCoffee';
import IconCalendar from '../components/Icon/IconCalendar';
import IconMapPin from '../components/Icon/IconMapPin';
import IconMail from '../components/Icon/IconMail';
import IconPhone from '../components/Icon/IconPhone';
import IconTwitter from '../components/Icon/IconTwitter';
import IconDribbble from '../components/Icon/IconDribbble';
import IconGithub from '../components/Icon/IconGithub';
import { getUserDetails } from '../store/userSlice';

import { useContractWrite } from 'wagmi';
import { abi } from '../abi';
import WalletConnectButton from '../components/Button';
import { useAccount } from 'wagmi';

const Withdrawal = () => {
    const dispatch = useAppDispatch();

    const { data: userInfo } = useAppSelector((state: any) => state.getUserDetailsReducer);

    const { address } = useAccount();

    const { write } = useContractWrite({
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        abi,
        functionName: 'transferFrom',
        args: ['0xd2135CfB216b74109775236E36d4b433F1DF507B', '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', 123n],
    });

    useEffect(() => {
        dispatch(setPageTitle('Finance'));
        dispatch(getUserDetails());
    }, [dispatch]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <div>
            <div className="flex flex-col items-center">
                <div className='bg-white p-4 rounded-xl flex items-center mb-5'>
                    <h2 className="text-xl text-red-600">Current wallet balance: {userInfo && userInfo.earning}</h2>
                </div>
                <form className="w-72 flex flex-col gap-3">
                    <input type="number" placeholder="Enter the amount to withdraw" className="form-input" required />
                    <input type="text" placeholder="Wallet Address" className="form-input" required />
                    <button type="submit" className="btn btn-primary mt-6">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Withdrawal;

import { Link } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, useAppSelector } from '../store';
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

const Finance = () => {
    const dispatch = useDispatch();

    const { userInfo } = useAppSelector((state: any) => state.authReducer);

    const [url, setUrl] = useState(`https://dreamzmeta.com/signup/${userInfo._id}`);

    useEffect(() => {
        dispatch(setPageTitle('Finance'));
    });
    //bitcoinoption
    const bitcoin: any = {
        series: [
            {
                data: [21, 9, 36, 12, 44, 25, 59, 41, 25, 66],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#00ab55'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    //ethereumoption
    const ethereum: any = {
        series: [
            {
                data: [44, 25, 59, 41, 66, 25, 21, 9, 36, 12],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    //litecoinoption
    const litecoin: any = {
        series: [
            {
                data: [9, 21, 36, 12, 66, 25, 44, 25, 41, 59],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#00ab55'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    //binanceoption
    const binance: any = {
        series: [
            {
                data: [25, 44, 25, 59, 41, 21, 36, 12, 19, 9],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    //tetheroption
    const tether: any = {
        series: [
            {
                data: [21, 59, 41, 44, 25, 66, 9, 36, 25, 12],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#00ab55'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    //solanaoption
    const solana: any = {
        series: [
            {
                data: [21, -9, 36, -12, 44, 25, 59, -41, 66, -25],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <div>
            {/* <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Finance</span>
                </li>
            </ul> */}
            <div className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-white">
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                            <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                                <IconPencilPaper />
                            </Link>
                        </div>
                        <div className="">
                            <div className="flex flex-col justify-center items-center">
                                <img src="/assets/images/user-silhouette.png" alt="img" className="w-24 h-24 rounded-full object-cover  mb-5" />
                                <p className="font-semibold text-primary text-xl">{userInfo.name}</p>
                            </div>
                            <ul className="mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark">
                                <li className="flex items-center gap-2">Sponsor ID: ${userInfo.ownSponserId}</li>
                                <li className="flex items-center gap-2">Account Status: {userInfo.userStatus == 'true' ? `Activated` : `Pending`}</li>
                                <li className="flex items-center gap-2">Auto Pool: {userInfo.autoPool}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Wallet Amount</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ${userInfo.earning} </div>
                                {/* <div className="badge bg-white/30">+ 2.35% </div> */}
                            </div>
                            {/* <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week 44,700
                        </div> */}
                        </div>

                        {/* Sessions */}
                        <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Direct Refferals</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {userInfo.children.length} </div>
                                {/* <div className="badge bg-white/30">- 2.35% </div> */}
                            </div>
                            {/* <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week 84,709
                        </div> */}
                        </div>
                        {/*  Time On-Site */}
                        <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Rejoining Wallet Amount</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ${userInfo.joiningAmount} </div>
                                {/* <div className="badge bg-white/30">+ 1.35% </div> */}
                            </div>
                            {/* <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week 37,894
                        </div> */}
                        </div>
                        {/* Bounce Rate */}
                        <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Refferal Link</div>
                            </div>
                            <div className="flex items-center my-5">
                                <input type="text" value={url} className="form-input" onChange={(e) => setUrl(e.target.value)} />
                                <div className="referralBtn sm:flex sm:space-y-0 sm:space-x-2 rtl:space-x-reverse">
                                    <CopyToClipboard
                                        text={url}
                                        onCopy={(text, result) => {
                                            if (result) {
                                                alert('Refferal link copied successfully!');
                                            }
                                        }}
                                    >
                                        <button type="button" className="btn btn-primary ms-2">
                                            Copy
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="">
                    {/*  Prices  */}
                    <div>
                        {/* <div className="flex items-center mb-5 font-bold">
                            <span className="text-lg">Live Prices</span>
                            <button type="button" className="ltr:ml-auto rtl:mr-auto text-primary hover:text-black dark:hover:text-white-dark">
                                See All
                            </button>
                        </div> */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
                            {/*  Binance */}
                            <div className="panel">
                                <div className="flex items-center font-semibold mb-5">
                                    <div className="shrink-0 w-10 h-10 rounded-full grid place-content-center">
                                        <IconBinance />
                                    </div>
                                    <div className="ltr:ml-2 rtl:mr-2">
                                        <h6 className="text-dark dark:text-white-light">BNB</h6>
                                        <p className="text-white-dark text-xs">Binance</p>
                                    </div>
                                </div>
                                <div className="mb-5 overflow-hidden">
                                    <ReactApexChart series={binance.series} options={binance.options} type="line" height={45} />
                                </div>
                                <div className="flex justify-between items-center font-bold text-base">
                                    $21,000 <span className="text-danger font-normal text-sm">-1.25%</span>
                                </div>
                            </div>
                            {/*  Tether  */}
                            <div className="panel">
                                <div className="flex items-center font-semibold mb-5">
                                    <div className="shrink-0 w-10 h-10 rounded-full grid place-content-center">
                                        <IconTether />
                                    </div>
                                    <div className="ltr:ml-2 rtl:mr-2">
                                        <h6 className="text-dark dark:text-white-light">USDT</h6>
                                        <p className="text-white-dark text-xs">Tether</p>
                                    </div>
                                </div>
                                <div className="mb-5 overflow-hidden">
                                    <ReactApexChart series={tether.series} options={tether.options} type="line" height={45} />
                                </div>
                                <div className="flex justify-between items-center font-bold text-base">
                                    $20,000 <span className="text-success font-normal text-sm">+0.25%</span>
                                </div>
                            </div>
                            {/*  Solana */}
                            <div className="panel">
                                <div className="flex items-center font-semibold mb-5">
                                    <div className="shrink-0 w-10 h-10 bg-warning rounded-full p-2 grid place-content-center">
                                        <IconSolana />
                                    </div>
                                    <div className="ltr:ml-2 rtl:mr-2">
                                        <h6 className="text-dark dark:text-white-light">SOL</h6>
                                        <p className="text-white-dark text-xs">Solana</p>
                                    </div>
                                </div>
                                <div className="mb-5 overflow-hidden">
                                    <ReactApexChart series={solana.series} options={solana.options} type="line" height={45} />
                                </div>
                                <div className="flex justify-between items-center font-bold text-base">
                                    $21,000 <span className="text-danger font-normal text-sm">-1.25%</span>
                                </div>
                            </div>

                            {/*  Bitcoin  */}
                            <div className="panel">
                                <div className="flex items-center font-semibold mb-5">
                                    <div className="shrink-0 w-10 h-10 rounded-full grid place-content-center">
                                        <IconBitcoin />
                                    </div>
                                    <div className="ltr:ml-2 rtl:mr-2">
                                        <h6 className="text-dark dark:text-white-light">BTC</h6>
                                        <p className="text-white-dark text-xs">Bitcoin</p>
                                    </div>
                                </div>
                                <div className="mb-5 overflow-hidden">
                                    <ReactApexChart series={bitcoin.series} options={bitcoin.options} type="line" height={45} />
                                </div>
                                <div className="flex justify-between items-center font-bold text-base">
                                    $20,000 <span className="text-success font-normal text-sm">+0.25%</span>
                                </div>
                            </div>
                            {/*  Ethereum*/}
                            <div className="panel">
                                <div className="flex items-center font-semibold mb-5">
                                    <div className="shrink-0 w-10 h-10 bg-warning rounded-full grid place-content-center p-2">
                                        <IconEthereum />
                                    </div>
                                    <div className="ltr:ml-2 rtl:mr-2">
                                        <h6 className="text-dark dark:text-white-light">ETH</h6>
                                        <p className="text-white-dark text-xs">Ethereum</p>
                                    </div>
                                </div>
                                <div className="mb-5 overflow-hidden">
                                    <ReactApexChart series={ethereum.series} options={ethereum.options} type="line" height={45} />
                                </div>
                                <div className="flex justify-between items-center font-bold text-base">
                                    $21,000 <span className="text-danger font-normal text-sm">-1.25%</span>
                                </div>
                            </div>
                            {/*  Litecoin*/}
                            <div className="panel">
                                <div className="flex items-center font-semibold mb-5">
                                    <div className="shrink-0 w-10 h-10 rounded-full grid place-content-center">
                                        <IconLitecoin />
                                    </div>
                                    <div className="ltr:ml-2 rtl:mr-2">
                                        <h6 className="text-dark dark:text-white-light">LTC</h6>
                                        <p className="text-white-dark text-xs">Litecoin</p>
                                    </div>
                                </div>
                                <div className="mb-5 overflow-hidden">
                                    <ReactApexChart series={litecoin.series} options={litecoin.options} type="line" height={45} />
                                </div>
                                <div className="flex justify-between items-center font-bold text-base">
                                    $11,657 <span className="text-success font-normal text-sm">+0.25%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finance;

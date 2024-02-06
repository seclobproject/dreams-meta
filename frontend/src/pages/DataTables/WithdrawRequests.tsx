import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconBell from '../../components/Icon/IconBell';
import { getAllUsersToAdmin, getWithdrawRequests, manageWithdrawRequests, verifyUser } from '../../store/adminSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAccount, useBalance, useContractWrite } from 'wagmi';
import { UsdtAddr } from '../../Constants';
import { abi } from '../../abi';

const WithdrawRequests = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [userStatus, setUserStatus] = useState('Pending');
    const [amount, setAmount] = useState(0);
    const [walletAddress, setWalletAddress] = useState('');
    const [requestId, setRequestId] = useState('');


    // const { loading, data: rowData, error } = useAppSelector((state: any) => state.getAllUsersToAdminReducer);
    const { loading, data: rowData, error } = useAppSelector((state: any) => state.getWithdrawRequestsReducer);
    const { loading: manageWithdrawLoading, data: manageWithdrawData, error: manageWithdrawError } = useAppSelector((state: any) => state.manageWithdrawRequestsReducer);

    let transformedData: any;
    if (rowData) {
        transformedData = rowData.map((record: any) => ({
            ...record,
            payStatus: record.status ? 'Paid' : 'Not Paid',
        }));
    }

    useEffect(() => {
        dispatch(getWithdrawRequests());
    }, [dispatch, manageWithdrawData]);

    useEffect(() => {
        dispatch(setPageTitle('All Members'));
    });
    const PAGE_SIZES = [10, 20, 30, 50, 100];

    //Skin: Striped
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(transformedData || []);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return (transformedData || []).filter((item: any) => {
                return (
                    item.user.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.walletAddress.toLowerCase().includes(search.toLowerCase()) ||
                    item.payStatus.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, rowData]);


    // Wallet configurations
    const { address } = useAccount();
    const result = useBalance({
        address,
        token: UsdtAddr,
    });
    
    const { data, isLoading, isSuccess, write, isError } = useContractWrite({
        address: UsdtAddr,
        abi,
        functionName: 'transferFrom',
        args: [address, walletAddress, amount*1000000],
    });

    console.log(data); // This will show the data of hash of the transaction

    const { data: approvalData, write: approvalWrite } = useContractWrite({
        address: UsdtAddr,
        abi,
        functionName: 'approve',
        args: [address, amount*1000000],
        onError: (e: any) => {
            console.log(e);
        },
        onSuccess: (tx: any) => {
            setTimeout(() => {
                write();
            }, 5000);

            // lodash: delay instead of timeout
        },
    });

    // Wallet configurations


    const payHandler = async (requestId: string, amount: number, walletAddress: string) => {

        setAmount(amount);
        setWalletAddress(walletAddress);
        setRequestId(requestId);
        
        await approvalWrite();
    };

    useEffect(() => {
        if (data) {
            const action = true;
            const hash = data.hash;
            dispatch(manageWithdrawRequests({requestId, action, hash}));
        }
    }, [data]);
    

    return (
        <div className="space-y-6">
            {/* Skin: Striped  */}
            <div className="panel">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Payment Request</h5>
                    {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                </div>
                <div className="datatables">
                    <DataTable
                        striped
                        className="whitespace-nowrap table-striped"
                        records={recordsData}
                        columns={[
                            { accessor: 'user.name', title: 'Name' },
                            { accessor: 'amount', title: 'Request Amount' },
                            { accessor: 'walletAddress', title: 'Wallet Address' },
                            { accessor: 'payStatus', title: 'Status' },
                            {
                                accessor: 'Actions',
                                title: 'Actions',
                                render: (requests: any) => (
                                    <div className="flex space-x-2">
                                        {requests.payStatus === 'Not Paid' && (
                                            <button type="button" onClick={() => payHandler(requests._id, requests.amount, requests.walletAddress)} className="btn btn-success">
                                                {isLoading ? 'Please Wait' ? isSuccess : 'Success' : 'Pay'}
                                            </button>
                                        )}
                                    </div>
                                ),
                            },
                        ]}
                        totalRecords={initialRecords ? initialRecords.length : 0}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default WithdrawRequests;

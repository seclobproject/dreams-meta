import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconHome from '../../components/Icon/IconHome';
import { useAppDispatch, useAppSelector } from '../../store';
import { editUserProfile } from '../../store/userSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useParams } from 'react-router-dom';
import { getUserDetailsToAdmin } from '../../store/adminSlice';

const EditUserByAdmin = () => {

    const dispatch = useAppDispatch();
    const { id } = useParams();
    const MySwal = withReactContent(Swal);

    
    const { data: userInfo } = useAppSelector((state) => state.getUserDetailsToAdminReducer);
    
    const [userName, setUserName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [password, setPassword] = useState('');
    
    useEffect(() => {
        dispatch(setPageTitle('Account Setting'));
    }, []);

    const [tabs, setTabs] = useState<string>('home');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const showMessage2 = () => {
        MySwal.fire({
            title: `Updated successfully.<br /> Please logout and login again to reflect the changes.`,
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 5000,
            showCloseButton: true,
        });
    };

    useEffect(() => {
        dispatch(getUserDetailsToAdmin(id));
    }, [dispatch]);

    const profileEditHandler = (e: any) => {
        e.preventDefault();
        dispatch(editUserProfile({ userName, email, password }));
        showMessage2();
    };

    return (
        <div>
            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Settings</h5>
                </div>
                <div>
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('home')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconHome />
                                Profile settings
                            </button>
                        </li>
                    </ul>
                </div>
                {tabs === 'home' ? (
                    <div>
                        <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                            <h6 className="text-lg font-bold mb-5">General Information</h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                    <img src="/assets//images/user-silhouette.png" alt="img" className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name">Full Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={userName}
                                            onChange={(e: any) => setUserName(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email">Email</label>
                                        <input id="email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="password">Password</label>
                                        <input id="password" type="text" placeholder="Enter New Password" value={password} onChange={(e: any) => setPassword(e.target.value)} className="form-input" />
                                    </div>
                                    <div className="mt-6">
                                        <button onClick={profileEditHandler} type="button" className="btn btn-primary">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default EditUserByAdmin;

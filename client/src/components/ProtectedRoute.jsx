import React, { useEffect } from 'react'
import { GetCurrentUser } from '../apicalls/users'
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/usersSlice';
import { Hideloading, Showloading } from '../redux/loadersSlice'


function ProtectedRoute({ children }) {
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate()
    const dispatch = useDispatch();


    const getCurrentUser = async () => {
        try {
            dispatch(Showloading())
            const response = await GetCurrentUser();
            dispatch(Hideloading())
            if (response.success) {
                // setUser(response.data)
                dispatch(SetUser(response.data))
            } else {
                dispatch(SetUser(null))
                message.error(response.message)
            }
        } catch (error) {
            dispatch(Hideloading())
            dispatch(SetUser(null))
            message.error(error.message)
        }
    }

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            getCurrentUser();
        } else {
            navigate('/login')
        }
    }, [])

    return (
        user && (
            <div className='layout p-1'>
                <div className="header bg-primary flex justify-between p-2">
                    <div>
                        <h1 className='text-2xl text-white cursor-pointer'
                            onClick={() => navigate("/")}>
                            JMOVIES
                        </h1>
                    </div>
                    <div className="bg-white p-1 flex gap-1 br-5">
                        <i className="ri-user-3-line"></i>
                        <h1 className='text-xl underline'
                            onClick={() => {
                                if (user.isAdmin) {
                                    navigate("/admin")
                                } else {
                                    navigate("/profile")
                                }
                            }}
                        >{user.name}
                        </h1>

                        <i class="ri-logout-circle-r-line ml-2"
                            onClick={() => {
                                sessionStorage.removeItem("token")
                                navigate('/login')
                            }}
                        ></i>
                    </div>
                </div>
                <div className="content mt-1 p-1">
                    {children}
                </div>
            </div>
        )
    )
}

export default ProtectedRoute
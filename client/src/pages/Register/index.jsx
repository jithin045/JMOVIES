import React, { useEffect } from 'react'
import { Form, message } from 'antd'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import { RegisterUser } from '../../apicalls/users'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Hideloading, Showloading } from '../../redux/loadersSlice'

function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const onFinish = async (values) => {

        try {
            dispatch(Showloading())
            const response = await RegisterUser(values)
            dispatch(Hideloading())
            if (response.success) {
                message.success(response.message)
                window.location.href = "/login"
            }
            else {
                message.error(response.message)
            }
        } catch (error) {
            dispatch(Hideloading())
            console.log(message.error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/")
        }
    }, [])

    return (
        <div className='flex justify-center h-screen items-center bg-img'>
            <div className='card p-3 w-400 br-5'>
                <h1 className='text-xl mb-1'>
                    MOVIETICKETS - REGISTER
                </h1>
                <hr />
                <Form
                    layout='vertical'
                    className='mt-1'
                    onFinish={onFinish}
                >

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please Enter Your Name" }]}
                    >
                        <input type='text'></input>
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please Enter Your Email" }]}
                    >
                        <input type='email'></input>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please Enter Your Password" }]}
                    >
                        <input type='password'></input>
                    </Form.Item>
                    <div className="flex flex-col mt-2 gap-1">
                        <Button
                            fullWidth
                            title='REGISTER' type="submit" />
                        <Link to="/login" className='text-primary'>
                            Already have an account? Login
                        </Link>
                    </div>
                </Form>

            </div>
        </div>
    )
}

export default Register
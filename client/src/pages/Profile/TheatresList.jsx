import React, { useEffect, useState } from 'react'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import TheatreForm from './TheatreForm'
import { useDispatch, useSelector } from 'react-redux';
import { Table, message } from 'antd';
import { Hideloading, Showloading } from '../../redux/loadersSlice';
import { DeleteTheatre, GetAllTheatresByOwner } from '../../apicalls/theatres';
import Shows from './Shows';

function TheatresList() {

    const { user } = useSelector(state => state.users)

    const [showTheatreFormModal, setShowTheatreFormModal] = useState(false)
    const [selectedTheatre, setSelectedTheatre] = useState(null)
    const [formType, setFormType] = useState("add")
    const [theatres, setTheatres] = useState([])


    const [openShowsModal, setOpenShowsModal] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const getData = async () => {
        try {
            dispatch(Showloading())
            const response = await GetAllTheatresByOwner({
                owner: user._id
            })
            if (response.success) {
                setTheatres(response.data)
            } else {
                message.error(response.message)
            }
            dispatch(Hideloading())
        } catch (error) {
            dispatch(Hideloading())
            message.error(error.message)
        }
    }

    const handledelete = async (id) => {
        try {
            dispatch(Showloading())
            const response = await DeleteTheatre({ theatreId: id })
            if (response.success) {
                message.success(response.message)
                getData()
            } else {
                message.error(response.message)
            }
            dispatch(Hideloading())
        } catch (error) {
            dispatch(Hideloading())
            message.error(error.message)
        }
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Address",
            dataIndex: "address"
        },
        {
            title: "Phone",
            dataIndex: "phone"
        },
        {
            title: "Email",
            dataIndex: "email"
        },
        {
            title: "Status",
            dataIndex: "isActive",
            render: (text, record) => {
                if (text) {
                    return "Approved"
                } else {
                    return "Pending/Blocked"
                }
            }
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => {
                return (
                    <div className="flex gap-1 item-center">
                        <i className="ri-delete-bin-fill" onClick={() => { handledelete(record._id) }} style={{color:"#a61c03"}} ></i>
                        <i className="ri-edit-box-fill" onClick={() => {
                            setFormType("edit")
                            setSelectedTheatre(record)
                            setShowTheatreFormModal(true)
                        }}
                        style={{color:"#fcba03"}}
                        ></i>

                        {record.isActive && <span className="underline" onClick={() => {
                            setSelectedTheatre(record)
                            setOpenShowsModal(true)
                        }}>Shows</span>}
                    </div>
                )
            }
        }
    ]


    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <div className="flex justify-end mb-1">
                <Button variant="outlined" title="Add Theatre" onClick={() => {
                    setFormType("add");
                    setShowTheatreFormModal(true)
                }} />
            </div>

            <Table columns={columns} dataSource={theatres} />

            {showTheatreFormModal && <TheatreForm
                showTheatreFormModal={showTheatreFormModal}
                setShowTheatreFormModal={setShowTheatreFormModal}
                formType={formType}
                setFormType={setFormType}
                selectedTheatre={selectedTheatre}
                setSelectedTheatre={setSelectedTheatre}
                getData={getData}
            />}

            {openShowsModal && <Shows
                openShowsModal={openShowsModal}
                setOpenShowsModal={setOpenShowsModal}
                theatre={selectedTheatre}
            />}

        </>
    )
}

export default TheatresList
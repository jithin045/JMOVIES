import { Col, Form, Modal, Row, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import Button from '../../../components/Button'
import { useDispatch } from 'react-redux'
import { GetAllMovies } from '../../../apicalls/movies'
import { GetAllShowsByTheatre, AddShow, DeleteShow } from '../../../apicalls/theatres'
import { Hideloading, Showloading } from '../../../redux/loadersSlice'
import moment from 'moment'

function Shows({ openShowsModal, setOpenShowsModal, theatre }) {
    const [view, setView] = React.useState("table")
    const [shows, setShows] = React.useState([])
    const [movies, setMovies] = React.useState([])
    const dispatch = useDispatch()

    const getData = async () => {
        try {
            dispatch(Showloading())
            const moviesResponse = await GetAllMovies()
            if (moviesResponse.success) {
                setMovies(moviesResponse.data)
            } else {
                message.error(moviesResponse.message)
            }

            const showsResponse = await GetAllShowsByTheatre({
                theatreId: theatre._id,
            });
            if (showsResponse.success) {
                setShows(showsResponse.data);
            } else {
                message.error(showsResponse.message);
            }
            dispatch(Hideloading())
        } catch (error) {
            message.error(error.message)
            dispatch(Hideloading())
        }
    }

    const handleAddShow = async (values) => {
        try {
            dispatch(Showloading());
            const response = await AddShow({
                ...values,
                theatre: theatre._id,
            });
            if (response.success) {
                message.success(response.message);
                getData();
                setView("table");
            } else {
                message.error(response.message);
            }
            dispatch(Hideloading());
        } catch (error) {
            message.error(error.message);
            dispatch(Hideloading());
        }
    }

    const handleDelete = async (id) => {
        try {
            dispatch(Showloading());
            const response = await DeleteShow({ showId: id });

            if (response.success) {
                message.success(response.message);
                getData();
            } else {
                message.error(response.message);
            }
            dispatch(Hideloading());
        } catch (error) {
            message.error(error.message);
            dispatch(Hideloading());
        }
    };

    const columns = [
        {
            title: "Show name",
            dataIndex: "name"
        },
        {
            title: "Date",
            dataIndex: "date",
            render: (text, record) => {
                return moment(text).format("MMM Do YYYY")
            }
        },
        {
            title: "Time",
            dataIndex: "time"
        },
        {
            title: "Movie",
            dataIndex: "movie",
            render: (text, record) => {
                return record.movie.title
            }
        },
        {
            title: "Ticket Price",
            dataIndex: "ticketPrice"
        },
        {
            title: "Total Seats",
            dataIndex: "totalSeats"
        },
        {
            title: "Available Seats",
            dataIndex: "availableSeats",
            render: (text, record) => {
                return record.totalSeats - record.bookedSeats.length
            }
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => {
                return (
                    <div className="flex gap-1 items-center">
                        {record.bookedSeats.length === 0 && (
                            <i
                                className="ri-delete-bin-line"
                                onClick={() => {
                                    handleDelete(record._id);
                                }}
                            ></i>
                        )}
                    </div>
                );
            },
        }
    ]

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <Modal title="" open={openShowsModal} onCancel={() => setOpenShowsModal(false)} width={1400} footer={null} >
                <h1 className="text-priary-text-md uppercase">
                    Theatre:{theatre.name}
                </h1>
                <hr />

                <div className="flex justify-between mt-1 mb-1 items-center">
                    <h1 className="text-md mb-1" >{view === "table" ? "Shows" : "Add Show"}</h1>
                    {view === "table" && <Button variant="outlined" title="Add Show" onClick={() => { setView("form") }} />}
                </div>


                {view === "table" && (<Table columns={columns} dataSource={shows} />)}

                {view === "form" && (
                    <Form layout='vertical' onFinish={handleAddShow} >
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Form.Item label="Show Name" name="name" rules={[{ required: true, message: "Please Enter Show Name" }]} >
                                    <input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Date" name="date" rules={[{ required: true, message: "Please Enter Show Date" }]} >
                                    <input type='date' />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Time" name="time" rules={[{ required: true, message: "Please Enter Show Time" }]} >
                                    <input type='time' />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Movie" name="movie" rules={[{ required: true, message: "Please Select Movie" }]} >
                                    <select>
                                        <option value="">Select Movie</option>
                                        {movies.map((movie) => (
                                            <option value={movie._id}>{movie.title}</option>
                                        ))}
                                    </select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Ticket Price" name="ticketPrice" rules={[{ required: true, message: "Please Enter Ticket Price" }]} >
                                    <input type='number' />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Total Seats" name="totalSeats" rules={[{ required: true, message: "Please Enter Total Seats" }]} >
                                    <input type='number' />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div className="flex justify-end gap-1">
                            <Button variant="outlined" title="Cancel" onClick={() => { setView("table") }} />
                            <Button variant="contained" title="Save" type="submit" />
                        </div>
                    </Form>
                )}
            </Modal>
        </>
    )
}

export default Shows
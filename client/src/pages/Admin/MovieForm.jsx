import React from 'react'
import { Form, Modal, Row, Col, message } from 'antd'
import Button from '../../components/Button'
import { useDispatch } from 'react-redux'
import { Hideloading, Showloading } from '../../redux/loadersSlice'
import { AddMovie, UpdateMovie } from '../../apicalls/movies'
import moment from 'moment'

function MovieForm({
    showMovieFormModal,
    setShowMovieFormModal,
    selectedMovie,
    setSelectedMovie,
    getData,
    formType
}) {

    if (selectedMovie) {
        selectedMovie.releaseDate = moment(selectedMovie.releaseDate).format("YYYY-MM-DD")
    }

    const dispatch = useDispatch()
    const onFinish = async (values) => {

        try {

            dispatch(Showloading())
            let response = null;

            if (formType === "add") {
                response = await AddMovie(values)
            } else {
                response = await UpdateMovie({
                    ...values,
                    movieId: selectedMovie._id
                })
            }

            if (response.success) {
                getData()
                message.success(response.message)
                setShowMovieFormModal(false)
            } else {
                message.error(response.message)
            }
            dispatch(Hideloading())

        } catch (error) {
            dispatch(Hideloading())
            message.error(error.message)
        }
    }

    return (
        <div>
            <Modal title={formType === "add" ? "ADD MOVIE" : "EDIT MOVIE"}
                open={showMovieFormModal}
                onCancel={() => {
                    setShowMovieFormModal(false)
                    setSelectedMovie(null)

                }}
                footer={null}
                width={800}
            >


                <Form
                    layout='vertical'
                    className='bg-secondary'
                    onFinish={onFinish}
                    initialValues={selectedMovie}
                >
                    <Row gutter={16}>

                        <Col span={24}>
                            <Form.Item label="Movie Name" name="title">
                                <input type="text" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Description" name="description">
                                <textarea type="text" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Movie Duration" name="duration">
                                <input type="text" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Language" name="language">
                                <select name="" id="">
                                    <option value="">Select Language</option>
                                    <option value="Malayalam">Malayalam</option>
                                    <option value="Tamil">Tamil</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="English">English</option>
                                </select>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Movie Release Date" name="releaseDate">
                                <input type="date" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Genre" name="genre">
                                <select name="" id="">
                                    <option value="">Select Genre</option>
                                    <option value="Action">Action</option>
                                    <option value="Comedy">Comedy</option>
                                    <option value="Drama">Drama</option>
                                    <option value="Romance">Romance</option>
                                </select>
                            </Form.Item>
                        </Col>

                        <Col span={16}>
                            <Form.Item label="Poster URL" name="poster">
                                <input type="text" />
                            </Form.Item>
                        </Col>

                    </Row>

                    <div className="flex justify-end gap-1">
                        <Button title="Cancel" variant="outlined" type="button" onClick={() => {
                            setShowMovieFormModal(false)
                            setSelectedMovie(null)
                        }} />
                        <Button title="Save" type="submit" />
                    </div>

                </Form>

            </Modal>
        </div>
    )
}

export default MovieForm
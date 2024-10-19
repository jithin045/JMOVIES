import { Form, Modal, message } from 'antd'
import React from 'react'
import Button from '../../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import { Hideloading, Showloading } from '../../redux/loadersSlice'
import { AddTheatre, UpdateTheatre } from '../../apicalls/theatres'

function TheatreForm({
    showTheatreFormModal,
    setShowTheatreFormModal,
    formType,
    setFormType,
    selectedTheatre,
    setSelectedTheatre,
    getData
}) {
    const { user } = useSelector(state => state.users)
    const dispatch = useDispatch()
    const onFinish = async (values) => {
        values.owner = user._id
        try {

            dispatch(Showloading())
            let response = null;

            if (formType === "add") {
                response = await AddTheatre(values)
            } else {
                response = await UpdateTheatre({
                    ...values,
                    theatreId: selectedTheatre._id
                })
            }

            if (response.success) {
                getData()
                message.success(response.message)
                setShowTheatreFormModal(false)
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
        <>
            <Modal title={formType === "add" ? "ADD THEATRE" : "EDIT THEATRE"}
                open={showTheatreFormModal}
                onCancel={() => {
                    setShowTheatreFormModal(false)
                    setSelectedTheatre(null)
                }}
                footer={null}
            >

                <Form layout='vertical' className='bg-secondary' onFinish={onFinish} initialValues={selectedTheatre}>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please Enter Theatre Name" }]}>
                        <input type="text" />
                    </Form.Item>

                    <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please Enter Theatre Address Details" }]}>
                        <textarea type="text" />
                    </Form.Item>

                    <div className="flex gap-1">
                        <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Please Enter Theatre Phone Number" }]}>
                            <input type="number" />
                        </Form.Item>

                        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please Enter Theatre Email" }]}>
                            <input type="text" />
                        </Form.Item>
                    </div>

                    <div className="flex justify-end gap-1">
                        <Button title="Cancel" variant="outlined" type="button" onClick={() => {
                            setShowTheatreFormModal(false)
                            setSelectedTheatre(null)
                        }} />
                        <Button title="Save" type="submit" />
                    </div>

                </Form>

            </Modal>
        </>
    )
}

export default TheatreForm
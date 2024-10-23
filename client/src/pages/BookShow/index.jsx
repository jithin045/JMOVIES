import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Showloading, Hideloading } from '../../redux/loadersSlice';
import { message } from "antd";
import moment from "moment";
import { GetShowById } from "../../apicalls/theatres";
import Button from '../../components/Button';
import { BookShowTickets } from '../../apicalls/bookings';

function BookShow() {
    const { user } = useSelector((state) => state.users);
    const [show, setShow] = React.useState(null);
    const [selectedSeats, setSelectedSeats] = React.useState([]);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const getData = async () => {
        try {
            dispatch(Showloading());
            const response = await GetShowById({
                showId: params.id,
            });
            if (response.success) {
                setShow(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(Hideloading());
        } catch (error) {
            dispatch(Hideloading());
            message.error(error.message);
        }
    };


    const onBook = async () => {
        try {
            dispatch(Showloading());
            const response = await BookShowTickets({
                show: params.id,
                seats: selectedSeats,
                user: user._id,
            });
            if (response.success) {
                message.success(response.message);
                navigate("/profile");
            } else {
                message.error(response.message);
            }
            dispatch(Hideloading());
        } catch (error) {
            message.error(error.message);
            dispatch(Hideloading());
        }
    };


    useEffect(() => {
        getData();
    }, []);


    const getSeats = () => {
        const columns = 10; // Number of seats in each row
        const totalSeats = show.totalSeats; // Total number of seats
        const rows = Math.ceil(totalSeats / columns); // Calculate number of rows

        const handleSeatClick = (seatLabel) => {
            if (selectedSeats.includes(seatLabel)) {
                setSelectedSeats(selectedSeats.filter((item) => item !== seatLabel));
            } else {
                setSelectedSeats([...selectedSeats, seatLabel]);
            }
        };

        return (
            <div className="flex gap-1 flex-col p-2 card bg-secondary br-5">
                {Array.from(Array(rows).keys()).map((rowIndex) => {
                    const rowLabel = String.fromCharCode(65 + rowIndex); // Generate row label (A, B, C...)

                    return (
                        <div key={`row-${rowIndex}`} className="flex gap-1 justify-center">
                            {Array.from(Array(columns).keys()).map((columnIndex) => {
                                const seatNumber = columnIndex + 1; // Seat numbers: 1, 2, 3...
                                const seatLabel = `${rowLabel}${seatNumber}`; // Create seat label like A1, A2...

                                let seatClass = "seat";

                                if (selectedSeats.includes(seatLabel)) {
                                    seatClass = seatClass + " selected-seat";
                                }

                                if (show.bookedSeats.includes(seatLabel)) {
                                    seatClass = seatClass + " booked-seat";
                                }

                                return (
                                    seatNumber <= totalSeats - rowIndex * columns && (
                                        <div
                                            key={`seat-${seatLabel}`}
                                            className={seatClass}
                                            onClick={() => handleSeatClick(seatLabel)}
                                            aria-label={`Seat ${seatLabel}`}
                                        >
                                            <h1 className="text-sm">{seatLabel}</h1>
                                        </div>
                                    )
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };



    return (
        show && (
            <div>
                {/* show infomation */}

                <div className="flex justify-between card p-2 items-center">
                    <div>
                        <h1 className="text-sm">{show.theatre.name}</h1>
                        <h1 className="text-sm">{show.theatre.address}</h1>
                    </div>

                    <div>
                        <h1 className="text-2xl uppercase">
                            {show.movie.title} ({show.movie.language})
                        </h1>
                    </div>

                    <div>
                        <h1 className="text-sm">
                            {moment(show.date).format("MMM Do yyyy")} -{" "}
                            {moment(show.time, "HH:mm").format("hh:mm A")}
                        </h1>
                    </div>
                </div>

                {/* seats */}

                <div className="flex justify-center mt-2">

                    <div>{getSeats()}</div>

                </div>

                {
                    selectedSeats.length > 0 && (
                        <div className="mt-2 flex justify-center gap-2 items-center flex-col">
                            <div className="flex justify-center">
                                <div className="flex uppercase card p-2 gap-3">
                                    <h1 className="text-sm"><b>Selected Seats</b> : {selectedSeats.join(" , ")}</h1>

                                    <h1 className="text-sm">
                                        <b>Total Price</b> : {selectedSeats.length * show.ticketPrice}
                                    </h1>
                                </div>
                            </div>

                            <div className='mt-2 flex justify-center'>

                                <Button onClick={onBook} title="Book Ticket" />

                            </div>


                        </div>
                    )
                }
            </div >
        )
    );
}

export default BookShow
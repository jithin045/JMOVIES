import React, { useEffect } from "react";
import { Col, message, Row, Table } from "antd";
import { useDispatch } from "react-redux";
import { Showloading, Hideloading } from "../../redux/loadersSlice";
import { GetMovieById } from "../../apicalls/movies";
import { GetAllTheatresByMovie } from "../../apicalls/theatres";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

function TheatresForMovie() {
    // get date from query string
    const tempDate = new URLSearchParams(window.location.search).get("date");
    const [date, setDate] = React.useState(
        tempDate || moment().format("YYYY-MM-DD")
    );


    const [movie, setMovie] = React.useState([]);
    const [theatres, setTheatres] = React.useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams()


    const getData = async () => {
        try {
            dispatch(Showloading());
            const response = await GetMovieById(params.id);
            if (response.success) {
                setMovie(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(Hideloading());
        } catch (error) {
            dispatch(Hideloading());
            message.error(error.message);
        }
    };

    const getTheatres = async () => {
        try {
            dispatch(Showloading());
            const response = await GetAllTheatresByMovie({ date, movie: params.id });
            if (response.success) {
                setTheatres(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(Hideloading());
        } catch (error) {
            dispatch(Hideloading());
            message.error(error.message);
        }
    };


    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getTheatres();
    }, [date]);

    return (
        movie &&
        <div className="">
            {/* movie information */}
            <div className="flex justify-between items-center mb-2 p-3">
                <div>
                    <div className="flex justify-between  mb-2">

                        <img className="ml-1 br-5 border-primary" src={movie.poster} alt="Movie Poster" height="200px" />

                        <div className="flex flex-col justify-between  mb-2 ml-2" >
                            <h1 className="text-2xl uppercase text-white">
                                {movie.title} ({movie.language})
                            </h1>
                            <h1 className="text-md text-white">Duration : {movie.duration} mins</h1>
                            <h1 className="text-md text-white">
                                Release Date : {moment(movie.releaseDate).format("MMM Do yyyy")}
                            </h1>
                            <h1 className="text-md text-white">Genre : {movie.genre}</h1>
                        </div>

                    </div>

                </div>

                <div>
                    <h1 className="text-md">Select Date</h1>
                    <input
                        className="text-md bg-secondary br-5"
                        type="date"
                        min={moment().format("YYYY-MM-DD")}
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            navigate(`/movie/${params.id}?date=${e.target.value}`);
                        }}
                    />
                </div>
            </div>


            {/* movie theatres */}
            <div className="mt-1">
                <h1 className="text-xl text-white uppercase ml-3">Theatres</h1>
            </div>

            <div className="mt-1 flex flex-col gap-1 p-3">
                {theatres.map((theatre) => (
                    <div className="card p-2 bg-primary br-5">
                        <h1 className="text-md uppercase text-white">{theatre.name}</h1>
                        <h1 className="text-sm text-white">Address : {theatre.address}</h1>

                        <div className="divider"></div>

                        <div className="flex gap-2">
                            {theatre.shows
                                .sort(
                                    (a, b) => moment(a.time, "HH:mm") - moment(b.time, "HH:mm")
                                )
                                .map((show) => (
                                    <div
                                        className="card p-1 cursor-pointer br-5 bg-white"
                                        onClick={() => {
                                            navigate(`/book-show/${show._id}`);
                                        }}
                                    >
                                        <h1 className="text-sm">
                                            {moment(show.time, "HH:mm").format("hh:mm A")}
                                        </h1>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default TheatresForMovie
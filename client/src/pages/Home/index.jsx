import React, { useEffect } from "react";
import { Col, message, Row, Table } from "antd";
import { useDispatch } from "react-redux";
import { Hideloading, Showloading } from '../../redux/loadersSlice'
import { GetAllMovies } from "../../apicalls/movies";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Home() {
  const [searchText = "", setSearchText] = React.useState("");
  const [movies, setMovies] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(Showloading());
      const response = await GetAllMovies();
      if (response.success) {
        setMovies(response.data);
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


  return (
    <>
      <input
        type="text"
        className="search-input "
        placeholder="Search for Movies"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Row gutter={[20,20]} className="mt-2">
        {movies
          .filter((movie) => movie.title.toLowerCase().includes(searchText.toLowerCase()))
          .map((movie) => (
            <Col span={8}>
              <div
                className="card flex flex-col gap-1 cursor-pointer br-card hover2"
                onClick={() =>
                  navigate(
                    `/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`
                  )
                }
              >
                <img className="br-img" src={movie.poster} alt="" height={250} />

                <div className="flex justify-center p-1">
                  <h1 className="text-md uppercase hover1">{movie.title}</h1>
                </div>
              </div>
            </Col>
          ))}
      </Row>
    </>
  );
}

export default Home;
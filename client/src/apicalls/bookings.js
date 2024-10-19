import { axiosInstance } from ".";


// book shows
export const BookShowTickets = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/bookings/book-show",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// get bookings of a user
export const GetBookingsOfUser = async () => {
  try {
    const response = await axiosInstance.get("/api/bookings/get-bookings");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");



// book shows
router.post("/book-show", authMiddleware, async (req, res) => {
    try {
        // save new booking
        const newBooking = new Booking(req.body);
        await newBooking.save();

        const show = await Show.findById(req.body.show);
        // update seats
        await Show.findByIdAndUpdate(req.body.show, {
            bookedSeats: [...show.bookedSeats, ...req.body.seats],
        });

        res.send({
            success: true,
            message: "Show booked successfully",
            data: newBooking,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


// get all bookings by user
router.get("/get-bookings", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.body.userId })
            .populate("show")
            .populate({
                path: "show",
                populate: {
                    path: "movie",
                    model: "movies",
                },
            })
            .populate("user")
            .populate({
                path: "show",
                populate: {
                    path: "theatre",
                    model: "theatres",
                },
            });

        res.send({
            success: true,
            message: "Bookings fetched successfully",
            data: bookings,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


module.exports = router;
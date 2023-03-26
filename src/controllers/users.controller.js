const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const User = require('./../models/user.model')
const AppError = require('./../utils/appError')

exports.getAllUsers = catchAsync(async (req, res, next) => {
  
  return next(new AppError('It was not possible to obtain users data. Please contact the administrator.', 400))
/*    const features = new APIFeatures(ModeloEscogido.find()
    .filter()
    .sort()
    .limitFields()
    .paginate()
  const products = await features.query*/
  /*const customer = await User.findById(req.user._id)
    .populate({
      path: 'orders_history',
      model: Ride,
      select: "customer rider origin destiny price ride_state note createdAt finishedAt customer_rating"
    })
      return next(new AppError('You cannot create a new ride if you have a delivery in process!', 404))
  res.status(200).json({
    status: 'success',
    data: {
      ride: newRide
    }
  })*/
  res.status(200).json({
    message: "Todos los usuarios"
  })
})


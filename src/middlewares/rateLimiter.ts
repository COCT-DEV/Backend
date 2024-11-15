import rateLimit from 'express-rate-limit'

let limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: "We have received too many requests from this device, please try after one hour"
})

export default limiter
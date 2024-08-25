// middleware/requestLogger.js

// Middleware for logging details of each request
const requestLogger = (req, res, next) => {
    console.log('Method:', req.method); // Log the HTTP method (GET, POST, etc.)
    console.log('Path:  ', req.path); // Log the request path
    console.log('Body:  ', req.body); // Log the request body (useful for POST/PUT requests)
    next(); // Move to the next middleware or route handler
};

// Export the request logger middleware
module.exports = requestLogger;

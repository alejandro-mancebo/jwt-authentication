import allowedOrigins from '../config/allowedOrigins.js';

const credentials = (request, response, next) => {

  // get the original url ex: 'http://localhost:5173' 
  const origin = request.headers.origin;

  if (allowedOrigins.includes(origin)) {
    response.header('Access-Control-Allow-Credentials', true);
  }
  next();
}

export default credentials;
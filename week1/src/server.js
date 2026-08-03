/**
 * HTTP Server Entry Point
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Week 1 Node.js REST API Running`);
  console.log(` Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(` Server URL  : http://localhost:${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/health`);
  console.log(` Items API   : http://localhost:${PORT}/api/items`);
  console.log(`=================================================`);
});

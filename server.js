require('dotenv').config();
const express = require('express');
const app = express();
const requestLoggerMiddleware = require('./middlewares/requestLogger');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const config = require('./config/config');
const db = require('./models');
const routes = require("./routes");
const fs = require('fs').promises;

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLoggerMiddleware);

app.use("/api", routes);

app.use(errorHandlerMiddleware);

db.sequelize.authenticate()
  .then(() => {
    console.log('Kết nối database thành công');
  })
  .catch((err) => {
    console.error('Kết nối database thất bại:', err);
  });


app.listen(PORT, () => {
  console.log(`Server đang lắng nghe tại localhost: ${PORT}`);
});
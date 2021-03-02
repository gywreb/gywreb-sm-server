const express = require("express");
const app = express();
require("dotenv").config();
const ConnectMongo = require("./database/dbConnect");
const { errorHandler } = require("./middleware/errorHandler");
require("colors");
const cors = require("cors");
const auth = require("./routes/auth");
const user = require("./routes/user");
const post = require("./routes/post");

ConnectMongo.getConnection();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/post", post);
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server is running on port: ${port}`.cyan));

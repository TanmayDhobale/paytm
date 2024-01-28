const express = require("express");
const rootRouter = require("./routes/index");
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // use express.json() for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.use("/api/v1", rootRouter);

app.listen(port, () => {
    console.log("Server started on port", port);
});

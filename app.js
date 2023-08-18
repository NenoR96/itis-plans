const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const plans = require("./routes/plans");
const features = require("./routes/features");

const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/plans', plans);
app.use('/features', features);

const server = app.listen(PORT, function () {
   let HOST = server.address().address;
   console.log("service listening at http://%s:%s", HOST, PORT)
})
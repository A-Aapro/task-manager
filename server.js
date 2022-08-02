const express = require("express");
const path = require("path");
const app = express();

const publicDirPath = path.join(__dirname, "../public/");
app.use(express.static(publicDirPath));
const port = process.env.PORT || 3000;
app.listen(port);

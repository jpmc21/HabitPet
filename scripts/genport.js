/*
* Generates src/port.js with the PORT enviroment variable
* Ensures that changes to .env PORT is reflected to the frontend
*/
const fs = require("fs");
const assert = require("assert");
const path = require("path");

require("dotenv").config();
const { SERVER_PORT } = process.env;

assert(SERVER_PORT, "PORT environment variable is not defined");
const parent = path.dirname(__dirname);
const port = path.join(path.join(parent, "src"), "port.js");

console.log(`Generating ${port} with PORT=${SERVER_PORT}`);
fs.writeFileSync(port, `export const PORT = ${SERVER_PORT};`);
require("dotenv").config();

const { ClientInterface } = require("./adapter/index.js");

const client = new ClientInterface();

// quick test
(async () => {
    await client.StartConnection();
    await client.CloseConnection();
})()
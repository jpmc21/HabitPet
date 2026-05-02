const { MongoClient } = require("mongodb");
const ClientInterface = require("./interface");

const MAIN_CLUSTER = "habitpet"

class MongoAdapter extends ClientInterface {
    async StartConnection() {
        this._client = new MongoClient(process.env.MONGODB)

        try {
            await this._client.connect();
            console.log("Connected to MongoDB");

            this._cluster = await this._client.db(MAIN_CLUSTER);
            console.log(`Connected to cluster ${MAIN_CLUSTER}`);

            return this._cluster;
        } catch {
            console.error(`Failed to connect to MongoDB, Cluster ${MAIN_CLUSTER}`)
            return null;
        }
    }

    async CloseConnection() {
        if (this._client) {
            await this._client.close();
            this._client = null;
        }
    }
}

module.exports = MongoAdapter;
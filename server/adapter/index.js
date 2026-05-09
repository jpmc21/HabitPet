const CONNECTION = "MongoDB";

const adapters = {
    MongoDB: "mongodb.js"
};

module.exports = {
    ClientInterface: require("./" + adapters[CONNECTION])
}
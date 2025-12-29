const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { app } = require("../src/app");

let mongoServer;

const setupTestDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
};

const teardownTestDB = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
};

const clearCollection = async (collection) => {
    await mongoose.connection.collection(collection).deleteMany({});
};

module.exports = { setupTestDB, teardownTestDB, clearCollection };

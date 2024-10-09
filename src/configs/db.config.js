const mongoose = require("mongoose");
const config = require("./env.config/db.env");

const {
  db_name,
  db_host,
  db_username,
  db_password,
  db_socket_timeout,
  db_connection_timeout,
} = config;

mongoose.Promise = global.Promise;
const MONGO_CONN_URL = `mongodb+srv://${db_username}:${db_password}@${db_host}.mongodb.net/${db_name}?retryWrites=true&w=majority`;
const RETRY_BASE_INTERVAL = 2000; // 2 seconds base interval for exponential backoff retry
const MAX_RETRIES = 5; // Max number of retries for connection attempts

function getRetrySleepTime(attempt) {
  const exponentialBackoff = RETRY_BASE_INTERVAL * Math.pow(2, attempt);
  const jitter = Math.random() * exponentialBackoff * 0.5;
  return exponentialBackoff + jitter;
}

async function retryConnection(attempt) {
  if (attempt > MAX_RETRIES)
    return gracefulShutdown(new Error("Max connection retries reached."));

  const sleepTime = getRetrySleepTime(attempt);
  console.log(`Retrying in ${sleepTime / 1000} seconds...`);

  setTimeout(() => establishConnection(attempt + 1), sleepTime);
}

async function establishConnection(attempt = 1) {
  try {
    await mongoose.connect(MONGO_CONN_URL, {
      connectTimeoutMS: db_connection_timeout,
      socketTimeoutMS: db_socket_timeout,
    });
  } catch (err) {
    console.error(
      `Failed to connect to db on attempt ${attempt}: ${err.message}`
    );
    await retryConnection(attempt);
  }
}

// Event listeners for MongoDB connection
mongoose.connection.on("error", (err) => {
  console.error("DB connection error:", err);
  gracefulShutdown(err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("DB connection lost.");
});

mongoose.connection.on("reconnected", () => {
  console.info("DB reconnected!");
});

mongoose.connection.on("reconnectFailed", () => {
  console.error("DB reconnection failed. Exiting...");
  gracefulShutdown(new Error("DB reconnection failed."));
});

// Graceful shutdown
function gracefulShutdown(err) {
  console.error("Encountered an error:", err.message);
  console.info("Initiating graceful shutdown...");

  mongoose.connection
    .close()
    .then(() => {
      console.log("🔔 DB connection closed due to app termination.", "\n");
      process.exit(1);
    })
    .catch((error) => {
      console.error("Error while closing MongoDB connection:", error);
      process.exit(1);
    });
}

// Shutdown process for signals
async function handleShutdown(signal) {
  console.log("⚠️ ", `Received ${signal}. Closing DB connection...`);
  try {
    await mongoose.connection.close();
    console.log("🔔 DB Connection closed due to app termination.", "\n");
    process.exit(0); // Clean exit
  } catch (error) {
    console.error("Error while closing MongoDB connection:", error);
    process.exit(1); // Failure exit
  }
}

// Listen for shutdown signals
process.on("SIGINT", handleShutdown.bind(null, "SIGINT"));
process.on("SIGTERM", handleShutdown.bind(null, "SIGTERM"));

module.exports = { establishConnection };

const axios = require("axios");

const httpClient = axios.create({
  timeout: 5000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("HTTP Error:", error.message);
    return Promise.reject(error);
  }
);

module.exports = httpClient;

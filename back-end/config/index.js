import dotenv from "dotenv";
dotenv.config();

const config = {
  db: {
    url: process.env.MONGODB_URL,
    name: "test",
  },
};
console.log("config: ",config);
export default config;

export const config = {
  MONGO_URL: process.env.MONGO_URL,
  PORT: parseInt(process.env.PORT, 10) || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
};

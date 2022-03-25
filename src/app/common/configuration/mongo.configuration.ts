export default () => {
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL environment is not defined');
  }
  if (!process.env.MONGO_DB_NAME) {
    throw new Error('MONGO_DB_NAME environment is not defined');
  }
  const MONGO_URL = process.env.MONGO_URL + '/' + process.env.MONGO_DB_NAME;
  return { MONGO_URL };
};

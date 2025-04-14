import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    API_ROUTES_PREFIX: str(),
    DB_HOST: str(),
    DB_PORT: port(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    ACCESS_TOKENS_KEY_LOCATION: str()
  });
};

export default validateEnv;
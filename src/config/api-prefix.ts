import pkg from '../../package.json';
import config from 'config';

let apiPrefix: string | undefined;

export const getApiPrefix = () => {
  if (apiPrefix) {
    return apiPrefix;
  }

  const majorVersion = pkg.version.split('.')[0];
  const routPrefix = process.env[config.get<string>('API_ROUTES_PREFIX')];
  apiPrefix = routPrefix! /* + `/api/v${majorVersion}`*/;
  return apiPrefix;
};

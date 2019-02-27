import * as crypto from 'crypto';

import { Configuration } from './configure';

export default function createStableSuffix(data: { [key: string]: any }, config: Configuration) {
  const hash: string = crypto
    .createHash('md5')
    .update(JSON.stringify(data))
    .digest('base64');
  if (config.shortenStableSuffices) {
    return hash.substring(0, 5);
  } else {
    return hash;
  }
};

import * as bcryptjs from 'bcryptjs';

const plainToHash = async (password: string) => {
  return await bcryptjs.hash(password, 10);
};

const comparePlainToHash = async (password: string, hash: string) => {
  return await bcryptjs.compare(password, hash);
};

export { plainToHash, comparePlainToHash };

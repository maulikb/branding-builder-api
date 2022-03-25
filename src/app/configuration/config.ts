import { Objectype, Production, Config } from './config.interface';

const util = {
  isObject<T>(value: T): value is T & Objectype {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },
  merge<T extends Objectype, U extends Objectype>(target: T, source: U): T & U {
    for (const key of Object.keys(source)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (this.isObject(targetValue) && this.isObject(sourceValue)) {
        Object.assign(targetValue, this.merge(targetValue, sourceValue));
      }
    }
    return { ...target, ...source };
  },
};

export const configuration = async (): Promise<Config> => {
  const { config } = await import('./envs/local');
  const { config: environments } = <{ config: Production }>(
    await import(`./envs/${process.env.NODE_ENV || 'dev'}`)
  );
  return util.merge(config, environments);
};

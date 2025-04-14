import logger from '../logger/logger';

export function logMethod(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    if (typeof descriptor.value !== 'function') {
      throw new Error('@logMethod can only be applied to method declarations');
    }

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const className = target.constructor.name;
      const methodName = String(propertyKey);
      const fullMethod = `${className}.${methodName}`;
      const start = Date.now();

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;
        logger.info(`✅ ${fullMethod} succeeded in ${duration}ms`);
        return result;
      } catch (error: unknown) {
        const duration = Date.now() - start;
        handleError(error, fullMethod, duration);

        throw error;
      }
    };

    return descriptor;
  };
}

function handleError(error: unknown, fullMethod: string, duration: number) {
  if (error instanceof Error) {
    logger.error(
      `❌ ${fullMethod} failed in ${duration}ms`,
      error.stack || error.message
    );
  } else {
    logger.error(
      `❌ ${fullMethod} failed in ${duration}ms with unknown error`,
      String(error)
    );
  }
}

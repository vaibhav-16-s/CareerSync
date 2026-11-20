import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

type Source = 'body' | 'query' | 'params';

/**
 * Validates and replaces req[source] with the parsed (typed, stripped) value.
 * Accepts any Zod schema, including `ZodEffects` produced by `.refine()`.
 */
export const validate =
  (schema: ZodTypeAny, source: Source = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      // query/params are read-only getters in some Express versions; assign carefully
      if (source === 'body') req.body = parsed;
      else Object.assign(req[source], parsed);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(err);
        return;
      }
      next(err);
    }
  };

export default validate;

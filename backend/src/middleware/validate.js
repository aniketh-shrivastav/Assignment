export const validate = (schema) => {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = parsed.body;
      req.params = parsed.params;
      req.query = parsed.query;
      next();
    } catch (error) {
      next(error);
    }
  };
};

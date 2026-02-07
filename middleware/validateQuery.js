import Joi from 'joi';

const validateFilterQuery = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    category: Joi.string().valid('electronics', 'clothing', 'books', 'home', 'sports').optional(),
    brand: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    inStock: Joi.boolean().optional(),
    sort: Joi.string().optional().default('createdAt'),
    page: Joi.number().min(1).optional().default(1),
    limit: Joi.number().min(1).max(100).optional().default(10),
  });

  const { error } = schema.validate(req.query, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      errors: error.details.map((e) => e.message),
    });
  }

  next();
};

export default validateFilterQuery;
import Joi from "joi";

export const createSubCategorySchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  category: Joi.string().min(2).max(50).required(),
});

// export const getCategorySchema = Joi.object({
//     id:Joi.string().hex().length(24).required()
// })

// export const updateCategorySchema = Joi.object({
//     name:Joi.string().min(2).max(20),
//     id:Joi.string().hex().length(24).required()
// })

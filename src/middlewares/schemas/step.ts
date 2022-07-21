import Joi from 'joi';

export const getStepsRule = Joi.object({
  considerer_traffic: Joi.boolean()
    .required(),
  maximun_distance: Joi.number()
    .max(99999999)
    .min(1)
    .required(),
  maximun_distance_between_points: Joi.number()
    .max(99999999)
    .min(1)
    .required(),
  plot: Joi.boolean()
    .required(),
});

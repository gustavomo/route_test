// Libraries
import Joi from 'joi';
import to from 'await-to-js';

// Config
import config from '../config';

// Utils
import * as helperResponse from '../utils/response';
import * as utils from '../utils';
import messages from '../utils/messages';

export const handlerReponse = (controllerAction: (req: IReq, res: IRes) => Promise<any>) => async (req: IReq, res: IRes) => {
  const [error, messagesList] = await to(controllerAction(req, res));
  if (error) {
    utils.logData('handlerReponse', error);
    return helperResponse.errorRes(res, error);
  }

  return helperResponse.successRes(res, messagesList);
};

export const handlerValidation = (functionName: string, schemaRule: Joi.ObjectSchema<any>) => async (req: IReq, res: IRes, next: INext) => {
  const [error] = await to(schemaRule.validateAsync(req.method === 'GET' ? req.query : req.body));
  if (error) {
    utils.logData(functionName, error);
    return res.status(400).send({
      error: {
        message: messages.invalidInfo,
      },
      [config.nodeENV == 'development' && 'serverError'] : {
        message: error.message,
      },
    });
  }

  return next();
};

// Config
import config from '../config';

// Utils
import messages from './messages';

export const successRes = (res: IRes, response: IObj) => {
  res.status(200).send(response);
};

export const errorRes = (res: IRes, error: IObj) => {
  const isInternalError = typeof error.code !== 'number';
  res.status(isInternalError ? 500 : 200).send({
    error: {
      message: isInternalError ? messages.serverError : error.message,
    },
    [config.nodeENV == 'development' && 'serverError'] : {
      message: error.message,
    },
    response: null,
  });
};

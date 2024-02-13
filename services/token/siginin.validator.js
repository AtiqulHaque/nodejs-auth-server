const Joi = require('joi');


const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const SignInValidator = (params) => {

  const result = schema.validate(params);

  if (typeof result.error != "undefined") {
    return {
      status: "validation-error",
      payload: result.error['message'],
      code : 500
    };
  }

  return {
    status: "success",
    payload: result.value,
    code : 200
  };

}

module.exports = SignInValidator;

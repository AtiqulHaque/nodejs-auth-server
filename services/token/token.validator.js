const Joi = require('joi');


const schema = Joi.object({
  requestToken: Joi.string().required()
});

module.exports = (params) => {

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
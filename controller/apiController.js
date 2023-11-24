const { getApiModel } = require('../model/apiModel');

exports.getApis = (req, res, next) => {
  getApiModel().then((dataApi) => {
    res.status(200).send({ dataApi });
  });
};



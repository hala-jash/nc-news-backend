
exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
      res.status(400).send({ msg: 'Bad request' });
    } else {
    //   console.error(err, '<<< handle psql error');
      next(err);
    }
  };
  
  exports.handleCustomErrors = (err, req, res, next) => {
    // console.error(err, '<<< handle custom error');
    if (err.status) {
      res.status(404).send({ msg: err.msg });
    } else {
      next(err);
    }
  };
  
  exports.handle404 = (req, res) => {
    res.status(404).send({ msg: 'Not Found' });
  };
  
  exports.handle500 = (err, req, res, next) => {
    // console.error(err, '<<< handle 500 error');
    res.status(500).send({ msg: 'Internal Server Error' });
  };
  
  exports.handleUnhandledErrors = (err, req, res, next) => {
    // console.error(err, '<<< handle unhandled error');
    res.status(500).send({ msg: 'Unhandled Error' });
  };
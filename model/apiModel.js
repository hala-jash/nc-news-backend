const fs = require('fs/promises');

exports.getApiModel = () => {
  const filePromise = fs
    .readFile(`${__dirname}/../endpoints.json`, 'utf8')
    .then((apiData) => JSON.parse(apiData));

  return filePromise;
};


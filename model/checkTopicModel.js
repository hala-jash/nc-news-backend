const db = require('../db/connection');
exports.checkTopicExist = () => {
  return db.query(`SELECT DISTINCT topic FROM articles`).then(({ rows }) => {
    console.log(rows);
    const ValidTopics = rows.map((row) => row.topic);
    console.log(ValidTopics);
    return ValidTopics;
  });
};

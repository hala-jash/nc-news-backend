const app = require('./app');
const PORT = 9090;

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}!`);
});

const express = require('express');
const app = express();
const port = 3000;

const userRouter = require('./routes/users');

app.use(express.json());
app.use(express.static('public'));
app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
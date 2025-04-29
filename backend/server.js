const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const userRouter = require('./routes/users');
const depenseRouter = require('./routes/depenses');
const colocationRouter = require('./routes/colocations');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/users', userRouter);
app.use('/depenses', depenseRouter);
app.use('/colocations', colocationRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
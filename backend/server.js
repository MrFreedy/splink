const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const userRouter = require('./routes/users');
const depenseRouter = require('./routes/depenses');
const colocationRouter = require('./routes/colocations');
const taskRouter = require('./routes/tasks');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/users', userRouter);
app.use('/api/depenses', depenseRouter);
app.use('/api/colocations', colocationRouter);
app.use('/api/tasks', taskRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
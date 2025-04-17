const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

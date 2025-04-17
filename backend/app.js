const express = require('express');
const app = express();

app.use(express.json());


app.get('/', (req, res) => {
  res.send('🚀 Hello, Express läuft!');
});

app.use((req, res) => {
  res.status(404).json({ message: '❌ Route nicht gefunden' });
});

module.exports = app;
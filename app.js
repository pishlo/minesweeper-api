const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const authRoutes = require('./routes/auth.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });

app.use('/api/users', authRoutes);

const PORT = 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));

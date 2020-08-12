require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const morgan = require('morgan');
const db = require('./config/keys').mongoURI;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());
app.use(cors());

// Router Middleware
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter, commentRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', userRouter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.use((error, req, res, next) => {
  //console.error(error);
  res.status(error.status || 500);
  res.json({
    error: {
      name: error.name,
      message: error.message
    }
  });
})

// mongoose.connect('mongodb://localhost:27017/articlesDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })

// DB Config
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log(`Database Connected!`))
  .catch((err) => console.log(err));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.listen(PORT, () => {
  console.log(`Server started running at port -> ${PORT}`)
})
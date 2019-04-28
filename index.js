/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const {
  admin,
  toGeoJSON,
  reports,
  DEFAULT_POINT,
  storeClinic,
  deleteOpinion,
  updateUser,
  saveMessage,
} = require('./server/lib-firestore');

require('pug');

const logger = t => console.log(t);

const mainReportsData = {
  geo: {},
};

const clinicsSubscribe = () => {
  const query2 = reports.within(DEFAULT_POINT, 22, 'position');
  const obs2 = query2.pipe(toGeoJSON('position', true));
  obs2.subscribe((geoj) => {
    console.log('reports changed');
    mainReportsData.geo = geoj;
    io.emit('clinics', {
      metric: mainReportsData.geo,
    });
  });
};

clinicsSubscribe();

app.set('PORT', process.env.PORT || 3000);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/authorize', (req, res) => {
  const { token } = req.cookies;
  // logger(token);
  // res.setHeader('Access-Control-Allow-Origin', '*');
  if (!token) {
    res.send({ auth: 'error' });
  } else {
    admin.auth().verifyIdToken(token)
      .then((claims) => {
        // console.log(claims);
        // const role = claims.admin ? 'admin' : 'error';
        const {
          name: displayName,
          email,
          uid,
          picture: photoURL,
        } = claims;
        const newUser = {
          displayName,
          email,
          uid,
          photoURL,
          isAdmin: claims.admin,
        };
        updateUser(newUser);
        res.send({ auth: newUser });
      })
      .catch(console.log);
  }
});

app.post('/api/clinic-add', (req, res) => {
  const { token } = req.cookies;
  const {
    uid,
    info,
  } = req.body;
  // res.setHeader('Access-Control-Allow-Origin', '*');
  if (!token) {
    res.send({ auth: 'error' });
  } else {
    admin.auth().verifyIdToken(token)
      .then(() => {
        storeClinic(uid, info, res);
      });
  }
});

app.post('/api/clinic-delete', (req, res) => {
  const { token } = req.cookies;
  const {
    uid,
    id,
  } = req.body;
  // res.setHeader('Access-Control-Allow-Origin', '*');
  if (!token && !!(uid)) {
    res.send({ auth: 'error' });
  } else {
    admin.auth().verifyIdToken(token)
      .then(() => {
        deleteOpinion(uid, id, res);
      })
      .catch((error) => {
        console.error('Error al guardar', error);
        res.send({ auth: 'error' });
      });
  }
});

app.post('/api/message', (req, res) => {
  const { token } = req.cookies;
  const {
    subject,
    phone,
    message,
    email,
    displayName,
    uid,
  } = req.body;
  // res.setHeader('Access-Control-Allow-Origin', '*');
  if (!token && !!(uid)) {
    res.send({ auth: 'error' });
  } else {
    admin.auth().verifyIdToken(token)
      .then(() => {
        saveMessage({
          subject,
          phone,
          message,
          email,
          displayName,
          uid,
        }, res);
      })
      .catch((error) => {
        console.error('Error al guardar mensaje :(', error);
        res.send({ auth: 'error' });
      });
  }
});

app.use(express.static('www'));

io.on('connection', (socket) => {
  socket.emit('clinics', {
    metric: mainReportsData.geo,
  });
  // socket.on('disconnect', () => {
  //   // console.log('user disconnected');
  // });
});

http.listen(app.get('PORT'), (error) => {
  if (error) {
    logger('Server started with an error', error);
    process.exit(1);
  }
  logger(`Server started and is listening at:${app.get('PORT')}`);
});

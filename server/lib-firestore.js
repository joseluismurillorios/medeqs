const admin = require('firebase-admin');
const firebase = require('firebase');
const geofirex = require('geofirex');
const {
  toGeoJSON,
  // get,
} = require('geofirex');

// console.log(process.env);

const serviceAccount = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key.replace(/\\n/g, '\n'),
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
};

const adminconfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://implandb.firebaseio.com',
};

const config = {
  apiKey: 'AIzaSyARCPWHg8DdKPWI0KxOLFD2hJJM_G0BrgU',
  authDomain: 'medeqs.firebaseapp.com',
  databaseURL: 'https://medeqs.firebaseio.com',
  projectId: 'medeqs',
  storageBucket: 'medeqs.appspot.com',
  messagingSenderId: '5313566256',
};

admin.initializeApp(adminconfig);
firebase.initializeApp(config);

const settings = { timestampsInSnapshots: true };

const db = admin.firestore();

const firestore = firebase.firestore();
firestore.settings(settings);

const geo = geofirex.init(firebase);

const DEFAULT_POINT = geo.point(32.520666, -117.021315);

// admin.auth().setCustomUserClaims('esoBYwO6DyQigOJOYz4RYRZbflE2', { admin: true }).then(() => {
//   // The new custom claims will propagate to the user's ID token the
//   // next time a new one is issued.
//   console.log('done');
// });

const COLORS = [
  '#E91E63',
  '#C2185B',
  '#880E4F',
];

// const TYPES = {
//   0: 'cardiograma',
//   1: 'matraz',
//   2: 'ambulancia',
//   3: 'tensiómetro',
//   4: 'defribilador',
//   5: 'reflejo',
//   6: 'muletas',
//   7: 'estetoscopio',
//   8: 'jeringa',
//   9: 'medicación',
//   10: 'camilla',
//   11: 'oxígeno',
//   12: 'cardiograma',
//   13: 'syringe 1',
//   14: 'tijeras',
//   15: 'mortero',
//   16: 'suero',
//   17: 'herramientas dentales',
//   18: 'escala',
//   19: 'botiquín',
//   20: 'termómetro',
//   21: 'silla de ruedas',
//   22: 'microscopio',
//   23: 'tubos de ensayo',
//   24: 'bisturí',
//   25: 'rayos x',
//   26: 'otoscopio',
//   27: 'placa de petri',
//   28: 'matraz',
// };

const reports = geo.collection('clinics', ref => ref.where('category', '==', 0));

const clinics = db.collection('clinics');
const users = db.collection('users');
const messages = db.collection('messages');

const storeClinic = (uid, info, res) => {
  const {
    address,
    latitude,
    longitude,
    clinic,
    contact,
  } = info;
  const {
    category,
    message,
    subcategory,
    name,
  } = clinic;
  const categ = parseInt(category, 10);
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const { data } = geo.point(lat, lon);
  const position = {
    geopoint: new admin.firestore.GeoPoint(lat, lon),
    geohash: data.geohash,
  };
  clinics.add({
    name,
    contact,
    address,
    latitude: lat,
    longitude: lon,
    category: categ,
    message,
    subcategory,
    timestamp,
    user: uid,
    position,
    open: true,
    resolved: false,
    'marker-color': COLORS[categ],
    'marker-size': 'large',
  })
    .then((docRef) => {
      users.doc(uid).set({
        clinics: {
          [docRef.id]: true,
        },
      }, { merge: true })
        .then(() => {
          res.send({ auth: 'success' });
        })
        .catch((error) => {
          console.error('Error al guardar en usuario', error);
          res.send({ auth: 'error' });
        });
    })
    .catch((error) => {
      console.error('Error al guardar', error);
      res.send({ auth: 'error' });
    });
};

const deleteOpinion = (uid, id, res) => {
  const batch = db.batch();

  const reportRef = db.collection('clinics').doc(id);
  batch.delete(reportRef);

  const usersRef = db.collection('users').doc(uid);
  batch.set(usersRef, {
    clinics: {
      [id]: admin.firestore.FieldValue.delete(),
    },
  }, { merge: true });

  batch.commit()
    .then(() => {
      res.send({ auth: 'success' });
    })
    .catch((error) => {
      console.error('Error al eliminar', error);
      res.send({ auth: 'error' });
    });
};

const updateUser = ({
  displayName,
  email,
  uid,
  photoURL,
}) => {
  users.doc(uid).set({
    email,
    displayName,
    photoURL,
  }, { merge: true })
    .catch((error) => {
      console.error('Error al guardar en usuario', error);
      return false;
    });
};

const saveMessage = ({
  subject,
  phone,
  message,
  email,
  displayName,
  uid,
}, res) => {
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  messages.add({
    subject,
    phone,
    message,
    email,
    displayName,
    user: uid,
    timestamp,
  })
    .then((docRef) => {
      users.doc(uid).set({
        messages: {
          [docRef.id]: true,
        },
      }, { merge: true })
        .then(() => {
          res.send({ auth: 'success' });
        })
        .catch((error) => {
          console.error('Error al guardar en usuario', error);
          res.send({ auth: 'error' });
        });
    })
    .catch((error) => {
      console.error('Error al guardar', error);
      res.send({ auth: 'error' });
    });
};

module.exports = {
  admin,
  firebase,
  toGeoJSON,
  reports,
  DEFAULT_POINT,
  storeClinic,
  deleteOpinion,
  updateUser,
  saveMessage,
};

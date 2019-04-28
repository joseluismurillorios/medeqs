import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

import socketIO from '../../../helpers/helper-socket';

import {
  auth,
  provider,
} from '../../../helpers/helper-firebase';
import $ from '../../../helpers/helper-jquery';
import {
  userLogged,
  // setLoader,
  setAdmin,
} from './index';
import { clearClinic } from '../info';

const DEVELOMPENT = (process.env.NODE_ENV === 'development');


let connected = true;
let toastId = null;

const onConnection = (connection) => {
  const type = connection ? toast.TYPE.SUCCESS : toast.TYPE.ERROR;
  const render = connection ? 'Conectado' : 'Desconectado';
  const isActive = toast.isActive(toastId);
  if (!toastId || !isActive) {
    toastId = toast(render, {
      render,
      type,
      autoClose: false,
    });
  } else {
    toast.update(toastId, {
      render,
      type,
      autoClose: false,
    });
  }
};

socketIO.on('connect', () => {
  if (!connected) {
    onConnection(true);
    connected = true;
  }
  // onConnection(true);
});

socketIO.io.on('connect_error', () => {
  if (connected) {
    onConnection(false);
    connected = false;
  }
  // onConnection(false);
});

const setAppCookie = dispatch => auth.currentUser && (
  auth.currentUser.getIdToken().then((token) => {
    // console.log('setAppCookie');
    Cookies.set('token', token, {
      domain: window.location.hostname,
      expire: 1 / 24, // One hour
      path: '',
      secure: !DEVELOMPENT,
    });
    if (dispatch) {
      fetch('/api/authorize', {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        method: 'GET',
        credentials: 'include',
      })
        .then(response => response.json())
        .then((data) => {
          // console.log(data);
          if (data.auth !== 'error') {
            dispatch(userLogged(data.auth));
            return true;
          }
          dispatch(setAdmin(false));
          return false;
        })
        .catch((error) => {
          // Handle Errors here.
          console.log(error);
          dispatch(setAdmin(false));
        });
    }
  })
);

const unsetAppCookie = () => Cookies.remove('token', {
  domain: window.location.hostname,
  path: '',
});


export const onAuthChange = () => (
  dispatch => auth.onAuthStateChanged((user) => {
    // console.log(user);
    // toast.success('Yeeeeeeeee', { autoClose: false });
    // toast.error('Yeeeeeeeee', { autoClose: false });
    // toast.warn('Yeeeeeeeee', { autoClose: false });
    // toast.info('Yeeeeeeeee', { autoClose: false });
    if (user) {
      const {
        displayName,
        email,
        photoURL,
        uid,
      } = user;
      dispatch(userLogged({
        displayName,
        email,
        photoURL,
        uid,
      }));

      // user is logged in
      setAppCookie(dispatch);
      // Reset cookie before hour expires
      setInterval(setAppCookie, 3500);

      // isAdmin();

      $('#Login').modal('hide');
      toast.info(`Hola ${displayName || email}`, { autoClose: 2000 });
      // dispatch(userLogged(user));
    } else {
      unsetAppCookie();
      dispatch(userLogged());
    }
  })
);

export const userLogin = (email, password) => (
  () => (
    auth.signInWithEmailAndPassword(email, password)
      .catch((er) => {
        console.log(er);
        if (er.code === 'auth/wrong-password') {
          toast.error('El usuario o contraseña no coincide', { autoClose: 5000 });
        } else {
          auth.createUserWithEmailAndPassword(email, password)
            .catch((error) => {
              // Handle Errors here.
              console.log(error);
              toast.error('Error inesperado, vuelva a intentarlo', { autoClose: 5000 });
            });
        }
      })
  )
);

export const authLogin = () => (
  (dispatch) => {
    if (window.cordova) {
      window.plugins.googleplus.login(
        {},
        (obj) => {
          const credential = provider.credential(obj.idToken, obj.accessToken);
          // console.log(obj, credential);
          return auth.signInAndRetrieveDataWithCredential(credential)
            .catch((error) => {
              console.log(error);
              dispatch(userLogged());
              toast.error(JSON.stringify(error));
            });
        },
      );
    } else {
      return auth.signInWithPopup(provider)
        .catch((error) => {
          // Handle Errors here.
          toast.error(error.message, { autoClose: 5000 });
        });
    }
    return false;
  }
);

export const authLogout = () => (
  dispatch => (
    auth.signOut()
      .then(() => {
        unsetAppCookie();
        dispatch(clearClinic());
        dispatch(userLogged());
      })
      .catch((error) => {
        toast.error(error.message, { autoClose: 5000 });
      })
  )
);

export const isAdmin = () => (
  dispatch => (
    fetch('/api/authorize', {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        if (data.auth !== 'error') {
          dispatch(userLogged(data.auth));
          return true;
        }
        dispatch(setAdmin(false));
        return false;
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
        toast.error('Error en el servidor', { autoClose: 5000 });
        dispatch(setAdmin(false));
      })
  )
);

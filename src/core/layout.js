import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  onAuthChange,
  authLogin,
  authLogout,
  userLogin,
} from './redux/actions/common/async';

import {
  hideInstallMessage,
} from './redux/actions/common';

import {
  isIOS,
  isInStandaloneMode,
  isIOSChrome,
} from './helpers/helper-util';

import CloseButton from './components/atoms/close';
import Loader from './components/atoms/loader';
import Button from './components/atoms/button';
import AddHome from './components/molecules/addhome';
import Modal from './components/molecules/modal';
import Header from './components/organisms/header';
import { ROUTES } from './components/templates';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpened: false,
      showInstallMessage: (isIOS && !isInStandaloneMode() && !isIOSChrome && !(window.cordova)),
      isStandalone: isIOS && (isInStandaloneMode() || !!(window.cordova)),
      email: '',
      password: '',
      height: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);

    this.setHeaderRef = this.setHeaderRef.bind(this);
    this.debouncedResize = this.debouncedResize.bind(this);

    this.handleText = this.handleText.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    const {
      authChange,
    } = this.props;
    const { isStandalone } = this.state;
    if (isStandalone) {
      document.body.classList.add('isStandalone');
      const root = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)

      root.classList.add('class', 'isStandalone');
    }
    window.addEventListener('orientationchange', this.debouncedOrientation, false);
    window.addEventListener('resize', this.debouncedResize, false);
    this.debouncedResize();

    const rectHeader = this.header.getBoundingClientRect();
    const { height } = rectHeader;
    this.setState({ top: height });
    authChange();

    if (isIOS && isInStandaloneMode()) {
      document.documentElement.style.height = '100%';
    }
  }

  setHeaderRef(header) {
    console.log(this.header);
    this.header = header;
  }

  debouncedResize() {
    switch (window.orientation) {
      case -90 || 90: {
        document.documentElement.style.height = isIOS ? '100vh' : '100%';
        break;
      }
      default: {
        document.documentElement.style.height = !isIOS ? '100vh' : '100%';
        break;
      }
    }
    setTimeout(() => {
      const rectHeader = this.header.getBoundingClientRect();
      const { height } = rectHeader;
      this.setState({ top: height, height: window.innerHeight });
    }, 100);
  }

  toggleMenu() {
    const { menuOpened } = this.state;
    this.setState({ menuOpened });
  }

  handleText(v) {
    this.setState({ [v.name]: v.value });
  }

  login() {
    const { loginUser } = this.props;
    const { email, password } = this.state;
    loginUser(email, password);
  }

  render() {
    const {
      common,
      children,
      loginAuth,
      logout,
      hideMessage,
    } = this.props;
    const {
      showInstallMessage,
      top,
      isStandalone,
      height,
    } = this.state;
    const style = height ? { top, height: height - top } : { top };
    const loaderClass = (typeof common.loading === 'string') ? common.loading : 'bg-light-80';
    return (
      <div id="Layout" style={{ height }} className="app__layout full">
        <Header
          setRef={this.setHeaderRef}
          isStandalone={isStandalone}
          login={loginAuth}
          logout={logout}
          user={common.user}
          routes={ROUTES}
        />
        <section
          id="Router"
          className="app__router fill"
          style={style}
        >
          {children}
        </section>

        <ToastContainer
          autoClose={10000}
          closeButton={<CloseButton className="implanf-close toast-close" />}
          transition={Zoom}
          toastClassName="toast"
        />


        <CSSTransition
          in={!!(common.loading)}
          timeout={1000}
          classNames="fade"
          unmountOnExit
        >
          <Loader style={{ top }} className={`preloader ${loaderClass}`} />
        </CSSTransition>
        {
          showInstallMessage && common.showInstallMessage && (
            <AddHome id="addhome" onClick={hideMessage} />
          )
        }

        {/* <Top /> */}
        <Modal.Container id="Login">
          <Modal.Header text="Entrar" />
          <Modal.Footer>
            <div className="flex-center">
              <Button id="gmail" color="danger" size="sm" onTap={loginAuth}>
                Continuar con
                <span className="implanf-google ml-10 mr-10" />
                Gmail
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Container>
      </div>
    );
  }
}

Layout.defaultProps = {
  authChange: () => {},
  loginAuth: () => {},
  loginUser: () => {},
  logout: () => {},
  hideMessage: () => {},
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
  common: PropTypes.objectOf(
    PropTypes.any,
  ).isRequired,
  authChange: PropTypes.func,
  loginAuth: PropTypes.func,
  loginUser: PropTypes.func,
  logout: PropTypes.func,
  hideMessage: PropTypes.func,
};

const mapStateToProps = state => ({
  common: state.common,
  esri: state.esri,
  info: state.info,
});

const mapDispatchToProps = {
  authChange: onAuthChange,
  loginAuth: authLogin,
  loginUser: userLogin,
  logout: authLogout,
  hideMessage: hideInstallMessage,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));

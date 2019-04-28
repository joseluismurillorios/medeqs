/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable jsx-a11y/anchor-has-content */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import $ from '../../../helpers/helper-jquery';
import { debounce } from '../../../helpers/helper-util';

import Templates from '../../templates';
import Button from '../../atoms/button';
import Logo from '../../atoms/logo';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.debouncedSearch = debounce(this.debouncedSearch.bind(this), 1000);
  }

  componentDidMount() {
    $(document).click((e) => {
      const clickover = $(e.target);
      const opened = $('.navbar-collapse').hasClass('collapse in');
      if (opened === true && !clickover.hasClass('navbar-toggle')) {
        $('button.navbar-toggle').click();
      }
    });

    $('.search-wrap, .trigger-search').on('click', (e) => {
      e.stopPropagation();
    });
  }

  onSearch(e) {
    this.searchTerm = e.target.value;
    this.debouncedSearch();
  }

  debouncedSearch() {
    const { searchItems } = this.props;
    searchItems({ searchTerm: this.searchTerm });
  }

  render() {
    const {
      setRef,
      login,
      logout,
      user,
      isStandalone,
      location,
    } = this.props;
    return (
      <header
        className="nav-type-1"
        ref={setRef}
        id="Header"
      >
        {
          isStandalone && (
            <div className="app__statusbar" />
          )
        }

        <nav className="navbar navbar-static-top">
          <div className="navigation">
            <div className="container relative">

              <form method="get" className="search-wrap">
                <input type="search" className="form-control" placeholder="Type &amp; Hit Enter" />
              </form>

              <div className="row">

                <div className="navbar-header">
                  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                </div>


                <div className="logo-container">
                  <div className="logo-wrap">
                    <a href="/">
                      {/* <img className="logo" src={navbarDark} alt="logo" /> */}
                    </a>
                    <NavLink
                      exact
                      to="/"
                      activeClassName="active"
                      replace={location.pathname === '/'}
                      // onClick={toggleNavBar}
                    >
                      <Logo />
                    </NavLink>
                  </div>
                </div>

                <div className="col-md-9 nav-wrap right">
                  <div className="collapse navbar-collapse" id="navbar-collapse" style={{ maxHeight: '812px' }}>

                    <ul className="nav navbar-nav navbar-right">
                      {
                        Templates.map(page => (
                          <li key={page.url}>
                            <NavLink
                              exact
                              to={page.url}
                              activeClassName="active"
                              replace={page.url === location.pathname}
                              // onClick={toggleNavBar}
                            >
                              {page.name}
                            </NavLink>
                          </li>
                        ))
                      }

                      {
                        user && user.email
                          ? (
                            <li className="dropdown">
                              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <span className="implanf-person mr-10" />
                                {user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0]}
                              </a>
                              <ul className="dropdown-menu menu-right">
                                <li>
                                  <a href="#" onClick={logout}>
                                    <span className="implanf-log-out mr-10" />
                                    Salir
                                  </a>
                                </li>
                              </ul>
                            </li>
                          )
                          : (
                            <li>
                              <div className="nav-btn center">
                                <Button color="primary" onTap={login}>
                                  <span className="implanf-google mr-10" />
                                  Entrar
                                </Button>
                              </div>
                            </li>
                          )
                      }

                      {/* <li id="mobile-search" className="hidden-lg hidden-md">
                        <form method="get" className="mobile-search">
                          <input type="search" className="form-control" placeholder="Search..." />
                          <button type="submit" className="search-button">
                            <i className="implanf-search" />
                          </button>
                        </form>
                      </li> */}

                      {/* <li>
                        <a href="#" className="nav-search">
                          <i className="implanf-search search-trigger" />
                          <i className="implanf-times search-close" />
                        </a>
                      </li> */}

                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

NavBar.defaultProps = {
  searchItems: () => { },
  setRef: () => { },
  login: () => { },
  logout: () => { },
  isStandalone: false,
  user: false,
};

NavBar.propTypes = {
  searchItems: PropTypes.func,
  setRef: PropTypes.func,
  login: PropTypes.func,
  logout: PropTypes.func,
  isStandalone: PropTypes.bool,
  user: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  location: PropTypes.objectOf(
    PropTypes.any,
  ).isRequired,
};

const mapStateToProps = state => ({
  common: state.common,
});

const mapDispatchToProps = {
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));

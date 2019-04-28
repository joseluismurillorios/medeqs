/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ id }) => (
  <footer id={id} className="footer footer-type-4">
    <div className="bottom-footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-xs-12 copyright">
            <span>
              2019 MEDEQS
            </span>
          </div>
          <div className="col-md-6 col-xs-12 footer-socials mt-mdm-10 text-right">
            <ul className="bottom-footer-links style-2">
              <div style={{ display: 'none' }}>
                Icons made by
                <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
                from
                <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                is licensed by
                <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">
                  CC 3.0 BY
                </a>
              </div>
              <li><a href="https://www.flaticon.com/authors/smashicons" target="_blank" rel="noopener noreferrer">Smashicons</a></li>
              <li><a href="#">Términos y Condiciones</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

Footer.defaultProps = {
  id: '',
};

Footer.propTypes = {
  id: PropTypes.string,
};

export default Footer;

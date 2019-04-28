import React from 'react';
import PropTypes from 'prop-types';


const ModalHeader = ({ children }) => (
  <article className="esri-popup__content">
    <div>
      <div>
        {children}
      </div>
    </div>
  </article>
);

ModalHeader.defaultProps = {
  children: 'no children',
};

ModalHeader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]),
};

export default ModalHeader;

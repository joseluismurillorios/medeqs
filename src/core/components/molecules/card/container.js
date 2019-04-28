import React from 'react';
import PropTypes from 'prop-types';


const ModalContainer = ({ className, id, children }) => (
  <div
    className={`esri-popup__main-container esri-widget esri-popup--shadow fixed-right-bottom ${className}`}
    id={id}
    aria-labelledby={`${id}Title`}
    aria-hidden="true"
    tabIndex="-1"
  >
    {children}
  </div>
);

ModalContainer.defaultProps = {
  className: '',
};

ModalContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ModalContainer;

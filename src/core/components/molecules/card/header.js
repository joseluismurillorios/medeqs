import React from 'react';
import PropTypes from 'prop-types';


const ModalHeader = ({ toggle, text }) => (
  <header className="esri-popup__header">
    <div className="esri-popup__header-container esri-popup__header-container--button" role="button" aria-label="Contraer" title="Contraer" tabIndex={0}>
      <h2 className="esri-popup__header-title">{text}</h2>
    </div>
    <div className="esri-popup__header-buttons">
      <button
        type="button"
        tabIndex={0}
        className="esri-popup__button"
        aria-label="Cerrar"
        title="Cerrar"
        onClick={toggle}
      >
        <span aria-hidden="true" className="esri-popup__icon esricon-close" />
      </button>
    </div>
  </header>
);

ModalHeader.defaultProps = {
  text: 'no text',
};

ModalHeader.propTypes = {
  text: PropTypes.string,
  toggle: PropTypes.func.isRequired,
};

export default ModalHeader;

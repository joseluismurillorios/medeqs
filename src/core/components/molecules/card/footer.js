import React from 'react';
import PropTypes from 'prop-types';


const ModalFooter = ({
  toggle,
  zoomOut,
  zoomIn,
  canEdit,
  deleteReport,
}) => (
  <div className="esri-popup__footer">
    {/* <section className="esri-popup__navigation">
      {children}
    </section> */}
    {
      canEdit
      && (
        <button
          className="esri-popup__button esri-popup__actions-menu-button"
          type="button"
          aria-haspopup="true"
          tabIndex={0}
          onClick={deleteReport}
        >
          <span aria-hidden="true" className="esricon-trash" />
        </button>
      )
    }
    {
      zoomOut
      && (
        <button
          className="esri-popup__button esri-popup__actions-menu-button btn-primary"
          type="button"
          aria-haspopup="true"
          tabIndex={0}
          onClick={zoomOut}
        >
          <span aria-hidden="true" className="esricon-zoom-out-magnifying-glass" />
        </button>
      )
    }
    {
      zoomIn
      && (
        <button
          className="esri-popup__button esri-popup__actions-menu-button btn-primary"
          type="button"
          aria-haspopup="true"
          tabIndex={0}
          onClick={zoomIn}
        >
          <span aria-hidden="true" className="esricon-zoom-in-magnifying-glass" />
        </button>
      )
    }
    {
      toggle
      && (
        <button
          className="esri-popup__button esri-popup__actions-menu-button btn-success"
          type="button"
          aria-haspopup="true"
          tabIndex={0}
          onClick={toggle}
        >
          <span aria-hidden="true" className="esri-icon-check-mark" />
        </button>
      )
    }
  </div>
);

ModalFooter.defaultProps = {
  toggle: false,
  zoomOut: false,
  zoomIn: false,
  deleteReport: () => {},
  canEdit: false,
};

ModalFooter.propTypes = {
  toggle: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  zoomOut: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  zoomIn: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  deleteReport: PropTypes.func,
  canEdit: PropTypes.bool,
};

export default ModalFooter;

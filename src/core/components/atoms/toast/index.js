import React from 'react';
import PropTypes from 'prop-types';

const Toast = ({ closeToast, texts }) => (
  <div className="Toastify">
    <div className="Toastify__toast-container Toastify__toast-container--top-left">
      <div className="Toastify__toast Toastify__toast--info toast">
        <div role="alert" className="Toastify__toast-body">
          {
            texts.map(t => <div>{t}</div>)
          }
        </div>
        <button className="implanf-close toast-close" type="button" onClick={closeToast} />
      </div>
    </div>
  </div>
);

Toast.defaultProps = {
  closeToast: () => {},
  texts: '',
};

Toast.propTypes = {
  closeToast: PropTypes.func,
  texts: PropTypes.arrayOf(PropTypes.any),
};

export default Toast;

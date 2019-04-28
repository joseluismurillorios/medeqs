import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../atoms/button';


import { isIOS } from '../../../helpers/helper-util';

const ControlsLeft = ({
  onMouseLeave,
  toggleShowHelp,
  showHelp,
  showTooltip,
  geo,
  download,
  tooltip,
  hasFeatures,
  showDataLayer,
  toggleDataLayer,
  toggleMapType,
  mapType,
  reset,
}) => (
  <div
    className="map-menu fixed-left-bottom"
    onMouseLeave={() => { onMouseLeave({ tooltip: '' }); }}
    onTouchEnd={() => { onMouseLeave({ tooltip: '' }); }}
  >
    <Button
      onTap={toggleShowHelp}
      onMouseMove={() => { onMouseLeave({ tooltip: 'help' }); }}
      color="lighter"
    >
      {
        showHelp
          ? <span className="implanf-close" />
          : <span className="implanf-help" />
      }
      {
        (showTooltip && tooltip === 'help')
        && <span className="map-tooltip-right">{showHelp ? 'Cerrar ayuda' : 'Mostrar ayuda'}</span>
      }
    </Button>
    {
      ((geo.features && geo.features.length > 0) && !isIOS && !(window.cordova))
      && (
        <Button
          onTap={download}
          onMouseMove={() => { onMouseLeave({ tooltip: 'download' }); }}
          color="lighter"
        >
          <span className="implanf-get_app" />
          {
            (showTooltip && tooltip === 'download')
            && <span className="map-tooltip-right">Descargar KML</span>
          }
        </Button>
      )
    }

    {
      hasFeatures
      && (
        <Button
          onTap={toggleDataLayer}
          onMouseMove={() => { onMouseLeave({ tooltip: 'datalayer' }); }}
          color="lighter"
        >
          <span className={showDataLayer ? 'implanf-visibility' : 'implanf-visibility_off'} />
          {
            (showTooltip && tooltip === 'datalayer')
            && <span className="map-tooltip-right">{showDataLayer ? 'Ocultar Datos' : 'Ver Datos'}</span>
          }
        </Button>
      )
    }
    <Button
      onTap={toggleMapType}
      onMouseMove={() => { onMouseLeave({ tooltip: 'satellite' }); }}
      color="lighter"
      className={`${mapType === 'satellite' ? 'active' : ''}`}
    >
      <span className="implanf-satellite" />
      {
        (showTooltip && tooltip === 'satellite')
        && <span className="map-tooltip-right">Vista satelital</span>
      }
    </Button>
    <Button
      onTap={reset}
      onMouseMove={() => { onMouseLeave({ tooltip: 'view' }); }}
      color="lighter"
    >
      <span className="implanf-public" />
      {
        (showTooltip && tooltip === 'view')
        && <span className="map-tooltip-right">Ver mapa completo</span>
      }
    </Button>
  </div>
);

ControlsLeft.defaultProps = {
  mapType: '',
  tooltip: '',
  showHelp: false,
  showTooltip: false,
  hasFeatures: false,
  showDataLayer: false,
  geo: {},
  toggleShowHelp: () => {},
  download: () => {},
  toggleDataLayer: () => {},
  toggleMapType: () => {},
  onMouseLeave: () => {},
  reset: () => {},
};

ControlsLeft.propTypes = {
  mapType: PropTypes.string,
  tooltip: PropTypes.string,
  showHelp: PropTypes.bool,
  showTooltip: PropTypes.bool,
  hasFeatures: PropTypes.bool,
  showDataLayer: PropTypes.bool,
  geo: PropTypes.objectOf(PropTypes.any),
  toggleShowHelp: PropTypes.func,
  download: PropTypes.func,
  toggleDataLayer: PropTypes.func,
  toggleMapType: PropTypes.func,
  onMouseLeave: PropTypes.func,
  reset: PropTypes.func,
};

export default ControlsLeft;

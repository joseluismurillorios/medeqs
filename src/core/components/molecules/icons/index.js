import React from 'react';
import PropTypes from 'prop-types';
import IconShock from './shock';
import IconSink from './sink';
import IconRoad from './road';
import IconDown from './down';
import IconDrown from './drown';
import IconFissure from './fissure';
import IconCollapse from './collapse';
import IconDrain from './drain';
import IconFlood from './flood';
import IconLandslide from './landslide';
import IconCracks from './cracks';
import IconElectric from './electric';
import IconLeak from './leak';
import IconRains from './rains';
import IconOther from './other';

const getIcon = (name) => {
  switch (name) {
    case 'Lluvia (Riesgos)': {
      return IconRains;
    }
    case 'Fugas': {
      return IconLeak;
    }
    case 'Socavones': {
      return IconFissure;
    }
    case 'Derrumbe de inmueble': {
      return IconCollapse;
    }
    case 'Inundacion de inmueble': {
      return IconFlood;
    }
    case 'Asentamiento grave de inmueble': {
      return IconSink;
    }
    case 'Arroyo crecido': {
      return IconDrown;
    }
    case 'Inundacion de vialidades': {
      return IconRoad;
    }
    case 'Deslave de talud o cerro': {
      return IconLandslide;
    }
    case 'Bardas colapsadas o en riesgo': {
      return IconCracks;
    }
    case 'Elemento vertical colapsado': {
      return IconDown;
    }
    case 'Interrupción de energía eléctrica': {
      return IconElectric;
    }
    case 'Riesgo de electrocutamiento': {
      return IconShock;
    }
    case 'Azolves/Taponamientos': {
      return IconDrain;
    }
    case 'Otro': {
      return IconOther;
    }
    default: {
      return IconRains;
    }
  }
};

const Icons = ({ name }) => {
  const Icon = getIcon(name);
  // console.log(name);
  return (
    <Icon />
  );
};

Icons.defaultProps = {
  name: '',
};

Icons.propTypes = {
  name: PropTypes.string,
};

export default Icons;

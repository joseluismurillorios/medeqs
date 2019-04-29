import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import {
  EQUIPMENT,
} from '../../../helpers/helper-constants';

import Card from '../card';

class Attrs extends Component {
  shouldComponentUpdate(nextProps) {
    const {
      info,
      showInfo,
    } = this.props;
    return (
      nextProps.info.id !== info.id
      || nextProps.showInfo !== showInfo
    );
  }

  render() {
    const {
      showInfo,
      info,
      zoomOut,
      zoomIn,
      toggle,
      user,
      deleteReport,
      isAdmin,
    } = this.props;
    const {
      address = '',
      position = {},
      category = 0,
      subcategory = [],
      name = '',
      contact = '',
    } = info;
    const { geopoint = {} } = position;
    const { _lat: latitude, _long: longitude } = geopoint;
    const canEdit = isAdmin || user.uid === info.user;
    return (
      <CSSTransition
        in={showInfo}
        timeout={200}
        classNames="fast"
        unmountOnExit
      >
        <Card.Container id="Attrs">
          <Card.Header
            text={name}
            toggle={toggle}
          />
          <Card.Body>
            <table className="esri-widget__table mb-10" summary="Lista de atributos y valores">
              <tbody>
                {
                  address
                  && (
                    <tr>
                      <th className="esri-feature__field-header">Dirección</th>
                      <td className="esri-feature__field-data">{address}</td>
                    </tr>
                  )
                }
                <tr>
                  <th className="esri-feature__field-header">Contacto</th>
                  <td className="esri-feature__field-data">
                    <a href={`mailto:${contact}`}>{contact}</a>
                  </td>
                </tr>
                <tr>
                  <th className="esri-feature__field-header">Necesita</th>
                  <td className="esri-feature__field-data">
                    <ul>
                      {
                        Object.keys(subcategory).map(sub => (
                          <li key={sub}>{EQUIPMENT[category].items[sub].es}</li>
                        ))
                      }
                    </ul>
                  </td>
                </tr>
                {
                  geopoint
                  && (
                    <tr>
                      <th className="esri-feature__field-header">Latitud</th>
                      <td className="esri-feature__field-data">
                        {latitude}
                      </td>
                    </tr>
                  )
                }
                {
                  geopoint
                  && (
                    <tr>
                      <th className="esri-feature__field-header">Longitud</th>
                      <td className="esri-feature__field-data">
                        {longitude}
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </Card.Body>
          <Card.Footer
            zoomOut={zoomOut}
            zoomIn={zoomIn}
            canEdit={canEdit}
            deleteReport={() => { deleteReport(info.user, info.id); }}
          />
        </Card.Container>
      </CSSTransition>
    );
  }
}


Attrs.defaultProps = {
  showInfo: false,
  info: {},
  user: {},
  zoomOut: () => {},
  zoomIn: () => {},
  toggle: () => {},
  isAdmin: false,
  deleteReport: () => { console.log('deleting...'); },
};

Attrs.propTypes = {
  showInfo: PropTypes.bool,
  info: PropTypes.objectOf(
    PropTypes.any,
  ),
  user: PropTypes.objectOf(
    PropTypes.any,
  ),
  zoomOut: PropTypes.func,
  zoomIn: PropTypes.func,
  toggle: PropTypes.func,
  isAdmin: PropTypes.bool,
  deleteReport: PropTypes.func,
};

export default Attrs;

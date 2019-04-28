/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import $ from '../../../helpers/helper-jquery';

import { setLoader } from '../../../redux/actions/common';
import {
  setAddress,
  setClinic,
  setLatLng,
  toggleCategory,
} from '../../../redux/actions/info';
import { onReportsChange } from '../../../redux/actions/reports/async';
import {
  storeClinic,
  deleteOpinion,
} from '../../../redux/actions/info/async';

import Scrollable from '../../atoms/scrollable';
import GMap from '../../organisms/gmap';
import Report from '../../organisms/report';

class Google extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      errors: {},
    };
    this.toggleReport = this.toggleReport.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
  }

  componentDidMount() {
    const { onReports } = this.props;
    onReports();
  }

  onSubmit() {
    const {
      info,
      onSave,
      common,
    } = this.props;
    const { user } = common;
    const errors = {};
    let error = false;
    let opened = true;
    Object.entries(info.clinic).forEach(([key, val]) => {
      if (key === 'name') {
        const short = info.clinic.name.length < 3;
        if (short) {
          error = true;
          errors[key] = true;
        }
      } else if (key === 'subcategory') {
        const short = val.length === 0;
        if (short) {
          error = true;
          errors[key] = true;
        }
      }
    });
    if (error) {
      toast.error('Es necesario agregar mas información');
    } else if (user && user.uid) {
      const newClinic = {
        ...info,
        contact: user.email,
      };
      console.log(newClinic);
      onSave(user.uid, newClinic, info.clinic);
      // console.log(user.uid, info, info.clinic);
      // mapLoading(true);
      opened = false;
    } else {
      $('#Login').modal('show');
    }
    this.setState({ errors, opened });
  }

  toggleReport() {
    const { opened } = this.state;
    this.setState({ opened: !opened });
  }

  zoomOut() {
    if (this.viewReference.zoomOut) {
      this.viewReference.zoomOut();
    }
  }

  zoomIn() {
    if (this.viewReference.zoomIn) {
      this.viewReference.zoomIn();
    }
  }

  render() {
    const {
      mapLoading,
      setCategory,
      info,
      common,
      setCoords,
      onUpdate,
      reports,
      clinicDelete,
      onChange,
    } = this.props;
    const { opened, errors } = this.state;
    const { user } = common;
    const { isAdmin } = common;
    return (
      <Scrollable
        id="Google"
        className="app__page"
        setRef={(el) => { this.container = el; }}
        disabled
      >
        <GMap
          onLoad={mapLoading}
          ref={(el) => { this.viewReference = el; }}
          toggle={this.toggleReport}
          address={info}
          geo={reports.geo}
          setCoords={setCoords}
          onUpdate={onUpdate}
          user={user || {}}
          clinicDelete={clinicDelete}
          isAdmin={isAdmin}
        />

        <Report
          onToggle={this.toggleReport}
          opened={opened}
          onChange={onChange}
          onCategory={setCategory}
          onSubmit={this.onSubmit}
          clinic={info.clinic}
          errors={errors}
        />
      </Scrollable>
    );
  }
}

Google.defaultProps = {
  setCoords: () => {},
  mapLoading: () => { console.log('webmap loaded successfully'); },
  onUpdate: () => {},
  onChange: () => {},
  onSave: () => {},
  onReports: () => {},
  clinicDelete: () => {},
  setCategory: () => {},
};

Google.propTypes = {
  common: PropTypes.objectOf(
    PropTypes.any,
  ).isRequired,
  info: PropTypes.objectOf(
    PropTypes.any,
  ).isRequired,
  reports: PropTypes.objectOf(
    PropTypes.any,
  ).isRequired,
  setCoords: PropTypes.func,
  mapLoading: PropTypes.func,
  onUpdate: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  onReports: PropTypes.func,
  clinicDelete: PropTypes.func,
  setCategory: PropTypes.func,
};

const mapStateToProps = state => ({
  common: state.common,
  info: state.info,
  reports: state.reports,
});

const mapDispatchToProps = {
  mapLoading: setLoader,
  onUpdate: setAddress,
  onChange: setClinic,
  onSave: storeClinic,
  setCoords: setLatLng,
  onReports: onReportsChange,
  clinicDelete: deleteOpinion,
  setCategory: toggleCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Google);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import tokml from 'tokml';

import { loadScript, circleMarker, styles } from '../../../helpers/helper-gmap';

// import { getOpinions } from '../../../redux/actions/common/async';

import {
  COLORS,
  TIJUANA,
} from '../../../helpers/helper-constants';

import { GOOGLE_API_KEY, TIJUANA_DELEGACIONES_KMZ } from '../../../../config';

import {
  isIOS,
  isMobile,
} from '../../../helpers/helper-util';

import Attrs from '../../molecules/attrs';

import ControlsLeft from '../controls/left';
import ControlsRight from '../controls/right';

class GMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: {},
      showProps: false,
      showHelp: false,
      zoom: isMobile ? 11 : 12,
      mapType: 'roadmap',
      tooltip: '',
      showDataLayer: true,
      hasFeatures: false,
    };
    this.getLocation = this.getLocation.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleFeatClick = this.handleFeatClick.bind(this);
    this.showLocation = this.showLocation.bind(this);
    this.showError = this.showError.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.initGMap = this.initGMap.bind(this);
    this.loading = this.loading.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.goTo = this.goTo.bind(this);
    this.reverseGeocode = this.reverseGeocode.bind(this);
    this.reset = this.reset.bind(this);
    this.createOpinion = this.createOpinion.bind(this);
    this.toggleShowHelp = this.toggleShowHelp.bind(this);
    this.hideShowHelp = this.hideShowHelp.bind(this);
    this.toggleMapType = this.toggleMapType.bind(this);
    this.renderFeatures = this.renderFeatures.bind(this);
    this.toggleDataLayer = this.toggleDataLayer.bind(this);
    this.download = this.download.bind(this);
    this.deleteReport = this.deleteReport.bind(this);
    this.hideAttrs = this.hideAttrs.bind(this);

    this.featureSelected = false;
    this.searching = false;

    this.isIOS = isIOS;
    this.pom = document.createElement('a');

    this.toastId = null;
    this.instructions = 'Seleccione una punto para ver sus necesidades o toque el mapa para agregar una clínica.';
  }

  componentDidMount() {
    this.loading(true);
    if (window.google && window.google.maps) {
      this.initGMap();
    } else {
      this.renderMap();
    }

    this.help.addEventListener('click', this.hideShowHelp);
    // this.menu.addEventListener('click', this.hideShowHelp);
  }

  componentDidUpdate(prevProps) {
    const { geo } = this.props;
    this.hasFeatures = !!(geo.features && geo.features.length > 0);
    if (this.hasFeatures && !!(this.gmap)) {
      this.geo = geo;
      const hasPrevFeatures = !!(prevProps.geo.features);
      if (hasPrevFeatures) {
        if (geo.features.length !== prevProps.geo.features.length) {
          console.log('new data');
          this.renderFeatures(geo);
        }
      } else {
        this.renderFeatures(geo);
      }
    }
  }

  componentWillUnmount() {
    this.help.removeEventListener('click', this.hideShowHelp);
    // this.menu.removeEventListener('click', this.hideShowHelp);
  }

  getLocation() {
    this.loading(true);
    navigator.geolocation.getCurrentPosition(this.showLocation, this.showError, { timeout: 30000 });
  }

  initGMap() {
    const { user } = this.props;
    // this.hasFeatures = !!(geo.features && geo.features.length > 0);
    this.gmap = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 32.476784, lng: -116.952631 },
      gestureHandling: 'greedy',
      zoomControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      zoom: isMobile ? 11 : 12,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      styles,
    });
    this.geocoder = new window.google.maps.Geocoder();

    this.kmzLayer = new window.google.maps.KmlLayer({
      url: TIJUANA_DELEGACIONES_KMZ,
      map: this.gmap,
      suppressInfoWindows: true,
    });

    this.gmap.data.setStyle({
      fillColor: 'green',
      strokeWeight: 20,
    });

    this.kmzLayer.addListener('click', this.handleMapClick);
    this.gmap.data.addListener('click', this.handleFeatClick);

    this.marker = new window.google.maps.Marker({
      map: this.gmap,
      position: { lat: 32.476784, lng: -116.952631 },
      icon: {
        ...circleMarker,
        scale: 0.55,
        fillOpacity: 0.8,
      },
    });
    this.marker.setVisible(false);

    this.markerHighlight = new window.google.maps.Marker({
      map: this.gmap,
      position: { lat: 32.476784, lng: -116.952631 },
      icon: {
        ...circleMarker,
        fillColor: '#00FFFF',
        scale: 0.55,
        fillOpacity: 0.6,
      },
    });
    this.markerHighlight.setVisible(false);

    this.markerHighlight.addListener('click', () => {
      this.setState({ showProps: true });
    });

    this.loading(false);
    this.gmap.data.setStyle((feature) => {
      const category = feature.getProperty('category');
      const uid = feature.getProperty('user');
      const strokeColor = (uid === user.uid) ? '#232323' : '#FFFFFF';
      return {
        icon: {
          ...circleMarker,
          anchor: new window.google.maps.Point(0, 0),
          fillColor: COLORS[category],
          strokeColor,
        },
      };
    });

    this.autocomplete = new window.google.maps.places.Autocomplete(this.searchWidget);
    this.autocomplete.bindTo('bounds', this.gmap);

    this.autocomplete.addListener('place_changed', () => {
      const { onUpdate, setCoords } = this.props;
      const place = this.autocomplete.getPlace();

      const { lat, lng } = place.geometry.location;

      const latitude = lat();
      const longitude = lng();
      const zm = this.gmap.getZoom();
      const zoom = zm < 15 ? 15 : zm;

      this.marker.setVisible(true);
      this.marker.setPosition(place.geometry.location);
      this.setState({ showProps: false });
      this.goTo({ value: { longitude, latitude } }, zoom);

      setCoords({ latitude, longitude });
      onUpdate(place.formatted_address);
    });

    window.google.maps.event.addListenerOnce(this.gmap, 'idle', () => {
      // do something only the first time the map is loaded
      this.toastId = toast.info(this.instructions, {
        position: toast.POSITION.TOP_LEFT,
        autoClose: false,
      });
      this.loading(false);
      const center = this.gmap.getCenter();
      const zoom = this.gmap.getZoom();
      this.setState({ center, zoom });
      if (this.geo) {
        this.renderFeatures(this.geo);
      }
      // this.search();
    });
    window.google.maps.event.addListenerOnce(this.gmap, 'zoom_changed', () => {
      // do something only the first time the map is loaded
      const center = this.gmap.getCenter();
      const zoom = this.gmap.getZoom();
      this.setState({ center, zoom });
    });
    this.setState({ tooltip: 'myloc' });
  }

  handleMapClick(evnt) {
    const { setCoords } = this.props;
    this.featureSelected = false;
    const { lat, lng } = evnt.latLng;

    const latitude = lat();
    const longitude = lng();
    const zm = this.gmap.getZoom();
    const inRange = (zm + 2) > 16 ? 1 : 2;
    const zoom = zm < 16 ? zm + inRange : zm;

    this.marker.setVisible(true);
    this.marker.setPosition(evnt.latLng);
    this.setState({ showProps: false });
    this.goTo({ value: { longitude, latitude } }, zoom);

    setCoords({ latitude, longitude });

    const latlng = { lat: latitude, lng: longitude };
    this.reverseGeocode(latlng);
  }

  handleFeatClick(evnt) {
    this.featureSelected = true;
    // this.kmzLayer.setMap(null);
    this.container.classList.add('transparent');

    const feat = evnt.feature;

    const properties = {};
    feat.forEachProperty((p, st) => {
      properties[st] = p;
    });
    // console.log('properties', properties);
    this.setState({ properties, showProps: true });

    this.markerHighlight.setVisible(true);
    this.markerHighlight.setPosition(evnt.latLng);
  }

  createOpinion() {
    this.setState({ showProps: false });
    const { toggle } = this.props;
    toggle();
  }

  toggleMapType() {
    const { mapType } = this.state;
    const newMapType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    this.setState({ mapType: newMapType });
    this.gmap.setMapTypeId(newMapType);
  }

  toggleShowHelp() {
    const { showHelp } = this.state;
    this.setState({ showHelp: !showHelp });
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.info(this.instructions, {
        position: toast.POSITION.TOP_LEFT,
        autoClose: false,
      });
    }
  }

  hideShowHelp() {
    this.setState({ showHelp: false });
  }

  hideAttrs() {
    const { showDataLayer } = this.state;
    this.markerHighlight.setVisible(false);
    this.setState({ showDataLayer: !showDataLayer, showProps: false });
  }

  showLocation(position) {
    const { setCoords } = this.props;
    const { longitude, latitude } = position.coords;
    this.marker.setVisible(true);
    this.marker.setPosition({ lat: latitude, lng: longitude });
    this.goTo({ value: { longitude, latitude } }, 17);

    setCoords({ latitude, longitude });

    const latlng = { lat: latitude, lng: longitude };
    this.reverseGeocode(latlng);
  }

  showError(err) {
    toast.error(err.message);
    this.loading(false);
  }

  reverseGeocode(location) {
    const { onUpdate } = this.props;
    this.geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const formattedAddress = results[0].formatted_address;
          console.log(formattedAddress);
          onUpdate(formattedAddress);
          this.searchWidget.value = formattedAddress;
          this.setState({ tooltip: 'add' });
        } else {
          toast.error('No results found');
        }
      } else {
        toast.error(`Geocoder failed due to: ${status}`);
      }
    });
  }

  loading(v) {
    const { onLoad } = this.props;
    setTimeout(() => {
      onLoad(v);
    }, 1000);
  }

  zoomOut() {
    this.gmap.setZoom(this.gmap.getZoom() - 1);
  }

  zoomIn() {
    this.gmap.setZoom(this.gmap.getZoom() + 1);
  }

  goTo({ value }, zoom = 12) {
    if (this.toastId) {
      toast.dismiss(this.toastId);
    }
    if (!value) {
      return;
    }
    // this.kmzLayer.setMap(null);
    this.container.classList.add('transparent');
    const { latitude, longitude, id = '' } = value;


    this.gmap.setZoom(zoom - 1);
    this.gmap.setCenter(new window.google.maps.LatLng(latitude, longitude));
    this.gmap.setZoom(zoom);

    if (id !== '') {
      this.searching = true;
    }

    this.setState({ showProps: false });
    this.loading(false);
  }

  download() {
    const { geo } = this.props;
    const stamp = (new Date()).getTime();
    const kml = tokml(geo, {
      name: 'name',
      description: 'description',
      documentName: 'Caminapp',
      documentDescription: `Proyectos Caminapp ${stamp}`,
      simplestyle: true,
    });
    const filename = `caminapp-${stamp}.kml`;
    const bb = new Blob([kml], { type: 'text/xml' });

    this.pom.setAttribute('href', window.URL.createObjectURL(bb));
    this.pom.setAttribute('download', filename);

    this.pom.dataset.downloadurl = ['text/xml', this.pom.download, this.pom.href].join(':');
    this.pom.draggable = true;
    this.pom.classList.add('dragout');

    this.pom.click();
  }

  toggleDataLayer() {
    const { showDataLayer } = this.state;
    this.gmap.data.setStyle((feature) => {
      const category = feature.getProperty('category');
      return {
        icon: {
          ...circleMarker,
          anchor: new window.google.maps.Point(0, 0),
          fillColor: COLORS[category],
        },
        visible: !showDataLayer,
      };
    });
    this.hideAttrs();
  }

  deleteReport(uid, id) {
    const { clinicDelete } = this.props;
    clinicDelete(uid, id).then((el) => {
      if (el) {
        this.markerHighlight.setVisible(false);
        this.setState({ showProps: false });
      }
    });
  }

  reset() {
    const { zoom, center } = this.state;
    this.gmap.setCenter(center || new window.google.maps.LatLng(TIJUANA[1], TIJUANA[0]));
    this.gmap.setZoom(zoom);
    // this.kmzLayer.setMap(this.gmap);
    this.container.classList.remove('transparent');
    this.setState({ showProps: false });
  }

  renderFeatures(geo) {
    this.hasFeatures = !!(geo.features && geo.features.length > 0);
    // console.log('renderFeatures', geo, this.hasFeatures);
    this.gmap.data.forEach((feature) => {
      this.gmap.data.remove(feature);
    });
    if (this.hasFeatures) {
      this.gmap.data.addGeoJson(geo);
      this.setState({ hasFeatures: this.hasFeatures });
    }
  }

  renderMap() {
    window.initGMap = this.initGMap;
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&callback=initGMap&libraries=places`);
  }

  render() {
    const {
      mapType,
      properties,
      showProps,
      showHelp,
      tooltip,
      hasFeatures,
      showDataLayer,
    } = this.state;
    const {
      geo,
      address,
      user,
      isAdmin,
    } = this.props;
    const hasGeo = (geo && !this.isIOS && !(window.cordova));
    const hasAddress = (address.latitude !== 0);
    const hasGeolocation = !!(navigator.geolocation);
    const showTooltip = !this.isMobile && !showHelp;
    const datalayerVisible = showDataLayer ? 'Ocultar' : 'Ver';
    const mapTypeVisible = mapType === 'satellite' ? 'Caminos' : 'Satélite';
    return (
      <div className="fill full">
        <div ref={(el) => { this.container = el; }} id="map" className="fill full" />
        <div className="map-menu fixed-right-top bg-light">
          <label htmlFor="SearchWidget">
            <input id="SearchWidget" ref={(el) => { this.searchWidget = el; }} type="text" className="map-search" />
            <span className="btn btn-lighter implanf-search" />
          </label>
        </div>

        <div ref={(el) => { this.help = el; }} className={`map-help fs-menu ${showHelp ? 'open' : ''}`}>
          <div className="fixed-left-bottom">
            <span>{isMobile ? 'Ayuda' : 'Mostrar/Cerrar ayuda'}</span>
            {
              hasGeo
              && <span>{isMobile ? 'KML' : 'Descargar KML'}</span>
            }
            {
              hasFeatures
              && <span>{isMobile ? datalayerVisible : 'Ver/Ocultar todo'}</span>
            }
            <span>{isMobile ? 'Vista' : mapTypeVisible}</span>
            <span>{isMobile ? 'Inicio' : 'Ver mapa completo'}</span>
          </div>
          <div className="fixed-right-bottom">
            {
              hasAddress
              && <span>{isMobile ? 'Agregar' : 'Agregar clínica'}</span>
            }
            <span>{isMobile ? 'Alejar' : 'Alejar mapa'}</span>
            <span>{isMobile ? 'Acercar' : 'Acercar mapa'}</span>
            {
              hasGeolocation
              && <span>{isMobile ? 'Ubícame' : 'Ir a mi ubicación'}</span>
            }
          </div>
        </div>

        <ControlsLeft
          showHelp={showHelp}
          showTooltip={showTooltip}
          geo={geo}
          tooltip={tooltip}
          hasFeatures={hasFeatures}
          showDataLayer={showDataLayer}
          mapType={mapType}
          toggleShowHelp={this.toggleShowHelp}
          download={this.download}
          toggleDataLayer={this.toggleDataLayer}
          toggleMapType={this.toggleMapType}
          onMouseLeave={(tip) => {
            this.setState({ tooltip: tip.tooltip });
          }}
          reset={this.reset}
        />

        <ControlsRight
          tooltip={tooltip}
          showTooltip={showTooltip}
          hasAddress={hasAddress}
          hasGeolocation={hasGeolocation}
          createOpinion={this.createOpinion}
          getLocation={this.getLocation}
          zoomOut={this.zoomOut}
          zoomIn={this.zoomIn}
          onMouseLeave={(tip) => {
            this.setState({ tooltip: tip.tooltip });
          }}
        />

        <Attrs
          showInfo={showProps}
          info={properties}
          zoomOut={this.zoomOut}
          zoomIn={this.zoomIn}
          toggle={this.hideAttrs}
          user={user}
          isAdmin={isAdmin}
          deleteReport={this.deleteReport}
        />
      </div>
    );
  }
}

GMap.defaultProps = {
  onLoad: () => { console.log('webmap loading successfully'); },
  toggle: () => {},
  setCoords: () => {},
  onUpdate: () => {},
  clinicDelete: () => {},
  address: {},
  geo: {},
  user: {},
  isAdmin: false,
};

GMap.propTypes = {
  onLoad: PropTypes.func,
  toggle: PropTypes.func,
  setCoords: PropTypes.func,
  onUpdate: PropTypes.func,
  clinicDelete: PropTypes.func,
  address: PropTypes.objectOf(PropTypes.any),
  geo: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(
    PropTypes.any,
  ),
  isAdmin: PropTypes.bool,
};

export default GMap;

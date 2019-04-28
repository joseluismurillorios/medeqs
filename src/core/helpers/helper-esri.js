import { ARCGIS_REVERSE_GEOCODE } from '../../config';
import { COLORS, TIJUANA } from './helper-constants';
import { isMobile } from './helper-util';

export const createLocator = Locator => (
  new Locator({
    url: ARCGIS_REVERSE_GEOCODE,
  })
);

export const createMap = (Map, layer) => (
  new Map({
    // basemap: 'osm',
    basemap: 'osm',
    layers: [layer],
  })
);

export const mapOptions = {
  container: 'viewDiv', // Reference to the scene div created in step 5
  zoom: isMobile ? 9 : 11, // Sets zoom level based on level of detail (LOD)
  center: TIJUANA, // Sets center point of view using longitude,latitude
  popup: {
    dockEnabled: true,
    dockOptions: {
      // Disables the dock button from the popup
      buttonEnabled: false,
      // Ignore the default sizes that trigger responsive docking
      breakpoint: false,
      position: 'bottom-right',
    },
  },
};

export const createMapView = (MapView, map) => (
  new MapView({
    map, // Reference to the map object created before the scene
    ...mapOptions,
  })
);

export const createPoint = (Point, lon, lat) => (
  new Point({
    longitude: lon,
    latitude: lat,
  })
);

export const createPopup = (address) => {
  // If an address is successfully found, show it in the popup's content
  const popupDiv = document.createElement('div');
  // Create the text
  const innerDiv = document.createElement('div');
  innerDiv.classList.add('esri-popup__header-inner', 'mb-20');
  innerDiv.innerHTML = address;
  popupDiv.appendChild(innerDiv);
  return popupDiv;
};

export const textSymbol = {
  type: 'text', // autocasts as new TextSymbol()
  color: '#0896a4',
  text: '\ue61d', // esri-icon-map-pin
  font: { // autocasts as new Font()
    size: 36,
    family: 'calcite-web-icons',
  },
};

export const circleSymbol = {
  type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
  style: 'circle',
  size: 15,
  color: [0, 0, 0, 0.8],
  outline: {
    width: 1,
    color: [255, 255, 255, 0.8],
    style: 'solid',
  },
};

export const zoomOutAction = {
  // This text is displayed as a tooltip
  title: 'Alejar a',
  // The ID by which to reference the action in the event handler
  id: 'zoom-out',
  // Sets the icon font used to style the action button
  className: 'esri-icon-zoom-out-magnifying-glass',
};


/** ************************************************
 * Define the specification for each field to create
 * in the layer
 ************************************************* */

export const fields = [
  {
    name: 'id',
    alias: 'id',
    type: 'oid',
  }, {
    name: 'uid',
    alias: 'uid',
    type: 'string',
  }, {
    name: 'user',
    alias: 'user',
    type: 'string',
  }, {
    name: 'color',
    alias: 'color',
    type: 'double',
  }, {
    name: 'longitude',
    alias: 'longitude',
    type: 'double',
  }, {
    name: 'latitude',
    alias: 'latitude',
    type: 'double',
  }, {
    name: 'category',
    alias: 'category',
    type: 'double',
  }, {
    name: 'subcategory',
    alias: 'subcategory',
    type: 'double',
  }, {
    name: 'type',
    alias: 'type',
    type: 'double',
  }, {
    name: 'address',
    alias: 'address',
    type: 'string',
  }, {
    name: 'position',
    alias: 'position',
    type: 'string',
  }];


// Set up popup template for the layer
export const pTemplate = {
  title: '{type}',
  content: [{
    type: 'fields',
    fieldInfos: [{
      fieldName: 'color',
      label: 'color',
      visible: false,
    }, {
      fieldName: 'uid',
      label: 'uid',
      visible: false,
    }, {
      fieldName: 'user',
      label: 'user',
      visible: false,
    }, {
      fieldName: 'category',
      label: 'Categoría',
      visible: true,
    }, {
      fieldName: 'subcategory',
      label: 'Subategoría',
      visible: true,
    }, {
      fieldName: 'type',
      label: 'Tipo',
      visible: true,
    }, {
      fieldName: 'address',
      label: 'Dirección',
      visible: true,
    }, {
      fieldName: 'position',
      label: 'Posición',
      visible: false,
    }, {
      fieldName: 'longitude',
      label: 'Lon',
      visible: true,
    }, {
      fieldName: 'latitude',
      label: 'Lat',
      visible: true,
    }],
  }],
};

/** ************************************************
 * Define the renderer for symbolizing earthquakes
 ************************************************* */
const colorVisVar = {
  type: 'color',
  field: 'color',
  // normalizationField: 'SQ_KM',
  stops: [
    { value: 0, color: COLORS[0] },
    { value: 1, color: COLORS[1] },
    { value: 2, color: COLORS[2] },
  ],
  legendOptions: {
    title: 'Some legend title',
  },
};

export const quakesRenderer = {
  type: 'simple', // autocasts as new SimpleRenderer()
  symbol: circleSymbol,
  visualVariables: colorVisVar,
};

/** ************************************************
       * Create graphics with returned geojson data
       ************************************************* */

export const createGraphics = (geoJson, Point) => {
  // raw GeoJSON data
  // console.log(geoJson);

  if (Object.keys(geoJson).length < 1) {
    return [];
  }

  // Create an array of Graphics from each GeoJSON feature
  return geoJson.features.map(feature => ({
    geometry: new Point({
      x: feature.geometry.coordinates[0],
      y: feature.geometry.coordinates[1],
    }),
    // select only the attributes you care about
    attributes: {
      uid: feature.properties.id,
      address: feature.properties.address,
      longitude: feature.properties.position.geopoint.longitude,
      latitude: feature.properties.position.geopoint.latitude,
      category: feature.properties.category,
      subcategory: feature.properties.subcategory,
      type: feature.properties.type,
      user: feature.properties.user,
      color: +feature.properties.category,
      position: JSON.stringify(feature.properties.position),
    },
  }));
};

/** ************************************************
 * Create a FeatureLayer with the array of graphics
 ************************************************* */

export const createLayer = (graphics, map, FeatureLayer) => {
  const layer = new FeatureLayer({
    source: graphics, // autocast as an array of esri/Graphic
    // create an instance of esri/layers/support/Field for each field object
    fields, // This is required when creating a layer from Graphics
    objectIdField: 'id', // This must be defined when creating a layer from Graphics
    renderer: quakesRenderer, // set the visualization on the layer
    popupTemplate: pTemplate,
  });

  map.add(layer);
  return layer;
};

/** ****************************************************************
 * Add layer to layerInfos in the legend
 ***************************************************************** */
let legend;

export const createLegend = (layer, view, Legend) => {
  // if the legend already exists, then update it with the new layer
  if (legend) {
    legend.layerInfos = [{
      layer,
      title: 'Magnitude',
    }];
  } else {
    legend = new Legend({
      view,
      layerInfos: [
        {
          layer,
          title: 'Earthquake',
        }],
    }, 'infoDiv');
  }
};

export const loadScript = (url) => {
  const index = window.document.getElementsByTagName('script')[0];
  const script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
};

export const circleMarker = {
  path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
  fillColor: '#000000',
  fillOpacity: 0.8,
  strokeWeight: 1,
  strokeOpacity: 0.6,
  strokeColor: '#FFFFFF',
  scale: 0.5,
};

export const styles = [
  {
    featureType: 'poi',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
];

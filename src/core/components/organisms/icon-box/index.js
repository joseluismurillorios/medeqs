import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import assets from '../../../assets';

import dict from '../../../dict';
import { isMobile } from '../../../helpers/helper-util';

class IconBox extends Component {
  constructor(props) {
    super(props);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    setTimeout(() => {
      this.resize();
    }, 700);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    if (!isMobile) {
      const bx1 = this.box1.getBoundingClientRect();
      const bx2 = this.box2.getBoundingClientRect();
      const bx3 = this.box3.getBoundingClientRect();
      const bx4 = this.box4.getBoundingClientRect();
      const max = Math.max(bx1.height, bx2.height, bx3.height, bx4.height);
      this.box1.style.height = `${max}px`;
      this.box2.style.height = `${max}px`;
      this.box3.style.height = `${max}px`;
      this.box4.style.height = `${max}px`;
    }
  }

  render() {
    return (
      <div className="row equal-height-container">
        <div ref={(el) => { this.box1 = el; }} className="col-md-3 service-item-wrap equal-height">
          <h2 className="mt-0">{dict.es['objectives.title']}</h2>
          <p>{dict.es['objectives.main']}</p>
        </div>
        <div ref={(el) => { this.box2 = el; }} className="col-md-3 service-item-wrap equal-height">
          <div className="service-item-box text-center">
            {/* <IconBrainstorm /> */}
            <img src={assets.IconA} alt="Identificar" />
            <h3>Reconocer</h3>
            <p className="mb-0 hidden-text">{dict.es['objectives.one']}</p>
          </div>
        </div>
        <div ref={(el) => { this.box3 = el; }} className="col-md-3 service-item-wrap equal-height">
          <div className="service-item-box text-center">
            {/* <IconDesign /> */}
            <img src={assets.IconB} alt="Identificar" />
            <h3>Contribuir</h3>
            <p className="mb-0 hidden-text">{dict.es['objectives.two']}</p>
          </div>
        </div>
        <div ref={(el) => { this.box4 = el; }} className="col-md-3 service-item-wrap equal-height">
          <div className="service-item-box text-center">
            {/* <IconArch /> */}
            <img src={assets.IconC} alt="Identificar" />
            <h3>Obtener</h3>
            <p className="mb-0 hidden-text">{dict.es['objectives.three']}</p>
          </div>
        </div>
      </div>
    );
  }
}

IconBox.defaultProps = {
};

IconBox.propTypes = {
};

export default IconBox;

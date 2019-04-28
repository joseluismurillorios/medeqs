/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable jsx-a11y/anchor-has-content */

import React from 'react';
import PropTypes from 'prop-types';

import Textarea from '../../atoms/textarea';
import Input from '../../atoms/input';
import Button from '../../atoms/button';
import Scrollable from '../../atoms/scrollable';
// import Icons from '../../molecules/icons';

import { EQUIPMENT } from '../../../helpers/helper-constants';

import { ICONS } from '../../../assets';

const Report = ({
  onCategory,
  onChange,
  onToggle,
  onSubmit,
  opened,
  clinic,
  errors,
  lang,
}) => {
  // const categories = Object.keys(EQUIPMENT).map((el) => {
  //   const cat = {};
  //   cat.id = el;
  //   cat.name = EQUIPMENT[el][lang];
  //   return cat;
  // });
  let subcategories = false;
  if (clinic.category !== '') {
    const sub = EQUIPMENT[clinic.category].items;
    subcategories = Object.keys(sub).map((el) => {
      const cat = {};
      cat.id = el;
      cat.name = sub[el][lang];
      return cat;
    });
  }


  // let types = false;
  const hasSub = !!(Object.keys(clinic.subcategory).length);
  return (
    <div className={`fs-menu bg-lighter ${opened ? 'open' : ''}`} id="overlay">
      <Scrollable id="ScrollReport" className="overlay-menu row">
        <div className="col-sm-12 col-md-6 col-md-offset-3 mt-30 mb-10">
          <div className="list-item" style={{ animationDelay: '0.1s' }}>
            <div className="title uppercase">Detalles</div>
            <sup className={errors.message ? 'error-text' : ''}>
              Tu información es muy importante para nosotros
            </sup>
            <Input
              id="name"
              placeholder="Nombre*"
              className={`mb-0 ${errors.name ? 'has-error' : ''}`}
              onChange={onChange}
              value={clinic.name || ''}
            />
          </div>
        </div>
        {/* <div className="col-sm-12 col-md-6 col-md-offset-3 mb-10 mt-30">
          <div className="title uppercase">Categoría</div>
          <sup
            className={errors.category ? 'error-text' : ''}
          >
            {errors.category ? 'Necesitas seleccionar una categoría' : 'Seleccionar'}
          </sup>
          <div className="list-item" style={{ animationDelay: '0.1s' }}>
            {
              categories.map(cat => (
                <Button
                  className="icon-box"
                  color="icon"
                  name="category"
                  onTap={onChange}
                  value={cat.id}
                  key={cat.id}
                >
                  <div
                    className={`service-item-box category ${clinic.category === cat.id ? 'selected' : ''}`}
                  >
                    <img className="icon" src={assets[cat.id]} alt="" />
                    <span>{cat.name}</span>
                  </div>
                </Button>
              ))
            }
          </div>
        </div> */}
        {
          subcategories
          && (
            <div className="col-sm-12 col-md-8 col-md-offset-2 mb-10">
              <div className="title uppercase">¿Que necesita?</div>
              <sup
                className={errors.subcategory ? 'error-text' : ''}
              >
                {errors.subcategory ? 'Necesitas seleccionar una subcategoría' : 'Seleccione 1 o más'}
              </sup>
              <div className="list-item" style={{ animationDelay: '0.1s' }}>
                {
                  subcategories.map(sub => (
                    <Button
                      className="icon-box "
                      color="icon"
                      name="subcategory"
                      onTap={onCategory}
                      value={sub.id}
                      key={sub.id}
                    >
                      <div className={`service-item-box subcategory ${clinic.subcategory[sub.id] ? 'selected' : ''}`}>
                        <img className="icon" src={ICONS[sub.id]} alt="" />
                        <span>{sub.name}</span>
                      </div>
                    </Button>
                  ))
                }
              </div>
            </div>
          )
        }
        {
          (clinic.name.length > 3 && clinic.name.length < 25 && hasSub)
          && (
            <div className="col-sm-12 col-md-6 col-md-offset-3 mb-10">
              <div className="list-item" style={{ animationDelay: '0.1s' }}>
                <div className="title uppercase">Detalles</div>
                <sup className={errors.message ? 'error-text' : ''}>
                  Tu información es muy importante para nosotros
                </sup>
                <Textarea
                  id="message"
                  placeholder="Mensaje*"
                  className={`mb-0 ${errors.message ? 'has-error' : ''}`}
                  rows="3"
                  onChange={onChange}
                  value={clinic.message}
                />
                <div className="description_tips mt-20">
                  <div className="do">
                    <p>
                      <span className="implanf-checkmark mr-10" />
                      Agregue datos de la clínica
                    </p>
                    <p>
                      <span className="implanf-checkmark mr-10" />
                      Use ubicaciones exactas
                    </p>
                  </div>
                  <div className="dont">
                    <p>
                      <span className="implanf-close mr-10" />
                      No identifique a otras personas
                    </p>
                    <p>
                      <span className="implanf-close mr-10" />
                      No incluya datos privados de ningún tipo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <div className="col-sm-12 col-md-6 col-md-offset-3 mb-50">
          <div className="list-item" style={{ animationDelay: '0.3s' }}>
            <div>
              <Button
                onTap={onToggle}
                color="dark"
                className="mt-10 mr-10"
                size="sm"
              >
                Cambiar
                <span className="implanf-pin ml-10" />
              </Button>
              <Button
                onTap={onSubmit}
                color="primary"
                className="mt-10"
                size="sm"
              >
                Enviar
                <span className="implanf-navigation-2 ml-10" />
              </Button>
            </div>
          </div>
        </div>
      </Scrollable>
    </div>
  );
};

Report.defaultProps = {
  errors: {},
  onChange: () => { },
  onToggle: () => { },
  onSubmit: () => { },
  onCategory: () => { },
  opened: false,
  lang: 'es',
};

Report.propTypes = {
  clinic: PropTypes.objectOf(
    PropTypes.any,
  ).isRequired,
  errors: PropTypes.objectOf(
    PropTypes.any,
  ),
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
  onSubmit: PropTypes.func,
  onCategory: PropTypes.func,
  opened: PropTypes.bool,
  lang: PropTypes.string,
};


export default Report;

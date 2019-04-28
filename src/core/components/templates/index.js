import Home from './home';
import Google from './google';

export const ROUTES = [
  {
    url: '/inicio',
    component: Home,
    name: 'Inicio',
    items: [
    ],
  },
  {
    url: '/explorar',
    component: Google,
    name: 'Explorar',
    items: [
    ],
  },
];

export default ROUTES;

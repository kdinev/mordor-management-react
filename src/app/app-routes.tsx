import Layout from './layout/layout';
import Home from './home/home';
import Military from './military/military';
import Command from './command/command';
import Provisions from './provisions/provisions';
import Armory from './armory/armory';
import Intelligence from './intelligence/intelligence';
import Reports from './reports/reports';

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home />, text: 'Home' },
      { path: '/military', element: <Military />, text: 'Military Command' },
      { path: '/command', element: <Command />, text: 'Order of Command' },
      { path: '/provisions', element: <Provisions />, text: 'Provisions' },
      { path: '/armory', element: <Armory />, text: 'Armories & Forges' },
      { path: '/intelligence', element: <Intelligence />, text: 'Eye of Sauron' },
      { path: '/reports', element: <Reports />, text: 'Commander Reports' },
    ],
  },
];

// import { toast } from 'react-toastify';
import socketIO from '../../../helpers/helper-socket';
import {
  setReports,
} from './index';

export const onReportsChange = () => (
  dispatch => socketIO.on('clinics', (msg) => {
    // console.log('clinics', msg.metric);
    dispatch(setReports(msg.metric));
  })
);

export default onReportsChange;

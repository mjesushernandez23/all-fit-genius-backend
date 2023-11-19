import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const dateCurrent = () => dayjs.utc().format('YYYY-MM-DD HH:mm:ss');

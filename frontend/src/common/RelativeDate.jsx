import { useLocaleState } from 'react-admin';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isYesterday from 'dayjs/plugin/isYesterday';
import isToday from 'dayjs/plugin/isToday';
import 'dayjs/locale/fr';

dayjs.extend(localizedFormat);
dayjs.extend(isYesterday);
dayjs.extend(isToday);

const RelativeDate = ({ date }) => {
  const [locale] = useLocaleState();
  
  if (!date) {
    console.warn('No date provided to RelativeDate component');
    return null;
  }

  const formattedDate = dayjs(date).locale(locale);

  let dateStr = '';
  if (formattedDate.isToday()) {
    dateStr = formattedDate.format('HH:mm');
  } else if (formattedDate.isYesterday()) {
    dateStr = `Hier ${formattedDate.format('HH:mm')}`;
  } else {
    dateStr = formattedDate.format('DD/MM/YYYY HH:mm');
  }

  return dateStr;
};

export default RelativeDate;

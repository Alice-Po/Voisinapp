import { useLocaleState } from 'react-admin';
import dayjs from 'dayjs';
import { Typography } from '@mui/material';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isYesterday from 'dayjs/plugin/isYesterday';
import isToday from 'dayjs/plugin/isToday';
import 'dayjs/locale/fr';

dayjs.extend(localizedFormat);
dayjs.extend(isYesterday);
dayjs.extend(isToday);

const RelativeDate = ({ date, ...rest }) => {
  const [locale] = useLocaleState();
  console.log('Date received in RelativeDate:', date);
  
  if (!date) {
    console.warn('No date provided to RelativeDate component');
    return null;
  }

  const formattedDate = dayjs(date).locale(locale);
  console.log('Formatted date:', formattedDate.format());

  let dateStr = '';
  if (formattedDate.isToday()) {
    dateStr = formattedDate.format('HH:mm');
  } else if (formattedDate.isYesterday()) {
    dateStr = `Hier ${formattedDate.format('HH:mm')}`;
  } else {
    dateStr = formattedDate.format('DD/MM/YYYY HH:mm');
  }

  return (
    <Typography {...rest}>
      {dateStr}
    </Typography>
  );
};

export default RelativeDate;

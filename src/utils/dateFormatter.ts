import dayjs from 'dayjs';

// Arabic month names
const arabicMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

// Arabic month names to numbers mapping
const arabicMonthToNumber: { [key: string]: number } = {
  'يناير': 0, 'فبراير': 1, 'مارس': 2, 'أبريل': 3,
  'مايو': 4, 'يونيو': 5, 'يوليو': 6, 'أغسطس': 7,
  'سبتمبر': 8, 'أكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11
};

// Convert ISO date to Arabic format using dayjs
export const formatISOToArabicDate = (isoDate: string): string => {
  const date = dayjs(isoDate);
  const day = date.date();
  const month = arabicMonths[date.month()];
  const year = date.year();
  return `${day} ${month} ${year}`;
};

// Convert Arabic date to ISO format using dayjs
export const parseArabicDateToISO = (arabicDate: string): string => {
  const parts = arabicDate.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = arabicMonthToNumber[parts[1]];
    const year = parseInt(parts[2]);
    
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const date = dayjs().year(year).month(month).date(day);
      return date.format('YYYY-MM-DD'); // Returns YYYY-MM-DD format
    }
  }
  
  // Fallback to current date if parsing fails
  return dayjs().format('YYYY-MM-DD');
};

// Parse focus areas from JSON string to text
export const parseFocusAreasToText = (focusAreas: string | null): string => {
  if (!focusAreas) return '';
  
  try {
    const parsed = JSON.parse(focusAreas);
    if (Array.isArray(parsed)) {
      return parsed.join('\n');
    }
    return '';
  } catch {
    return '';
  }
};

// Convert focus areas text to JSON string
export const formatFocusAreasToJSON = (focusAreasText: string): string => {
  if (!focusAreasText.trim()) return '';
  
  const areas = focusAreasText
    .split('\n')
    .map(area => area.trim())
    .filter(area => area.length > 0);
  
  return JSON.stringify(areas);
};

/**
 * Sort activities by date, using dc:created first, then published date as fallback
 * @param {Object} a1 First activity
 * @param {Object} a2 Second activity
 * @returns {number} Comparison result (-1, 0, 1)
 */
export const sortActivitiesByDate = (a1, a2) => {
  const date1 = new Date(a1.object?.['dc:created'] || a1['dc:created'] || a1.object?.published || a1.published);
  const date2 = new Date(a2.object?.['dc:created'] || a2['dc:created'] || a2.object?.published || a2.published);
  return date2 - date1;
};

/**
 *
 * @param {Date} date
 * @returns
 */
const formatDate = (date) =>
  date.toLocaleDateString('en-US', {
    dateStyle: 'medium',
  })

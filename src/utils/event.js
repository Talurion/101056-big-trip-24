import dayjs from 'dayjs';

const humanizeDueDate = (dueDate, dateFormat) => dueDate ? dayjs(dueDate).format(dateFormat) : '';

const isEventFuture = (dateFrom) => dateFrom && dayjs().isBefore(dateFrom, 'D');

const isEventPresent = (dateFrom, dateTo) => {
  const now = dayjs();
  return dateFrom && dateTo &&
         (now.isAfter(dateFrom, 'D') || now.isSame(dateFrom, 'D')) &&
         (now.isBefore(dateTo, 'D') || now.isSame(dateTo, 'D'));
};

const isEventPast = (dateTo) => dateTo && dayjs().isAfter(dateTo, 'D');

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const sortEventsPrice = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

const sortEventsTime = (eventA, eventB) => {
  const dateFromA = dayjs(eventA.dateFrom);
  const dateToA = dayjs(eventA.dateTo);
  const dateFromB = dayjs(eventB.dateFrom);
  const dateToB = dayjs(eventB.dateTo);

  const durationA = dateToA.diff(dateFromA);
  const durationB = dateToB.diff(dateFromB);

  return durationB - durationA;
};

const sortEventsDate = (eventA, eventB) => new Date(eventA.dateFrom) - new Date(eventB.dateFrom);

export {
  humanizeDueDate,
  isEventFuture,
  isEventPresent,
  isEventPast,
  isDatesEqual,
  sortEventsPrice,
  sortEventsTime,
  sortEventsDate
};

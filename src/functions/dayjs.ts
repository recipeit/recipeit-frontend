import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/pl'

dayjs.extend(calendar)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(updateLocale)

dayjs.locale('pl')
dayjs.updateLocale('pl', {
  calendar: {
    sameDay: '[dzisiaj]', // The same day ( Today at 2:30 AM )
    nextDay: '[jutro]', // The next day ( Tomorrow at 2:30 AM )
    nextWeek: 'dddd, D MMM', // The next week ( Sunday at 2:30 AM )
    lastDay: '[wczoraj]', // The day before ( Yesterday at 2:30 AM )
    lastWeek: 'dddd, D MMM', // Last week ( Last Monday at 2:30 AM )
    sameElse: 'D MMMM' // Everything else ( 17/10/2011 )
  }
})

export default dayjs

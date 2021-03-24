import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import duration from 'dayjs/plugin/duration'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/pl'

dayjs.extend(calendar)
dayjs.extend(duration)
dayjs.extend(updateLocale)

dayjs.locale('pl')
dayjs.updateLocale('pl', {
  calendar: {
    sameDay: '[dzisiaj]', // The same day ( Today at 2:30 AM )
    nextDay: '[jutro]', // The next day ( Tomorrow at 2:30 AM )
    nextWeek: 'dddd, D MMM', // The next week ( Sunday at 2:30 AM )
    // lastDay: '[Wczoraj]', // The day before ( Yesterday at 2:30 AM )
    // lastWeek: '[Poprzedni] dddd', // Last week ( Last Monday at 2:30 AM )
    sameElse: 'DD MMMM' // Everything else ( 17/10/2011 )
  }
})

export default dayjs

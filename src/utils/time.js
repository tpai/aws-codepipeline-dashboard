import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)

export const formatTimeAgo = (time) => new TimeAgo('en-US').format(time)

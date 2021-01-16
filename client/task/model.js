import { formatDistanceToNowStrict, isPast } from 'date-fns'
import { sortBy, defaultTo } from 'lodash'

const getIcon = (task) => {
  if (task.completed) {
    return 'check-square-o'
  } else if (task.started) {
    return 'spinner fa-spin fa-pulse'
  }
  return 'square-o'
}

const getTime = (task) => {
  if (task.completed) {
    return `done ${formatDistanceToNowStrict(new Date(task.completed))} ago`
  } else if (task.started) {
    return `started ${formatDistanceToNowStrict(new Date(task.started))} ago`
  } else if (task.due) {
    const delta = formatDistanceToNowStrict(new Date(task.due))
    return isPast(new Date(task.due)) ? `${delta} overdue` : `due in ${delta}`
  }
  return ''
}

const getShortMeasures = ({ task, activity }) => {
  const out = []
  activity?.measurements?.forEach((key) => {
    out.push(`${key[0]}${defaultTo(task[key], '?')}`)
  })
  return out.join(' ')
}

const sortByDate = (tasks) =>
  sortBy(tasks, (t) => {
    // using the fact that timestamps are positive integers in the same order of magnitude
    // to sort with a priortiy that makes all due completed tasks larger than all due tasks
    if (t.completed) {
      return new Date(t.completed).valueOf()
    }
    if (t.started) {
      return -new Date(t.started).valueOf()
    }
    return -new Date(t.due).valueOf() / 1000
  })

export default {
  getIcon,
  getTime,
  getShortMeasures,
  sortByDate,
}

import React from 'react'
import { formatDistanceToNow } from 'date-fns'

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
    return `done ${formatDistanceToNow(new Date(task.completed))} ago`
  } else if (task.started) {
    return `started ${formatDistanceToNow(new Date(task.started))} ago`
  } else if (task.due) {
    return (
      <span title={new Date(task.due)}>{`due in ${formatDistanceToNow(
        new Date(task.due),
      )}`}</span>
    )
  }
  return ''
}

const getShortMeasures = ({ task, activity }) => {
  const out = []
  activity?.measurements?.forEach((key) => {
    out.push(`${key[0]}x${task[key] || 0}`)
  })
  return out.join(' ')
}

export default {
  getIcon,
  getTime,
  getShortMeasures,
}

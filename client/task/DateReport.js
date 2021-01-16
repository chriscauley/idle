import React from 'react'
import { format, startOfDay, endOfDay, isWithinInterval, addDays, isBefore } from 'date-fns'

import api from '../task/api'
import TaskList from '../task/TaskList'

const getDate = (date_str) => {
  let title = 'Today'
  let date = new Date()
  if (date_str === 'future') {
    title = 'Future'
  } else if (date_str !== 'today') {
    title = format(date, 'yyyy-MM-dd')
    date = new Date(date_str)
  }
  const start = startOfDay(date)
  const end = date_str === 'future' ? addDays(date, 1e6) : endOfDay(date)
  return { start, end, title, date }
}

export default function DateReport(props) {
  const { title, _date, start, end } = getDate(props.match.params.date_str)
  const { tasks: all_tasks } = api.task.use()
  if (!all_tasks) {
    return null
  }
  const _now = new Date().valueOf()
  const tasks = all_tasks.filter((t) =>
    isWithinInterval(new Date(t.completed || t.due || _now), { start, end }),
  )
  return (
    <div>
      <h1>{title}</h1>
      <TaskList tasks={tasks} />
    </div>
  )
}

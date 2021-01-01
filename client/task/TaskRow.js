import React from 'react'
import css from '@unrest/css'
import { post } from '@unrest/core'
import { formatDistanceToNow } from 'date-fns'

import api from './api'

const getTaskIcon = (task) => {
  if (task.completed) {
    return 'check-square-o'
  }
  return 'square-o'
}

const getTaskTime = (task) => {
  if (task.completed) {
    return `done ${formatDistanceToNow(task.completed)} ago`
  } else if (task.due) {
    return `due in ${formatDistanceToNow(task.due)}`
  }
  return ''
}

export default function TaskRow({ task }) {
  const { refetch, tasks } = api.task.use()
  const { activities } = api.activity.use()
  if (!(tasks && activities)) {
    return null
  }
  const trigger = () =>
    post(`/api/task/${task.id}/`, {
      completed: new Date().valueOf(),
    }).then(() => refetch())

  return (
    <li className={css.list.item()} key={task.id}>
      <i
        className={css.icon(getTaskIcon(task) + ' trigger')}
        onClick={trigger}
      />
      <span>
        {task.name}
        <div className="light">{getTaskTime(task)}</div>
      </span>
      <span className="flex-grow"></span>
    </li>
  )
}

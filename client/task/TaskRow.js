import React from 'react'
import css from '@unrest/css'
import { post, Dropdown, SchemaForm } from '@unrest/core'
import { formatDistanceToNow } from 'date-fns'

import api from './api'

const getTaskIcon = (task) => {
  if (task.completed) {
    return 'check-square-o'
  } else if (task.started) {
    return 'spinner  fa-spin fa-pulse'
  }
  return 'square-o'
}

const getTaskTime = (task) => {
  if (task.completed) {
    return `done ${formatDistanceToNow(new Date(task.completed))} ago`
  } else if (task.started) {
    return formatDistanceToNow(task.started)
  } else if (task.due) {
    return `due in ${formatDistanceToNow(new Date(task.due))}`
  }
  return ''
}

const getLinks = (task, activity, refetch) => {
  const links = []
  if (activity) {
    links.push({
      children: 'Edit Activity',
      to: `/activity/${activity.id}/edit/`,
    })
  } else {
    links.push({
      children: 'Create Activity',
      onClick: () =>
        post(
          // TODO make this a to instead of onclick to reduce complexity
          `/api/schema/TaskForm/${task.id}/`,
          { name: task.name, data: { create_activity: true } },
        ).then(() => {
          api.activity.markStale()
          refetch()
        }),
    })
  }
  return links
}

function ActiveTaskForm({ task }) {
  const prepSchema = (schema) => {
    return schema
  }
  return (
    <div className="flex-grow w-full">
      <SchemaForm prepSchema={prepSchema} form_name={`TaskForm/${task.id}`} />
    </div>
  )
}

const trigger = ({ _activity, task, refetch }) => {
  const now = new Date().valueOf()
  const data = {}
  if (task.completed) {
    data.completed = null
  } else if (task.started) {
    data.completed = now
  } else {
    data.started = now
  }
  post(`/api/task/${task.id}/`, data).then(() => refetch())
}

export default function TaskRow({ task }) {
  const { refetch, tasks } = api.task.use()
  const { activities } = api.activity.use()
  if (!(tasks && activities)) {
    return null
  }
  const activity = activities.find((a) => a.id === task.activity_id)

  return (
    <li className={css.list.item('flex-wrap')} key={task.id}>
      <i
        className={css.icon(getTaskIcon(task) + ' trigger')}
        onClick={() => trigger({ activity, task, refetch })}
      />
      <span className="name">
        {task.name}
        <div className="light">{getTaskTime(task)}</div>
      </span>
      <span className="flex-grow"></span>
      <Dropdown
        links={getLinks(task, activity, refetch)}
        title={<i className={css.icon('ellipsis-v')} />}
      />
      {task.started && !task.completed && <ActiveTaskForm {...{ task }} />}
    </li>
  )
}

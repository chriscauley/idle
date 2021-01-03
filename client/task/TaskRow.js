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

const getLinks = (task, activity) => {
  const links = []
  if (activity) {
    links.push({
      children: 'Edit Activity',
      to: `/activity/${activity.id}/edit/`,
    })
  } else {
    links.push({
      children: 'Create Activity',
      to: `/activity/${task.id}/from_task/`,
    })
  }
  return links
}

function ActiveTaskForm({ task, activity }) {
  const prepSchema = () => {
    const properties = {}
    activity.measurements?.forEach((s) => {
      properties[s] = {
        type: 'number',
        default: task[s],
      }
    })
    return { type: 'object', properties }
  }
  return (
    <div className="flex-grow w-full">
      <SchemaForm
        prepSchema={prepSchema}
        form_name={`ActiveTaskForm/${task.id}`}
        autosubmit={true}
        customButton={true}
      />
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
      <div className="trigger">
        <i
          className={css.icon(getTaskIcon(task))}
          onClick={() => trigger({ activity, task, refetch })}
        />
      </div>
      <span className="name">
        {task.name}
        <div className="light">{getTaskTime(task)}</div>
      </span>
      <span className="flex-grow"></span>
      <Dropdown
        links={getLinks(task, activity, refetch)}
        title={<i className={css.icon('ellipsis-v')} />}
      />
      {task.started && !task.completed && (
        <ActiveTaskForm {...{ task, activity }} />
      )}
    </li>
  )
}

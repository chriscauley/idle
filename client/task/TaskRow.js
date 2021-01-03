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
    return `started ${formatDistanceToNow(new Date(task.started))} ago`
  } else if (task.due) {
    return `due in ${formatDistanceToNow(new Date(task.due))}`
  }
  return ''
}

const getLinks = ({ task, activity, edit }) => {
  const links = [{ children: 'Edit Task', onClick: edit }]
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

const fields = {
  DateTime: (value) => ({
    type: 'string',
    format: 'date-time',
    default: value ? new Date(value).toString() : undefined,
  }),
}

function ActiveTaskForm({ task, activity, editing, setEditing }) {
  const properties = {}
  if (editing) {
    properties.started = fields.DateTime(task.started)
    properties.completed = fields.DateTime(task.completed)
  }
  activity.measurements?.forEach((s) => {
    properties[s] = {
      type: 'number',
      default: task[s],
    }
  })
  if (Object.keys(properties).length === 0) {
    return null
  }
  const schema = { type: 'object', properties }
  return (
    <div className="flex-grow w-full">
      <SchemaForm
        prepSchema={() => schema}
        form_name={`ActiveTaskForm/${task.id}`}
        autosubmit={true}
        customButton={true}
      >
        {editing && (
          <button
            className={css.button()}
            onClick={() => setEditing(false)}
            type="button"
          >
            Done
          </button>
        )}
      </SchemaForm>
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

export default function TaskRow({ task, editing, setEditing }) {
  const { refetch, tasks } = api.task.use()
  const { activities } = api.activity.use()
  if (!(tasks && activities)) {
    return null
  }
  const activity = activities.find((a) => a.id === task.activity_id)
  const showForm = editing || (task.started && !task.completed)
  const edit = () => setEditing(task.id)

  return (
    <li className={css.list.item('flex-wrap')} key={task.id}>
      <div className="flex w-full items-center">
        <div className="trigger">
          <i
            className={css.icon(getTaskIcon(task))}
            onClick={() => trigger({ activity, task, refetch })}
          />
        </div>
        <span className="flex-shrink">
          <div>{task.name}</div>
          <div className="light">{getTaskTime(task)}</div>
        </span>
        <span className="flex-grow"></span>
        <Dropdown
          links={getLinks({ task, activity, edit, editing })}
          title={<i className={css.icon('ellipsis-v')} />}
        />
      </div>
      {showForm && (
        <ActiveTaskForm {...{ task, activity, editing, setEditing }} />
      )}
    </li>
  )
}

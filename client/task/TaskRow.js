import React from 'react'
import css from '@unrest/css'
import { post, Dropdown, SchemaForm } from '@unrest/core'

import Task from './model'
import api from './api'

const getLinks = ({ task, activity, edit }) => {
  const links = [{ children: 'Edit Task', onClick: edit }]
  if (activity) {
    links.push({
      children: 'Edit Activity',
      to: `/activity/${activity.id}/edit/`,
    })
    links.push({
      children: 'View Activity',
      to: `/activity/${activity.id}/`,
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
  const required = []
  if (task.completed) {
    properties.started = fields.DateTime(task.started)
    properties.completed = fields.DateTime(task.completed)
  }
  if (!task.started) {
    properties.due = fields.DateTime(task.due)
  }
  activity.measurements?.forEach((s) => {
    required.push(s)
    properties[s] = {
      type: 'number',
      default: task[s],
    }
  })
  activity.texts?.forEach((s) => {
    required.push(s)
    properties[s] = {
      type: 'string',
      default: task[s],
    }
  })
  if (Object.keys(properties).length === 0) {
    return null
  }
  const schema = { type: 'object', properties, required }
  return (
    <div className="flex-grow w-full">
      <SchemaForm
        prepSchema={() => schema}
        form_name={`ActiveTaskForm/${task.id}`}
        autosubmit={true}
        customButton={true}
        onSuccess={api.task.markStale}
      >
        {editing && (
          <button className={css.button()} onClick={() => setEditing(false)}>
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
            className={css.icon(Task.getIcon(task))}
            onClick={() => trigger({ activity, task, refetch })}
          />
        </div>
        <span className="flex-grow">
          <div>{task.name}</div>
          <div className="flex justify-between w-full">
            <div className="light">{Task.getTime(task)}</div>
            <div className="light">
              {Task.getShortMeasures({ task, activity })}
            </div>
          </div>
        </span>
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

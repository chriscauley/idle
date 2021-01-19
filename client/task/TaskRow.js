import { uniq } from 'lodash'
import React from 'react'
import css from '@unrest/css'
import { post, Dropdown, SchemaForm } from '@unrest/core'

import api from '../api'
import Task from './model'
import { makeTypeahead } from './Typeahead'

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

const getTextsOptions = (key) => () => {
  const { tasks = [] } = api.task.use()
  return uniq(tasks.reduce((acc, item) => acc.concat(item[key] || []), [])).filter(Boolean)
}

function ActiveTaskForm({ task, activity, editing, setEditing }) {
  const { setData, tasks } = api.task.use()
  const onChange = (data) => {
    // update the task in the /api/task/ rest list so the TaskRow matches the form.
    // task is already in tasks, so we just re-setData the tasks to update tasks in list.
    if (Object.keys(data).find((key) => data[key] !== task[key])) {
      Object.assign(task, data)
      setData({ tasks })
    }
  }
  const properties = {}
  const required = []
  const uiSchema = {}
  if (task.completed) {
    properties.started = fields.DateTime(task.started)
    properties.completed = fields.DateTime(task.completed)
  }
  if (!task.started) {
    properties.due = fields.DateTime(task.due)
  }
  activity.boolean_fields?.forEach((s) => {
    properties[s] = {
      type: 'boolean',
      default: task[s],
    }
  })
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
    uiSchema[s] = {
      'ui:field': makeTypeahead(getTextsOptions(s)),
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
        onChange={onChange}
        uiSchema={uiSchema}
        form_name={`ActiveTaskForm/${task.id}`}
        autosubmit={true}
        customButton={true}
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
            <div className="light">{Task.getShortMeasures({ task, activity })}</div>
          </div>
        </span>
        <Dropdown
          links={getLinks({ task, activity, edit, editing })}
          title={<i className={css.icon('ellipsis-v')} />}
        />
      </div>
      {showForm && <ActiveTaskForm {...{ task, activity, editing, setEditing }} />}
    </li>
  )
}

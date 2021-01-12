import React from 'react'
import { range } from 'lodash'
import { SchemaForm } from '@unrest/core'
import { alert, post } from '@unrest/core'

import api from './api'

const prepSchema = (schema) => {
  const data = schema.properties.data
  const properties = {
    name: schema.properties.name,
    per_day: {
      type: 'number',
      enum: range(1, 11),
      default: 1,
    },
    interval: {
      type: 'number',
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 14, 21, 28],
      default: 1,
    },
    measurements: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['count', 'reps', 'sets', 'lbs', 'cans', 'pages'],
      },
    },
    texts: {
      type: 'array',
      items: { type: 'string' },
    },
  }
  Object.entries(data.default || {}).forEach(
    ([name, value]) => (properties[name].default = value),
  )
  return { type: 'object', properties }
}

export default function ActivityForm(props) {
  const { id } = props.match.params
  const { success } = alert.use()
  const { refetch } = api.task.use()
  const form_name = `ActivityForm${id ? '/' + id : ''}`
  const onSuccess = () => {
    api.activity.markStale()
    refetch()
    success('form saved!')
    props.history.replace(`/activity/${id}/project/`)
  }

  const prepData = ({ name, ...data }) => {
    return { name, data }
  }
  return <SchemaForm {...{ form_name, prepSchema, onSuccess, prepData }} />
}

const loading = {}

export function CreateTaskActivity(props) {
  const task_id = parseInt(props.match.params.task_id)
  const { history } = props
  const { tasks = [] } = api.task.use()
  const { success } = alert.use()
  const task = tasks.find((t) => t.id === task_id)
  if (task && !loading[task.id]) {
    loading[task.id] = true
    post(
      // TODO make this a to instead of onclick to reduce complexity
      `/api/schema/TaskForm/${task.id}/`,
      { name: task.name, data: { create_activity: true } },
    ).then(() => {
      api.activity.markStale()
      api.task.markStale()
      history.replace(`/project/${task.project_id}/`)
      success(`Created activity for ${task.name}`)
    })
  }
  return null
}

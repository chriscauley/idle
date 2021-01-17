import React from 'react'
import { range, uniq } from 'lodash'
import { SchemaForm } from '@unrest/core'
import { alert, post } from '@unrest/core'
import qs from 'querystring'

import { makeTypeahead } from './Typeahead'
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
        // enum: ['count', 'reps', 'sets', 'lbs', 'cans', 'pages'],
      },
    },
    texts: {
      type: 'array',
      items: { type: 'string' },
    },
  }
  Object.entries(data.default || {}).forEach(([name, value]) => (properties[name].default = value))

  const required = ['interval', 'name']
  return { type: 'object', properties, required }
}

const getMeasurementsOptions = () => {
  const { activities = [] } = api.activity.use()
  return uniq(activities.reduce((acc, item) => acc.concat(item.measurements || []), []))
}

const getTextsOptions = () => {
  const { activities = [] } = api.activity.use()
  return uniq(activities.reduce((acc, item) => acc.concat(item.texts || []), []))
}

const uiSchema = {
  measurements: {
    'ui:field': makeTypeahead(getMeasurementsOptions),
  },
  texts: {
    'ui:field': makeTypeahead(getTextsOptions),
  },
}

export default function ActivityForm(props) {
  const { id } = props.match.params
  const { success } = alert.use()
  const { refetch } = api.task.use()
  const { next } = qs.parse(props.location.search.slice(1))
  const form_name = `ActivityForm${id ? '/' + id : ''}`
  const onSuccess = () => {
    api.activity.markStale()
    refetch()
    success('form saved!')
    props.history.replace(next || `/activity/${id}/project/`)
  }

  const prepData = ({ name, ...data }) => {
    return { name, data }
  }
  return <SchemaForm {...{ form_name, prepSchema, onSuccess, prepData, uiSchema }} />
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

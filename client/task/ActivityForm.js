import React from 'react'
import { range } from 'lodash'
import { SchemaForm } from '@unrest/core'
import { alert } from '@unrest/core'

import api from './api'

const prepSchema = (schema) => {
  const data = schema.properties.data
  const properties = {
    name: schema.properties.name,
    per_day: { type: 'number', enum: range(1, 11) },
    interval: { type: 'number', enum: [0, 1, 2, 3, 4, 5, 6, 7, 14, 21, 28] },
    measurements: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['count', 'reps', 'sets', 'weight'],
      },
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
    props.history.replace(`/activity/${id}`)
  }

  const prepData = ({ name, ...data }) => {
    return { name, data }
  }
  return <SchemaForm {...{ form_name, prepSchema, onSuccess, prepData }} />
}

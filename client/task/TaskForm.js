import React from 'react'

import { SchemaForm, alert } from '@unrest/core'
import { addDays } from 'date-fns'
import api from './api'

export default function TaskForm({ id, activity_id, project_id, close }) {
  const { refetch } = api.task.use()
  const { success } = alert.use()
  const properties = {
    name: { type: 'string' },
  }
  if (!activity_id) {
    properties.create_activity = {
      type: 'boolean',
      title: 'Create Activity',
      default: true,
    }
  }
  const schema = {
    type: 'object',
    properties,
  }

  const prepData = ({ name, ...data }) => {
    Object.assign(data, {
      activity_id,
      project_id,
      due: addDays(new Date(), 1).valueOf(),
    })
    return { name, data }
  }

  const onSuccess = () => {
    api.activity.markStale()
    refetch()
    close()
    success('form saved')
  }

  const form_name = `TaskForm${id ? '/' + id : ''}`
  return (
    <SchemaForm
      form_name={form_name}
      prepSchema={() => schema}
      prepData={prepData}
      onSuccess={onSuccess}
      cancel={close}
    />
  )
}

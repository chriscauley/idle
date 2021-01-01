import React from 'react'
import { SchemaForm } from '@unrest/core'
import { addDays } from 'date-fns'

export default function TaskForm({ id, activity_id, project_id }) {
  const properties = {
    name: { type: 'string' },
  }
  if (!activity_id) {
    properties.create_activity = { type: 'boolean', title: 'Create Activity' }
  }
  const schema = {
    type: 'object',
    properties,
  }

  const prepData = ({ name, ...data }) => {
    Object.assign(data, {
      activity_id,
      project_id,
      due: addDays(new Date(), 1),
    })
    return { name, data }
  }

  const form_name = `TaskForm${id ? '/' + id : ''}`
  return (
    <SchemaForm
      form_name={form_name}
      prepSchema={() => schema}
      prepData={prepData}
    />
  )
}

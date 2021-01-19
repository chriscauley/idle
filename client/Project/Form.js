import React from 'react'
import { SchemaForm, alert } from '@unrest/core'

import api from '../api'

export default function ProjectForm(props) {
  const { id } = props.match.params
  const { success } = alert.use()
  const form_name = `ProjectForm${id ? '/' + id : ''}`
  const onSuccess = ({ id }) => {
    api.project.markStale()
    success('form saved!')
    props.history.push(`/project/${id}/`)
  }
  return <SchemaForm form_name={form_name} onSuccess={onSuccess} />
}

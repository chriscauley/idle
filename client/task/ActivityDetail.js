import React from 'react'
import { Redirect } from 'react-router-dom'
import api from './api'

export function ActivityProjectRedirect(props) {
  const id = parseInt(props.match.params.id)
  const activity = api.activity.use().activities?.find((a) => a.id === id)
  // TODO 404 page?
  return activity ? <Redirect to={`/project/${activity.project_id}`} /> : null
}

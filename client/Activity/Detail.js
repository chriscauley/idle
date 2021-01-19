import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import css from '@unrest/css'

import Task from '../task/model'
import api from '../api'

export function ActivityProjectRedirect(props) {
  const id = parseInt(props.match.params.id)
  const activity = api.activity.use().activities?.find((a) => a.id === id)
  // TODO 404 page?
  return activity ? <Redirect to={`/project/${activity.project_id}`} /> : null
}

export default function ActivityDetail(props) {
  const id = parseInt(props.match.params.id)
  const activity = api.activity.use().activities?.find((a) => a.id === id)
  const { tasks: all_tasks } = api.task.use()
  if (!activity || !all_tasks) {
    return null
  }
  const tasks = all_tasks.filter((a) => a.id === id)
  return (
    <div>
      <h1>
        {activity.name}
        <Link to={`/activity/${id}/edit/`} className={css.icon('edit')} />
      </h1>
      <ul>
        {tasks.map((task) => (
          <div key={task.id}>
            <div>Done: {task.completed}</div>
            <div>{Task.getShortMeasures(task)}</div>
          </div>
        ))}
        {tasks.length === 0 && <div>There are no tasks yet for this.</div>}
      </ul>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

import TaskList from '../task/TaskList'
import api from '../api'

export default function ProjectDetail(props) {
  const [showCompleted, setShowCompleted] = React.useState()
  const { projects = [] } = api.project.use()
  let { tasks = [] } = api.task.use()
  const id = parseInt(props.match.params.id)
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return null
  }

  tasks = tasks.filter((t) => t.project_id === id)
  if (showCompleted) {
    tasks = tasks.filter((t) => t.completed)
  } else {
    const cutoff = new Date().valueOf() - 300 * 1000
    tasks = tasks.filter((t) => !t.completed || t.completed > cutoff)
  }
  const editIcon = (icon, active) => css.button[active ? 'secondary' : 'light'](css.icon(icon))
  return (
    <div className="project-detail">
      <h1 className="flex justify-between items-center">
        {project.name}
        <span>
          <Link className={css.icon('edit link')} to={`/project/${id}/edit/`} />
          <i
            className={editIcon('check-square-o completed-trigger', showCompleted)}
            onClick={() => setShowCompleted(!showCompleted)}
          />
        </span>
      </h1>
      <TaskList tasks={tasks} project_id={project.id} />
    </div>
  )
}

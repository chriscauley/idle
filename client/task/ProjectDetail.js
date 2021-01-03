import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'
import createTasks from './createTasks'

import TaskRow from './TaskRow'
import TaskForm from './TaskForm'
import api from './api'

export default function ProjectDetail(props) {
  const [editing, setEditing] = React.useState()
  const [showCompleted, setShowCompleted] = React.useState()
  const { projects = [] } = api.project.use()
  let { tasks = [] } = api.task.use()
  const id = parseInt(props.match.params.id)
  const project = projects.find((p) => p.id === id)
  createTasks()
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
  const editIcon = (icon, active) =>
    css.button[active ? 'secondary' : 'light'](css.icon(icon))
  return (
    <div className="project-detail">
      <h1 className="flex justify-between items-center">
        {project.name}
        <span>
          <Link className={css.icon('edit link')} to={`/project/${id}/edit/`} />
          <i
            className={editIcon(
              'check-square-o completed-trigger',
              showCompleted,
            )}
            onClick={() => setShowCompleted(!showCompleted)}
          />
        </span>
      </h1>
      <ul className={css.list.outer('task-list')}>
        {tasks.map((task) => (
          <TaskRow
            task={task}
            key={task.id}
            setEditing={setEditing}
            editing={task.id === editing}
          />
        ))}
      </ul>
      {!editing && (
        <li className={css.list.item()}>
          <button className={css.button()} onClick={() => setEditing('new')}>
            <i className={css.icon('plus mr-2')} />
            Add new task
          </button>
        </li>
      )}
      {editing === 'new' && (
        <li className={css.list.item()}>
          <TaskForm project_id={project.id} close={() => setEditing(null)} />
        </li>
      )}
    </div>
  )
}

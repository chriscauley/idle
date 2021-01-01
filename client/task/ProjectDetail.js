import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

import TaskRow from './TaskRow'
import TaskForm from './TaskForm'
import api from './api'

export default function ProjectDetail(props) {
  const [editing, setEditing] = React.useState()
  const { projects = [] } = api.project.use()
  let { tasks = [] } = api.task.use()
  const id = parseInt(props.match.params.id)
  const project = projects.find((p) => p.id === id)
  if (!project) {
    return null
  }

  tasks = tasks.filter((t) => t.project_id === id)
  return (
    <div>
      <h1 className="flex justify-between">
        {project.name}
        <Link className={css.icon('edit link')} to={`/project/${id}/edit/`} />
      </h1>
      <ul className={css.list.outer('task-list')}>
        {tasks.map((task) => (
          <TaskRow task={task} key={task.id} />
        ))}
      </ul>
      {!editing && (
        <button className={css.button()} onClick={() => setEditing('new')}>
          <i className={css.icon('plus mr-2')} />
          Add new task
        </button>
      )}
      {editing === 'new' && <TaskForm project_id={project.id} />}
    </div>
  )
}

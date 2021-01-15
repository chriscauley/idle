import React from 'react'
import css from '@unrest/css'
import createTasks from './createTasks'

import TaskRow from './TaskRow'
import TaskForm from './TaskForm'

export default function TaskList({ tasks, project_id }) {
  const [editing, setEditing] = React.useState()
  createTasks()
  return (
    <div>
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
      {project_id && !editing && (
        <li className={css.list.item()}>
          <button className={css.button()} onClick={() => setEditing('new')}>
            <i className={css.icon('plus mr-2')} />
            Add new task
          </button>
        </li>
      )}
      {project_id && editing === 'new' && (
        <li className={css.list.item()}>
          <TaskForm project_id={project_id} close={() => setEditing(null)} />
        </li>
      )}
    </div>
  )
}

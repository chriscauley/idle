import React from 'react'
import { Link } from 'react-router-dom'

import api from './task/api'
import css from '@unrest/css'

function OpenTasks({ tasks }) {
  tasks = tasks.filter((t) => t.started && !t.completed)
  return (
    <div className="flex">
      {tasks.map((task) => (
        <div key={task.id} className="text--text-alt">
          <i className={css.icon('spinner fa-spin mr-2')} />
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const { projects = [] } = api.project.use()
  const { tasks = [] } = api.task.use()
  return (
    <div>
      <div className={css.list.outer()}>
        {projects.map(({ id, name }) => (
          <Link to={`/project/${id}/`} key={id} className={css.list.item()}>
            <div className="flex-grow">{name}</div>
            <OpenTasks tasks={tasks.filter((t) => t.project_id === id)} />
          </Link>
        ))}
        <li className={css.list.item()}>
          <Link to="/activity/" className={'link'}>
            Activity List
          </Link>
        </li>
      </div>
      <div>
        <Link className={css.button('inline-block')} to="/project/new/">
          <i className={css.icon('plus mr-3')} />
          Add Project
        </Link>
      </div>
    </div>
  )
}

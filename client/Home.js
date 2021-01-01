import React from 'react'
import { Link } from 'react-router-dom'

import api from './task/api'
import css from '@unrest/css'

export default function Home() {
  const { projects = [] } = api.project.use()
  return (
    <div className={css.list.outer()}>
      {projects.map(({ id, name }) => (
        <Link to={`/project/${id}/`} key={id} className={css.list.item()}>
          {name}
        </Link>
      ))}
      <Link to="/project/new/">Add Project</Link>
    </div>
  )
}

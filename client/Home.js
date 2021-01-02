import React from 'react'
import { Link } from 'react-router-dom'

import api from './task/api'
import css from '@unrest/css'

export default function Home() {
  const { projects = [] } = api.project.use()
  return (
    <div>
      <div className={css.list.outer()}>
        {projects.map(({ id, name }) => (
          <Link to={`/project/${id}/`} key={id} className={css.list.item()}>
            {name}
          </Link>
        ))}
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

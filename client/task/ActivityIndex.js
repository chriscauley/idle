import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

import api from './api'

const getFrequencyString = ({ interval }) => {
  if (interval === 0) {
    return 'no repeat'
  }
  return `every ${interval === 1 ? 'day' : interval + ' days'}`
}

export default function ActivityIndex({ location }) {
  const { activities = [] } = api.activity.use()
  const { projects = [] } = api.project.use()

  const getProjectName = ({ project_id }) => projects.find((p) => p.id === project_id)?.name
  const toForm = ({ id }) => ({
    pathname: `/activity/${id}/edit/`,
    search: `next=${encodeURIComponent(location.pathname)}`,
  })
  return (
    <div>
      <h1>Activities</h1>
      <table className="table">
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>
                <Link to={toForm(activity)} className={css.icon('edit link')} />
                <span className="ml-2">{activity.name}</span>
                <span className="ml-2">({getProjectName(activity)})</span>
              </td>
              <td>{getFrequencyString(activity)}</td>
              <td>{activity.measurements?.join(', ')}</td>
              <td>{activity.texts?.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

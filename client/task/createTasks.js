import { addDays, max } from 'date-fns'
import { pick, sortBy } from 'lodash'
import { post } from '@unrest/core'

import api from './api'

let loading

// TODO should be an action in api
export default () => {
  const { activities } = api.activity.use()
  const { tasks, refetch } = api.task.use()
  if (loading || !(tasks && activities)) {
    return
  }
  const promises = []
  activities.forEach((activity) => {
    const activity_tasks = tasks.filter((t) => t.activity_id === activity.id)
    const new_task = activity_tasks.find((t) => !t.completed)
    if (!new_task) {
      const last_task = sortBy(activity_tasks, (t) => t.due || 0)
        .reverse()
        .find((t) => t.completed)
      const due = addDays(max([new Date(last_task?.completed || 0), new Date()]), 1).valueOf()
      const { name, project_id } = last_task || activity
      const activity_id = activity.id
      const extras = pick(last_task, activity.texts, activity.measurements)
      promises.push(
        post(`/api/schema/TaskForm/`, {
          name,
          data: { activity_id, project_id, due, ...extras },
        }),
      )
    }
  })
  if (promises.length) {
    loading = true
    Promise.all(promises).then(() => {
      loading = false
      refetch()
    })
  }
}

import { addDays } from 'date-fns'
import { post } from '@unrest/core'

import api from './api'

let loading

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
      const last_task = activity_tasks.find((t) => t.completed)
      const due = addDays(
        last_task?.completed || new Date().valueOf(),
        1,
      ).valueOf()
      const { name, project_id } = last_task || activity
      const activity_id = activity.id
      promises.push(
        post(`/api/schema/TaskForm/`, {
          name,
          data: { activity_id, project_id, due },
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

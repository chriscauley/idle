import RestHook from '@unrest/react-rest-hook'
import { sortBy } from 'lodash'

const prepTaskData = (data) => {
  data.tasks = sortBy(data.tasks, 'due')
  return data
}

export default {
  project: RestHook('/api/project/'),
  activity: RestHook('/api/activity/'),
  task: RestHook('/api/task/', { prepData: prepTaskData }),
}

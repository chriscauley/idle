import RestHook from '@unrest/react-rest-hook'

export default {
  project: RestHook('/api/project/'),
  activity: RestHook('/api/activity/'),
  task: RestHook('/api/task/'),
}

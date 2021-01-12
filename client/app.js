import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import { alert } from '@unrest/core'
import auth from '@unrest/react-auth'

import photo from './photo'
import Home from './Home'
import Nav from './Nav'
import ProjectForm from './task/ProjectForm'
import ActivityForm, { CreateTaskActivity } from './task/ActivityForm'
import { ActivityProjectRedirect } from './task/ActivityDetail'
import ProjectDetail from './task/ProjectDetail'

// TODO this is where photos, activities, actions, and things can be cross associated
auth.config.prepData = (data) => {
  const { user } = data
  if (!user) {
    return
  }
}

const App = () => {
  return (
    <HashRouter>
      <Nav />
      <div className="app-content">
        <Route exact path="/" component={Home} />
        <Route exact path={'/project/:id/'} component={ProjectDetail} />
        <Route exact path={'/project/new/'} component={ProjectForm} />
        <Route exact path={'/project/:id/edit/'} component={ProjectForm} />
        <Route exact path={'/activity/:id/project/'} component={ActivityRedirect} />
        <Route
          exact
          path={'/activity/:task_id/from_task/'}
          component={CreateTaskActivity}
        />
        <Route exact path={'/activity/:id/edit/'} component={ActivityForm} />
      </div>
      <alert.List />
      <photo.BulkUpload />
      <Route exact path={'/photo/'} component={photo.MyPhotos} />
      <auth.Routes />
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)

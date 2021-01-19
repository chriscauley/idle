import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import { alert } from '@unrest/core'
import auth from '@unrest/react-auth'

import photo from './photo'
import Home from './Home'
import Nav from './Nav'
import Project from './Project'
import Activity from './Activity'
import DateReport from './task/DateReport'

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
        <Route exact path={'/project/:id/'} component={Project.Detail} />
        <Route exact path={'/project/new/'} component={Project.Form} />
        <Route exact path={'/project/:id/edit/'} component={Project.Form} />
        <Route exact path={'/activity/:id/project/'} component={Activity.ProjectRedirect} />
        <Route exact path={'/activity/:task_id/from_task/'} component={Activity.CreateTaskActivity} />
        <Route exact path={'/activity/'} component={Activity.List} />
        <Route exact path={'/activity/:id/edit/'} component={Activity.Form} />
        <Route exact path={'/photo/'} component={photo.MyPhotos} />
        <Route exact path={'/report/:date_str/'} component={DateReport} />
        <auth.Routes />
      </div>
      <alert.List />
      {/* <photo.BulkUpload /> */}
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)

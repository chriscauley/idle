import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import { alert } from '@unrest/core'
import auth from '@unrest/react-auth'
import photo from './photo'

import Home from './Home'
import Nav from './Nav'

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

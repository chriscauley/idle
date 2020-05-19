import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import { alert } from '@unrest/core'
import auth from '@unrest/react-auth'

import BulkUpload from './BulkUpload'
import Home from './Home'
import Nav from './Nav'

const App = () => {
  return (
    <HashRouter>
      <Nav />
      <div className="app-content">
        <Route exact path="/" component={Home} />
      </div>
      <alert.List />
      <BulkUpload />
      <auth.Routes />
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)

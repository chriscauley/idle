import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'

import Home from './Home'
import Nav from './Nav'

const App = () => {
  return (
    <HashRouter>
      <Nav />
      <div className="app-content">
        <Route exact path="/" component={Home} />
      </div>
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)

import React from 'react'
import { Link } from 'react-router-dom'
import auth from '@unrest/react-auth'
import css from '@unrest/css'

export default function Nav() {
  return (
    <header className={css.nav.outer()}>
      <section className={css.nav.section()}>
        <Link to="/" className={css.nav.brand()}>
          Idle Hands
        </Link>
      </section>
      <section className={css.nav.section('flex items-center')}>
        <auth.NavLink />
        <a
          className="text-blue-500 fa fa-github"
          href="https://github.com/chriscauley/idle/"
        />
      </section>
    </header>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import { config as ur_config, afterFetch, handleError, alert } from '@unrest/core'
import progress from '@unrest/react-progress-bar'
import auth from '@unrest/react-auth'
import css from '@unrest/css'

const _onChange = (props) => ({ target }, alert) => {
  const { files = [] } = target
  const { progress } = props
  if (!FileReader) {
    // TODO fallback a warning for older browsers
    return
  }

  const promises = Array.from(files).map((file) => {
    const formData = new FormData()
    formData.append('src', file)
    // TODO may want to integrate using formData with @unrest/rjsf/post
    return fetch('/api/schema/PhotoForm/', {
      method: 'POST',
      body: formData,
      headers: { 'X-CSRFToken': ur_config.getCSRF() },
    }).then(afterFetch, handleError)
  })

  const onSuccess = (results) => {
    const success_count = results.filter(({ error }) => (error ? alert.error(error) : true)).length
    success_count && alert.success(`${success_count} uploads successful`)
    props.auth.refetch()
  }
  progress.actions.display({
    name: `Uploading ${promises.length} photos`,
    promises,
    onSuccess,
  })
}

const Button = progress.connect((props) => {
  const { user } = auth.use()
  const _btn =
    'cursor-pointer w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full'
  const onChange = _onChange(props, alert.use())
  return (
    <div className="fixed bottom-0 right-0 m-4 text-2xl z-10">
      {user ? (
        <label className={_btn}>
          <i className={css.icon('file-photo-o')} />
          <input className="hidden" type="file" accept="image/*" onChange={onChange} multiple />
        </label>
      ) : (
        <Link to={auth.config.urls.login} className={_btn}>
          <i className={css.icon('file-photo-o')} />
        </Link>
      )}
    </div>
  )
})

export default Button

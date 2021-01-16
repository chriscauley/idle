// TODO move to @unrest/core and fix noticed
import React from 'react'
import css from '@unrest/css'
import { alert } from '@unrest/core'

const noop = () => {}
export default function DeleteButton({ onDelete = noop, name = 'Item', action }) {
  const [{ loading, clicked }, setState] = React.useState({})
  const toggle = () => setState({ loading, clicked: !clicked })
  const { success, error } = alert.use()

  const confirm = () => {
    setState({ loading: true, clicked })
    action().then((result = {}) => {
      setState({})
      if (result.error) {
        error(result.error)
      } else {
        success(`${name} has been deleted.`)
        onDelete(result)
      }
    })
  }

  return (
    <>
      {clicked && (
        <div className={css.modal.outer()}>
          <div className={css.modal.mask()} onClick={toggle} />
          <div className={css.modal.content.sm()}>
            <div className={css.h3()}>Deleting: {name}</div>
            Are you sure?
            <div className="flex justify-between mt-4">
              <button className={css.button.light()} onClick={toggle}>
                No
              </button>
              <button className={css.button()} onClick={confirm}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      <a className={css.button.danger()} onClick={toggle}>
        <i className="fa fa-trash" />
      </a>
    </>
  )
}

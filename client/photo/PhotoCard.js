import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'
import auth from '@unrest/react-auth'
import { post } from '@unrest/core'

import { ZoomButton } from './Zoom'
import DeleteButton from '../DeleteButton'

export default function PhotoCard(props) {
  const { src, thumbnail, id, onDelete, location } = props
  const { user } = auth.use()
  const is_owner = user?.photos.find((p) => p.id === id)
  const deletePhoto = () => post('/api/media/photo/delete/', { id })
  return (
    <div className="px-2 mb-4 w-full sm:w-1/2 lg:w-1/3">
      <div className="relative">
        <div className="absolute top-0 right-0 m-4">
          <ZoomButton src={src} />
          {is_owner && <DeleteButton action={deletePhoto} onDelete={onDelete} name="Photo" />}
        </div>
        <img src={thumbnail} />
        <div className="absolute bottom-0 right-0 m-4">
          {is_owner && (
            <>
              <Link to={`/photo/crop/${id}/`} className={css.button()}>
                <i className={css.icon('crop')} />
              </Link>
              <a
                href={`#/photo/${id}/locate/`}
                className={css.button[location ? 'primary' : 'warning']()}
              >
                <i className={css.icon('edit mr-2')} />
                {location ? location.name : 'needs location'}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

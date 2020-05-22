import React from 'react'
import auth from '@unrest/react-auth'
import { post } from '@unrest/core'
import Form from '@unrest/react-jsonschema-form'
import RestHook from '@unrest/react-rest-hook'
import Autosuggest from '../Autosuggest'

import PhotoCard from './PhotoCard'

const withSchema = RestHook('/api/schema/${form_name}/')

const uiSchema = {
  name: { 'ui:widget': Autosuggest },
}

class BaseSchemaForm extends React.Component {
  onSubmit = (formData) => post(this.props.api.makeUrl(this.props), formData)
  render() {
    const { api, prepSchema = () => {}, ...props } = this.props
    const { loading, schema } = api
    if (loading) {
      return null
    }
    const form_props = {
      schema: prepSchema(schema) || schema,
      onSubmit: this.onSubmit,
      onSuccess: this.props.onSuccess,
      ...props,
    }
    return <Form uiSchema={uiSchema} {...form_props} />
  }
}

const SchemaForm = withSchema(BaseSchemaForm)

class MyPhotos extends React.Component {
  render() {
    const { user, loading, refetch } = this.props.auth

    if (!user && loading) {
      return null
    }

    const photo = user.photos.find((p) => !p.activity_id)
    const prepData = (formData) => (formData.photo_id = photo.id)
    const prepSchema = (schema) => {
      const values = user.activities.map((a) => a.name)
      schema.properties.name.enum = values
      return schema
    }

    return (
      <div>
        <Autosuggest />
        {photo && (
          <div className="border rounded p-4 max-w-sm">
            <SchemaForm
              form_name="ActionForm"
              prepData={prepData}
              prepSchema={prepSchema}
              onSuccess={refetch}
            />
            <img src={photo.thumbnail} />
          </div>
        )}
        {user.photos.slice(0, 10).map((photo) => (
          <PhotoCard {...photo} onDelete={refetch} key={photo.id} />
        ))}
      </div>
    )
  }
}

export default auth.required(MyPhotos)

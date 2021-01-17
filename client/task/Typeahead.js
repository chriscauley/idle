import React from 'react'
import { resolveCallable } from '@unrest/core'
import css from '@unrest/css'

export default function Typeahead(props) {
  // props.onChange doesn't trigger reflow so we need to force update with this
  const setLength = React.useState(0)[1]
  const [focused, setFocused] = React.useState(false)
  const [value, setValue] = React.useState('')
  const id = props.idSchema.$id
  const { formData = [] } = props
  const title = props.schema.title || props.name
  const normalized = value.toLowerCase()
  const suggestions = resolveCallable(props.options)
    .filter((o) => o.toLowerCase().includes(normalized))
    .filter((o) => !formData.includes(o))
  const CUSTOM = suggestions.length

  const remove = (index) => {
    formData.splice(index, 1)
    props.onChange(formData.slice())
    setLength(formData.length || -1)
  }
  const onChange = (e) => {
    setValue(e.target.value)
  }
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      useIndex(0)
    } else if (!value && e.key === 'Backspace') {
      remove(formData.length - 1)
    }
  }

  const add = (item) => {
    if (item && !formData.includes(item)) {
      formData.push(item.trim())
      props.onChange(formData)
      setValue('')
      setLength(formData.length)
    }
  }

  const useIndex = (index) => {
    const item = suggestions[index]
    if (index === CUSTOM) {
      add(value)
    } else if (item !== undefined) {
      add(item)
    }
  }

  const suggestion = css.pill.primary('cursor-poitner')
  const onFocus = () => setFocused(true)
  // if not for the following timeout, the input blurs before
  const onBlur = () => setFocused(false)

  return (
    <div className="ur-typeahead">
      <label className="control-label" htmlFor={id}>
        {title}
      </label>
      <div className={`form-control ${focused ? '-focus' : ''}`}>
        {formData.map((item, index) => (
          <span key={item} className={css.pill.primary()} onMouseDown={() => remove(index)}>
            <span className="mr-2">{item}</span>
            <a className={css.icon('close')} />
          </span>
        ))}
        <input {...{ value, onChange, onKeyDown, onFocus, onBlur }} />
      </div>
      {focused && (
        <ul className="suggestions">
          {suggestions.map((item, index) => (
            <li key={item} className={suggestion} onMouseDown={() => useIndex(index)}>
              {item}
              <i className={css.icon('plus ml-2')} />
            </li>
          ))}
          {value && !suggestions.length && (
            <li onMouseDown={() => useIndex(CUSTOM)} className={suggestion}>
              <i className={css.icon('plus mr-2')} />
              {`Create new item "${value}"`}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export const makeTypeahead = (options) => (props) => <Typeahead {...props} options={options} />

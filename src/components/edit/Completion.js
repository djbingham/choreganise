import './Completion.css'
import { Fragment, useState } from 'react'
import IconButton from '../IconButton'
import { getUnixTime } from 'date-fns'
import { noop } from 'lodash'

const Completion = ({
  completion,
  onChange,
  onDelete,
  forceEdit = false,
  onCancelEdit = noop
}) => {
  const allowDelete = (typeof onDelete === 'function')
  const initialDurationMinutes = completion.duration ? Math.ceil(completion.duration / 60) : null

  const [date, setDate] = useState(new Date(1000 * completion.time || 0))
  const [durationMinutes, setDurationMinutes] = useState(initialDurationMinutes)
  const [editing, setEditing] = useState(!!forceEdit)

  const handleDateChange = (event) => setDate(new Date(event.target.value))
  const handleDurationChange = (event) => setDurationMinutes(+event.target.value)

  const handleClickDelete = () => {
    setEditing(false)
    onDelete()
  }

  const startEditing = () => setEditing(true)

  const stopEditing = () => {
    setEditing(false)
    setDurationMinutes(initialDurationMinutes)
    onCancelEdit()
  }

  const save = () => {
    setEditing(false)
    onChange({
      ...completion,
      time: getUnixTime(date),
      duration: +durationMinutes * 60
    })
  }

  return (
    <tr className="tableRow completion">
      <td className="tableCell">
          {editing ? (
            <input
              className="input date"
              name="date"
              onChange={handleDateChange}
              type="date"
              value={date.toISOString().slice(0,10)}
            />
          ) : (
            <span className="date">
              {date.toLocaleDateString()}
            </span>
          )}
        {}
      </td>

      <td className="tableCell">
        {editing ? (
          <Fragment>
            <input
              className="input duration"
              name="duration"
              onChange={handleDurationChange}
              type="number"
              value={durationMinutes === null ? '' : durationMinutes}
            />
            <span className="durationUnits">
              &nbsp;minutes
            </span>
          </Fragment>
        ) : completion.duration && (
          <Fragment>
            <span className="duration">
              {durationMinutes}
            </span>
            <span className="durationUnits">
              &nbsp;minutes
            </span>
          </Fragment>
          )}
      </td>

      <td className="tableCell controls">
        {editing ? (
          <Fragment>
            <span className="control">
              <IconButton icon="undo" onClick={stopEditing} />
            </span>
            <span className="control">
              <IconButton icon="save" onClick={save} />
            </span>
          </Fragment>
        ) : (
          <span className="control">
            <IconButton icon="pencil" onClick={startEditing} />
          </span>
        )}
        {allowDelete && (
          <span className="control">
            <IconButton icon="trash" onClick={handleClickDelete} />
          </span>
        )}
      </td>
    </tr>
  )
}

export default Completion

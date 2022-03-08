import './Timer.css'
import { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { getUnixTime } from 'date-fns'
import { pause, resume, selectTimeRemaining, setDuration, skipActiveTask, start, stop } from '../store/timerSlice.js'
import { getResidualSeconds, getWholeHours, getWholeMinutes, sumTimeComponents } from '../utility/dateTimeFunctions.js'
import IconButton from './IconButton'
import Container from './Container'

class Timer extends Component {
  constructor (props) {
    super(props)

    this.handleHoursChange = this.handleHoursChange.bind(this)
    this.handleMinutesChange = this.handleMinutesChange.bind(this)
    this.handleSecondsChange = this.handleSecondsChange.bind(this)
    this.handleSkipClick = this.handleSkipClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.stop = this.stop.bind(this)
    this.togglePause = this.togglePause.bind(this)
    this.handleAnimationFrame = this.handleAnimationFrame.bind(this)

    this.state = {
      currentTickTime: getUnixTime(new Date())
    }
  }

  componentDidMount () {
    this.frameId = requestAnimationFrame(this.handleAnimationFrame)
  }

  componentWillUnmount () {
    this.stop()
    cancelAnimationFrame(this.frameId)
  }

  handleAnimationFrame () {
    const { duration, paused, started, startTime } = this.props.timer

    const now = getUnixTime(new Date())

    if (started && !paused && now > startTime) {
      if (now < startTime + duration) {
        // Timer is running; update tick time
        this.setState(
          { now },
          () => this.frameId = requestAnimationFrame(this.handleAnimationFrame)
        )
      } else {
        // Timer passed end time; pause the timer
        this.props.pause()
        this.frameId = requestAnimationFrame(this.handleAnimationFrame)
      }
    } else {
      // Timer not started, do nothing this frame
      this.frameId = requestAnimationFrame(this.handleAnimationFrame)
    }
  }

  stop () {
    this.props.stop()
  }

  togglePause () {
    if (this.props.timer.paused) {
      this.props.resume()
    } else {
      this.props.pause()
    }
  }

  handleSubmit (event) {
    event.preventDefault()

    if (this.props.timer.paused) {
      this.props.start()
    } else {
      this.props.pause()
    }
  }

  handleHoursChange (event) {
    const duration = sumTimeComponents({
      hours: +event.target.value || 0,
      minutes: getWholeMinutes(this.props.timer.duration),
      seconds: 0
    })
    this.props.setDuration(duration)
  }

  handleMinutesChange (event) {
    const duration = sumTimeComponents({
      hours: getWholeHours(this.props.timer.duration),
      minutes: +event.target.value || 0,
      seconds: 0
    })
    this.props.setDuration(duration)
  }

  handleSecondsChange (event) {
    const duration = sumTimeComponents({
      hours: getWholeHours(this.props.timer.duration),
      minutes: getWholeMinutes(this.props.timer.duration),
      seconds: +event.target.value || 0
    })
    this.props.setDuration(duration)
  }

  handleSkipClick (event) {
    this.props.skipActiveTask()
  }

  render () {
    const { timer } = this.props
    const { activeTask, duration, paused, started } = timer
    const initialHours = getWholeHours(duration)
    const initialMinutes = getWholeMinutes(duration)
    const timeRemaining = selectTimeRemaining({ timer })
    const hours = getWholeHours(timeRemaining)
    const minutes = getWholeMinutes(timeRemaining)
    const seconds = getResidualSeconds(timeRemaining)

    return (
      <Container>
        <Container solid>
        <form className="timer" onSubmit={this.handleSubmit}>
          <section className="time">
            <input
              className="timePart"
              disabled={started}
              onChange={this.handleHoursChange}
              name="hours"
              placeholder="--"
              value={started ? hours : initialHours || ""}
              type="text"
            />
            <span>h</span>
            <input
              className="timePart"
              disabled={started}
              onChange={this.handleMinutesChange}
              name="minutes"
              placeholder="--"
              value={started ? minutes : initialMinutes || ""}
              type="text"
            />
            <span>m</span>
            {started && (
              <Fragment>
                <span className="timePart">
                  {seconds}
                </span>
                <span>s</span>
              </Fragment>
            )}
          </section>

          <hr />

          <section className="controls">
            <span className="control secondaryControl">
              <IconButton
                className="secondaryControl"
                disabled={!started}
                icon="stop"
                onClick={this.stop}
                type="button"
              />
            </span>
            <span className="control primaryControl">
              <IconButton
                disabled={started ? !activeTask : (!initialHours && !initialMinutes)}
                icon={paused ? "play" : "pause"}
                onClick={started ? this.togglePause : null}
                type={started? "button" : "submit"}
              />
            </span>
            <span className="control secondaryControl">
              <IconButton
                className="secondaryControl"
                disabled={!activeTask}
                icon="forward-step"
                onClick={started ? this.handleSkipClick : null}
                type="button"
              />
            </span>
          </section>
        </form>
        </Container>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  timer: state.timer
})

const mapDispatchToProps = {
  pause: () => pause(),
  resume: () => resume(),
  setDuration: (duration) => setDuration(duration),
  skipActiveTask: () => skipActiveTask(),
  start: () => start(),
  stop: () => stop()
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer)

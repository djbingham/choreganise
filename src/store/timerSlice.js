import { createSlice } from "@reduxjs/toolkit"
import getTimeInSeconds from "../utility/getTimeInSeconds"

const initialState = {
  duration: 0,
  paused: true,
  startTime: null
}

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    pause: (state, action) => {
      state.duration = state.duration - (getTimeInSeconds(new Date()) - state.startTime)
      state.paused = true
      state.startTime = initialState.startTime
    },

    setDuration: (state, action) => {
      state.duration = +action.payload
    },

    start: (state, action) => {
      state.paused = false
      state.startTime = getTimeInSeconds(new Date())
    },

    stop: (state, action) => {
      state.duration = initialState.duration
      state.paused = initialState.paused
      state.startTime = initialState.startTime
    }
  }
})

export const { pause, setDuration, start, stop } = timerSlice.actions

export const selectTimerStarted = (state) => !!state.timer.startTime

export default timerSlice.reducer

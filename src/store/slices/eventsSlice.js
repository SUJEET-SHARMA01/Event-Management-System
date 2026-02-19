import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as eventService from '../../services/eventService'

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      return await eventService.fetchEvents()
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      return await eventService.fetchEventById(id)
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (payload, { rejectWithValue }) => {
    try {
      return await eventService.createEvent(payload)
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await eventService.updateEvent(id, payload)
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id)
      return id
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    list: [],
    currentEvent: null,
    loading: false,
    loadingOne: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list = payload
      })
      .addCase(fetchEvents.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loadingOne = true
        state.error = null
      })
      .addCase(fetchEventById.fulfilled, (state, { payload }) => {
        state.loadingOne = false
        state.currentEvent = payload
      })
      .addCase(fetchEventById.rejected, (state, { payload }) => {
        state.loadingOne = false
        state.error = payload
      })
      .addCase(createEvent.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, { payload }) => {
        state.actionLoading = false
        state.list.push(payload)
      })
      .addCase(createEvent.rejected, (state, { payload }) => {
        state.actionLoading = false
        state.error = payload
      })
      .addCase(updateEvent.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, { payload }) => {
        state.actionLoading = false
        const i = state.list.findIndex((e) => e.id === payload.id)
        if (i !== -1) state.list[i] = payload
        if (state.currentEvent?.id === payload.id) state.currentEvent = payload
      })
      .addCase(updateEvent.rejected, (state, { payload }) => {
        state.actionLoading = false
        state.error = payload
      })
      .addCase(deleteEvent.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, { payload }) => {
        state.actionLoading = false
        state.list = state.list.filter((e) => e.id !== payload)
        if (state.currentEvent?.id === payload) state.currentEvent = null
      })
      .addCase(deleteEvent.rejected, (state, { payload }) => {
        state.actionLoading = false
        state.error = payload
      })
  },
})

export const { clearCurrentEvent, clearError } = eventsSlice.actions
export default eventsSlice.reducer

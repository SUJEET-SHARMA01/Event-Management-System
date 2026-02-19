import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bookedTickets: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
eventSchema.index({ date: 1 })
eventSchema.index({ organizer: 1 })
eventSchema.index({ isActive: 1 })

// Virtual for available tickets
eventSchema.virtual('availableTickets').get(function () {
  return this.capacity - this.bookedTickets
})

// Ensure virtuals are included in JSON
eventSchema.set('toJSON', { virtuals: true })
eventSchema.set('toObject', { virtuals: true })

const Event = mongoose.model('Event', eventSchema)

export default Event

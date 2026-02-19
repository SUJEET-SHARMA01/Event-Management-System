import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    tickets: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'paid',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 })
bookingSchema.index({ event: 1 })
bookingSchema.index({ status: 1 })

// Pre-save middleware to update event bookedTickets
bookingSchema.pre('save', async function (next) {
  if (this.isNew) {
    const Event = mongoose.model('Event')
    await Event.findByIdAndUpdate(this.event, {
      $inc: { bookedTickets: this.tickets },
    })
  }
  next()
})

// Pre-remove middleware to decrease bookedTickets when booking is cancelled/deleted
bookingSchema.pre('findOneAndDelete', async function (next) {
  const booking = await this.model.findOne(this.getQuery())
  if (booking) {
    const Event = mongoose.model('Event')
    await Event.findByIdAndUpdate(booking.event, {
      $inc: { bookedTickets: -booking.tickets },
    })
  }
  next()
})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking

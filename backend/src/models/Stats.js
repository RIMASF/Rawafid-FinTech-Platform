const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  fintechCompanies: { type: Number, default: 0 },
  speakers:         { type: Number, default: 0 },
  opportunities:    { type: Number, default: 0 },
}, { timestamps: true });

statsSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

module.exports = mongoose.model("Stats", statsSchema);

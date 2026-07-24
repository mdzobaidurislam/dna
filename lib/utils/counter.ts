import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

export async function getNextDnaId(): Promise<number> {
  const counter = await Counter.findByIdAndUpdate(
    "dna_id",
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  return counter.sequence_value;
}

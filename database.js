import mongoose from "mongoose";
import catchAsyncErrors from "./middlewares/catchAsyncErrors.js";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

const connectDB = catchAsyncErrors(async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB connected to host: ${connection.host}`);
  app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
  });
});

export default connectDB;

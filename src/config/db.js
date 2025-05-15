import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://renzoruarte7:renzoruarte7@cluster0.td6yflw.mongodb.net/myEcommerce?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Conectado con MongoDB");
  } catch (error) {
    console.log("Error al conectar con MongoDB");
  }
};

export default connectMongoDB;

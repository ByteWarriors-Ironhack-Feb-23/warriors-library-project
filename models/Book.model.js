const { Schema, model } = require("mongoose");


const bookSchema = new Schema(
  {
    title: String,
    description: String,
    rating: Number,
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author"
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Book = model("Book", bookSchema);

module.exports = Book;

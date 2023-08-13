const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const User = require("./user");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: "string",
      required: true,
    },
    text: {
      type: "string",
      required: true,
    },
    completed: {
      type: Boolean,
      dafault: false,
    },
  },
  {
    //this will give created and updated time

    timestamps: true,
  }
);

//adding incremental ticket number : creates a counter

// noteSchema.plugin(AutoIncrement,{
//     inc_field:'ticket',
//     id:'ticketNums',
//     start_seq:500

// })

module.exports = mongoose.model("Note", noteSchema);

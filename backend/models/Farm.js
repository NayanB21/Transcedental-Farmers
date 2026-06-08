const mongoose = require("mongoose");

const FarmSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true
  },

  farmer: Object,

  landRecord: Object,

  location: {
    lat: Number,
    lng: Number
  },

  polygon: [
    {
      lat: Number,
      lng: Number
    }
  ],

  boundarySource: String

},{
  timestamps:true
});

module.exports =
 mongoose.model(
   "Farm",
   FarmSchema
 );
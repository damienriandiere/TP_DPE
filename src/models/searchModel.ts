import { Schema, model } from "mongoose";

const searchesSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId,
    ref : process.env.USERS_COLLECTION,
    required: true},
  parameters: {
    Etiquette_DPE: String,
    Etiquette_GES: String,
    "Code_postal_(BAN)": Number,
    Surface_habitable_logement: Number,
  },
  results: [{
    DPE : {
      type : Schema.Types.ObjectId,
      ref : process.env.DPE_COLLECTION,
      required: true
    },
    address: String,
    latitude: Number,
    longitude: Number,
  }]
});

const Search = model(process.env.SEARCHES_COLLECTION, searchesSchema);

export default Search;
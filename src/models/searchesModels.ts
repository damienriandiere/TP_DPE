import { Schema, model } from "mongoose";

const searchesSchema = new Schema({
  parameters: {
    Etiquette_DPE: String,
    Etiquette_GES: String,
    "Code_postal_(BAN)": Number,
    Surface_habitable_logement: Number,
  },
  results: [],
});

const SearchesModel = model("DRI_searches", searchesSchema);

export default SearchesModel;
import { Schema, model } from 'mongoose'

const depSchema = new Schema({
    "N°_département_(BAN)": Number,
    Date_réception_DPE: Date,
    Date_établissement_DPE: Date,
    Date_visite_diagnostiqueur: Date,
    Etiquette_GES: String,
    Etiquette_DPE: String,
    Année_construction: Number,
    Surface_habitable_logement: Number,
    "Adresse_(BAN)": String,
    "Code_postal_(BAN)": Number,
});

const DPE = model(process.env.DPE_COLLECTION, depSchema)

export default DPE
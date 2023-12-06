import axios from "axios"
import DPE from "../models/dpeModel"
import logger from "../utils/logger"

export async function getGeolocalisation(dpe: string, ges: string, zipcode: number, surface: number) {

  const address = await getAddress(dpe, ges, zipcode, surface)

  let geolocalisation = []

  for (let i = 0; i < address.length; i++) {
    logger.info("Geolocalisation in progress... with " + address[i].address)
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${address[i].address}&format=jsonv2`
    );

    if (response.data.length > 0) {
      logger.info("Geolocalisation found for " + address[i].address)
      logger.info("Latitude: " + response.data[0].lat)
      logger.info("Longitude: " + response.data[0].lon)
      geolocalisation.push({
        DPE: address[i].DPE,
        latitude: response.data[0].lat,
        longitude: response.data[0].lon,
      });
    } else {
      logger.error("No geolocalisation found for " + address[i].address)
      throw new Error('No geolocalisation found');
    }
  }
  logger.info(geolocalisation.length + " geolocalisation found")
  return geolocalisation;
}


export async function getAddress(dpe: string, ges: string, zipcode: number, surface: number) {
  const dpeFind = await DPE.find({
    $and: [
      { Etiquette_DPE: dpe },
      { Etiquette_GES: ges },
      { "Code_postal_(BAN)": zipcode },
      { Surface_habitable_logement: { $lte: surface + 5, $gte: surface - 5 } },
    ],
  });

  if (dpeFind.length === 0) {
    logger.error("No DPE found in database. Please try again with different parameters or contact us if the problem persists.")
    throw new Error("No DPE found in database. Please try again with different parameters or contact us if the problem persists.");
  } else {
    logger.info(dpeFind.length + " DPE found in database")
    let address = [];
    dpeFind.forEach((element) => {
      address.push({
        DPE: element._id,
        address: element["Adresse_(BAN)"]
      });
    });
    return address;
  }
}

import axios from "axios";
import Dpe from "../models/dpeModels";

export async function getGeolocalisation(dpe: string, ges: string, zipcode: number, surface: number) {
    
    const address = await getAddress(dpe, ges, zipcode, surface);

    let geolocalisation = [];

    for (let i = 0; i < address.length; i++) {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${address[i]}&format=jsonv2`
      );
  
      if (response.data.length > 0) {
        geolocalisation.push({
          address: address[i],
          latitude: response.data[0].lat,
          longitude: response.data[0].lon,
        });
      }
    }
  
    if (geolocalisation.length === 0){
        throw new Error('No geoloc found');
    } else {
        return geolocalisation;
    }
}


export async function getAddress(dpe: string, ges: string, zipcode: number, surface: number) {
    const dpeFind = await Dpe.find({    
        $and: [
        { Etiquette_DPE: dpe },
        { Etiquette_GES: ges },
        { "Code_postal_(BAN)": zipcode },
        { Surface_habitable_logement: { $lte: surface + 5, $gte: surface - 5 } },
      ],
    });
  
    if (dpeFind.length === 0){
        throw new Error("No dep found");
    } else {
        let address = [];
        dpeFind.forEach((element) => {
            address.push(element["Adresse_(BAN)"]);
        }); 
        return address;
    }
}

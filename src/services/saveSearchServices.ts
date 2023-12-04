import * as geolocationServices from "./geolocalisationServices";
import SearchesModel from "../models/searchesModels";
import UserModel from "../models/userModels";
import logger from "../utils/logger";
import { UserAccount } from "../types";

export async function saveSearch(connectedUser : UserAccount, dpe : string, ges : string, zipcode : number, surface : number, results : any) {
    const params = {
        DPE: dpe,
        GES: ges,
        "Code Postal": zipcode,
        "Surface habitable": surface
    };

    const savedSearch = new SearchesModel({
        parameters: params,
        results: results,
    });
    
    await savedSearch.save();

    const user = await UserModel.findById(connectedUser.id);

    if (user) {
        user.savedSearches.push(savedSearch);
        await user.save();
    } else {
        logger.error("User not found");
        logger.error("Search not saved");
    }

    return savedSearch;
}

export async function getSearches(connectedUser : UserAccount, page : number) {
    const user = await UserModel.findById(connectedUser.id) 

    const savedSearches = user.savedSearches.slice((page - 1) * 10, page * 10)

    let searches = []

    for (let i = 0; i < savedSearches.length; i++) {
        const search = await SearchesModel.findById(savedSearches[i])
        searches.push(search)
    }

    return searches
}

export async function relaunchSearch(connectedUser: UserAccount, id: string) {
    const user = await UserModel.findById(connectedUser.id);

    const savedSearches = user.savedSearches;

    if (savedSearches.includes(id as any)) {
        const search = await SearchesModel.findById(id);
        const params = search?.parameters;

        if (params) {
            const result = await geolocationServices.getGeolocalisation(
                params["Etiquette_DPE"],
                params["Etiquette_GES"],
                params["Code_postal_(BAN)"],
                params["Surface_habitable_logement"]);
            search.results = result;
            await search.save();
            return search
        }
    } else {
        logger.error("Search not found");
        throw new Error("Search not found");
    }
}

export async function deleteSearch(connectedUser : UserAccount, id: string){
    const user = await UserModel.findById(connectedUser.id)

    const savedSearches = user.savedSearches

    if (savedSearches.includes(id as any)){
        const index = savedSearches.indexOf(id as any)
        savedSearches.splice(index, 1)
        await user.save()
        try {
            await SearchesModel.findByIdAndDelete(id)
        } catch (error) {
            logger.error("Search not found")
            throw new Error("Search not found")
        }
    } else {
        logger.error("Search not found for the specified user")
        throw new Error("Search not found for the specified user")
    }
}

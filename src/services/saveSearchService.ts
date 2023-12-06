import SearchesModel from "../models/searchModel"
import UserModel from "../models/userModel"
import logger from "../utils/logger"
import { UserAccount } from "../types"
import * as geolocationServices from "./geolocationService"

export async function saveSearch(connectedUser: UserAccount, dpe: string, ges: string, zipcode: number, surface: number, results: any) {
    const user = await UserModel.findById(connectedUser.id)
    if (!user){
        logger.error("User not found. Search not saved")
        throw new Error("User not found. Search not saved")
    } else {
        const params = {
            "Etiquette_DPE" : dpe,
            "Etiquette_GES": ges,
            "Code_postal_(BAN)": zipcode,
            "Surface_habitable_logement": surface
        }
        const savedSearch = new SearchesModel({
            user: user._id,
            parameters: params,
            results: results,
        })
        logger.info("Search created")
        await savedSearch.save()
        logger.info("Search saved")
        return savedSearch
    }
}

export async function getSearches(connectedUser: UserAccount, page: number) {
    const search = await SearchesModel.find({ user : connectedUser.id})

    const savedSearches = search.slice((page - 1) * 10, page * 10)

    let searches = []

    for (let i = 0; i < savedSearches.length; i++) {
        const search = await SearchesModel.findById(savedSearches[i])
        searches.push(search)
    }

    return searches
}


export async function relaunchSearch(id: string, connectedUser: UserAccount) {
    if (await SearchesModel.exists({ _id: id })) {
        logger.info("Search found.")
        const search = await SearchesModel.findById(id);
        logger.info(search.parameters)
        const { Etiquette_DPE, Etiquette_GES, "Code_postal_(BAN)": zipcode, "Surface_habitable_logement": surface } = search.parameters
        logger.info("Search parameters found.")
        const result = await geolocationServices.getGeolocalisation(Etiquette_DPE, Etiquette_GES, parseInt(zipcode.toString()), parseInt(surface.toString()))
        logger.info("Relaunch done.")
        await saveSearch(connectedUser, Etiquette_DPE, Etiquette_GES, parseInt(zipcode.toString()), parseInt(surface.toString()), result)
        logger.info("Search saved.")
        return search
    } else {
        logger.error("Search not found.")
        throw new Error("Search not found.")
    }
}

export async function deleteSearch(id: string) {
    try{
        const search = await SearchesModel.findByIdAndDelete(id)
        logger.info("Search deleted.")
        return search
    } catch (error) {
        logger.error("Search not found.")
        throw new Error("Search not found.")
    }
}

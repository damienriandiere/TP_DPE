import dotenv from "dotenv";
import { describe, it, expect, beforeAll } from "@jest/globals";
import mongoose from "mongoose";
import { register } from "../../src/services/authService";
import { deleteUser } from "../../src/services/userService";
import * as savedSearchService from "../../src/services/saveSearchService";

import SavedSearches from "../../src/models/searchModel";
import logger from "../../src/utils/logger";

describe("Test savedSearch service", () => {
    beforeAll(async () => {
        dotenv.config();
        if (process.env.DB_URL) {
            await mongoose.connect(process.env.DB_URL, {});
        } else {
            logger.error("DB_URL is not defined");
        }
    });

    it("should be able to save a search", async () => {
        const user = await register(
            "testUnit2",
            "testUnit2@unit.testUnit",
            "testUnit2"
        );

        const saveSearch = await savedSearchService.saveSearch(
            {
                ...user.userProfile,
                id: user.userProfile.id.toString(),
            },
            "A",
            "A",
            72000,
            65,
            [{
                DPE: "656082c21941e30e2d6d036c",
                address: "4 Rue des Cygnes 72000 Le Mans",
                latitude: "48.0090975",
                longitude: "0.2228414",
            }]
        );

        const search = await SavedSearches.findById(saveSearch.id);

        expect(search.parameters.Etiquette_DPE).toBe("A");
        expect(search.parameters.Etiquette_GES).toBe("A");
        expect(search.parameters["Code_postal_(BAN)"]).toBe(72000);
        expect(search.parameters.Surface_habitable_logement).toBe(65);

        await deleteUser(user.userProfile.id.toString());
    });


    it("should be able to relaunch a search", async () => {
        const user = await register(
            "testUnit2",
            "testUnit2@unit.testUnit",
            "testUnit2"
        );

        const saveSearch = await savedSearchService.saveSearch(
            {
                ...user.userProfile,
                id: user.userProfile.id.toString(),
            },
            "A",
            "A",
            72000,
            65,
            [{
                DPE: "656082c21941e30e2d6d036c",
                address: "4 Rue des Cygnes 72000 Le Mans",
                latitude: "48.0090975",
                longitude: "0.2228414",
            }]
        );

        const search = await savedSearchService.relaunchSearch(
            saveSearch.id,
            {
                ...user.userProfile,
                id: user.userProfile.id.toString(),
            }
        );

        expect(search["results"][0]["address"]).toBe("4 Rue des Cygnes 72000 Le Mans");
        expect(search["results"][0]["latitude"]).toBe(48.0090975);
        expect(search["results"][0]["longitude"]).toBe(0.2228414);

        
        await deleteUser(user.userProfile.id.toString());
    });

    it("should be able to get saved searches", async () => {
        const user = await register(
            "testUnit2",
            "testUnit2@unit.testUnit",
            "testUnit2"
        );

        await savedSearchService.saveSearch(
            {
                ...user.userProfile,
                id: user.userProfile.id.toString(),
            },
            "A",
            "A",
            72000,
            65,
            [{
                DPE: "656082c21941e30e2d6d036c",
                address: "4 Rue des Cygnes 72000 Le Mans",
                latitude: "48.0090975",
                longitude: "0.2228414",
            }]
        );

        const userProfile = {
            ...user.userProfile,
            id: user.userProfile.id.toString(),
        };

        const searches = await savedSearchService.getSearches(userProfile, 1);

        expect(searches[0]["parameters"]["Etiquette_DPE"]).toBe("A");
        expect(searches[0]["parameters"]["Etiquette_GES"]).toBe("A");
        expect(searches[0]["parameters"]["Code_postal_(BAN)"]).toBe(72000);
        expect(searches[0]["parameters"]["Surface_habitable_logement"]).toBe(65);
        
        expect(searches[0]["results"][0]["address"]).toBe("4 Rue des Cygnes 72000 Le Mans");
        expect(searches[0]["results"][0]["latitude"]).toBe(48.0090975);
        expect(searches[0]["results"][0]["longitude"]).toBe(0.2228414);

        await savedSearchService.deleteSearch(searches[0].id);

        await deleteUser(user.userProfile.id.toString());
    });

    it("should be able to delete a saved search", async () => {
        const user = await register(
            "testUnit2",
            "testUnit2@unit.testUnit",
            "testUnit2"
        );

        const saveSearch = await savedSearchService.saveSearch(
            {
                ...user.userProfile,
                id: user.userProfile.id.toString(),
            },
            "A",
            "A",
            72000,
            65,
            [{
                DPE: "656082c21941e30e2d6d036c",
                address: "4 Rue des Cygnes 72000 Le Mans",
                latitude: "48.0090975",
                longitude: "0.2228414",
            }]
        );

        const userProfile = {
            ...user.userProfile,
            id: user.userProfile.id.toString(),
        };

        const searches = await savedSearchService.getSearches(userProfile, 1);

        expect(searches.length).toBe(1);

        await savedSearchService.deleteSearch(saveSearch.id);

        const searches2 = await savedSearchService.getSearches(userProfile, 1);

        expect(searches2.length).toBe(0);

        await deleteUser(user.userProfile.id.toString());

    });
});
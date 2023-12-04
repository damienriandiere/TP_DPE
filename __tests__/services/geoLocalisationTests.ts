import dotenv from "dotenv";
import logger from "../../src/utils/logger";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { register } from "../../src/services/authServices";
import { deleteUser } from "../../src/services/userServices";
import * as geolocService from "../../src/services/geolocalisationServices";

describe("Test geolocalisation service", () => {
    beforeAll(async () => {
        dotenv.config();
        if (process.env.DB_URL) {
          await mongoose.connect(process.env.DB_URL, {
          });
        } else {
          logger.error("DB_URL is not defined");
        }
      });
      afterAll(async () => {
        await mongoose.connection.close();
      });

  it("should be able to get address", async () => {
    const address = await geolocService.getAddress("A", "A", 72380, 170);

    expect(address.length).toBe(1);
    expect(address[0]).toBe("12 Rue des Sorbiers 72380 Saint-Jean-d'Assé");
  });

  it("should be able to get geoloc", async () => {
    const user = await register(
      "testUnit3",
      "testUnit3@unit.testUnit",
      "testUnit3"
    );

    const geoloc = await geolocService.getGeolocalisation(
        "A",
        "A",
        72000,
        65,
    );

    expect(geoloc.length).toBe(1);
    expect(geoloc[0]["address"]).toBe("4 Rue des Cygnes 72000 Le Mans");
    expect(geoloc[0]["latitude"]).toBe("48.0090975");
    expect(geoloc[0]["longitude"]).toBe("0.2228414");

    await deleteUser(user.userProfile.id.toString());
  });
});
import dotenv from "dotenv";
import logger from "../../src/utils/logger";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { register } from "../../src/services/authService";
import { deleteUser } from "../../src/services/userService";
import * as geolocService from "../../src/services/geolocationService";

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
    const address = await geolocService.getAddress("A", "A", 72170, 92);

    expect(address.length).toBe(1);
    expect(address[0].address).toBe("Rue du Major Christophe Fournier 72170 Beaumont-sur-Sarthe");
  });

  it("should be able to get geoloc", async () => {
    const user = await register(
      "testUnit3",
      "testUnit3@unit.testUnit",
      "testUnit3"
    );

    const geoloc = await geolocService.getGeolocalisation("A", "A", 72170, 92)

    expect(geoloc.length).toBe(1);
    expect(geoloc[0]["DPE"].toString()).toBe("656082c21941e30e2d6d0363")
    expect(geoloc[0]["latitude"]).toBe("48.2284088");
    expect(geoloc[0]["longitude"]).toBe("0.1384752");

    await deleteUser(user.userProfile.id.toString());
  });
});
import dotenv from "dotenv";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-global";
import logger from "../../src/utils/logger";

import * as authService from "../../src/services/authService";
import { deleteUser } from "../../src/services/userService";

let mongoServer: any;

describe("Test auth service", () => {
  beforeAll(async () => {
    dotenv.config();

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();

    if (mongoUri) {
      await mongoose.connect(mongoUri, {});
    } else {
      logger.error("Failed to start MongoDB memory server");
    }
  });

  afterAll(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
  });

  it("Should be able to create a user.", async () => {
    const user = await authService.register(
      "Henri Dupont",
      "henri.dupont@outlook.fr",
      "helloworld"
    );

    expect(user).toHaveProperty("accessToken");
    expect(user).toHaveProperty("refreshToken");
    expect(user).toHaveProperty("userProfile");

    await deleteUser(user.userProfile.id.toString());
  });

  it("Should not be able to create a user with an existing email.", async () => {
    let user;
    try {
      user = await authService.register(
        "Henri Dupont",
        "henri.dupont@outlook.fr",
        "helloworld"
      );
      await authService.register(
        "Henri Dupont",
        "henri.dupont@outlook.fr",
        "helloworld"
      );
    } catch (error) {
      await deleteUser(user.userProfile.id);
      expect(error.message).toBe("User already exists !");
    }
  });

  it("Should be able to login a user.", async () => {
    const user = await authService.register(
      "Henri Dupont",
      "henri.dupont@outlook.fr",
      "helloworld"
    );

    const login = await authService.login("henri.dupont@outlook.fr", "helloworld");

    expect(login).toHaveProperty("accessToken");
    expect(login).toHaveProperty("refreshToken");
    expect(login).toHaveProperty("userProfile");

    await deleteUser(user.userProfile.id.toString());
  });

  it("Should not be able to login a user with an unregistered email.", async () => {
    try {
      await authService.login("henri.dupont@outlook.fr", "helloworld");
    } catch (error) {
      expect(error.message).toBe("User not found !");
    }
  });

  it("Should not be able to login a user with the wrong password.", async () => {
    let user;
    try {
      user = await authService.register(
        "Henri Dupont",
        "henri.dupont@outlook.fr",
        "helloworld"
      );

      await authService.login("henri.dupont@outlook.fr", "BonjourMonde");
    } catch (error) {
      await deleteUser(user.userProfile.id);
      expect(error.message).toBe("Incorrect password !");
    }
  });
});
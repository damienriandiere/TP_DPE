import dotenv from "dotenv"
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals"
import mongoose from "mongoose"
import logger from "../../src/utils/logger"
import { MongoMemoryServer } from "mongodb-memory-server-global"

import * as userService from "../../src/services/userService"
import { register } from "../../src/services/authService"

let mongoServer: any

describe("Test user services", () => {
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
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("Should be able to get a user profile.", async () => {
    const user = await register(
      "unitTest1name",
      "unitTest1@iamtest1.fr",
      "unitTest1password"
    );
    logger.info("User registered !");
    const userProfile = await userService.getUserProfile(user.userProfile.id);
    logger.info("User profile retrieved !");

    expect(userProfile.name).toBe("unitTest1name");
    expect(userProfile.email).toBe("unitTest1@iamtest1.fr");

    await userService.deleteUser(user.userProfile.id.toString());
  });

  it("Should be able to delete a user.", async () => {
    const user = await register(
      "unitTest2name",
      "unitTest2@iamtest2.fr",
      "unitTest2password"
    );

    const response = await userService.deleteUser(user.userProfile.id.toString());

    expect(response.message).toBe("User deleted !");
  });
});
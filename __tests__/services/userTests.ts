import dotenv from "dotenv";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import logger from "../../src/utils/logger";

import * as userService from "../../src/services/userServices";
import { register } from "../../src/services/authServices";

describe("Test user services", () => {
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

  it("Should be able to get a user profile.", async () => {
    const user = await register(
      "unitTest2name",
      "unitTest2@iamtest1.fr",
      "unitTest2password"
    );
    logger.info("User registered !")
    const userProfile = await userService.getUserProfile(user.userProfile.id);
    logger.info("User profile retrieved !")

    expect(userProfile.name).toBe("unitTest2name");
    expect(userProfile.email).toBe("unitTest2@iamtest1.fr");

    await userService.deleteUser(user.userProfile.id.toString());
  });

  it("Should be able to delete a user.", async () => {
    const user = await register(
      "unitTest1name",
      "unitTest1@iamtest1.fr",
      "unitTest1password"
    );

    const response = await userService.deleteUser(user.userProfile.id.toString());

    expect(response.message).toBe("User deleted !");
  });
});
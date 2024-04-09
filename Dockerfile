# Use the official Node.js image as base
FROM node:18.20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your Node.js application will run
EXPOSE 1998

# Command to run your Node.js application
CMD ["npm", "start"]
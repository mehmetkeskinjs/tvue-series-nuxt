# Stage 1: Build the application
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy only the built application from the previous stage
COPY --from=build /app/.output /app/.output

# Expose the Nuxt app port
EXPOSE 3000

# Run the Nuxt app
CMD ["node", ".output/server/index.mjs"]

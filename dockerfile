# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY pnpm-lock.yaml package.json ./

# Install the application dependencies
RUN npm install -g pnpm && pnpm i

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN pnpm run build && pnpm run prisma:generate:prod



# Expose the application port
EXPOSE 3003

# Command to run the application
CMD [ "pnpm", "run", "start:migrate:prod" ]

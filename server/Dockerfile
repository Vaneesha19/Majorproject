# Use official Node.js image as the base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install && npm rebuild bcrypt --build-from-source

# Copy the rest of the backend files
COPY . .
RUN npx prisma generate

# Expose the port the server runs on
EXPOSE 3001

# Start the backend server
CMD ["npm", "start"]
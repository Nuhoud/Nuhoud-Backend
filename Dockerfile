# Stage 1: Build
FROM node:18 AS development

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Ensure proto directory exists and copy proto files to the correct location
RUN mkdir -p dist/proto && cp -r src/proto/* dist/proto/

# Run the application
CMD ["npm", "run", "start:dev"]
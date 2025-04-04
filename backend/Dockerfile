FROM node:22-alpine

# Create app directory
WORKDIR /app
# Install app dependencies
COPY . .
RUN npm ci
# Build the app
RUN npm run build

# Copy the built app to the production image
FROM node:22-alpine
WORKDIR /app
COPY --from=0 /app/dist ./dist
COPY --from=0 /app/node_modules ./node_modules

# Copy data to be imported into dist
COPY --from=0 /app/data ./dist/data

# Expose the port the app runs on
EXPOSE 3000
# Run the app
CMD [ "node", "--prof", "dist/index.js" ]

# Use a Node base image that also has Python installed
FROM node:18

# Install Python (if not present in base image)
RUN apt-get update && apt-get install -y python3

# Set working directory
WORKDIR /app

# Copy all files to the container
COPY . .

# Install node dependencies
RUN npm install

# Expose the port your service runs on
EXPOSE 8000

# Start the compiler service (assuming index.mjs is your main file)
CMD ["node", "index.mjs"]


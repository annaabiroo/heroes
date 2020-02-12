# BUILD STAGE
# download node image
FROM node:11.15.0-alpine as build-step

# set work directory inside container
WORKDIR /app

# copy package.json into image
COPY package.json ./

# download angular dependencies
RUN npm install

# copy rest of the project
COPY . .

# build project
RUN npm run build

# RUN STAGE
# download nginx image (web server)
FROM nginx:1.16.0-alpine as prod-stage

# copy file from angular
COPY --from=build-step /app/dist/hello-world-angular /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run the application
CMD ["nginx", "-g", "daemon off;"]

## MERN-Blog-Website
> This is my very first project of a full stack web. The project is a simple blog website built with MERN technologies. Along with React Hooks and Bootstrap.

:eyes: Check it out [https://blogstar-blog.herokuapp.com/](https://blogstar-blog.herokuapp.com/ "Blogstar Blog")

## Quick Start
Add your MongoDB Atlas password, username, dbname to MONGO_PASS, MONGO_USER, DB_NAME of the ```.env``` file or, just set the atlas URL to the ```config``` folder ```mongoURI``` property.
```
  # Install dependencies for server
  npm install

  # Install dependencies for client
  npm run client-install

  # Run the client & server with concurrently
  npm run dev

  # Run the Express server only
  nodemon server.js or npm run server

  # Run the React client only
  npm run client

  # Server runs on http://localhost:5000 and client on http://localhost:3000
```

## Deployment
There is a Heroku post build script so that you do not have to compile your React frontend manually, it is done on the server. Simply push to Heroku and it will build and load the client index.html page

## Cloud Database Service Provider
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas "MongoDB Atlas")

## TO-DO (Front-End)
* :pushpin: Update State When Comments Updated
* :pushpin: Redesign CKEditor section (currenlty not resposnsive). Make it responsive and better
* :pushpin: Work on updating post
* :pushpin: Redesign Footer

## Future Release
* :hourglass_flowing_sand: Make users post Images, Videos, Code etc.
* :hourglass_flowing_sand: Follow, Unfollow user
* :hourglass_flowing_sand: Social Media Integration (Facebook, Google login/signup)

## Version
0.0.1

## License
This project is licensed under the MIT License

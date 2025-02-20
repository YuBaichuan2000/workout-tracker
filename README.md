# [workout-tracker](https://workout-tracker-frontend-1gjy.onrender.com/) deployed on Render

## Demo
To try it out, use the demo account
- Email: demouser1@gmail.com
- Password: 9e%kr8Ud92$k

- Email: baichuan.yu@student.adelaide.edu.au
- Password: #Cc]?,3K5,Ybcq%+7#XNW6J

## User stories
* As a user, I want to signup or login
* As a user, I want to signup or login using Google account
* As a user, I want to upload a workout record
* As a user, I want to edit a workout record
* As a user, I want to delete a workout record


## Tech Stack
* Frontend: React, CSS
* Backend: nodejs with Express, RESTful API
* Database: mongodb, mongoose
* Testing: Postman

## Skills Gained
* How to use React hooks: useState, useEffect, useContext, useReducer
* How to use RESTful API to communicate with frontend and backend
* How to setup frontend and backend from scratch
* How to use JWT for user authentication, how to protect React components and backend routes
* How to use Passport and Google OAuth2.0 to set up user authentication via Google

## Technical Decisions
* Tradeoff between JWT and cookie-session
* Migrate to HTTP-only cookie for JWT to safeguard against XSS

## Bugs Fixed
* Backend redirect route not found in frontend, solution: use redirect/rewrite route rule to fallback to index.html for route handling


## Future Work
* Migrated rate limiting to centralized Redis
* Docker => AWS
* Testing
* Documentation




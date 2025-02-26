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

## Authentication Technical Decisions
* Tradeoff between JWT and session-based
  - JWT is stateless, easy to scale, token is exchanged between client and server in req.headers, good with microservices architecture
  - session-based is stateful and server stores session info, session id is exchanged between client and server, latency with centralised Redis store but can revoke session instantly, leverage existing centralized datastore
* Migrate to HTTP-only cookie for JWT from localStorage to safeguard against XSS
* Server-side validation endpoint VS client-side state management to verify if an user is logged in
  - Server-side is more secure and expiration can be reflected immediately, but introduce more server calls and latency, tried reduce workload by Redis
  - Client-side is fast but complex to implement, invalidation is not reflected immediately, need to call server to reflect expiration
 
## Database Technical Decisions
* Tradeoff between NoSQL and Relational DB
  - NoSQL: flexible schema with simple queries, highly scalable and fast retrival(social media app)
  - Relational DB: structured schema with complex relationship(banking system)

## Bugs Fixed
* Backend redirect route not found in frontend, solution: use redirect/rewrite route rule to fallback to index.html for route handling


## Future Work
* Testing
* Documentation




# [workout-tracker](https://workout-tracker-frontend-1gjy.onrender.com/) deployed on Render

## Demo
To try it out, use the demo account(email verification and reset password only work for my own uni email because a domain name is not purchased)
- Email: demouser1@gmail.com
- Password: 9e%kr8Ud92$k

## Tech Stack
* Frontend: React, CSS
* Backend: nodejs with Express, RESTful API, Langchain for AI Agent
* Database: mongodb, mongoose
* Testing: Postman

## Skills Gained
* How to use React hooks: useState, useEffect, useContext, useReducer
* How to use RESTful API to communicate with frontend and backend
* How to use JWT for user authentication, how to protect React components and backend routes
* How to use Passport and Google OAuth2.0 to set up user authentication via Google
* How to integrate AI Agent to suggest workout based on user workout history using Langchain

## Technical Decisions
* Tradeoff between JWT and session-based
  - JWT is stateless, easy to scale, token is exchanged between client and server in req.headers, good with microservices architecture
  - session-based is stateful and server stores session info, session id is exchanged between client and server, latency with centralised Redis store but can revoke session instantly, leverage existing centralized datastore
* Migrate to HTTP-only cookie for JWT from localStorage to safeguard against XSS
* Server-side validation endpoint VS client-side state management to verify if an user is logged in
  - Server-side is more secure and expiration can be reflected immediately, but introduce more server calls and latency, tried reduce workload by Redis
  - Client-side is fast but complex to implement, invalidation is not reflected immediately, need to call server to reflect expiration
 
## Bugs Fixed
* Backend redirect route not found in frontend, solution: use redirect/rewrite route rule to fallback to index.html for route handling

## Future Work
* Better UI Design
* Documentation




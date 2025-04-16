# [workout-tracker](https://workout-tracker-frontend-1gjy.onrender.com/) fully deployed

## Demo
To try it out, use the demo account(email verification and reset password only work for my own uni email because a domain name is not purchased)
- Email: demouser1@gmail.com
- Password: 9e%kr8Ud92$k

## Tech Stack
* Frontend: React, CSS
* Backend: nodejs with Express, RESTful API, Langchain for AI Agent
* Database: mongodb, mongoose
* Testing: Postman

## API Endpoints
### Workout Routes
- GET /api/workouts => return an array of workout objects for the authenticated user
- GET /api/workouts/:id => return a single workout object
- POST /api/workouts => create and return a new workout for the authenticated user
- PATCH /api/workouts/:id => update and return an existing workout for the authenticated user
- DELETE /api/workouts/:id => delete and return an existing workout for the authenticated user
- GET /api/workouts/suggest => return an AI suggested workout object

### User Routes
- POST /api/users/signup => register a new user and send a verification email
- POST /api/users/verify-email => verify user's email using the token sent
- POST /api/users/login => return user email and set authentication cookie in header
- POST /api/users/logout => log out a user and clear authentication cookie in header
- POST /api/users/forgot-password => send a password reset link to user's email
- POST /api/users/reset-password/:token => reset password using the reset token sent
- GET /api/users/google => Google OAuth authentication
- GET /api/users/google/redirect => Google OAuth callback

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
* Testing
* Documentation




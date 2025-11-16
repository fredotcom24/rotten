# Rotten Tomatoes

Rotten Tomatoes is a modern, customizable movie rating and review platform inspired by the original Rotten Tomatoes.
It allows users to browse a movie catalog, rate films, write reviews, and manage personal preferences through a clean and modular interface.

The platform provides role-based features, secure authentication, and an administrator panel for content and user management.


## Features

### Movie Features

* Movie catalog with search, filtering (genre, director, release date), and sorting.
* Detailed movie pages including synopsis, director, poster, and global score.
* Ability to rate a movie (1–5 stars) and write comments.
* Quick rating directly from the movie list.
* Favorites system to save movies for later.

### User Features

* Account creation with email verification.
* Authentication (login/logout) via JWT.
* Profile management (username, email, password).
* Ability to edit or delete personal ratings and comments.

### Admin Features

* User list and account management (create, edit, disable, delete).
* User role management (promote/demote administrators).
* Movie management: add movies via TMDB API, edit details, delete entries.
* Comment moderation (remove inappropriate content).
* Platform statistics (average ratings, number of movies, top movies, etc.).

## Tech Stack
**Frontend**

* React - Next.js
* TailwindCSS

**Backend**
* NestJS
* Prisma ORM
* PostgreSQL or MySQL
* JWT-based authentication
* TMDB API integration

**Tooling**

* Docker
* ESLint

### Frontend 
### Backend

npm install
npm run dev

## Tests

npm run test

## License

MIT.

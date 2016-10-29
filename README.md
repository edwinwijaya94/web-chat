# web-chat
Web chat using rabbit-mq

## API list
 - Get user by ID : `GET /user/user/:id` -> `GET /user/user/1`
 - Register new user : `POST /user/register`. JSON format with params : `name`, `password`, `photoUrl`(optional, leave blank `""` to use default photo).
 - Login : `POST /user/login`. JSON format with params : `name`, `password`.
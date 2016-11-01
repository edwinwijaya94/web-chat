# web-chat
Web chat using rabbit-mq

## API list
 - Get user by ID : `GET api/user?id=...` -> `GET api/user?id=1`
 - Register new user : `POST api/user/register`. JSON format with params : `name`, `password`, `photoUrl`(optional, leave blank `""` to use default photo).
 - Login : `POST api/user/login`. JSON format with params : `name`, `password`.
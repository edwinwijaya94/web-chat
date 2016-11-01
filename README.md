# web-chat
Web chat using rabbit-mq

## API list
 - Get user by ID : `GET api/user?id=...` -> `GET api/user?id=1`
 - Register new user : `POST api/user/register`. JSON format with params : `name`, `password`, `photo_url`(optional, leave blank `""` to use default photo).
 - Login : `POST api/user/login`. JSON format with params : `name`, `password`.
 - Add friend : `POST api/user/add`. JSON format with params : `user_id`, `friend_id`.
 - Get friends list : `GET api/user/friends?id=...` 
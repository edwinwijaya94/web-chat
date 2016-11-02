# web-chat
Web chat using rabbit-mq

## API list

### User
 - Get user by ID : `GET api/user?id=...`
 - Register new user : `POST api/user/register`. JSON format with params : `name`, `password`, `photo_url`(optional, leave blank `""` to use default photo).
 - Login : `POST api/user/login`. JSON format with params : `name`, `password`.
 - Add friend : `POST api/user/add`. JSON format with params : `user_id`, `friend_name`.
 - Get friend list : `GET api/user/friends?id=...` 
 - Get group list : `GET api/user/groups?id=...` 

### Group
 - Get group by ID : `GET api/group?id=...`
 - Create new group : `POST api/group/create`
   example :
   ```
   {
	  "name": "Hello 3",
	  "member": [{"name":"gerry"},
	  				{"name":"elvan"},
	  				{"name":"jessica"}
	  			],
	  "admin_id": "01fa85ea-d2bc-4852-ab35-7db61c0d37b2"
   }
   ```
 - Add a member to group : `POST api/group/add`
 	example :
 	```
 	{
		"group_id":"6cf7c712-a18d-4d13-886e-bd2ef3d66b68",
		"member_name":"erick"
	}
 	```
 - Remove a member from group : `POST api/group/remove`
 	example :
 	```
 	{
		"group_id":"6cf7c712-a18d-4d13-886e-bd2ef3d66b68",
		"member_name":"erick"
	}
 	```
 
### Chat
 - Get chat of user and friend : `GET api/chat/user?user_id=...&friend_id=...`
 - Send personal chat : `POST api/chat/user`
  example : 
  ```
  {
	"user_id":"01fa85ea-d2bc-4852-ab35-7db61c0d37b2",
	"friend_id":"2aa7f672-e70a-4b71-a608-8bb2ff83e6d3",
	"chat":"I dont know"
  }
  ```
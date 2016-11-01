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
  	"name": "Hello 2",
  	"member": [
  			{"id":"01fa85ea-d2bc-4852-ab35-7db61c0d37b2"},
  			{"id":"5b1ec427-7d0e-491e-b136-bfae421378b0"},
  			{"id":"856d434b-fa99-4061-8275-15f918bcab76"}
  		],
  	"admin_id": "01fa85ea-d2bc-4852-ab35-7db61c0d37b2"
	}
   ```
 - Add a member to group : `POST api/group/add`
 	example :
 	```
 	{
		"group_id":"6cf7c712-a18d-4d13-886e-bd2ef3d66b68",
		"user_id":"4577946d-7452-44c3-a6a2-150f749a554e"
	}
 	```
 - Remove a member from group : `POST api/group/remove`
 	example :
 	```
 	{
		"group_id":"6cf7c712-a18d-4d13-886e-bd2ef3d66b68",
		"user_id":"4577946d-7452-44c3-a6a2-150f749a554e"
	}
 	```
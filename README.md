# web-chat
Web chat using rabbit-mq

## Anggota kelompok
 1. Edwin Wijaya / 13513040
 2. Randi Chilyon Alfianto / 13513087

## Desain Aplikasi

 - Aplikasi menggunakan platform web
 - RabbitMQ digunakan pada pengiriman chat, baik untuk personal chat maupun group chat. Terdapat 1 exchange yaitu `chat_controller` yang bertugas memasukkan chat yang diterima dari client ke dalam salah satu queue : `personal_chat` atau `group_chat` sesuai dengan jenis chat nya. Terdapat 2 consumers yang bertugas menyimpan chat dari queue ke database.

## Petunjuk Instalasi

 1. Install NodeJS, MySQL, RabbitMQ
 2. Import web_chat.sql ke dalam database
 3. Clone repository ini / buka folder source code
 4. `$ npm install`
 5. `$ npm start`
 6. Akses aplikasi pada `localhost:3000`

## Daftar Tes Fitur

 1. Register
 2. Login
 3. Add friend
 4. Create group
 5. Add member to group
 6. Remove member to group
 7. Personal chat
 8. Group chat

## Langkah-Langkah Tes

 1. Buka aplikasi melalui browser di `localhost:3000`
 2. Klik tombol register pada halaman yang ditunjukkan
 3. Lakukan register untuk akun baru, setelah selesai akan diarahkan ke halaman login
 4. Login dengan akun yang telah diregister tadi
 5. Add friend dengan klik tombol `+` di friend list kemudian ketik friend name yang akan ditambahkan
 6. Friend list menampilkan teman yang pernah di add
 7. Create new group dengan klik tombol `+` pada group list, kemudian masukkan nama grup dan member (dipisahkan dengan koma)
 8. Klik salah satu friend untuk melakukan chat. History chat akan ditampilkan pada kotak chat di sebelah kiri secara terurut. Untuk melakukan chat, ketik pesan pada box yang disediakan kemudian tekan enter. History pesan terbaru akan ditampilkan kemudian.
 9. Klik salah satu group untuk melakukan group chat. History chat akan ditampilkan pada kotak chat di sebelah kiri secara terurut, berikut dengan nama member yang mengirim setiap chat. Untuk melakukan chat, ketik pesan pada box yang disediakan kemudian tekan enter. History pesan terbaru akan ditampilkan kemudian.
 10. Klik tombol `+` pada room chat group dan ketikkan nama salah satu user untuk menambahkan ke dalam group
 11. Klik tombol `trash` pada room chat group dan ketikkan nama salah satu member group untuk kick member tersebut

## API List

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

 - Get group chat : `GET api/chat/group?group_id=...`
 - Send group chat : `POST api/chat/group`
 example :

  	```
	{
		"user_id":"c02df700-9d1a-4979-83c6-31bca1b9f4db",
		"group_id":"0ec07a3d-4d0a-4757-9efb-50900dec7387",
		"chat":"gelut oi"
	}
	```

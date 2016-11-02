var app = angular.module("web-chat", []);

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

app.controller("userController", function($scope, $http){
	var id = getParameterByName("id");
	$http.get("/api/user?id="+id).then(function(response){
		$scope.user = response.data;
	});

	$scope.go = function ( path ) {
	  window.location.href = path;
	};
});

app.controller("friendController", function($scope, $http){
	var id = getParameterByName("id");
	var friendData = {};
	$scope.friends = [];

	$http.get("/api/user/friends?id="+id).then(function(response){
		$scope.friends = response.data.data;

		for (var i = 0;i<$scope.friends.length;i++){
			friendData[$scope.friends[i].id] = $scope.friends[i]
		}
	});

	$scope.inviteNewFriend=false;

	$scope.newFriendOnClick = function(){
		$scope.inviteNewFriend = !$scope.inviteNewFriend;
		$scope.newFriendName = "";
	};

	$scope.addNewFriend = function(){
		console.log(id);
		console.log($scope.newFriendName)
		$http.post("/api/user/add", {user_id: id , friend_name: $scope.newFriendName})
            .then(function(response) {
                $scope.newFriendOnClick();
                $scope.friends.push(response.data)
                friendData[response.data.id] = response.data;
            }, function(response){
                $scope.errorMessage = response.data.error
            });
	}

	$scope.friendOnClick = function(friendId){
		$scope.clickedFriend = friendId
		$scope.$emit('friendClickEvent',{
			friend: friendData[friendId]
		})
	}


});

app.controller("groupController", function($scope, $http){
	var id = getParameterByName("id");
	var groupData = {}
	$http.get("/api/user?id="+id).then(function(response){
		$scope.adminName = response.data.name;
	});
	$scope.groups = [];

	$http.get("/api/user/groups?id="+id).then(function(response){
		console.log("data ",response.data.data)
		$scope.groups = response.data.data;

		for (var i = 0;i<$scope.groups.length;i++){
			groupData[$scope.groups[i].id] = $scope.groups[i]
		}
	});

	$scope.isCreateNewGroup=false;

	$scope.newGroupOnClick = function(){
		$scope.isCreateNewGroup = !$scope.isCreateNewGroup;

		$scope.newGroupName = "";
		$scope.newMember = "";
	};

	$scope.createNewGroup = function(){
		var memberNames = String($scope.newMember).split(",");

		var memberJson = []
		memberJson.push({"name": $scope.adminName})
		for (var i = 0; i<memberNames.length ; i++){
			console.log(memberNames[i])
			memberJson.push({"name": memberNames[i]});
		}

		$http.post("/api/group/create", {name: $scope.newGroupName , member: memberJson, admin_id: id})
            .then(function(response) {
                $scope.newGroupOnClick();
                $scope.groups.push(response.data)
                groupData[response.data.id] = response.data;
            }, function(response){
                $scope.errorMessage = response.data.error
            });
	}

	$scope.groupOnClick = function(groupId){
		$scope.clickedGroup = groupId
		$scope.$emit('groupClickEvent',{
			group: groupData[groupId]
		})
	}



});

app.controller("chatController", function($scope, $http){
	var id = getParameterByName("id");
	$http.get("/api/user?id="+id).then(function(response){
		$scope.userName = response.data.name;
	});

	$scope.chats=[];

	$scope.$on('openFriendChatEvent',function(event,args){
		var friend = args["friend"];
		console.log("friend",friend)
		$scope.groupDetail = null;
		$scope.chatFriend = friend;
		$scope.roomName = friend.name;
	})

	$scope.$on('openGroupChatEvent',function(event,args){
		var group = args["group"];
		$scope.chatFriend=null;
		$scope.chatGroup = group;
		$scope.roomName = group.name;

		$http.get("/api/group?id="+group.id).then(function(response){
			$scope.groupDetail = response.data;
		});
	})
	$scope.addNewMemberGroup = false;
	$scope.kickGroupMember = false;

	$scope.addMemberOnClick = function(){
		$scope.kickGroupMember = false;
		$scope.addNewMemberGroup = !$scope.addNewMemberGroup

		$scope.newMemberName = ""
	}

	$scope.addMember = function(){
		$http.post("/api/group/add", {group_id: $scope.groupDetail.id , member_name: $scope.newMemberName})
			.then(function(response) {
                $scope.addMemberOnClick();
                $scope.groupDetail = (response.data);
                console.log(response)
            }, function(response){
                $scope.errorMessage = response.data.error
            });
	}

	$scope.kickMemberOnClick = function(){
		$scope.addNewMemberGroup = false;
		$scope.kickGroupMember = !$scope.kickGroupMember

		$scope.memberName = ""
	}

	$scope.kickMember = function(){
		$http.post("/api/group/remove", {group_id: $scope.groupDetail.id , member_name: $scope.memberName})
			.then(function(response) {
				for(var i = 0; i < $scope.groupDetail.member.length ; i++){
					if ($scope.groupDetail.member[i].name === $scope.memberName){
						$scope.groupDetail.member.splice(i,1);
					}
				}
                $scope.kickMemberOnClick();
                console.log(response)
            }, function(response){
                $scope.errorMessage = response.data.error
            });
	}
});

app.controller("showUserChatController", function($scope,$http){
	var id = getParameterByName("id");
	$http.get("/api/user?id="+id).then(function(response){
		$scope.userName = response.data.name;
	});

	$scope.$on('openFriendChatEvent',function(event,args){
		var friend = args["friend"];
		$scope.chatFriend = friend;

		if($scope.chatFriend){
			$http.get("api/chat/user?user_id=" + id + "&friend_id="+$scope.chatFriend.id).then(function(response){
				$scope.chatData = response.data;
				for (var i = 0; i < $scope.chatData.data.length ; i++){
					$scope.chatData.data[i].date_time = moment($scope.chatData.data[i].date_time).fromNow()
				}
			});
		}
	})

	$scope.$on('openGroupChatEvent',function(event,args){
		var group = args["group"];
		$scope.chatGroup = group;

		$http.get("/api/group?id="+group.id).then(function(response){
			$scope.groupDetail = response.data;

			if($scope.groupDetail){
				$http.get("api/chat/group?group_id=" + $scope.groupDetail.id).then(function(response){
					$scope.chatData = response.data;
					for (var i = 0; i < $scope.chatData.data.length ; i++){
						$scope.chatData.data[i].date_time = moment($scope.chatData.data[i].date_time).fromNow()
					}
				});
			}
		});

	})	

	$scope.$on("openNewChatEvent",function(event,args){
		var chatData = args["chatData"];
		$scope.chatData = chatData;
	})
})

app.controller("newChatUserController", function($scope, $http){
	var id = getParameterByName("id");
	$http.get("/api/user?id="+id).then(function(response){
		$scope.userName = response.data.name;
	});

	$scope.$on('openFriendChatEvent',function(event,args){
		var friend = args["friend"];
		$scope.chatFriend = friend;

		if($scope.chatFriend){
			console.log($scope.newChat)
			$scope.postNewChat = function(){
				$http.post("/api/chat/user", {user_id: id , friend_id: $scope.chatFriend.id, chat: $scope.newChat})
					.then(function(response) {
						$scope.newChat = "";
						$http.get("api/chat/user?user_id=" + id + "&friend_id="+$scope.chatFriend.id).then(function(response){
								$scope.chatData = response.data;
								for (var i = 0; i < $scope.chatData.data.length ; i++){
									$scope.chatData.data[i].date_time = moment($scope.chatData.data[i].date_time).fromNow()
								}
								console.log("chatdata", $scope.chatData.data)
								$scope.$emit('postNewChatEvent',{
									chatData: $scope.chatData
								})
							});
		            }, function(response){
		                $scope.errorMessage = response.data.error
		            });
			}	
		}
	})

	$scope.$on('openGroupChatEvent',function(event,args){
		var group = args["group"];
		$scope.chatGroup = group;

		$http.get("/api/group?id="+group.id).then(function(response){
			$scope.groupDetail = response.data;

			if($scope.groupDetail){
				console.log($scope.newChat)
				$scope.postNewChat = function(){
					$http.post("/api/chat/group", {user_id: id , group_id: $scope.groupDetail.id, chat: $scope.newChat})
						.then(function(response) {
							$scope.newChat = "";
							$http.get("api/chat/group?group_id="+$scope.groupDetail.id).then(function(response){
								$scope.chatData = response.data;
								console.log(response.data)
								for (var i = 0; i < $scope.chatData.data.length ; i++){
									$scope.chatData.data[i].date_time = moment($scope.chatData.data[i].date_time).fromNow()
								}
								$scope.$emit('postNewChatEvent',{
									chatData: $scope.chatData
								})
							});
			            }, function(response){
			                $scope.errorMessage = response.data.error
			            });
				}	
			}
		});
	})
})

app.controller("appController", function($scope,$http){
	$scope.$on("friendClickEvent", function(event,args){
		$scope.$broadcast("openFriendChatEvent",args)
	})	

	$scope.$on("groupClickEvent", function(event,args){
		$scope.$broadcast("openGroupChatEvent",args)
	})

	$scope.$on("postNewChatEvent", function(event,args){
		$scope.$broadcast("openNewChatEvent",args)
	})
});


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

		$scope.roomName = friend.name;
		console.log("roomName",$scope.roomName);
	})

	$scope.$on('openGroupChatEvent',function(event,args){
		var group = args["group"];

		$scope.roomName = group.name;
		console.log("roomName",$scope.roomName);
	})

});

app.controller("appController", function($scope,$http){
	$scope.$on("friendClickEvent", function(event,args){
		$scope.$broadcast("openFriendChatEvent",args)
	})	

	$scope.$on("groupClickEvent", function(event,args){
		$scope.$broadcast("openGroupChatEvent",args)
	})
});
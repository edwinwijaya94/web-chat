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
});

app.controller("friendController", function($scope, $http){
	var id = getParameterByName("id");
	$scope.friends = [];
	$http.get("/api/user/friends?id="+id).then(function(response){
		$scope.friends = response.data.data;
	});

	$scope.inviteNewFriend=false;

	$scope.newFriendOnClick = function(){
		$scope.inviteNewFriend = !$scope.inviteNewFriend;
		$scope.isAddNewUser = !$scope.isAddNewUser;

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
});

app.controller("groupController", function($scope, $http){
	var id = getParameterByName("id");
	$http.get("/api/user/groups?id="+id).then(function(response){
		console.log("data ",response.data.data)
		$scope.groups = response.data.data;
	});
});
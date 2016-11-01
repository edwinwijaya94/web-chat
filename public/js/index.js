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
	$http.get("/api/user/friends?id="+id).then(function(response){
		$scope.friends = response.data.data;
	});
});

app.controller("groupController", function($scope, $http){
	var id = getParameterByName("id");
	$http.get("/api/user/groups?id="+id).then(function(response){
		console.log("data ",response.data.data)
		$scope.groups = response.data.data;
	});
});
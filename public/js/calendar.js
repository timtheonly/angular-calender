/*
 * Your Calendar App goes here
 */
var app  = angular.module("calendar",[]);

//controller handles data manipulation
app.controller("calendarCtrl",["$scope", "$http", function($scope, $http){
	$scope.title = "My Calendar";
	$scope.cal = [];
	//$scope.loc = -1;

	$scope.insert = function(loc)
	{
		if(loc > -1)
		{
			$http.post('/calendar/entries',{ what: $scope.what, when: $scope.when, where: $scope.where, until:$scope.until }).success(function(data, status, headers, config){
				$scope.what = "";
				$scope.when ="";
				$scope.where ="";
				$scope.until="";
				$scope.addEntry.$setPristine();
				$scope.cal.push(data);
				console.log('added');
			});
		}else{
			console.log(loc);
			$http.put('/calendar/entries/' + $scope.cal[loc]._id,{ what: $scope.what, when: $scope.when, where: $scope.where, until:$scope.until }).success(function(data, status, headers, config){
				$scope.what = "";
				$scope.when ="";
				$scope.where ="";
				$scope.until="";
				$scope.addEntry.$setPristine();
				$scope.cal[loc] = data;
				console.log('updated');
				$scope.loc = -1;
			});

		}
	};

	$scope.fillForm = function(loc)
	{
		$scope.loc = loc;
		$scope.what = $scope.cal[loc].what;
		$scope.when =$scope.cal[loc].when;
		$scope.where =$scope.cal[loc].where;
		$scope.until=$scope.cal[loc].until;

	};

	$scope.remove = function(loc)
	{
		$http.delete('/calendar/entries/'+$scope.cal[loc]._id).success(function(data,status,headers,config){
			console.log('deleted');
			$scope.cal.splice(loc,1);
		});
	};

	$scope.refresh = function()
	{
		$http.get('/calendar/entries').success(function(data, status, headers, config){
			$scope.cal = data;
		});
	};

	$scope.refresh();
}]);


//fill in the calender
app.directive('caldata', function($compile) {
	var html ="";
	var el;
	var compiled;
	return {
		restrict: 'E',
		replace:true,
		template:'<div></div>',
		link:function(scope,elm,attr){
			scope.$watchCollection('cal', function(){
				html = "<table><tr>";
				for(var i in scope.cal)
				{
					if(i %  5 === 0 && i !== 0)//only five elements per row
					{
						html += "</tr><tr>";
					}
					html += "<td><div class='well entry'><button class='btn btn-xs btn-info' ng-click='fillForm("+i+")'><i class='fa fa-pencil'></i></button>&nbsp;<button class='btn btn-xs btn-info' ng-click='remove("+i+")'><i class='fa fa-times'></i></button><ul class='list-unstyled'>";
					html += "<li>"+ scope.cal[i].what +"</li>";
					html += "<li>"+ scope.cal[i].where +"</li>";
					html += "<li>"+ scope.cal[i].when +"</li>";
					html += "<li>"+ scope.cal[i].until +"</li>";
					html += "</ul></div></td>";
				}
				html += "</tr></table>";
				elm.html(html);
				$compile(elm.contents())(scope);
				console.log('watch called');
			});
		}

    };
  });


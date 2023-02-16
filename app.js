
var myApp = angular.module("myApp", []);

myApp.directive('validare', function() {
  var regExp = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  return {
    link: function(scope, elm) {
      elm.on("keyup",function(){
        var exista = regExp.test(elm.val());
        if(exista && elm.hasClass('eroare') || elm.val() == ''){
          elm.removeClass('eroare');
        } else if(exista == false && !elm.hasClass('eroare')){
          elm.addClass('eroare');
        }
      });
    }
  }
});


myApp.service("RegisterService" , function(){
 
	// Save User
	this.save = function(user)  
	{
    var currentUsers =  this.list();
    if (!currentUsers) {
      currentUsers = new Array()
    }
    currentUsers.push(user);
    window.localStorage.setItem('usersGarburMirela', JSON.stringify(currentUsers));

  };
  
	// List Users
	this.list = function()
	{
    var reg = localStorage.getItem("usersGarburMirela");  
    if (!reg) {
      return  null
    } else {
      return JSON.parse(reg);
    }
  };
  
  this.search = function(x) {
    var users = this.list()
    for(var i in users )
    {
      if(users[i].email == x.email && users[i].password == x.password)
      {
        return users[i];
      }
    }
    return null
  };

  this.getCurrentUser = function() {
    return window.localStorage.getItem('CurrentUserMirela');
  };

  this.setCurrentUser = function (x) {
    if (!x) {
      window.localStorage.removeItem('CurrentUserMirela');
    } else {
      window.localStorage.setItem('CurrentUserMirela', x);
    }
  };
  
});

myApp.service('routing', function() {
  this.loadPage =  function (x){
    window.location.href = x;
  }
});

// Register Controller 
myApp.controller("RegisterController" , function($scope , RegisterService){
  console.clear();
  $scope.users = RegisterService.list();
  console.log($scope.users)
  $scope.mesajEroare = "Email is required."
  $scope.disableRegister = true;

  $scope.verificaDisponibilitate = function() {
    $scope.disableRegister =   !$scope.newUser.nume || !$scope.newUser.email ||  !$scope.newUser.login || !$scope.newUser.password
    console.log($scope.newUser)
  }

  $scope.confirma = function()
  {
   console.log($scope.newUser);
   if($scope.newUser == null || $scope.newUser == angular.undefined)
     return;
   RegisterService.save($scope.newUser);
   $scope.users = RegisterService.list();
   console.log($scope.users + "")
   window.location.href = "login.html"
 };		
 $scope.anuleaza = function () {
   $scope.newUser.nume = ""
   $scope.newUser.email = ""
   $scope.newUser.login = ""
   $scope.newUser.parola = ""
 }
});

// Login Controller 
myApp.controller("LoginController" , function($scope , RegisterService, routing){
  $scope.users = RegisterService.list();
  $scope.currentUser = RegisterService.getCurrentUser();
  $scope.updateData = function() {
    $scope.users = RegisterService.list();
    $scope.currentUser = RegisterService.getCurrentUser();
  }

  $scope.loginFunc = function() {
    console.log($scope.loginUser)
    var searchedUser = RegisterService.search($scope.loginUser)

    if (!searchedUser) {
      console.log("nu a fost gasit nimic")
    } else {
      RegisterService.setCurrentUser($scope.loginUser.email)
      console.log("am gasit utilizatorul")
      routing.loadPage("index.html")
    }
  }
  console.log($scope.currentUser)
  console.log($scope.users)

  
});


myApp.service('calculator', function() {
  this.getSuma = function(x) {
    var suma = 0 
    x.forEach((item, index)=> {
      suma += item.pret    
    });
    return suma
  }
});

myApp.controller("IndexController" , function($scope , RegisterService, routing, calculator){
  $scope.users = RegisterService.list();
  $scope.currentUser = RegisterService.getCurrentUser();
  $scope.verifica = "Nu este ng-non-bindable"
  $scope.telefoane = [
  {nume: "Ring", imagine: "https://css.brilliantearth.com/static/img/gateway/engagement-rings/ir336/ER-GW-cyo-diamond-ring-fall-image-XS.jpg?v1", pret:2500},
  {nume: "Bracelet", imagine: "https://www.cartier.com/dw/image/v2/BGTJ_PRD/on/demandware.static/-/Sites-cartier-master/default/dw19aad47b/images/large/637708802635616886-2059335.png?sw=750&sh=750&sm=fit&sfrm=png", pret:1900},
  {nume: "Earring", imagine: "https://asset.swarovski.com/images/$size_1450/t_swa002/c_scale,dpr_auto,f_auto,w_auto/5504753_ms1/swarovski-sparkling-dance-drop-earrings--round-cut--white--rose-gold-tone-plated-swarovski-5504753.jpg", pret:3000},
  ]
  $scope.telefoaneCart = new Array();
  $scope.addToCart = function(x) {
    $scope.telefoaneCart.push(x);
    console.log($scope.telefoaneCart)
  }

  $scope.removeFromCart = function(x) {
    $scope.telefoaneCart.splice(x, 1);
  }

  $scope.getSumaFromCart = function() {
    return calculator.getSuma($scope.telefoaneCart)
  }

  
});

myApp.directive('modal', function () {
  return {
    template: '<div class="modal fade">' + 
    '<div class="modal-dialog">' + 
    '<div class="modal-content">' + 
    '<div class="modal-header">' + 
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
    '<h4 class="modal-title">{{ title }}</h4>' + 
    '</div>' + 
    '<div class="modal-body" ng-transclude></div>' + 
    '</div>' + 
    '</div>' + 
    '</div>',
    restrict: 'E',
    transclude: true,
    replace:true,
    scope:true,
    link: function postLink(scope, element, attrs) {
      scope.title = attrs.title;

      scope.$watch(attrs.visible, function(value){
        if(value == true)
          $(element).modal('show');
        else
          $(element).modal('hide');
      });

      $(element).on('shown.bs.modal', function(){
        scope.$apply(function(){
          scope.$parent[attrs.visible] = true;
        });
      });

      $(element).on('hidden.bs.modal', function(){
        scope.$apply(function(){
          scope.$parent[attrs.visible] = false;
        });
      });
    }
  };
});


myApp.controller("HeaderController" , function($scope , RegisterService, routing){
  $scope.users = RegisterService.list();
  $scope.currentUser = RegisterService.getCurrentUser();
  
  console.log($scope.currentUser)
  console.log($scope.users)

  $scope.logout = function() {
    RegisterService.setCurrentUser(null);
    routing.loadPage('index.html')
  }

  $scope.showModal = false;
  $scope.toggleModal = function(){
    $scope.showModal = !$scope.showModal;
  };


  
});
angular.module('starter', ['ionic','xeditable']).config(function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('home', {
		url : '/',
		templateUrl : 'temps/home2.html',
		controller : 'homeCtrl'
	});

	

	// Send to login if the URL was not found
	$urlRouterProvider.otherwise('/');
})


.directive('myclick', function() {

	return function(scope, element, attrs) {

		element.bind('touchstart click', function(event) {

			event.preventDefault(); 
			event.stopPropagation();

			scope.$apply(attrs['myclick']);
		});
	};
	
	
})

.directive('iosDblclick', function() {

	const DblClickInterval = 300;
	//milliseconds

	var firstClickTime;
	var waitingSecondClick = false;

	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			element.bind('click', function(e) {

				if (!waitingSecondClick) {
					firstClickTime = (new Date()).getTime();
					waitingSecondClick = true;

					setTimeout(function() {
						waitingSecondClick = false;
					}, DblClickInterval);
				} else {
					waitingSecondClick = false;

					var time = (new Date()).getTime();
					if (time - firstClickTime < DblClickInterval) {
						scope.$apply(attrs.iosDblclick);
					}
				}
			});
		}
	};
})

.directive('whenScrolled', function($rootScope) {
	return function(scope, elm, attr) {
		var raw = elm[0];
		
		
		elm.bind('scroll', function() {
			$rootScope.scrollTop = raw.scrollTop;	
			$rootScope.$apply();				
			if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight * 0.8) {
				scope.$apply(attr.whenScrolled);
			}
		});
	};
	
}).directive('whenScrolledBlog', function($rootScope) {
	return function(scope, elm, attr) {
		var raw = elm[0];
		
		
		elm.bind('scroll', function() {
			$rootScope.scrollTop = raw.scrollTop;	
			$rootScope.$apply();				
			if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight * 0.8) {
				scope.$apply(attr.whenScrolled);
			}
		});
	};
	
})
.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        var content = element.find('a');
        content.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
}) 
.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
                
            element.bind('load', function() {
                

            });
       
			

        }
    };
})


.directive('sbLoad', ['$parse',
function($parse) {
	return {
		restrict : 'A',
		link : function(scope, elem, attrs) {
			var fn = $parse(attrs.sbLoad);
			elem.on('load', function(event) {
				scope.$apply(function() {
					fn(scope, {
						$event : event
					});
				});
			});
		}
	};
}])

.directive('scrollWatch', function($rootScope) {
	return function(scope, elem, attr) {
		var start = 0;
		var threshold = 50;
		var raw = elem[0];

		elem.bind('scroll', function(e) {

			//console.log(raw.scrollTop)

			if (raw.scrollTop - start > threshold) {
				$rootScope.slideHeader = true;
			} else {
				$rootScope.slideHeader = false;

			}
			if ($rootScope.slideHeaderPrevious >= raw.scrollTop - start) {
				$rootScope.slideHeader = false;

			}
			$rootScope.slideHeaderPrevious = raw.scrollTop - start;
			$rootScope.$apply();
		});
	};
})


.directive('style', function($compile) {
	return {
		restrict : 'E',
		link : function postLink(scope, element) {
			if (element.html()) {
				var template = $compile('<style ng-bind-template="' + element.html() + '"></style>');
				element.replaceWith(template(scope));
			}
		}
	};
})



.filter('sumOfTwoValues', function () {
    return function (data, key1, key2) {
        if (typeof (data) === 'undefined' || typeof (key1) === 'undefined' || typeof (key2) === 'undefined') {
            return 0;
        }
        var keyObjects1 = key1.split('.');
        var keyObjects2 = key2.split('.');
        var sum = 0;
        for (i = 0; i < data.length; i++) {
            var value1 = data[i];
            var value2 = data[i];
            for (j = 0; j < keyObjects1.length; j++) {
                value1 = value1[keyObjects1[j]];
            }
            for (k = 0; k < keyObjects2.length; k++) {
                value2 = value2[keyObjects2[k]];
            }
            sum = sum + (1 * value2);
            
            //sum = sum + (value1 * value2); első változó helyett egyes..
        }
        return sum;
    }
})



.controller('homeCtrl', function($scope, $window,  $rootScope,  $filter, $location, $anchorScroll, $ionicTabsDelegate, $ionicScrollDelegate, $ionicPlatform, $animate, $timeout, $ionicModal, $ionicSlideBoxDelegate, $state, $ionicPopup, $ionicPlatform, $ionicSideMenuDelegate, $ionicLoading, $http) {



	$rootScope.online = navigator.onLine;
	$window.addEventListener("offline", function() {
		$rootScope.$apply(function() {
			$rootScope.online = false;
		});
	}, false);
	$window.addEventListener("online", function() {
		$rootScope.$apply(function() {
			$rootScope.online = true;
		});
	}, false); 

	
	
	//visszagombkezelése android
	
	
	
	$scope.keszAKepBezar = function() {	
		$scope.keszAKep = false;
		$scope.$apply();
	};

	$scope.keszitsTobbetBezar = function() {

		$scope.keszitsTobbet = false;
		$scope.$apply();
	}; 
	
	$scope.imageStackClose = function() {

		$scope.imageStack = false;
		$scope.$apply();
	}; 

	
	
	
	$ionicPlatform.registerBackButtonAction(function() {
		//visszagomb, ha idézeteképelkészült popup
		
		
		
		if($scope.keszAKep){
			$scope.keszAKep = false;
			$scope.$apply();
		
		}else if($scope.keszitsTobbet){
			$scope.keszitsTobbet = false;
			$scope.$apply();	
		}else if($scope.imageStack){
			$scope.imageStack = false;
			$scope.$apply();	
		}else{
			var myPopup = $ionicPopup.show({			    
				    title: 'Kilépés!',
				    template: '<div style="font-family: Courgette, cursive;">Biztos ki akarsz lépni?</div>',			       		 
				    scope: $scope,
				    buttons: [
				      { text: 'Nem' },
				      {
				        text: '<b>Igen</b>',
				        type: 'button-outline button-positive',
				        onTap: function(e) {			          
							navigator.app.exitApp();	
				        }
				      },
				    ]
			});
		}
	
		
	}, 100);
	
	$scope.titles = ['Idézetek', 'Kedvencek', 'Időzitők', 'Súgó'];
	$scope.title = $scope.titles[0];
	$scope.data = [];
	
	
	//vászonkép rendelés
	
	$scope.buyImageParams = {};
	
	
	
	
	
	
	
	
	//sendIdezet scope
	$scope.sendIdezetData = [];
	
	
	//blog scroll header hide 
	$rootScope.slideHeader = false;
  $rootScope.slideHeaderPrevious = 0;
	
	$scope.page = 0;
	$scope.searchText = '';
	
	$scope.ertesitesek = [];
	$scope.kedvencek = [];
	$scope.ertekeltek = [];
	$scope.isCollapsed = false; 
	$scope.loading = true;
	$scope.kepEdit = false;
	
	 
	//menü funkciók 
	//téma szine	
	$rootScope.themeColors = ['#000000','#FF3399','#2196F3','#00BCD4','#8BC34A','#FF9800','#795548','#607D8B','#F44336','#9C27B0'];
	if (localStorage.getItem("themeColor") === null) {
		$scope.themeColor = '#FF3399';			
	} else {		
		$scope.themeColor = localStorage.getItem("themeColor");	
	}
	$rootScope.setTheme = function(color,index){		
		$scope.themeColor = color; 		
		window.localStorage.setItem("themeColor", color);
		$ionicSideMenuDelegate.toggleRight();
		$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Témaszin váltás : szin="+color, new Date() , 1);			
	
	};
	
	$scope.disableThemes = false;
	
	
	$rootScope.themesShow = function(){		
		if(!$scope.disableThemes){
			$('#themesDiv').animate( { height: "show" }, 100 );
		}else{
			$('#themesDiv').animate( { height: "hide" }, 100 );
		}
		$scope.disableThemes = !$scope.disableThemes;
	};
	
	
	$rootScope.nevjegyShow = function(){
			$scope.nevjegy = true;
			
			/*
			var myPopup = $ionicPopup.show({
				title : '<i class="icon pink ion-ios-close-outline" style="font-size:40px;float : left"></i>',
				template : '<div style="font-family: Courgette, cursive;text-align:center;font-size:25px"> <img width="80%" src="css/icon-webstudio2.png" /> </div>',
				scope : $scope				
			}); 
			*/
	};
	
	
	//blog megnyitás és friss bejegyzések ellenörzése
		$rootScope.openBlog = function() {
			$scope.blogBejegyzesek = [];
			
			
			if ($rootScope.online) {
					
				
				
		
			
				var tomorrow= new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
				var dd = tomorrow.getDate();
				var mm = tomorrow.getMonth() + 1;
				var yyyy = tomorrow.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				};
				if (mm < 10) {
					mm = '0' + mm;
				};
				var tomorrow = yyyy + '.' + mm + '.' + dd+"%2000:00:00"; 

				$scope.stopLoad = false;
				
				$http.get('http://www.idezet.hu/blogForApp.php?lastModified='+tomorrow ).success(function(blogok) {
				
							
					blogok.forEach(function(e, i) {
					
						$scope.blogBejegyzesek.push({
							'id' : e.id,
 							'nagycim' : e.title,
							'kiscim' : e.subTitle, 
							'datum' : e.startDate,
							'tartalom' : e.description,
							'kep' : e.kep
						}); 

					}); 
					
					$scope.lastBlog = blogok[0].lastModified.replace(" ", "%20");
					
					
					/*
					console.log(blogok[0].startDate)
					console.log(blogok[0].lastModified)
					//$scope.blogBejegyzesek = data;
					console.log(Object.keys(blogok[0])) 
					*/
				});
				
			
			
				
				$scope.setSlide(6);
				

				
				
				$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Megnyitja a blogot", new Date() , 1);		

			} else {
				var myPopup = $ionicPopup.show({
					title : 'Nincs internetkapcsolat!',
					template : '<div style="font-family: Courgette, cursive;text-align: center">Az alkalmazás nem talált internetkapcsolatot.</div>',
					scope : $scope,
					buttons : [{
						text : 'Rendben',
						type : ' button-outline button-positive',
					}]
				});
			}

			
		

		}; 

	
	//rákattint a blogbejegyzése vagy megnyomja a továbbot
	
	
	function accentsTidy(s) {
		var r = s.toLowerCase();
		r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
		r = r.replace(new RegExp("[èéêë]", 'g'), "e");
		r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
		r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
		r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
		return r;
	}; 

	
	$scope.BlogBejegyzesMegnyit = function(blog){	
	
		
		
		$('.blogBejegyzes').animate({
			scrollTop : 0

		}, '200', 'swing', function() {

		});

	
		$scope.currentBlog = null;
		$scope.currentBlog = blog;

		$scope.currentBlog.tartalom = $scope.currentBlog.tartalom.replace('"/upload', '"http://www.idezet.hu/upload');

		$scope.currentBlog.link = blog.id + "-" + blog.nagycim.replace(/ /g, '-');
		$scope.currentBlog.link = $scope.currentBlog.link.split('?').join('-');
		$scope.currentBlog.link = accentsTidy($scope.currentBlog.link);
		$scope.currentBlog.link = encodeURIComponent($scope.currentBlog.link);
		$scope.currentBlog.link = $scope.currentBlog.link.split('%2C').join(',');
		              
		$scope.currentBlog.link = "http://www.idezet.hu/blog/" + $scope.currentBlog.link + ".html";
		
 
		$scope.$apply();
		$scope.setSlide(8); 


	};
		
	
	

	  // Hello.js Functions
   
	hello.init({		
		facebook : '755622754522366'		
	}, {
		//
		// Define the OAuth2 return URL
		// This can be anything you like, providing its the callback which you have registered with the providers for OAuth2
		// It could even be localhost, e.g. http://localhost/somepath as phonegap is not run from a domain so SameOrigin breaks, instead we take advantage of being able to read the popups URL in PhoneGap
		scope : "email",
		redirect_uri : 'http://adodson.com/hello.js/redirect.html'
	});
	
	
	

	var online = function(session) {
		var current_time = (new Date()).getTime() / 1000;
		return session && session.access_token && session.expires > current_time;
	};

	var fb = hello("facebook").getAuthResponse();
	
	function facebookLogin() {
		hello('facebook').login(function() {
			hello('facebook').api('/me').success(function(json) {				
				window.localStorage.setItem("userid", json.id);
				
				console.log(json.id)
				
				//console.log(json)
				$scope.userid = localStorage.getItem("userid");				
				fb = hello("facebook").getAuthResponse();
				$scope.setSlide(5);
			});
		});
	};
 
	$scope.shareBlog = function(url) {	
	
		var appInBrowser = window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'location=yes,enableViewportScale=yes');

		appInBrowser.addEventListener('loadstart', function(event) {
			facebookLoc(event.url, appInBrowser);
		});
	}; 
	
	function facebookLoc(loc, appInBrowser) {
		if (loc.indexOf("story.php") > -1) {
			appInBrowser.close();
		}
	};


	$scope.nyitcsukMenu = function(){
		$ionicSideMenuDelegate.toggleRight();
	};


	
	
	$scope.idezetSend = function(){   
		//alert(checkConnection()); 
		
		
		
		if($rootScope.online && online(fb)){ 
			
			$scope.setSlide(5);	

					
		
		}else if($rootScope.online && !online(fb)){
	
			var myPopup = $ionicPopup.show({
				title : 'Új idézet!',
				template : '<div style="font-family: Courgette, cursive;text-align: center">Új <k class="pink">idézet</k> beküldéséhez be kell jelentkezned!</div>',
				scope : $scope,
				buttons : [{
					text : '<b>Facebook</b>',
					type : ' button-outline button-positive',
					onTap : function(e) { 
						facebookLogin();
					}
				}, {
					text : 'Mégsem',
					type : ' button-outline'
				}]
			}); 

		}else{
			var myPopup = $ionicPopup.show({
				title : 'Nincs internetkapcsolat!',
				template : '<div style="font-family: Courgette, cursive;text-align: center">Az alkalmazás nem talált internetkapcsolatot.</div>',
				scope : $scope,
				buttons : [ {
					text : 'Rendben',
					type : ' button-outline button-positive',
				}]
			}); 
		}
	};
	
	
	//ajax ami elküldi az idézetet
	$scope.sendIdezetAjax = function(){
		
		
	

		
		if ($("#tags").select2("data").length >= 2 && $scope.sendIdezetData.szerzo && $scope.sendIdezetData.szerzo.length != '' && $scope.sendIdezetData.alkotas && $scope.sendIdezetData.alkotas.length != '' && $scope.sendIdezetData.idezet && $scope.sendIdezetData.idezet != '' && $("#tags").select2("val") != '') {
			hello('facebook').api('/me').success(function(json) {
				
				var cimkek = $("#tags").select2("data");				
			
				
				
				var data = "1";				
				cimkek.forEach(function(e, i) {
					data += "&cimkek[]="+cimkek[i].text;	
				});			
				data +="&szerzo="+$scope.sendIdezetData.szerzo;	
				data += "&email=" + json.email;
				data += "&source=" + $scope.sendIdezetData.alkotas;
				data += "&szerzodesiFeltetelek=on";
				data += "&description=" + $scope.sendIdezetData.idezet;
				data += "&fbid=" + json.id + "&firstname=" + json.first_name + "&lastname=" + json.last_name + "";
				data += "&rendszer=" + device.platform;

				$scope.sendIdezet = true;
				
				
				$timeout(function() {

					$.ajax({
						type : "POST",
						url : "http://www.idezet.hu/ajax_front.php",
						data : "mod=idezet&upload=1&" + data,
						error : function(request, error) {
							console.log(error);
							$scope.sendIdezet = false;
							var myPopup = $ionicPopup.show({
								title : 'Hiba!',
								template : '<div style="font-family: Courgette, cursive;text-align : center">Az idézetet beküldése során hiba lépett fel. Később próbáld meg újra!</div>',
								scope : $scope,
								buttons : [{
									text : 'Bezár',
									type : 'button-outline button-positive'
								}]
							});
							
						},
						success : function(msg) {
							//alert(msg);

							$scope.sendIdezet = false;
							
							
							
							var myPopup = $ionicPopup.show({
								title : 'Köszönjük!',
								template : '<div style="font-family: Courgette, cursive;text-align : center">Idézeted beküldése sikeres! Legkésőbb 24 óra múlva elérhető lesz az idézet.hu adatbázisában, valamint a mobil alkalmazásokban is.</div>',
								scope : $scope,
								buttons : [{
									text : 'Bezár',
									type : 'button-outline button-positive'
								}]
							});
							
							$scope.sendIdezetData.alkotas = '';
							$scope.sendIdezetData.szerzo = '';
							$scope.sendIdezetData.idezet = '';
							$('.select2-search-choice').remove();
							$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Beküldött egy idézetet : idézet="+$scope.sendIdezetData.idezet, new Date() , 1);
							
							
						}
					});
				}, 100);	

			
				
			


		


			


			});
			
		}else{
			var myPopup = $ionicPopup.show({			    
						    title: 'Hiányzó adatok!',
						    template: '<div style="font-family: Courgette, cursive;text-align : center">A mezők kitöltése kötelező!</div>',			       		 
						    scope: $scope,
						    buttons: [
						      { text: 'Rendben',
						       type: 'button-outline button-positive' }						      
						    ]
					});
		};
		


	
	
	

		
		//alert('idézet : '+$scope.sendIdezetData.idezet)
		//alert('cimkék : '+$("#tags").select2("val"))
		//alert('szerző : '+$scope.sendIdezetData.szerzo)
		//alert('alkotas : '+$scope.sendIdezetData.alkotas)
		//alert('facebookid : ' + $scope.userid)
	
	};
	
	
	
	//menü nyitás/zárás
	
	
	$scope.toggleMenu = function() {
		$('#themesDiv,#nevjegyDiv').animate({
			height : "hide"
		}, 10, function() {
			$ionicSideMenuDelegate.toggleRight();
			$scope.disableThemes = false; 
		});
		
	

	};


	//a 4.4 nél régebbi(gagyi) androidhoz paraméterek
	  
	
	//képszerkesztés gobális változók

	
	
	$scope.sharingImage = false;
	$rootScope.text =false;
	$rootScope.hatter = false;
	$rootScope.font =false;
	$rootScope.size =false;
	$rootScope.color =false;
	$rootScope.effect =false;
	$scope.lastPage = 0;
	
	$rootScope.editIdezet = {};
	$rootScope.editIdezet.idezet = '';
	$rootScope.editIdezet.kitol = ''; 
	$rootScope.editIdezet.edit = {};
	$rootScope.editIdezet.blur = 0;
	$rootScope.editIdezet.edit.fontSize = 20;
	$rootScope.editIdezet.edit.fontFamily = 'Courgette';
	$rootScope.editIdezet.edit.backColor = '#FFFFFF';

	
	$scope.frissit = function(){
		$scope.$apply();
	};
	
	$scope.nepszeruek = ['szerelem', 'szeretlek', 'élet', 'boldogság', 'barát', 'barátság', 'siker', 'család', 'gyermek'];


	

	$rootScope.imageUri;

	$scope.dateAlap = new Date();
	$scope.date = $scope.dateAlap.toString();

	$scope.tegnap = new Date();
	$scope.tegnap.setDate($scope.tegnap.getDate() - 1);

	var theyear = $scope.tegnap.getFullYear();
	var themonth = $scope.tegnap.getMonth() + 1;
	var theyesterday = $scope.tegnap.getDate();
	if (theyesterday.toString().length == 1) {
		theyesterday = '0' + theyesterday;
	};

	var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	$scope.tegnap = month_names_short[themonth - 1] + " " + theyesterday + " " + theyear + " ";

	$scope.today = $scope.date.substring(4, 16);

	$scope.now = new Date();
	var nowOra = new Date().getHours();
	var nowPerc = '' + new Date().getMinutes();


	
	if (nowPerc.length == 1) {
		nowPerc = '0' + nowPerc;
	} 

	$scope.now = nowOra + ":" + nowPerc; 



	ionic.Platform.ready(function() {
		ionic.Platform.fullScreen();
	
	}); 

 

 
 
   	



  
	
	/* random id for user	 */
	if (localStorage.getItem("userid") === null) {
		window.localStorage.setItem("userid", Math.floor(Math.random() * 10000));
	} else {
		$scope.userid = localStorage.getItem("userid");
	}

	if (localStorage.getItem("kedvencek") === null) {
		window.localStorage.setItem("kedvencek", JSON.stringify($scope.kedvencek));
	} else {
		$scope.kedvencek = JSON.parse(localStorage.getItem("kedvencek"));
	}


	if (localStorage.getItem("ertesitesek") === null) {
		window.localStorage.setItem("ertesitesek", JSON.stringify($scope.ertesitesek));
	} else {
		$scope.ertesitesek = JSON.parse(localStorage.getItem("ertesitesek"));

		$.grep($scope.ertesitesek, function(e, index) {
			e.idezet.kedvenc = false;
		});

		for (idezet in $scope.kedvencek) {
			var x = $scope.kedvencek[idezet];
			var result2 = $.grep($scope.ertesitesek, function(e, index) {

				if (e.idezet.id == x.id) {
					e.idezet.kedvenc = true;
				};
				return e.idezet.id == x.id;
			});

		}
	}
	
	

 var pushNotification;


document.addEventListener("deviceready", onDeviceReady, false);
   
	function onDeviceReady() {
	
	
		
		//ios ne csusszon szét a kép
	    cordova.plugins.Keyboard.disableScroll(true);
		
	
 
		/*
		$rootScope.gaPlugin;
		$rootScope.gaPlugin=window.plugins.gaPlugin;
		$rootScope.gaPlugin.init($rootScope.successHandler,$rootScope.errorHandler,"UA-59986649-1",10);
		
		$rootScope.successHandler= function(result) {
		  	console.log('nativePluginResultHandler - ' + result);  
		};
		$rootScope.errorHandler= function(error) {
		 	console.log('nativePluginErrorHandler - ' + error);
		};		
		*/
		        
	
		
		
		
		// pusplugin aktiválás
		
		/*
		pushNotification = window.plugins.pushNotification;
		
		if (localStorage.getItem("regid") !== null) {
			$("#app-status-ul").append('<li>REGISTERED -> REGID:' + localStorage.getItem("regid") + "</li>");
		}
		
		if (localStorage.getItem("token") !== null) {
			$("#app-status-ul").append('<li>REGISTERED -> REGID:' + localStorage.getItem("token") + "</li>");
		}
		
		
		$scope.elkuldRegid = function(){
			window.plugins.socialsharing.share(localStorage.getItem("regid"), null, null, null);
		};
		
		$scope.elkuldToken = function(){
			window.plugins.socialsharing.share(localStorage.getItem("token"), null, null, null);
		};
	

 
	
		if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos') {
			pushNotification.register(successHandler, errorHandler, {
				"senderID" : "736353574400",
				"ecb" : "onNotification"
			});
			// required!
			alert('android ');
		} else {
			pushNotification.register(tokenHandler, errorHandler, {
				"badge" : "true",
				"sound" : "true",
				"alert" : "true",
				"ecb" : "onNotificationAPN"
			});
			// required!
			alert('ios');
		}

			 
		// handle APNS notifications for iOS
		window.onNotificationAPN = function(e) {
			if (e.alert) {
				$("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
				// showing an alert also requires the org.apache.cordova.dialogs plugin
				navigator.notification.alert(e.alert);
			}
	
			if (e.sound) {
				// playing a sound also requires the org.apache.cordova.media plugin
				var snd = new Media(e.sound);
				snd.play();
			}
	
			if (e.badge) {
				pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
			}
		};
	
		// handle GCM notifications for Android

		
		window.onNotification = function(e) {
			
			$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
			alert(e.event);
			switch( e.event ) {
			case 'registered':
				if (e.regid.length > 0) {
					$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
					// Your GCM push server needs to know the regID before it can push to this device
					// here is where you might want to send it the regID for later use.
					console.log("regID = " + e.regid);
					
					
	
					if (localStorage.getItem("regid") === null) {
						window.localStorage.setItem("regid", e.regid);
					}

					
				}
				break;
	
			case 'message':
				// if this flag is set, this notification happened while we were in the foreground.
				// you might want to play a sound to get the user's attention, throw up a dialog, etc.
				if (e.foreground) {
					$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
					
					// on Android soundname is outside the payload.
					// On Amazon FireOS all custom attributes are contained within payload
					var soundfile = e.soundname || e.payload.sound;
					// if the notification contains a soundname, play it.
					// playing a sound also requires the org.apache.cordova.media plugin
					var my_media = new Media("/android_asset/www/" + soundfile);
					my_media.play();
				} else {// otherwise we were launched because the user touched a notification in the notification tray.
					if (e.coldstart){
						("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
							
					}else{
						$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
						
					}
						
				}
	
				$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
				
				//android only
				$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
			
				//amazon-fireos only
				$("#app-status-ul").append('<li>MESSAGE -> TIMESTAMP: ' + e.payload.timeStamp + '</li>');
				
				break;
	
			case 'error':
				$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
				
				break;
	
			default:
				$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
				
				break;
			}
		};

	
	
		$scope.elkuldToken = function(){
			window.plugins.socialsharing.share(localStorage.getItem("token"), null, null, null);
		};
	

		
		function tokenHandler(result) {
			$("#app-status-ul").append('<li>token: ' + result + '</li>');
			// Your iOS push server needs to know the token before it can push to this device
			// here is where you might want to send it the token for later use.
			if (localStorage.getItem("token") === null) {
				window.localStorage.setItem("token", result);
			}

		}


		function successHandler(result) {
			$("#app-status-ul").append('<li>success:' + result + '</li>');
			
		}

		function errorHandler(error) {
			$("#app-status-ul").append('<li>error:' + error + '</li>');
			
		}
		*/

	
		
		
	
	
		
		// cimkék tag input source
		$http.get('js/cimkek.json').success(function(data) {
	
			$('#tags').select2({
				tags : data,
				allowClear : true
			});
	
		}); 

		
		

		
		$scope.compareTimes = function(time1,time2){		
			
			if(time1.length == 4){
				time1 = '0'+time1;
			}
			if(time2.length == 4){
				time2 = '0'+time2;
			}
			
		
			if(time2 >= time1){
				return true;
			}else{
				return false;
			}
		};
		
		$scope.idezetek=[];
		
		
		$scope.number = 60;
		$scope.getNumber = function(num) {
			return new Array(num);
		};  
		
		
	// idézetek betöltése
		
	
	if (localStorage.getItem("idezetek") === null) {
		idezetekFirstLoad();

	} else {
		idezetekNotFirstLoad();
		$timeout(function() {

			var oldIdezetekSzama = $scope.idezetek.length;
			console.log($scope.idezetek.length);		
			
			
			if($rootScope.online) {
				idezetekFrissit(function() { 
					var newIdezetekSzama = $scope.idezetek.length - oldIdezetekSzama;
					console.log('új idézetek száma : ' + newIdezetekSzama);

					if (window.localStorage.getItem("ertesitesSzam") == 1 || window.localStorage.getItem("ertesitesSzam") == 2) {
						$ionicSlideBoxDelegate.slide(2);
					}

					$scope.loading = false;

				});
			} else {
				if (window.localStorage.getItem("ertesitesSzam") == 1 || window.localStorage.getItem("ertesitesSzam") == 2) {
					$ionicSlideBoxDelegate.slide(2);
				}

				$scope.loading = false;
			}

			
		}, 500);

	} 

	



		

		
		function idezetekFirstLoad() {
			$http.get('js/idezetek.json').success(function(data) {

				
				for (idezet in data) { 
					$scope.idezetek.unshift(data[idezet]);
				};


				for (idezet in $scope.kedvencek) {
					var x = $scope.kedvencek[idezet];
					var kedvencIndex;
					var result1 = $.grep($scope.idezetek, function(e, index) {
						if (e.id == x.id) {
							e.kedvenc = true;
						};
						return e.id == x.id;
					});
				}

				idozitokFrissitese();
				$.grep($scope.ertesitesek, function(e, index) {
					e.idezet.kedvenc = false;
				});

				for (idezet in $scope.kedvencek) {
					var x = $scope.kedvencek[idezet];
					var result2 = $.grep($scope.ertesitesek, function(e, index) {

						if (e.idezet.id == x.id) {
							e.idezet.kedvenc = true;
						};
						return e.idezet.id == x.id;
					});

				}
				if (window.localStorage.getItem("ertesitesSzam") == 1 || window.localStorage.getItem("ertesitesSzam") == 2) {
					$ionicSlideBoxDelegate.slide(2);
				}
				
				window.localStorage.setItem("idezetek", JSON.stringify($scope.idezetek));
				$scope.loading = false;
				

			});
		} ;

	
		function idezetekNotFirstLoad() {
			$scope.idezetek = JSON.parse(localStorage.getItem("idezetek"));

			for (idezet in $scope.kedvencek) {
				var x = $scope.kedvencek[idezet];
				var kedvencIndex;
				var result1 = $.grep($scope.idezetek, function(e, index) {
					if (e.id == x.id) {
						e.kedvenc = true;
					};
					return e.id == x.id;
				});
			}

			idozitokFrissitese();
			$.grep($scope.ertesitesek, function(e, index) {
				e.idezet.kedvenc = false;
			});

			for (idezet in $scope.kedvencek) {
				var x = $scope.kedvencek[idezet];
				var result2 = $.grep($scope.ertesitesek, function(e, index) {

					if (e.idezet.id == x.id) {
						e.idezet.kedvenc = true;
					};
					return e.idezet.id == x.id;
				});

			}
			

			

		};

		function idezetekFrissit(callback){
		
			var today = new Date();
			var dd = today.getDate();   
			var mm = today.getMonth()+1;
			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			};
			if (mm < 10) {
				mm = '0' + mm;
			};
			var date = yyyy + '.' + mm + '.' + dd;
 
			//alert('frissit' + date + " " + localStorage.getItem("lastUpdate") );
			
			if (localStorage.getItem("lastUpdate") === null) {	
				console.log('friss start');
			 					
			    
				$http.get('http://www.idezet.hu/IdezetForApp.php?lastModified=2015.04.19').success(function(data) {
					console.log(data.length);					
					if (data != 0) {
						
						data.reverse();
						for (idezet in data) {
							$scope.idezetek.unshift(data[idezet]);
						}; 
						window.localStorage.setItem("lastUpdate", date);
						window.localStorage.setItem("idezetek", JSON.stringify($scope.idezetek));
					}
					callback();

				}).error(function(data, status, headers, config) {
					console.log('feki szerver nem elérhető');
					callback();
					
				});
				

							 
			} else {
				
			
				var lastUpdate = localStorage.getItem("lastUpdate");
	  		
	  			  
				if (lastUpdate < date) {
					console.log('frissit' + lastUpdate);
					
					$http.get('http://www.idezet.hu/IdezetForApp.php?lastModified=' + lastUpdate).success(function(data) {

						if (data != 0) {

							if (data.length >= 2)
								data.reverse();

							//console.log(data)

							for (idezet in data) {
								$scope.idezetek.unshift(data[idezet]);
							};
							window.localStorage.setItem("lastUpdate", date);
							window.localStorage.setItem("idezetek", JSON.stringify($scope.idezetek));
						}
						callback();

					}).error(function(data, status, headers, config) {
						console.log('feki szerver nem elérhető');
						callback();
						// or server returns response with an error status.
					});
					; 

				} else {
					//alert('nemkell' + lastUpdate);   					
					callback();
				}   
	
			};



	
		
			

		

			
			
			
 
		};

	
		
	
    
		
	
		$scope.socialShare = function(idezet) {
		
			window.plugins.socialsharing.share(idezet.idezet + ' - ' + idezet.kitol +' - #idezet.hu - www.idezet.hu', null, null, null);
			$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Megoszt egy idézetet : id="+idezet.id, new Date() , 1);
		};
	
		
		

		

		
		$scope.keres = function(searchText,$event,nepszeru) {
			$('input').blur();	
					
		
			if (nepszeru) {
				$('#keresInput').val(nepszeru);	
				searchText = $('#keresInput').val();		
				$scope.searchText = searchText;
			} else {
				searchText = $('#keresInput').val();				
				$scope.searchText = searchText;
			}

			
		
			
			if(searchText.length >= 1 && !$rootScope.keresLoading){
			 		
				$rootScope.keresLoading = true;
				var patt = new RegExp("á|é|í|ú|ü|ű|ó|ö|ő"); 
					
				$timeout(function() {
					$scope.limit = 5;
					
					
					if (patt.test(searchText)) {
						$scope.filteredIdezetek = $filter('filter')($scope.idezetek, searchText);
									
					} else {
						$scope.filteredIdezetek = $filter('filter')($scope.idezetek, searchText);
					}
					

					
					$scope.talalatok = $scope.filteredIdezetek.length;
					$rootScope.keresLoading = false;
					$rootScope.gaPlugin.trackEvent($rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Keresés : " + searchText, new Date(), 1);
				}, 500);

			
			}else{
				$scope.filteredIdezetek = [];
				$scope.talalatok = undefined;
			};
			
			
			
			
		};
		
		$scope.doubleTapListener = function(){		
		 	$(".doubleTapp").swipe("destroy");
		
			$(".doubleTapp").swipe({
				tap : function() {
				},
				doubleTap : function(event, target) {					
					$scope.szerkeszt($scope.filteredIdezetek[target.id]);
				}
			});
	

			
		};
		
		function bennevan() {
			
			
			$.grep($scope.idezetek, function(e, index) {
				e.kedvenc = false;
			});
	
			$.grep($scope.ertesitesek, function(e, index) {			
				e.idezet.kedvenc = false;
			});
			
	
		
			for (idezet in $scope.kedvencek) {
				var x = $scope.kedvencek[idezet];
				var kedvencIndex;
				var result1 = $.grep($scope.idezetek, function(e, index) {
	
					if (e.id == x.id) {
						e.kedvenc = true;					
					};
	
					return e.id == x.id;
				});
				
				var result2 = $.grep($scope.ertesitesek, function(e, index) {
	
					if (e.idezet.id == x.id) {					
						e.idezet.kedvenc = true;					
					};
	
					return e.idezet.id == x.id;
				});
	
			}
			
	
		};
		
		
	
		$scope.limit = 5;
	
		$scope.change = function() {
			$scope.limit = 5;
		};
		
		
		$scope.loadMore = function() {
			$scope.limit += 5;		
			bennevan();
			$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Több idézet betöltése görgetés : idézetek száma="+$scope.limit, new Date() , 1);
		};
		
		
		
		$scope.moreBlog = function() {
			
			
			
			if (!$scope.stopLoad) {
				console.log($scope.lastBlog)
				$scope.stopLoad = true;

				$http.get('http://www.idezet.hu/blogForApp.php?lastModified=' + $scope.lastBlog).success(function(blogok) {
						
					console.log(blogok.length)
				 
					if (blogok.length != null) {
						blogok.forEach(function(e, i) {

						
							$scope.blogBejegyzesek.push({
								'id' : e.id,
								'nagycim' : e.title,
								'kiscim' : e.subTitle,
								'datum' : e.startDate,
								'tartalom' : e.description,
								'kep' : e.kep
							}); 


						});

						$scope.lastBlog = blogok[0].lastModified.replace(" ", "%20");
						$scope.stopLoad = false;
					}else{
						
					}	

								

					//$scope.blogBejegyzesek = data;
					//console.log(Object.keys(blogok[1]))
				}).error(function(data, status, headers, config) {
					$scope.stopLoad = false;
					// or server returns response with an error status.
				});

			}

		};


	
		
		$scope.kedvenc = function(i) {
			if (i.kedvenc) {
				var myPopup = $ionicPopup.show({			    
					    title: 'Kedvenc törlése!',
					    template: '<div style="font-family: Courgette, cursive;">Biztos törölni szeretnéd a kedvencek közül ezt az idézetet?</div>',			       		 
					    scope: $scope,
					    buttons: [
					      { text: 'Nem' },
					      {
					        text: '<b>Igen</b>',
					        type: 'button-outline button-positive',
					        onTap: function(e) {			          
								i.kedvenc = false;
								var deleteIndex;
								$.grep($scope.kedvencek, function(e, index) {
									if (e.id == i.id) {
										deleteIndex = index;  
									}
								});
					
								$scope.kedvencek.splice(deleteIndex, 1);
								window.localStorage.setItem("kedvencek", JSON.stringify($scope.kedvencek));
					        }
					      },
					    ]
				});
					
	
			} else {
				var myPopup = $ionicPopup.show({			    
					    title: 'Gratulálok!',
					    template: '<div style="font-family: Courgette, cursive;">Az idézetet a kedvenceid közé helyezted. A  <i style="font-size: 20px" class="ion-ios-heart  "></i>  használatával bármikor elérheted.	</div>',			       		 
					    scope: $scope,
					    buttons: [
					      {		
					        text: '<b>Bezárás</b>',
					        type: 'button-outline button-positive',					        
					      }
					    ]
				});
				
			
				$scope.$apply();
				
				i.kedvenc = true;
				
				
				
	
				
				
				$scope.kedvencek.push(i);		
				for (index in $scope.kedvencek) {
					$scope.kedvencek[index].backImage = null;					
				}				
				window.localStorage.setItem("kedvencek", JSON.stringify($scope.kedvencek));				
				$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Kedvencek közé rak : id="+i.id+", cimkék="+i.cimke, new Date() , 1);
	
			};
			bennevan();
	
		}; 
	
	
		$scope.newErtesites = {
			'kat' : 'Minden kategória',
			'ora' : undefined,
			'perc' : undefined
		};
	
		
		$scope.megnyomtapluszidozito = function(){
			$scope.megEgyIdozito = true;			
		};
		
	
		$scope.ujErtesites = function() {
		
		
	
			if ($scope.newErtesites.kat == undefined || $scope.newErtesites.ora == undefined || $scope.newErtesites.perc == undefined) {
				 var myPopup = $ionicPopup.show({			    
				    title: 'Hiányzó adatok!',
				    template: '<div style="font-family: Courgette, cursive;">Válassz ki minden adatot az időzitő létrehozásához.</div>',			       		 
				    scope: $scope,
				    buttons: [
				      { text: 'Rendben' ,
				      type: 'button-outline button-positive'
				      },
				     
				    ]
			});
			} else {
	
				if ($scope.newErtesites.perc.toString().length == 1) {
					$scope.newErtesites.perc = '0' + $scope.newErtesites.perc;
				}
				
				var filter;
				if($scope.newErtesites.kat == 'Minden kategória'){
					filter = '';
					
				}else{
					filter = $scope.newErtesites.kat;
					
				}
				 
				var filteredArray = $filter('filter')($scope.idezetek, filter);
	
				var randomIdezet = filteredArray[Math.floor(Math.random() * filteredArray.length)];
	
				var goalDate = new Date();				
				goalDate.setHours($scope.newErtesites.ora);
				goalDate.setMinutes($scope.newErtesites.perc);
				goalDate.setSeconds(0);
				
				var osztaly = Math.floor((Math.random() * 100) + 1);
				
			
				if (localStorage.getItem("ertesitesSzam") === null || localStorage.getItem("ertesitesSzam") == 0) {
					window.localStorage.setItem("ertesitesSzam", 1); 				
				} else if (localStorage.getItem("ertesitesSzam") == 1) {
					window.localStorage.setItem("ertesitesSzam", 2);				
				}
	
	
				for ( i = 0; i <= 31; i++) {
			
					if (localStorage.getItem("ertesitesSzam") == 1) {
						$scope.ertesitesek.push({
							az : i,
							osztaly : osztaly,
							kat : $scope.newErtesites.kat,
							datum : goalDate.toString().substring(4, 16),
							ora : $scope.newErtesites.ora,
							perc : $scope.newErtesites.perc,
							idopont : $scope.newErtesites.ora + ':' + $scope.newErtesites.perc,
							idezet : randomIdezet
						});
						
				
				
						 window.plugin.notification.local.add({
							 id : i,
							 title : randomIdezet.kitol,
							 message : randomIdezet.idezet,
							 repeat : 'yearly',
							 autoCancel : true,
							 led: 'FF3399',
							 smallIcon: 'smallIcon',
							 icon: 'icon',
							 date : new Date(new Date(new Date(new Date(new Date().setDate(new Date().getDate()+i)).setHours($scope.newErtesites.ora)).setMinutes($scope.newErtesites.perc)).setSeconds(0))
						  });
					
					} else if (localStorage.getItem("ertesitesSzam") == 2 && $scope.ertesitesek[0].az == 0) {
						
						$scope.ertesitesek.push({
							az : 32+i,
							osztaly : osztaly,
							kat : $scope.newErtesites.kat,
							datum : goalDate.toString().substring(4, 16),
							ora : $scope.newErtesites.ora,
							perc : $scope.newErtesites.perc,
							idopont : $scope.newErtesites.ora + ':' + $scope.newErtesites.perc,
							idezet : randomIdezet
						});
						
						 window.plugin.notification.local.add({
							 id : 32+i,
							 title : randomIdezet.kitol,
							 message : randomIdezet.idezet,
							 repeat : 'yearly',
							 led: 'FF3399',
							 smallIcon: 'smallIcon',
							 icon: 'icon',
							 autoCancel : true,
							 date : new Date(new Date(new Date(new Date(new Date().setDate(new Date().getDate()+i)).setHours($scope.newErtesites.ora)).setMinutes($scope.newErtesites.perc)).setSeconds(0))
						  });
						 
						  
					} else if (localStorage.getItem("ertesitesSzam") == 2 && $scope.ertesitesek[0].az == 32) {
						
						$scope.ertesitesek.push({
							az : i,
							osztaly : osztaly,
							kat : $scope.newErtesites.kat,
							datum : goalDate.toString().substring(4, 16),
							ora : $scope.newErtesites.ora,
							perc : $scope.newErtesites.perc,
							idopont : $scope.newErtesites.ora + ':' + $scope.newErtesites.perc,
							idezet : randomIdezet
						});
						
						 window.plugin.notification.local.add({
							 id : i,
							 title : randomIdezet.kitol,
							 message : randomIdezet.idezet,
							 repeat : 'yearly',
							 led: 'FF3399',
							 smallIcon: 'smallIcon',
							 icon: 'icon',
							 autoCancel : true,
							 date : new Date(new Date(new Date(new Date(new Date().setDate(new Date().getDate()+i)).setHours($scope.newErtesites.ora)).setMinutes($scope.newErtesites.perc)).setSeconds(0))
						  });
						 
					} 
					
	
					randomIdezet = $scope.idezetek[Math.floor(Math.random() * $scope.idezetek.length)];
					goalDate.setDate(goalDate.getDate() + 1);
	
	
				}// for ciklus a 32 idézet generáláshoz
				
				window.localStorage.setItem("ertesitesek", JSON.stringify($scope.ertesitesek));
				$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Új időzitő : kategória="+$scope.newErtesites.kat+", időpont="+$scope.newErtesites.ora + ':' + $scope.newErtesites.perc, new Date() , 1);
			
	
				$scope.newErtesites = {
					'kat' : 'Minden kategória',
					'ora' : undefined,
					'perc' : undefined
				};
				
			}
	
		};
		function idozitokFrissitese(){			
					var maiErtesitesEgy = false;
					var maiErtesitesKetto = false;
					
					
					if($scope.now.length == 4){
						$scope.now = '0'+$scope.now;
					}
					
						
					$scope.ertesitesek.forEach(function(e, i) {
						
						var tempTime; 
						if(e.idopont.length == 4){
							tempTime = '0'+e.idopont;
						}
						
						//console.log(tempTime+" < "+ $scope.now); 	
						  
						if(e.datum == $scope.today && tempTime < $scope.now){ 
							
							 
							 
							if(e.az <= 31){				   
								console.log('frissités1');																		
								maiErtesitesEgy = e;								
							}else if(e.az >= 32){  		
								console.log('frissités2'); 						 	
								maiErtesitesKetto = e;								 
							}						
						}	
						
					}); 
					
					if(maiErtesitesEgy){ 
						
						console.log('lsőt frissiti');
						
						
						var temp = maiErtesitesEgy;
						$scope.tempIdezet = maiErtesitesEgy.idezet;   
						
						goalDate = new Date();
						goalDate.setHours(temp.ora);
						goalDate.setMinutes(temp.perc);
						goalDate.setSeconds(0);
						
				
					
						var filter;
						if (temp.kat == 'Minden kategória') {
							filter = '';
							
							
						} else {
							filter = temp.kat;
							
						}
	
						var filteredArray = $filter('filter')($scope.idezetek, filter);
					
						
						var elsoElemIndex;
						    
						$scope.ertesitesek.forEach(function(e, i) {						
							var randomIdezet = filteredArray[Math.floor(Math.random() * filteredArray.length)];
							
							if (e.osztaly == temp.osztaly) {							
								e.idezet = randomIdezet;
								e.datum = goalDate.toString().substring(4, 16);
							
								elsoElemIndex = i-32+1;
								     
								
							
								if(i != 0 && i != 32){
								
									window.plugin.notification.local.add({
									 id : i,
									 title : randomIdezet.kitol,
									 message : randomIdezet.idezet,
									 repeat : 'yearly',
									 led: 'FF3399',
									 smallIcon: 'smallIcon',
									 icon: 'icon',
									 autoCancel : true,
									 date : new Date(new Date(new Date(new Date(new Date().setDate(new Date().getDate()+i)).setHours(e.ora)).setMinutes(e.perc)).setSeconds(0))
								 	});
								 	
								 	
								}
								
								goalDate.setDate(goalDate.getDate() + 1);
								 
								
								
							}
							
				
						});
						
						
						console.log(elsoElemIndex); 
						$scope.ertesitesek[elsoElemIndex].idezet = $scope.tempIdezet;
						
						window.localStorage.setItem("ertesitesek", JSON.stringify($scope.ertesitesek));
						
											
						
					}
						
				
					if(maiErtesitesKetto){
						
						console.log('másodikat  frissiti');
					
					
						var temp = maiErtesitesKetto; 
						$scope.tempIdezet = maiErtesitesKetto.idezet;
						
						goalDate = new Date();
						goalDate.setHours(temp.ora);
						goalDate.setMinutes(temp.perc);
						goalDate.setSeconds(0);
						
						
					
							
						var filter = temp.kat;
						var filteredArray = $filter('filter')($scope.idezetek, filter);
			
						
	
						var elsoElemIndex;			
						$scope.ertesitesek.forEach(function(e, i) {						
							var randomIdezet = filteredArray[Math.floor(Math.random() * filteredArray.length)];
							if (e.osztaly == temp.osztaly) {							
								e.idezet = randomIdezet;
								e.datum = goalDate.toString().substring(4, 16);
								
								elsoElemIndex = i-32+1;
								
								
								if(i != 0 && i != 32){
									
									window.plugin.notification.local.add({
									 id : 32+i,
									 title : randomIdezet.kitol,
									 message : randomIdezet.idezet,
									 repeat : 'yearly',
									  led: 'FF3399',
									 smallIcon: 'smallIcon',
									 icon: 'icon',
									 autoCancel : true,
									 date : new Date(new Date(new Date(new Date(new Date().setDate(new Date().getDate()+i)).setHours(e.ora)).setMinutes(e.perc)).setSeconds(0))
								 	});
								 	
								}
							
								goalDate.setDate(goalDate.getDate() + 1);
								
								
							}
							
				
						});
						
						
						console.log(elsoElemIndex);    
						$scope.ertesitesek[elsoElemIndex].idezet = $scope.tempIdezet;
						window.localStorage.setItem("ertesitesek", JSON.stringify($scope.ertesitesek));
						
					
					}
					
				
				
					
		};
		
		
	
		$scope.delErtesites = function(osztaly) {
			 var myPopup = $ionicPopup.show({			    
				    title: 'Időzítő törlése!',
				    template: '<div style="font-family: Courgette, cursive;">Biztos törölni szeretnéd az időzítőt?</div>',			       		 
				    scope: $scope,
				    buttons: [
				      { text: 'Nem' },
				      {
				        text: '<b>Igen</b>',
				        type: 'button-outline button-positive',
				        onTap: function(e) {			          
							$scope.temp = [];					
							$scope.ertesitesek.forEach(function(e, i) {
								if (osztaly != e.osztaly) {
									$scope.temp.push(e);				
								}else{				
									window.plugin.notification.local.cancel(e.az);				
								}							
							}); 						
							
							$scope.ertesitesek = [];
							$scope.ertesitesek = $scope.temp;	
									
							$scope.megEgyIdozito = false;   		
														 	
							window.localStorage.setItem("ertesitesSzam", $scope.ertesitesek.length/32 );
							window.localStorage.setItem("ertesitesek", JSON.stringify($scope.ertesitesek));
				        }
				      },
				    ]
			});
		};
		
		$scope.getNumber = function(num) {
			return new Array(num);
		};
		
		$scope.feedback = function(){
		 cordova.plugins.Keyboard.disableScroll(false);
		 var myPopup = $ionicPopup.show({			    
				    title: 'Segíts nekünk!',
				    template: '<div style="font-family: Courgette, cursive;">Kérlek, írj pár mondatot arról, hogy milyennek találod az alkalmazást. Ha van valami, amit hiányolsz, azt is nyugodtan írd ide. Köszönjük!</div>'+
				       		  '​<textarea ng-model="data.feedback" style="border : 1px solid grey"  rows="5" cols="70"></textarea>',
				    scope: $scope,
				    buttons: [
				      { text: 'Mégsem',
				        onTap : function(){
				        	cordova.plugins.Keyboard.disableScroll(true);
				        } 
				      },
				      {
				        text: '<b>Küldés</b>',
				        type: 'button-outline button-positive',
				        onTap: function(e) {
				          if (!$scope.data.feedback) {
				            //don't allow the user to close unless he enters wifi password
				            e.preventDefault();
				          } else {	
				          	cordova.plugins.Keyboard.disableScroll(true);		           
				          	$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Visszajelzés : "+$scope.data.feedback, new Date() , 1);
			 	          }
				        }
				      },
				    ]
				  });
		};
	
		$scope.rate =  function(number,idezet){
			
			idezet.rate = number;		
			$scope.ertekeltek.push(idezet); 
			window.localStorage.setItem("ertekeltek", JSON.stringify($scope.ertekeltek));
			$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Idézetet értékel : id="+idezet.id+", pontszám="+number, new Date() , 1);
			
			
		};
		
		
	 
		
	
		$scope.save = function(idezet) {
		
			
		
			$scope.buyImageParams.kisKepUrl = $rootScope.imageUri;
			$scope.buyImageParams.nagyKepUrl = $scope.imageNagyUri ;
			$scope.buyImageParams.xKepMargin = $('#editImage').cropper("getData").x;
			$scope.buyImageParams.yKepMargin = $('#editImage').cropper("getData").y;
			$scope.buyImageParams.rotateKep = $('#editImage').cropper("getData").rotate;				
			$scope.buyImageParams.keszKepWidth = $('#editImage').cropper("getData").width;
			$scope.buyImageParams.keszKepHeight = $('#editImage').cropper("getData").height;
				
			/*
			$("<img/>").attr("src", $rootScope.imageUri).load(function() {
				s = {
					w : this.width,
					h : this.height
				};
				$scope.buyImageParams.kisKepWidth = s.w;
				$scope.buyImageParams.kisKepHeight = s.h;
				console.log($scope.buyImageParams);
				 
				
					
				$.ajax({
						type : "POST",
						url : "http://192.168.1.184/idezet.hu/createimage/vaszonkep.php",
						data : angular.toJson($scope.buyImageParams),
						error : function(request, error) {
							alert('valami hiba');
							
						},
						success : function(data) {
											
							alert('ok')				
											
											
							var adatok = JSON.parse(data);					
									
							alert('Kész a kép '+adatok.rate);
							
							
							
							$rootScope.editIdezet.backImage = adatok.link;
							$scope.kepEdit = false;
							$scope.$apply(); 

							 	

			
												
							
						}
					});
				

				
				
			}); 
			*/

			
			
			
			
			
			
			
		
			var c = document.createElement("canvas");
			var kepSzelesseg = $('#forSize').width();
			var kepMagassag = $('#forSize').height();
			c.width = kepSzelesseg;
			c.height = kepMagassag;

			
 
			var cxt = c.getContext("2d");
			var img = new Image();

		
			img.onload = function() {
				
				
				cxt.drawImage(img, 0, 0, kepSzelesseg, kepMagassag);
				var dataURL = c.toDataURL('image/jpeg');;
				$rootScope.editIdezet.backImage = dataURL;
				$scope.kepEdit = false;
				$scope.$apply();

			};
			
			
			//alert($('#editImage').cropper('getImageData'))
			
			
			
			img.src = $('#editImage').cropper('getCroppedCanvas', {
				fillColor: "#FFFFFF"
			}).toDataURL('image/jpeg'); 

			
			$rootScope.editIdezet.fullBackImage = img.src;

		}; 

	
	
		$scope.kepMegosztas = function(){
			
			
			
			window.plugins.socialsharing.share("#idezet.hu - www.idezet.hu", null, $rootScope.keszKep, null, function() {
				$scope.keszAKep = false;
				$scope.keszitsTobbet = false;
				$scope.$apply();
			}, function(errormsg) {
			});
		
			$rootScope.gaPlugin.trackEvent($rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Megoszt egy képet : id=" + $rootScope.editIdezet.id + ", cimkék=" + $rootScope.editIdezet.cimke, new Date(), 1);
			
		};
		
		$scope.kosar = [{
				kep : 'css/600x600-bananas.jpg',
				idezet : 'sfsadfasf',
				kitol : 'asdgasdg',
				ar : 4990,
				osszar : 4990,
				db : 1,
				hatter : 'valamikép'					
			},{
				kep : 'css/600x600-bananas.jpg',
				idezet : 'sfsadfasf',
				kitol : 'asdgasdg',
				ar : 4990,
				osszar : 4990,
				db : 1,
				hatter : 'valamikép'					
			}];
			
		$scope.deleteFromKosar = function(index){
			
			var myPopup = $ionicPopup.show({			    
					    title: 'Eldobás!',
					    template: '<div style="font-family: Courgette, cursive;">Biztos törölni szeretnéd ezt a képet a kosárból?</div>',
					    scope: $scope,
					    buttons: [
					          { 
					          	text: 'Igen',
					          	onTap: function(e) {			          
									$scope.kosar.splice(index, 1);
									
				       			 }
				       		  },
					          { 
					          	text: 'Nem',
					        	type: 'button-outline button-positive',
				       		  }
					    ]
				});
		};
		
		$scope.kepKosarba = function(){
		
			
			$scope.kosar.push({
				kep : $rootScope.keszKep,
				idezet : 'sfsadfasf',
				kitol : 'asdgasdg',
				ar : 4990,
				osszar : 4990,
				db : 1,
				hatter : 'valamikép'					
			});
			
			$scope.lastKosarIndex = $scope.kosar.length - 1;
		
			
			$scope.keszAKep = false;
			
			$timeout(function(){
				var myPopup = $ionicPopup.show({			    
					    title: 'Akció!',
					    template: '<div style="font-family: Courgette, cursive;">Az idézetes képed a kosárba helyeztük.<br />További minden képre <k class="pink">10%</k>	kedvezményt adunk <k class="pink"> július 10 </k>-ig.<br />	Rendelj többet vagy készíts újabb képeket!</div>',			       		 				    scope: $scope,
					    buttons: [
					          { text: 'Rendben' }
					    ]
				});
			},1000);
			
			$scope.setSlide(9);
			$scope.$apply();
			
	
		};
		
		$scope.goToKosar = function(){
			$scope.kosar[$scope.lastKosarIndex].db = $scope.darabszam;
			//console.log($scope.kosar);
			
			
			$scope.keszitsTobbet = false;			
			$scope.setSlide(9);			
			
			$scope.$apply();
			
	
		};
		
		$scope.oneMoreKep = function(){
			$scope.darabszam  = 1;
			
			$scope.keszitsTobbet = false;			
			$scope.setSlide(0);			
			
			$scope.$apply();
			
	
		};
		
		$scope.darabszam = 1;
		$scope.setDarabszam = function(mennyivel){
			if($scope.darabszam + mennyivel >= 1) $scope.darabszam += mennyivel;
		};
		
		$scope.setKosarDarabszam = function(kep , mennyivel){
			if(kep.db + mennyivel >= 1){
				kep.db += mennyivel;
				kep.osszar = kep.db * kep.ar - $scope.faktor(kep.db-1) * (kep.ar * 0.1);
				
			} 
		};
		
		
		
		$scope.getKosarOsszeg = function(){
			
			$scope.vegOsszeg = 0;
			$scope.kosar.forEach(function(kep, i) {
				$scope.vegOsszeg += kep.osszar;
			}); 
			

		};
		
		$scope.faktor = function(szam){
			var n = 0;
			
			for ( i = 1; i <= szam; i++) {				
				n += i;
			}
			
			return n;
		
		};
		
		
		$scope.kepetKeszit = function() {
			$scope.sharingImage = true;
			
		
			
			
			var kellPicikep = false;

			$timeout(function() {
				var imageObj = new Image();

				imageObj.onload = function() {
					
					var logo = new Image();
					
					
					logo.onload = function() {
						
						logo.width = 100;
						logo.height = 30;
						
						var kepmeret = imageObj.width;
						
						//alert('a kép mérete : '+imageObj.width+"x"+imageObj.width);

						var extra_canvas = document.createElement("canvas");
						extra_canvas.setAttribute('width', 600);
						extra_canvas.setAttribute('height', 600);
						var ctx = extra_canvas.getContext('2d');



						imageObj = document.getElementById('filteredPhoto') || document.getElementById('fullImage');

						

						ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, 0, 0, 600, 600);
						
					
						
						if(picikep){
							$( "#toSize" ).prepend(picikep);
							
						};
							
										
						
						stackBlurCanvasRGBA(extra_canvas, 0, 0, 600, 600, $rootScope.editIdezet.blur * 3);

						
						
						ctx.drawImage(logo, extra_canvas.width - 100, extra_canvas.height - 30, 100, 30);


  
						// text illesztés canvasra
						var scale = 600 / $('#editDivToCanvas').width();
						var szoveg = $rootScope.editIdezet;
						var eredetiWidth = $('#editDivToCanvas').width() * 0.9;
						var ujWidthScale = $('#editDiv').width() / eredetiWidth;
						var text = "„"+szoveg.idezet+"”";
						var marginLeft = ($('#editDiv').width() / ujWidthScale * 0.05) * scale;
						var marginTop = ($('#editDiv').width() / ujWidthScale * 0.05) * scale;
						var posLeft = 0;
						var posTop = 0;
						if ($('#editDiv').css('left') != 'auto')
							posLeft = parseFloat($('#editDiv').css('left').replace('px', '')) * scale;
						if ($('#editDiv').css('top') != 'auto')
							posTop = parseFloat($('#editDiv').css('top').replace('px', '')) * scale;
						var width = $('#editDiv').width() * scale; 
						var maxWidth = $('#editDiv').width() * scale;
						var height = $('#editDiv').height() * scale;
						var fontFamily = szoveg.edit.fontFamily;
						var fontSize = szoveg.edit.fontSize * scale + "px";
						var fontColour = szoveg.edit.fontColor;
						ctx.font = fontSize + " " + fontFamily;
						ctx.textAlign = "center";
						ctx.fillStyle = fontColour;
						ctx.shadowColor = "black";
						ctx.shadowOffsetX = 1;
						ctx.shadowOffsetY = 1;
						
						 
						

						//idézet illesztés
						
						
						
						var szerzoSor = 0;
					
					
						if (ctx.measureText(text).width < maxWidth) {
						
							ctx.fillText(text, 7 + posLeft + marginLeft + (width / 2), posTop + marginTop + 2 + ((0 + 1) * parseInt(fontSize, 0)));							
							szerzoSor += 1;
						} else {
							var words = text.split(' '), lines = [], line = "";
							
							while (words.length > 0) {
								while (ctx.measureText(words[0]).width >= maxWidth) {
									var tmp = words[0];
									words[0] = tmp.slice(0, -1);
									if (words.length > 1) {
										words[1] = tmp.slice(-1) + words[1];
									} else {
										words.push(tmp.slice(-1));
									}
								}
								if (ctx.measureText(line + words[0]).width < maxWidth) {
									line += words.shift() + " ";
								} else {
									lines.push(line);
									line = "";
								}
								if (words.length === 0) {
									lines.push(line);
								}
							}					
							
							lines.forEach(function(line, i) {
								ctx.fillText(line, 7 + posLeft + marginLeft + (width / 2), posTop + marginTop + 2 + ((i + 1) * parseInt(fontSize, 0)));
								szerzoSor += 1;
							}); 

						}

						
					
						
						//szerző illesztés
						ujfontSize = (szoveg.edit.fontSize - 5) * scale + "px";
						ctx.font = ujfontSize + " " + fontFamily;
						var words = szoveg.kitol.split(' '), lines = [], line = "";
						
						
						if (ctx.measureText(text).width < maxWidth) {

							ctx.fillText(szoveg.kitol, 7 + posLeft + marginLeft + (width / 2), posTop + marginTop + 12 + ((szerzoSor + 0 + 1) * parseInt(fontSize, 0)));

						} else {
							while (words.length > 0) {
								while (ctx.measureText(words[0]).width >= maxWidth) {
									var tmp = words[0];
									words[0] = tmp.slice(0, -1);
									if (words.length > 1) {
										words[1] = tmp.slice(-1) + words[1];
									} else {
										words.push(tmp.slice(-1));
									}
								}
								if (ctx.measureText(line + words[0]).width < maxWidth) {
									line += words.shift() + " ";
								} else {
									lines.push(line);
									line = "";
								}
								if (words.length === 0) {
									lines.push(line);
								}
							}
							lines.forEach(function(line, i) {
								ctx.fillText(line, 7 + posLeft + marginLeft + (width / 2), posTop + marginTop + 12 + ((szerzoSor + i + 1) * parseInt(fontSize, 0)));
							});
						}
						
						
						$scope.sharingImage = false;
						
						

						//$scope.kepEdit = true;
						//$rootScope.imageUri = extra_canvas.toDataURL('image/jpeg');
						
						
					
						$rootScope.keszKep = extra_canvas.toDataURL('image/jpeg');
						
						
			
						window.plugins.socialsharing.share("#idezet.hu - www.idezet.hu", null, $rootScope.keszKep, null, function() {
							
							$scope.keszAKep = true;
							$scope.$apply();
							
						}, function(errormsg) {
						
						});

						$rootScope.gaPlugin.trackEvent($rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Megoszt egy képet : id=" + $rootScope.editIdezet.id + ", cimkék=" + $rootScope.editIdezet.cimke, new Date(), 1);

						
						
						$scope.$apply(); 


					};

					//ez azért kell hogy, újjra lefusson, mégha nem is változott src

					if (document.getElementById('fullImage')) {
						document.getElementById("hereAppend").removeChild(document.getElementById('fullImage'));
					}
					document.getElementById("hereAppend").appendChild(imageObj);
					
						
					if (document.getElementById('filteredPhoto')) {
						
					
						var picikep = document.getElementById('filteredPhoto');
						$('#filteredPhoto').remove();
						
						$scope.keszKepParams.effekt = $rootScope.filters[$scope.filterSelect];
						
						ApplyEffects[$rootScope.filters[$scope.filterSelect]](imageObj, 'jpeg', function() {
							
							logo.src = 'css/idezet_logo_pici.png';
						});

					} else {
						
						logo.src = 'css/idezet_logo_pici.png';
						
					};


				
					
					

					

				};

				imageObj.id = 'fullImage';
				imageObj.src = $rootScope.editIdezet.fullBackImage;
				
				$scope.keszKepParams.hatter = $rootScope.editIdezet.fullBackImage;
				

			}, 100);

		};
		
		$scope.kepetKeszit2 = function() {
			$scope.sharingImage = true;
			
			$scope.keszKepParams = {};
			
			
			var kellPicikep = false;

			$timeout(function() {
				var imageObj = new Image();

				imageObj.onload = function() {
					
					var logo = new Image();
					
					
					logo.onload = function() {
						
						logo.width = 100;
						logo.height = 30;
						
						var kepmeret = imageObj.width;
						
						alert('a kép mérete : '+imageObj.width+"x"+imageObj.width);

						var extra_canvas = document.createElement("canvas");
						extra_canvas.setAttribute('width', kepmeret);
						extra_canvas.setAttribute('height', kepmeret);
						var ctx = extra_canvas.getContext('2d');



						imageObj = document.getElementById('filteredPhoto') || document.getElementById('fullImage');

						

						ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, 0, 0,  kepmeret,  kepmeret);
						
					
						
						if(picikep){
							$( "#toSize" ).prepend(picikep);
							
						};
							
										
						
						stackBlurCanvasRGBA(extra_canvas, 0, 0,  kepmeret,  kepmeret, $rootScope.editIdezet.blur * 3);

						
						
						ctx.drawImage(logo, extra_canvas.width - 100, extra_canvas.height - 30, 100, 30);


  
						// text illesztés canvasra
						var scale =  kepmeret / $('#editDivToCanvas').width();
						var szoveg = $rootScope.editIdezet;
						var eredetiWidth = $('#editDivToCanvas').width() * 0.9;
						var ujWidthScale = $('#editDiv').width() / eredetiWidth;
						var text = "„"+szoveg.idezet+"”";
						var marginLeft = ($('#editDiv').width() / ujWidthScale * 0.05) * scale;
						var marginTop = ($('#editDiv').width() / ujWidthScale * 0.05) * scale;
						var posLeft = 0;
						var posTop = 0;
						if ($('#editDiv').css('left') != 'auto')
							posLeft = parseFloat($('#editDiv').css('left').replace('px', '')) * scale;
						if ($('#editDiv').css('top') != 'auto')
							posTop = parseFloat($('#editDiv').css('top').replace('px', '')) * scale;
						var width = $('#editDiv').width() * scale; 
						var maxWidth = $('#editDiv').width() * scale;
						var height = $('#editDiv').height() * scale;
						var fontFamily = szoveg.edit.fontFamily;
						var fontSize = szoveg.edit.fontSize * scale + "px";
						var fontColour = szoveg.edit.fontColor;
						ctx.font = fontSize + " " + fontFamily;
						ctx.textAlign = "center";
						ctx.fillStyle = fontColour;
						ctx.shadowColor = "black";
						ctx.shadowOffsetX = 1;
						ctx.shadowOffsetY = 1;
						
						 
						

						//idézet illesztés
						
						
						
						var szerzoSor = 0;
					
					
						if (ctx.measureText(text).width < maxWidth) {
						
							ctx.fillText(text, 7 + posLeft + marginLeft + (width / 2), posTop + marginTop + 2 + ((0 + 1) * parseInt(fontSize, 0)));							
							szerzoSor += 1;
						} else {
							var words = text.split(' '), lines = [], line = "";
							
							while (words.length > 0) {
								while (ctx.measureText(words[0]).width >= maxWidth) {
									var tmp = words[0];
									words[0] = tmp.slice(0, -1);
									if (words.length > 1) {
										words[1] = tmp.slice(-1) + words[1];
									} else {
										words.push(tmp.slice(-1));
									}
								}
								if (ctx.measureText(line + words[0]).width < maxWidth) {
									line += words.shift() + " ";
								} else {
									lines.push(line);
									line = "";
								}
								if (words.length === 0) {
									lines.push(line);
								}
							}					
							
							lines.forEach(function(line, i) {
								ctx.fillText(line, 7 + posLeft + marginLeft + (width / 2), posTop + marginTop + 2 + ((i + 1) * parseInt(fontSize, 0)));
								szerzoSor += 1;
							}); 

						}

						
					
						
						//szerző illesztés
						ujfontSize = (szoveg.edit.fontSize - 5) * scale + "px";
						ctx.font = ujfontSize + " " + fontFamily;
						var words = szoveg.kitol.split(' '), lines = [], line = "";
						
						
						if (ctx.measureText(text).width < maxWidth) {

							ctx.fillText(szoveg.kitol, 7 + posLeft + marginLeft + (width / 2), posTop + marginTop + 12 + ((szerzoSor + 0 + 1) * parseInt(fontSize, 0)));

						} else {
							while (words.length > 0) {
								while (ctx.measureText(words[0]).width >= maxWidth) {
									var tmp = words[0];
									words[0] = tmp.slice(0, -1);
									if (words.length > 1) {
										words[1] = tmp.slice(-1) + words[1];
									} else {
										words.push(tmp.slice(-1));
									}
								}
								if (ctx.measureText(line + words[0]).width < maxWidth) {
									line += words.shift() + " ";
								} else {
									lines.push(line);
									line = "";
								}
								if (words.length === 0) {
									lines.push(line);
								}
							}
							lines.forEach(function(line, i) {
								ctx.fillText(line, 7 + posLeft + marginLeft + (width / 2), posTop + marginTop + 12 + ((szerzoSor + i + 1) * parseInt(fontSize, 0)));
							});
						}
						
						
						
						
					
						
						$scope.sharingImage = false;
						
						

						//$scope.kepEdit = true;
						//$rootScope.imageUri = extra_canvas.toDataURL('image/jpeg');
						
						
			
						 
						
						
						
					
						window.canvas2ImagePlugin.saveImageDataToLibrary(function(msg) {
							alert(msg);
						}, function(err) {
							alert(err);
						}, extra_canvas);
						


						
						$scope.$apply(); 


					};

					//ez azért kell hogy, újjra lefusson, mégha nem is változott src

					if (document.getElementById('fullImage')) {
						document.getElementById("hereAppend").removeChild(document.getElementById('fullImage'));
					}
					document.getElementById("hereAppend").appendChild(imageObj);
					
						
					if (document.getElementById('filteredPhoto')) {
						
					
						var picikep = document.getElementById('filteredPhoto');
						$('#filteredPhoto').remove();
						
						$scope.keszKepParams.effekt = $rootScope.filters[$scope.filterSelect];
						
						ApplyEffects[$rootScope.filters[$scope.filterSelect]](imageObj, 'jpeg', function() {
							
							logo.src = 'css/idezet_logo_pici.png';
						});

					} else {
						
						logo.src = 'css/idezet_logo_pici.png';
						
					};


				
					
					

					

				};

				imageObj.id = 'fullImage';
				imageObj.src = $rootScope.editIdezet.fullBackImage;
				
				$scope.keszKepParams.hatter = $rootScope.editIdezet.fullBackImage;
				

			}, 100);

		};


		
		$scope.changeBlur= function() {
       		console.log($rootScope.editIdezet.blur);       		
       		$('.hatterIdezet').css('filter', 'blur('+$rootScope.editIdezet.blur+'px)').css('webkitFilter', 'blur('+$rootScope.editIdezet.blur+'px)').css('mozFilter', 'blur('+$rootScope.editIdezet.blur+'px)').css('oFilter', 'blur('+$rootScope.editIdezet.blur+'px)').css('msFilter', 'blur('+$rootScope.editIdezet.blur+'px)');
       		
      	};
		
		$scope.applyFilter = function(index){
			
			
			$scope.filtering = true;
			$scope.filterSelect = index;
			
			
			$timeout(function() {
				var kep = document.getElementById('idezetHatter');

				ApplyEffects[$rootScope.filters[$scope.filterSelect]](kep, 'jpeg', function() {
					$scope.filtering = false;
					$('#filteredPhoto').addClass('hatterIdezet');
					$('.hatter').css('filter', 'blur(' + $rootScope.editIdezet.blur + 'px)').css('webkitFilter', 'blur(' + $rootScope.editIdezet.blur + 'px)').css('mozFilter', 'blur(' + $rootScope.editIdezet.blur + 'px)').css('oFilter', 'blur(' + $rootScope.editIdezet.blur + 'px)').css('msFilter', 'blur(' + $rootScope.editIdezet.blur + 'px)');
					$scope.$apply();
				});
			}, 500); 

			$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Filtert alkalmaz : "+$rootScope.filters[$scope.filterSelect], new Date() , 1);
		 
			 
		};
		
			
		$rootScope.filtersFunctions = [
	
		function(callback) {//normál pipa
			
			Caman('#fullImage', function() {					
				this.vintage();
				this.render(function(){
					alert('mehet');
					callback();
				});
			});
	
		},
	
		function(callback) {//grayscale(1) pipa
			texture = canvasFiltered.texture(document.getElementById('fullImage'));
			canvasFiltered.draw(texture).hueSaturation(0, -1).update();
			callback();
		},
		function(callback) {//sepia(1) pipa
			texture = canvasFiltered.texture(document.getElementById('fullImage'));
			canvasFiltered.draw(texture).draw(texture).sepia(1).update();
			callback();
		},
		function(callback) {//saturate(4) pipa
			texture = canvasFiltered.texture(document.getElementById('fullImage'));
			canvasFiltered.draw(texture).hueSaturation(0, 0.65).update();
			callback();
		},
		function(callback) {//hue-rotate(90deg) pipa
			texture = canvasFiltered.texture(document.getElementById('fullImage'));
			canvasFiltered.draw(texture).hueSaturation(0.50, 0).brightnessContrast(0.1, 0.1).update();
			callback();
		},
	
		function(callback) {//brightness(.5) pipa
			texture = canvasFiltered.texture(document.getElementById('fullImage'));
			canvasFiltered.draw(texture).brightnessContrast(-0.5, -0.3).update();
			callback();
		},
		function(callback) {//contrast(3) pipa
			texture = canvasFiltered.texture(document.getElementById('fullImage'));
			canvasFiltered.draw(texture).brightnessContrast(0, 0.75).update();
			callback();
		},
		function(callback) {//contrast(1.4) saturate(1.8) sepia(.6) pipa
			texture = canvasFiltered.texture(document.getElementById('fullImage'));
			canvasFiltered.draw(texture).brightnessContrast(0, 0.35).hueSaturation(0, 0.32).sepia(0.6).update();
			callback();
		}]; 






	
	$scope.fotoz = function(index) {
		$scope.loadingCamera = true;
		navigator.camera.getPicture(function(imageURI) {

			$scope.kepEdit = true;
			$( "#idezetHatter" ).show();
			
			$( "#filteredPhoto" ).remove();
			//filterkép törlése
			var image_x = document.getElementById('filteredPhoto');
			if(image_x != null){
				image_x.parentNode.removeChild(image_x);
			}			
			
			
			$rootScope.editIdezet.filterIndex = 0;
			$scope.filterSelect = 0;
			
			$rootScope.index = index;
			$rootScope.imageUri = "data:image/jpeg;base64," + imageURI;
			$scope.imageNagyUri = "data:image/jpeg;base64," + imageURI;
			$scope.loadingCamera = false;
			$scope.$apply();

		}, function() {
			$scope.loadingCamera = false;
			$scope.$apply();
		}, {
			destinationType : Camera.DestinationType.DATA_URL,
			correctOrientation : true
		}); 

	};



		

		

	
	$scope.editPixaImage = function(kisurl,nagyurl) {
		$scope.imageStack = false;
		$scope.kepEdit = true;
		
		
		
		$("#idezetHatter").show();

		$("#filteredPhoto").remove();
		//filterkép törlése
		var image_x = document.getElementById('filteredPhoto');
		if (image_x != null) {
			image_x.parentNode.removeChild(image_x);
		}

		$rootScope.editIdezet.filterIndex = 0;
		$scope.filterSelect = 0;

		$rootScope.imageUri = kisurl;
		$scope.imageNagyUri = nagyurl;
		
		
		
	};


	$scope.onImgLoad = function (event) {
       
       
		
		$('#selectHatter').hide();
		$('#hatterLehetoseg').hide();
		$('#szerkesztoDiv .tabs').hide();
		$('.' + 'fomenu').show();
		$('#visszaNyil').hide();
		
		
		
		$('#editImage').cropper({
			aspectRatio : 1,
			autoCropArea : 1,
			movable : false,
			resizable : false,
			strict : false,
			dragCrop : false,
			guides : false,
			minCropBoxWidth : window.innerWidth - 5,		
			built: function () {
			
			}

		});

		
		

    };
		
		
	
	$scope.stack = function() {

		$scope.imageStack = true;
		
		
	
		$scope.pixabayCimke = $rootScope.editIdezet.pixabayCimke;

		if ($scope.lastPage == 0) {
			$scope.pixabayCimke = $scope.searchText;
		};
		
		$scope.pixabayCimke = 'szerelem';
	
		var USERNAME = 'lukacsisz0';
		var API_KEY = 'a66d2574021173e56c50';
		var URL = "http://pixabay.com/api/?username=" + USERNAME + "&key=" + API_KEY + "&q=" + encodeURIComponent($scope.pixabayCimke) + "&min_width=1920&min_height=1&lang=hu&response_group=high_resolution&image_type=photo&page=1";

		$scope.pixaImages = [];
		$http.get(URL).success(function(data) {

			if (parseInt(data.totalHits) > 0) {
				$.each(data.hits, function(i, hit) {
					var image = {};
					image.megjelenit = hit.webformatURL;
					image.betolt = hit.imageURL;
										
					$scope.pixaImages.push(image);
				});
			} else {
				console.log('No hits');
			}

		});

	};	
	
	
	$scope.moreStack = function(page){
				
		var USERNAME = 'lukacsisz0';
		var API_KEY = 'a66d2574021173e56c50';
		var URL = "http://pixabay.com/api/?username=" + USERNAME + "&key=" + API_KEY + "&q=" + encodeURIComponent($scope.pixabayCimke) + "&min_width=1920&min_height=1&lang=hu&response_group=high_resolution&image_type=photo&page="+page;

		$http.get(URL).success(function(data) {

			if (parseInt(data.totalHits) > 0) {
				$.each(data.hits, function(i, hit) {
					var image = {};
					image.megjelenit = hit.webformatURL;
					image.betolt = hit.imageURL;
										
					$scope.pixaImages.push(image);
				});
			} else {
				console.log('No hits');
			}

		});
		
		
	};

	
	$scope.taloz = function(index) {
		$scope.loadingGallery = true;
		navigator.camera.getPicture(function(imageURI) {
			$scope.kepEdit = true;
			$( "#idezetHatter" ).show();
			
			$( "#filteredPhoto" ).remove();
			//filterkép törlése
			var image_x = document.getElementById('filteredPhoto');
			if(image_x != null){
				image_x.parentNode.removeChild(image_x);
			}		
			 
			
			
			$rootScope.editIdezet.filterIndex = 0;
			$scope.filterSelect = 0;
			
			$rootScope.index = index;
			$rootScope.imageUri = "data:image/jpeg;base64," + imageURI;
			$scope.imageNagyUri = "data:image/jpeg;base64," + imageURI;
			$scope.loadingGallery = false;
			$scope.$apply();

		}, function() {
			$scope.loadingGallery = false;
			$scope.$apply();
		}, {
			destinationType : Camera.DestinationType.DATA_URL,
			sourceType : 0,
			correctOrientation : true
		});

	};




		
	

		$scope.szerkeszt = function(idezet) {
		
			
			$rootScope.editIdezet.id = idezet.id;
			$rootScope.editIdezet.cimke = idezet.cimke;	
				
			var cimkek = idezet.cimke.split(' ');
			$rootScope.editIdezet.pixabayCimke = cimkek[0];
			
		
			
			$rootScope.editIdezet.kitol = idezet.kitol;
			
			$rootScope.editIdezet.idezet = idezet.idezet;
						
			$rootScope.editIdezet.edit.fontColor  =  $rootScope.editIdezet.edit.fontColor || 'black';
			
			//$rootScope.editIdezet.backImage = "js/effects/bokeh-stars.png" 
						
				
			$scope.lastPage = $scope.page;
			//console.log($scope.lastPage)
			
			
			//get image from pixabay
						
			
			

			
			$scope.newformeKepEdit = false;	  				
			$ionicSlideBoxDelegate.slide(3);
			
			 
			
		 
			
			$scope.$apply();
			
			
		};


		$scope.setEditHeight = function(){
			if (!$scope.textIdezetAreaWidth) {
				$scope.textIdezetAreaWidth = $('#editDiv').width()-4 + "px";	
				$scope.textKitolAreaWidth = $('#editDiv').width()-4 + "px";
								
			}
			 
			$scope.textIdezetAreaHeight = $('#idezetEditDiv').height() + "px";
			$scope.textKitolAreaHeight = $('#kitolEditDiv').height() + "px";
			
			
			
		};
		

	
	
		function updatePreview(c) {
		    if (parseInt(c.w) > 0) {
		        // Show image preview
		        var imageObj = $("#viewport")[0];
		        var canvas = $("#preview")[0];
		        var context = canvas.getContext("2d");
		
		        if (imageObj != null && c.x != 0 && c.y != 0 && c.w != 0 && c.h != 0) {
		            context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height); 		            
		        }
		    }
		}
		
	
		$scope.nosave = function(){
		
		
			$scope.kepEdit = false;
			//ha a user kiikszelte a képszerkesztést, akkor a pixabaystack maradjon
			$scope.imageStack = true;
		};
	
		$scope.rotate = function() {
			$('#editImage').cropper('rotate', 45);
		};
	
		$scope.setSlide = function(i) {
			$ionicSlideBoxDelegate.slide(i);	
			
			if ($ionicSideMenuDelegate.isOpen()) {
				$ionicSideMenuDelegate.toggleRight();
			};

			$rootScope.gaPlugin.trackEvent( $rootScope.successHandler, $rootScope.errorHandler, $scope.userid, "Menü választás : "+$scope.titles[i], new Date() , 1);
		};
	

		
		
	
		



	$rootScope.colors = ['#000000','#FFFFFF','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722','#795548','#9E9E9E','#607D8B','#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5'];
	$rootScope.fonts = ['Courgette','Lily Script One','Petit Formal Script','Marck Script','Lobster','Francois One','Kaushan Script','Jura','Playball','Shadows Into Light Two','Audiowide','Freckle Face'];
	
	
	$rootScope.filters = [];
	$rootScope.filters.push('reset');
	$rootScope.filters.push('sumie');
	$rootScope.filters.push('fluor'); 
	$rootScope.filters.push('nostalgia');
	$rootScope.filters.push('deutlich');
	$rootScope.filters.push('memphis');
	$rootScope.filters.push('lotus');
	$rootScope.filters.push('phykos');

 



	$scope.legyenSzinScroll = function() {
		

		
			$timeout(function() {

				var $frame = $('.frameColor');
				var $wrap = $frame.parent();

				var options = {
					horizontal : 1,
					itemNav : 'forceCentered',
					smart : 1,
					activateMiddle : 1,
					activateOn : 'click',
					touchDragging : 0,
					mouseDragging : 0,
					startAt : $rootScope.editIdezet.colorIndex || 0,
					scrollBar : $wrap.find('.scrollbar'),
					speed : 100,
					easing : 'easeOutExpo'
				};

				$rootScope.sly =  new Sly($frame, options).init();
				var ehh;
				$frame.swipe({
					//Generic swipe handler for all directions
						
					swipeStatus : function(event, phase, direction, distance, duration, fingerCount) {
						
						
						
						if(phase == 'start'){
							ehh = $rootScope.sly.pos.dest;
						}
						console.log(phase +" "+ ehh);
						
						if (direction == 'left') {
							$rootScope.sly.slideTo(ehh  + distance);
						} else if (direction == 'right') {
							$rootScope.sly.slideTo(ehh  - distance);
						}
						
		
					},

					
					swipe : function(event, direction, distance, duration, fingerCount, fingerData) {			
						
								
						
					},
					//Default is 75px, set to 0 for demo so any distance triggers swipe
					threshold : 0
				});

				$rootScope.sly.on('active', function(e, itemIndex) {
					
					
					$rootScope.editIdezet.edit.fontColor = $rootScope.colors[itemIndex];
					$rootScope.editIdezet.colorIndex = itemIndex;
					
					$("#idezetEditDiv").css('color', $rootScope.colors[itemIndex]);
					$("#kitolEditDiv").css('color', $rootScope.colors[itemIndex]);
					
					
					
					// 'load'

				});

			}, 10); 


	}; 
	
	
	
	$scope.legyenFontScroll = function() {
		

		
		
			$timeout(function() {

				var $frame = $('.frameFont');
				var $wrap = $frame.parent();

				var options = {
					horizontal : 1,
					itemNav : 'forceCentered',
					smart : 1,
					activateMiddle : 1,
					activateOn : 'click',
					touchDragging : 0,
					mouseDragging : 0,
					startAt : $rootScope.editIdezet.fontIndex || 0,
					scrollBar : $wrap.find('.scrollbar'),
					speed : 100,
					easing : 'easeOutExpo'
				};

				$rootScope.sly =  new Sly($frame, options).init();				
				var ehh;
				$frame.swipe({
					//Generic swipe handler for all directions
						
					swipeStatus : function(event, phase, direction, distance, duration, fingerCount) {
						
						
						
						if(phase == 'start'){
							ehh = $rootScope.sly.pos.dest;
						}
						console.log(phase +" "+ ehh);
						
						if (direction == 'left') {
							$rootScope.sly.slideTo(ehh  + distance);
						} else if (direction == 'right') {
							$rootScope.sly.slideTo(ehh  - distance);
						}
						
		
					},

					
					swipe : function(event, direction, distance, duration, fingerCount, fingerData) {			
						
								
						
					},
					//Default is 75px, set to 0 for demo so any distance triggers swipe
					threshold : 0
				});

		
				$rootScope.sly.on('active', function(e, itemIndex) {
					$rootScope.editIdezet.edit.fontFamily = $rootScope.fonts[itemIndex];
					$rootScope.editIdezet.fontIndex = itemIndex;
					
					$("#idezetEditDiv").css("font-family","\'"+$rootScope.fonts[itemIndex]+"\'");
					$("#kitolEditDiv").css("font-family","\'"+$rootScope.fonts[itemIndex]+"\'");

					// 'load'

				}); 




			}, 10);



	}; 

	
	
	
	$scope.legyenFilterScroll = function() {
		

		
		
			$timeout(function() {

				var $frame = $('.frameFilter');
				var $wrap = $frame.parent();

				var options = {
					horizontal : 1,
					itemNav : 'forceCentered',
					smart : 1,
					activateMiddle : 1,
					activateOn : 'click',
					touchDragging : 0,
					mouseDragging : 0,
					startAt : $rootScope.editIdezet.filterIndex || 0,
					scrollBar : $wrap.find('.scrollbar'),
					speed : 100,
					easing : 'easeOutExpo'
				};

				$rootScope.sly =  new Sly($frame, options).init();				
				var ehh;
				$frame.swipe({
					//Generic swipe handler for all directions
						
					swipeStatus : function(event, phase, direction, distance, duration, fingerCount) {
						
						
						
						if(phase == 'start'){
							ehh = $rootScope.sly.pos.dest;
						}
						console.log(phase +" "+ ehh);
						
						if (direction == 'left') {
							$rootScope.sly.slideTo(ehh  + distance);
						} else if (direction == 'right') {
							$rootScope.sly.slideTo(ehh  - distance);
						}
						
		
					},

					
					swipe : function(event, direction, distance, duration, fingerCount, fingerData) {			
						
								
						
					},
					//Default is 75px, set to 0 for demo so any distance triggers swipe
					threshold : 0
				});

		
				$rootScope.sly.on('active', function(e, itemIndex) {
					$rootScope.editIdezet.edit.filter = $rootScope.filters[itemIndex];
					$rootScope.editIdezet.filterIndex = itemIndex;
					

					// 'load'

				}); 




			}, 10);



	}; 
	
	


	



	$scope.pulse = function() {

		
		if (!$rootScope.editIdezet.bezar) {
			$('.pulse').animate({
				zoom : 1.2
			}, 500, function() {
				$('.pulse').animate({
					zoom : 1.0
				}, 500);

			});
		}

		


	}; 

/*		
		$scope.nopulseHatter = function() {

			$('.pulseHater').clearQueue();
			$('.pulseHater').stop();

		};
		
		
		$scope.pulseSzoveg = function() {
			
			$('.pulseSzoveg').animate({
				zoom : 1.1
			}, 500, function() {
				// First animate complete
				$('.pulseSzoveg').animate({
					zoom : 1
				}, 500, function() {
					// Second animate complete
					$scope.pulseSzoveg();
				});
			});

		};
		
		$scope.nopulseSzoveg = function() {

			$('.pulseSzoveg').clearQueue();
			$('.pulseSzoveg').stop();

		};

*/



	//dupla click a kereső gombra, a tetejére ugrik
	
		$(".doubleTappSearch").swipe({
			tap : function() {
			},
			doubleTap : function(event, target) {
				$timeout(function() {
					$('#idezetekLista').animate({
						scrollTop : 0
					}, '200', 'swing', function() {

					});
				});
			}
		}); 


	$scope.scrollToTop = function() {
		$timeout(function() {
			$('#idezetekLista').animate({
				scrollTop : 0
			}, '200', 'swing', function() {

			});
		});	
		
		
	};
	
 
		$scope.dragableFalse = function() {
			//alert('dragfalse');
			$("#editDiv").draggable( "disable" );
		};
		$scope.dragableTrue = function() {
			//alert('dragtrue');
			//$("#editDiv").draggable() ;
		};

 
 
 	
		$scope.fontSizeRange = function(fontSize) {
			$rootScope.editIdezet.edit.fontSize = fontSize;

			$("#idezetEditDiv").css("font-size", fontSize + "px");
			$("#idezetEditDiv").css("line-height", fontSize + "px");

			$("#kitolEditDiv").css("font-size", fontSize - 5 + "px");
			$("#kitolEditDiv").css("line-height", fontSize - 5 + "px");
		};


	$scope.display = function(mit,vissza){
		
		$('#visszaNyil').show(); 
			
		if ($scope.hol == "szovegFont" || $scope.hol == "szovegColor") {
			$('#szerkesztoDiv .tabs').hide();
			$('.' + 'szoveg').show();
			$scope.hol = mit;
			
			
		} else {
		
			
			$('#szerkesztoDiv .tabs').hide();
			$('.' + mit).show();
			$scope.hol = mit;
			
			$scope.nincsVissza = true;
			if(mit != 'fomenu')	$scope.nincsVissza = false;
				
			 
			
		}
		
		
	
	};
	
	 
	
		$scope.showHatterLehetoseg = function(kibe) {
			if (kibe) {
				$('#hatterLehetoseg').show();
				$('#selectHatter').hide();
			} else { 
				$('#hatterLehetoseg').hide();
				$('#selectHatter').show();
							
			}

		}; 

	$scope.slideHasChanged = function(i) {
		$scope.limit = 5;
		$scope.title = $scope.titles[i];
		$(".tab-item").removeClass("active");
		$("#tab" + i).addClass("active");
		
	
	
		
		$scope.page = i;
		
		
		if (i == 1) {
		
			$(".doubleTapp").swipe("destroy");
			$(".doubleTapp").swipe({
				tap: function(){},
				doubleTap : function(event, target) {
					$scope.szerkeszt($scope.kedvencek[target.id]);
				}
			}); 
			
			
		
			


        }else if (i == 2) {
		
			$(".doubleTappp").swipe("destroy");
			$(".doubleTappp").swipe({
				tap: function(){},
				doubleTap : function(event, target) {
					$scope.szerkeszt($scope.ertesitesek[target.id].idezet);
				}
			}); 


        }else if (i == 3 && $rootScope.editIdezet.idezet.length > 5) {

				$scope.nincsVissza = true;
			
				$timeout(function() {
					
					$ionicSlideBoxDelegate.enableSlide(false);
					
					var cw = $('#forSize').width();
					
				
					
					$("#idezetEditDiv").css('color', $rootScope.editIdezet.edit.fontColor || 'black');
					$("#kitolEditDiv").css('color', $rootScope.editIdezet.edit.fontColor || 'black');
					$("#idezetEditDiv").css("font-size", "20px");
					$("#idezetEditDiv").css("line-height","20px");

					$("#kitolEditDiv").css("font-size","15px");
					$("#kitolEditDiv").css("line-height", "15px"); 

					
					
					
					$('.outEditDiv').css({
						'height' : cw + 'px'
					});
					$('.outEditDiv').css({
						'maxheight' : cw + 'px'
					});
					
					$('#toSize').width($('#forSize').width());
					$('#toSize').height($('#forSize').height()); 
					
					
					console.log('szélesség  : '+ cw);


					$rootScope.leftMaring = parseInt(($('ion-slide').width() - 310) / 2);

					$("#editDiv").draggable();
			
				


					$("#editDiv").resizable({
						helper : "ui-resizable-helper",
						stop: function( event, ui ) {
							//console.log(ui.size.width);
							
							$scope.textIdezetAreaWidth = ui.size.width-4+"px";						
							$scope.textKitolAreaWidth = ui.size.width-4+"px";					
						
							$scope.textIdezetAreaHeight = $('#idezetEditDiv').height() + "px";							
							$scope.textKitolAreaHeight = $('#kitolEditDiv').height() + "px";
							
							
							
							
							
						}						
					});

					$("#editDiv").swipe({
						pinchIn : function(event, direction, distance, duration, fingerCount, pinchZoom) {
							//console.log("You pinched " + direction + " by " + distance + "px, zoom scale is " + pinchZoom);
						},
						pinchOut : function(event, direction, distance, duration, fingerCount, pinchZoom) {
							//console.log("You pinched " + direction + " by " + distance + "px, zoom scale is " + pinchZoom);
						},
						pinchStatus : function(event, phase, direction, distance, duration, fingerCount, pinchZoom) {
							//console.log("Pinch zoom scale " + pinchZoom + "  <br/>Distance pinched " + distance + " <br/>Direction " + direction);
							//var currSize = $('#editDiv').css('font-size').replace("px", "");

							var currSize = $rootScope.editIdezet.edit.fontSize;

							var zoomRate = ((1 - pinchZoom) / 15) * -1;

							if (currSize * (1 + zoomRate) < 40 && currSize * (1 + zoomRate) > 10) {
								$rootScope.editIdezet.edit.fontSize = currSize * (1 + zoomRate);
								
								
								$("#idezetEditDiv").css("font-size",currSize * (1 + zoomRate)+"px");
								$("#idezetEditDiv").css("line-height",currSize * (1 + zoomRate)+"px");
								
								$("#kitolEditDiv").css("font-size",currSize * (1 + zoomRate)-5+"px");
								$("#kitolEditDiv").css("line-height",currSize * (1 + zoomRate)-5+"px");
								
								$("#fontSizeRange").val(currSize * (1 + zoomRate));
							};

						},
						fingers : 2,
						pinchThreshold : 0
					});

				}, 100);
				
			


		}else if(i == 4){
			$ionicSlideBoxDelegate.enableSlide(false);
		}else if(i == 5){
			$ionicSlideBoxDelegate.enableSlide(false);
		}else if(i == 6){
			$ionicSlideBoxDelegate.enableSlide(false);
		}else if(i == 7){
			$ionicSlideBoxDelegate.enableSlide(false);
		}else if(i == 8){
			$ionicSlideBoxDelegate.enableSlide(false);
		}else if(i == 9){
			$ionicSlideBoxDelegate.enableSlide(false);
			
			
		}  else {
			
			$ionicSlideBoxDelegate.enableSlide(true);
			
			
		}

	}; 



	
		
	};    
     
 
});


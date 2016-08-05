var links = (function(){
	var init = function () {
		parseURL();

		$(window).on('hashchange', function (e){
			parseURL();
		});

		//appendedEvent();
	};

	var parseURL = function() {
		window.location.hash.slice(1).split(";").forEach(function (s) {
			if (typeof dialog[s.split('?')[0]] != "undefined") {
				var func = s.split('?')[0];
				var args = s.split('?')[1].split('&');

				dialog[func].apply(this, args);
			} else if (window.location.hash == "" || window.location.hash == "#") {
				window.location.hash = "#genPopular?0";
			} else if (typeof dialog[window.location.hash.slice(1).split(";")] == "undefined") {
				alert("404 Not Found");
				window.location.hash = '#genPopular?0';
			};
		});
	};

	// var appendedEvent = function () {
	// 	$("body").on('click', 'a', function (){
	// 		$("body a.appended").each(function (){
	// 			if (window.location.hash != "" && window.location.hash != "#") {
	// 				this.href = window.location.hash + ";" + encodeURI(this.getAttribute("name"));
	// 			} else if (window.location.hash == "" || window.location.hash == "#") {
	// 				this.href = "#" + this.getAttribute("name");
	// 			}
	// 		});
	// 	});
	// };

	return {
		init: init,
		parseURL: parseURL
	};
}());

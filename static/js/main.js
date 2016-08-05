$(document).ajaxStart(function (settings) {
	$("div#loading_indicator").fadeIn(250);
	$("span#loading_icon").addClass("animate-loading-icon");
}).ajaxStop(function (settings) {
	$("div#loading_indicator").fadeOut(500);
	$("span#loading_icon").removeClass("animate-loading-icon");
}).ajaxError(function (event, request, settings){
	console.error("Request failed: " + settings.url + ".");
	alert("Ошибка запроса " + settings.url + ". Попробуйте позже.");
});

$(document).ready(function () {
	dialog.init();
	features.init();
	links.init();
});

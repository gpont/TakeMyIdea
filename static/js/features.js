var features = (function () {
	var init = function () {
		navbar();
		profile();
		header();
		scrollToTopEvent();
	};

	var header = function () {
		$(window).scroll(function () {
			if ($(window).scrollTop() > 0) {
				$("header").addClass("header_scrolled");
			} else {
				$("header").removeClass("header_scrolled");
			};
		});

		$("span#logo").click(function () {
			links.parseURL();
		});
	};

	var navbar = function () {
		function hideNavbar() {
			$("nav").removeClass("unhidden");
		};
		function showNavbar() {
			$("nav").addClass("unhidden");
		};

		$("#hide_navbar").click(function () {
			$("nav").hasClass("unhidden") ? hideNavbar() : showNavbar();
		});
	};

	var profile = function () {
		$("#profile_button").click(function () {
			$("#profile_options").fadeToggle(250);
		});

		$("#login_button").click(function () {
			$("form#login_form").fadeIn(0);
			$("form#register_form").fadeOut(0);
		});

		$("#register_button").click(function () {
			$("form#register_form").fadeIn(0);
			$("form#login_form").fadeOut(0);
		});
	};

	var scrollToTopEvent = function () {
		var scrollFromTop, oldScrollFromTop;

		$(window).scroll(function () {
			if ($(window).scrollTop() > 0) {
				$("div#up span").html("↑");
				scrollFromTop = $(window).scrollTop();
			} else if ($(window).scrollTop() === 0) {
				$("div#up span").html("↓");
				scrollFromTop = $(window).scrollTop();
			};
		});

		$("#up").click(function () {
			if (scrollFromTop !== 0) {
				oldScrollFromTop = scrollFromTop;
				$("html, body").animate({scrollTop: 0}, 250, 'swing');
			} else {
				$("html, body").animate({scrollTop: oldScrollFromTop}, 250, 'swing', function () {
					oldScrollFromTop = $(window).scrollTop();
				});
			};
		});
	};

	return {
		init: 			init
	}
}());

var dialog = (function () {
	var init = function () {
		feed.genCategories();

		loginEvent();
		registerEvent();
		logoutEvent();
		feed.likeEvent();
		searchEvent();
	};

	var feed = (function () {
		var categoriesReq;
		var ideas_root = "/ideas/";
		var ideas = {
			"popular": ideas_root + "get_the_most_popular_ideas/",
			"last": ideas_root + "get_the_most_popular_ideas/",
			"random": ideas_root + "get_random_ideas/",
			"get_categories": ideas_root + "get_categories/",
			"category": ideas_root + "get_ideas_by_category/",
			"search": ideas_root + "search/",
			"idea": ideas_root + "get_idea_by_id/",
			"like": ideas_root + "like_thread/",
			"new": ideas_root + "new_idea"
		};

		////////////////
		// Categories //
		var genCategory = function (data) {
			function genBlock(data) {
				return $("<li/>").append(
					$("<a/>").attr({"href": "#genFromCategory?" + "0" + "&" + data['id']}).html(data['name'])
				);
			};

			var block = genBlock(data);

			if ("subs" in data) {
				var subs_ul = $("<ul/>");

				$.each(data['subs'], function (i, k) {
					subs_ul.append(genBlock(k));
				});

				block.append(subs_ul);
			};

			return block;
		};

		var genCategories = function () {
			categoriesReq = $.ajax({
				url: ideas['get_categories'],
				type: "POST",
				dataType: "json"
			}).done(function (json) {
				window.categories = json;

				$.each(json, function (i, k) {
					$("nav ul#categories").append(genCategory(json[i]));
				});
			});
		};

		/////////////
		// Threads //
		var clearFeed = function (callback) {
			$(window).scrollTop(0);

			var el = $("article").find("div.item"), count = el.length;

			el.each(function (i, k){
				$(k).fadeOut('slow', function () {
					$(this).remove();
				})
			});

			if (typeof callback != 'undefined')
				callback();
		};

		var genThread = function (data, type, callback) {
			var $item = $("<div/>").attr("class", "item")

			if (typeof type == "undefined" || type === "thread") {
				$item.append(
					$("<div/>").attr("class", "thread").append(
						$("<h1/>").attr("class", "title").append(
							$("<a/>").attr({"href": "#viewThread?" + data['id']}).html(data['title'])
						).append(
							$("<h6/>").attr("class", "date").html(data['date'])
						).append(
							$("<h6/>").attr("class", "author").text(", автор ").append(
								$("<a/>").attr("href", "#genProfile?" + data['creator']).html(data['creator'])
							)
						)
					).append(
						$("<div/>").attr("class", "description").html(data['description'])
					)
				).append(
					$("<div/>").attr("class", "social_container").append(
						$("<div/>").attr("class", "views icon").append(
							$("<span/>").attr("class", "icon-eye")
						).append(data['views'])
					).append(
						$("<div/>").attr({"class": "likes icon", "id": "like_"+data['id']}).append(
							$("<span/>").attr("class", "icon-heart like" + (data['is_liked'] ? " liked" : "")).append(data['likes'])
						)
					)
				);
			} else if (type === "empty") {
				$item.append(
					$("<div/>").attr("class", "thread").append(
						$("<div/>").attr("class", "description").html("По данному запросу ничего не найдено.")
					)
				);
			} else if (type === "addIdea") {
				var categories = $("<select/>");

				$.when(categoriesReq).done(function () {
					$.each(window.categories, function (i, val) {
						categories.append($("<option>").text(val['name']).attr('value', val['id']));

						$.each(val['subs'], function (i, val_sub) {
							categories.append($("<option>").text("— " + val_sub['name']).attr('value', val_sub['id']));
						});

						if (i+1 === window.categories.length) {
							$item.append(
								$("<div/>").attr("class", "add_idea").append(
									$("<h1/>").attr("class", "title").html("Добавить идею")
								).append(
									$("<div/>").attr("class", "content").append(
										$("<p/>").html("Название:")
									).append(
										$("<input/>").attr({"type": "text", "id": "idea_title", "placeholder": "Название"})
									).append(
										$("<p/>").html("Категория:")
									).append(
										categories
									).append(
										$("<p/>").html("Описание:")
									).append(
										$("<textarea/>").attr({"id": "idea_editor", "cols": 80, "rows": 20})
									)
								).append(
									$("<div/>").attr("class", "control_buttons").append(
										$("<input/>").attr({"type": "button", "value": "Добавить"})
									)
								)
							);
						};
					});
				});
			};

			return $item;
		};

		var genFeed = function (url, data) {
			clearFeed();

			var $new;

			$.ajax({
				url: url,
				type: "POST",
				data: data,
				dataType: "json"
			}).done(function (json) {
				if (json.length > 0) {
					for (var i = 0; i < json.length; i++) {
						$new = genThread(json[i]).css("display", "none");

						$("article").append($new);

						$new.fadeIn('slow');
					};
				} else if (json.length === 0) {
					$new = genThread({}, "empty").css("display", "none");

					$("article").append($new);

					$new.fadeIn('slow');
				};
			});
		};

		var genPopular = function (page) {
			genFeed(ideas['popular'], {"page": page});
		};

		var genLast = function (page) {
			genFeed(ideas['last'], {"page": page});
		};

		var genRandom = function (page) {
			genFeed(ideas['random'], {"page": page});
		};

		var genFromCategory = function (page, category) {
			genFeed(ideas['category'], {"category": category, "page": page});
		};

		var viewThread = function (id) {
			$.ajax({
				url: ideas['idea'],
				type: "POST",
				data: {"id": id},
				dataType: "json"
			}).done(function (json) {
				clearFeed();

				$("article").append(
					genThread(json).append(
						$("<div/>").attr("class", "comments").append(
							$("<p/>").attr("class", "title").html("Комментарии (WIP)")
						)
					)
				)
			});
		};

		var addIdea = function () {
			clearFeed();

			var $new = genThread({}, "addIdea").css("display", "none");

			$("article").append($new);

			$new.fadeIn('slow');
			// $.ajax({
			// 	url: ideas['new'],
			// 	type: "POST",
			// 	data: {}
			// })
		};

		var settings = function () {
			clearFeed();

			// var $new = genThread({}).css("display", "none");
			// $("article").append($new);
			// $new.fadeIn('slow');

			alert("WIP");
		};

		var likeEvent = function () {
			var mainEl;

			$("body").on('click', '.likes', function () {
				mainEl = $(this);

				$.ajax({
					url: ideas['like'],
					type: "POST",
					data: {"thread_id": mainEl.attr("id").split("_")[1]},
				}).done(function (result) {
					var like = mainEl.find(".like");

					if (result != "false") {
						like.hasClass("liked") ? like.removeClass("liked") : like.addClass("liked");

						like.html(result);
					} else {
						alert("Вы должны войти в систему");
					};
				})
			})
		};

		var search = function (page, request) {
			genFeed(ideas['search'], {"search": request, "page": page});
		};

		return {
			genPopular: genPopular,
			genLast: genLast,
			genRandom: genRandom,
			genFromCategory: genFromCategory,
			genCategories: genCategories,
			viewThread: viewThread,
			addIdea: addIdea,
			settings: settings,
			likeEvent: likeEvent,
			search: search
		};
	}());

	var loginEvent = function () {
		$("#login_form").submit(function (e) {
			e.preventDefault();

			$.ajax({
				url: "/auth/login/",
				type: "POST",
				data: {"email": $("#login_email_input").val(), "password": $("#login_password_input").val()},
				dataType: "json"
			}).done(function (json) {window.location.reload()});
		});
	};

	var registerEvent = function () {
		$("#register_form").submit(function (e) {
			e.preventDefault();

			$.ajax({
				url: "/auth/register/",
				type: "POST",
				data: {
					"username": $("#register_username_input").val(),
					"email": $("#register_email_input").val(),
					"password": $("#register_password_input").val(),
					"about": ""
				},
			}).done(function (result) {
				$("#register_form").append($("<p/>").html("Для завершения регистрации вам необходимо пройти по ссылке, отправленной на ваш почтовый адрес."))
			});
		});
	};

	var logoutEvent = function () {
		$("#logout_button").click(function (e) {
			e.preventDefault();

			$.ajax({
				url: "/auth/logout/",
				type: "POST"
			}).done(function () {window.location.reload()});
		})
	};

	var searchEvent = function () {
		$("#search").keypress(function (e) {
			if (e.which == 13) {
				location.hash = "#search?" + "0&" + $(this).children("input").val();
			};
		});
	};

	return {
		init: 					init,
		genPopular: 			feed.genPopular,
		genLast: 				feed.genLast,
		genRandom: 				feed.genRandom,
		genFromCategory: 		feed.genFromCategory,
		viewThread: 			feed.viewThread,
		addIdea: 				feed.addIdea,
		settings: 				feed.settings,
		search: 				feed.search
	};
}());

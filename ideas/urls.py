from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
	url(r'^new_idea/', 'ideas.views.new_idea'),
	url(r'^get_ideas_by_category/', 'ideas.views.get_ideas_by_category'),
	url(r'^get_idea_by_id/', 'ideas.views.get_idea_by_id'),
	url(r'^search/', 'ideas.views.search'),
	url(r'^get_the_most_popular_ideas/', 'ideas.views.get_the_most_popular_ideas'),
	url(r'^get_random_ideas/', 'ideas.views.get_random_ideas'),
	url(r'^get_categories/', 'ideas.views.get_categories'),
	url(r'^like_thread/', 'ideas.views.like_thread'),
)
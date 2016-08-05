from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'TakeMyIdea.view.index'),
    url(r'^features$', 'TakeMyIdea.view.features'),
    url(r'^img/(?P<img_type>\d+)/(?P<img_path>\d+)$', 'TakeMyIdea.views.img'),
    url(r'^auth/', include('auth.urls')),
    url(r'^ideas/', include('ideas.urls')),
)

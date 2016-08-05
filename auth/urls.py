from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^login/', 'auth.views.login_view'),
    url(r'^logout/', 'auth.views.logout_view'),
    url(r'^register/', 'auth.views.register'),
    url(r'^activate/', 'auth.views.activate'),
    url(r'^change_data/', 'auth.views.change_data'),
    url(r'^get_data_user/', 'auth.views.get_data_user'),
    url(r'^upload_avatar/', 'auth.views.upload_avatar'),
    url(r'^get_resized_image/', 'auth.views.get_resized_image'),
)
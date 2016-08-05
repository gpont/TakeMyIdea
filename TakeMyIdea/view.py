from django.http import HttpResponse
from django.shortcuts import render
from TakeMyIdea import settings
import os

def index(request):
	return render(request, 'index.html', {})

def features(request):
	return HttpResponse(open(settings.BASE_DIR+'/../FEATURES').read(), content_type='text/plain; charset=utf8')

def img(request, img_type, img_path):
	path = settings.MEDIA_ROOT+'/'+img_type+'/'+img_path
	default_path = settings.MEDIA_ROOT+'/'+img_type+'/template.jpg'
	if os.path.exists(path):
		with open(path, "rb") as f:
			return HttpResponse(f.read(), mimetype="image/jpeg")
	else:
		with open(default_path, "rb") as f:
			return HttpResponse(f.read(), mimetype="image/jpeg")
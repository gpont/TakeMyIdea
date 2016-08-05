from django.contrib.auth.models import User
from django.db import models

class Category(models.Model):
	name = models.CharField(max_length=200)
	par_category = models.ForeignKey('self', blank=True, null=True)
	def __unicode__(self):
		return self.name

class Idea(models.Model):
	title = models.CharField(max_length=100, blank=True, null=True)
	description = models.CharField(max_length=10000, blank=True, null=True)
	likes = models.ManyToManyField(User, related_name='likes')
	views = models.DecimalField(max_digits=8, decimal_places=0)
	publish_date = models.DateField(auto_now_add=True)
	creator = models.ForeignKey(User, related_name='creator')
	category = models.ForeignKey(Category)
	def __unicode__(self):
		return self.title

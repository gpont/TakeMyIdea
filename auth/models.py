from django.db import models
from django.contrib.auth.models import User

class UserData(models.Model):
	user = models.ForeignKey(User, related_name="user_data")
	about = models.CharField(max_length=400, blank=True, null=True)
	activate_text = models.CharField(max_length=12, blank=True, null=True)
	def __unicode__(self):
		return self.user.username

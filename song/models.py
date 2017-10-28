from __future__ import unicode_literals

from django.db import models

from tag.models import *
import os
from django.conf import settings

def filepath(self, filename):
	return '%s' % (os.path.join(settings.BASE_DIR, 'media/' + filename))
	
class SongManager(models.Manager):
	use_for_related_fields = True
	def get_queryset(self):
		return super(SongManager, self).get_queryset()

class Song(models.Model):
	songId = models.AutoField(primary_key = True)
	songName = models.CharField(max_length = 50)
	songFile = models.FileField(upload_to = filepath)
	tags = models.ManyToManyField(Tag)
	objects = models.Manager()
	songObjects = SongManager()
	
	def __unicode__(self):
		return u'%s' % self.songName

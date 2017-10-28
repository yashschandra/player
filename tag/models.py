from __future__ import unicode_literals

from django.db import models

class Tag(models.Model):
	tagId = models.AutoField(primary_key = True)
	tagName = models.CharField(max_length = 20)
	
	def __unicode__(self):
		return u'%s' % self.tagName

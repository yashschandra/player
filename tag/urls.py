from django.conf.urls import url
from views import *

urlpatterns = [
	url(r'^add/$', add),
	url(r'^alltags/$', allTags),
]

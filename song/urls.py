from django.conf.urls import url
from views import *

urlpatterns = [
	url(r'^upload/$', upload),
	url(r'^edit/$', edit),
	url(r'^remove/$', remove),
	url(r'^allsongs/$', allSongs),
	url(r'^play/$', play),
	url(r'^pause/$', pause),
	url(r'^unpause/$', unpause),
	url(r'^stop/$', stop),
	url(r'^volumeup/$', volumeUp),
	url(r'^volumedown/$', volumeDown),
	url(r'^current/$', current),
	url(r'^details/$', details),
	url(r'^addtag/$', addTag),
	url(r'^removetag/$', removeTag),
	url(r'^tagsleft/$', tagsLeft),
	url(r'^indexdata/$', indexData),
	url(r'^searchdata/$', searchData),
]

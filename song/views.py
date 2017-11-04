from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from models import *
import vlc
import json
import websocket
import os
from django.conf import settings
from subprocess import Popen, PIPE
import requests
import os

media = None
instance = vlc.Instance()
player = instance.media_player_new()
currentSong = ''
relatedSongs = []
	
def getSocketPort():
	with open(os.path.join(settings.BASE_DIR, 'settings.js')) as socketFile:
		fileData=socketFile.read()
		data = json.loads(fileData[fileData.find('{'): fileData.rfind('}') + 1])
		socketPort = data['PORT']
		return str(socketPort)

socketPort = getSocketPort()
ws = websocket.WebSocket()
ws.connect('ws://localhost' + ':' + socketPort)

@csrf_exempt
def upload(request):
	response = {}
	if request.method == 'POST':
		post = request.POST
		files = request.FILES
		song = Song(songName = post['name'], songFile = files['file'])
		song.save()
		addNewSong(song)
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def edit(request):
	response = {}
	if request.method == 'POST':
		body = json.loads(request.body)
		song = Song.objects.get(songId = body['id'])
		song.songName = body['name']
		song.save(update_fields = ['songName'])
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def remove(request):
	response = {}
	if request.method == 'POST':
		body = json.loads(request.body)
		song = Song.objects.get(songId = body['id'])
		removeSong(song)
		song.delete()
		response['status'] = 'OK'
	return JsonResponse(response)

@csrf_exempt	
def allSongs(request):
	response = {}
	if request.method == 'POST':
		songs = Song.objects.all()
		response['status'] = 'OK'
		response['songs'] = list(songs.values())
	return JsonResponse(response)
	
@csrf_exempt
def current(request):
	response = {}
	if request.method == 'POST':
		if currentSong:
			song = Song.objects.filter(pk = currentSong.pk)
			response['song'] = list(song.values())
			response['related'] = relatedSongs
			response['status'] = 'OK'
	return JsonResponse(response)

@csrf_exempt	
def play(request):
	response = {}
	if request.method == 'POST':
		body = json.loads(request.body)
		song = Song.objects.get(songId = body['songId'])
		playSong(song)
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def pause(request):
	response = {}
	if request.method == 'POST':
		pauseSong()
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def unpause(request):
	response = {}
	if request.method == 'POST':
		unpauseSong()
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def stop(request):
	response = {}
	if request.method == 'POST':
		stopSong()
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def volumeUp(request):
	response = {}
	if request.method == 'POST':
		process = Popen([os.path.join(settings.BASE_DIR, 'scripts/increase_volume.sh')], stdout = PIPE, stderr = PIPE)
		stdout, stderr = process.communicate()
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def volumeDown(request):
	response = {}
	if request.method == 'POST':
		process = Popen([os.path.join(settings.BASE_DIR, 'scripts/decrease_volume.sh')], stdout = PIPE, stderr = PIPE)
		stdout, stderr = process.communicate()
		response['status'] = 'OK'
	return JsonResponse(response)

@csrf_exempt	
def details(request):
	response = {}
	if request.method == 'POST':
		body = json.loads(request.body)
		song = Song.objects.get(songId = body['songId'])
		response['songName'] = song.songName
		response['songId'] = song.songId
		response['tags'] = []
		for tag in song.tags.all():
			response['tags'].append({'tagName': tag.tagName, 'tagId': tag.tagId})
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def tagsLeft(request):
	response = {}
	if request.method == 'POST':
		body = json.loads(request.body)
		song = Song.objects.get(songId = body['songId'])
		tagsLeft = Tag.objects.exclude(tagId__in = song.tags.all())
		response['tagsLeft'] = list(tagsLeft.values())
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def addTag(request):
	response = {}
	if request.method == 'POST':
		body = json.loads(request.body)
		song = Song.objects.get(songId = body['songId'])
		tag = Tag.objects.get(tagId = body['tagId'])
		song.tags.add(tag)
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def removeTag(request):
	response = {}
	if request.method == 'POST':
		body = json.loads(request.body)
		song = Song.objects.get(songId = body['songId'])
		tag = Tag.objects.get(tagId = body['tagId'])
		song.tags.remove(tag)
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def indexData(request):
	response = {}
	if request.method == 'POST':
		data = []
		songs = Song.objects.all()
		for song in songs:
			s = {}
			s['songName'] = song.songName + '<>' + ' '.join(song.tags.all().values_list('tagName', flat = True))
			s['songId'] = song.songId
			data.append(s)
		for d in data:
			res = requests.post('http://localhost:9200/player/song/' + str(d['songId']), data = json.dumps(d))
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def searchData(request):
	response = {}
	if request.method == 'POST':
		body = json.loads(request.body)
		res = requests.post('http://localhost:9200/player/song/_search?q=size:4+songName:' + body['search'] + '*')
		data = json.loads(res.content)
		response['status'] = 'OK'
		response['data'] = []
		for song in data['hits']['hits']:
			response['data'].append({'songName': song['_source']['songName'].split('<>')[0], 'songId': song['_source']['songId']})
	return JsonResponse(response)
	
def removeSong(song):
	os.remove(str(song.songFile))
	res = requests.delete('http://localhost:9200/player/song/' + str(song.songId))
	
def searchRelated():
	global relatedSongs
	tags = currentSong.tags.all()
	songTags = tags.values_list('tagName', flat = True)
	q = map(lambda st: st + '*', songTags)
	if not q:
		q = ['*']
	res = json.loads(requests.post('http://localhost:9200/player/song/_search?q=size:10+songName:' + '%20'.join(q) + '+-songId:' + str(currentSong.songId)).content)
	data = {}
	data['type'] = 'related'
	relatedSongs = []
	for hit in res['hits']['hits']:
		relatedSongs.append({'songName': hit['_source']['songName'].split('<>')[0], 'songId': hit['_source']['songId']})
	data['data'] = relatedSongs
	sendData(data)
	
def pauseSong():
	player.pause()
	
def unpauseSong():
	player.play()
	
def stopSong():
	global media
	player.stop()
	media = None
	
def playSong(song):
	global media
	global player
	global currentSong
	if media is not None:
		player.stop()
	currentSong = song
	media = instance.media_new(str(song.songFile))
	player.set_media(media)
	player.play()
	playNewSong()
	searchRelated()
	
def addNewSong(song):
	data = {}
	data['type'] = 'add'
	song = Song.objects.filter(pk = song.pk)
	data['song'] = list(song.values())
	sendData(data)
	
def playNewSong():
	data = {}
	data['type'] = 'play'
	song = Song.objects.filter(pk = currentSong.pk)
	data['song'] = list(song.values())
	sendData(data)
	
def sendData(data):
	ws.send(json.dumps(data))

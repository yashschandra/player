from django.http import JsonResponse
from models import *
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def allTags(request):
	response = {}
	if request.method == 'POST':
		response['tags'] = list(Tag.objects.all().values())
		response['status'] = 'OK'
	return JsonResponse(response)

@csrf_exempt
def add(request):
	response = {}
	if request.method == 'POST':
		body = json.loads(request.body)
		tag = Tag(tagName = body['tagName'])
		tag.save()
		response['tag'] = list(Tag.objects.filter(pk = tag.pk).values())
		response['status'] = 'OK'
	return JsonResponse(response)
	
@csrf_exempt
def edit(request):
	response = {}
	if request.method == 'POST':
		body = json.loads(request.body)
		tag = Tag.objects.get(tagId = body['id'])
		tag.tagName = body['name']
		tag.save(update_fields = ['tagName'])
		response['status'] = 'OK'
	return JsonResponse(response)

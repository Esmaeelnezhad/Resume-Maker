from django.http import JsonResponse
from django.shortcuts import render


def index(request):
    return render(request, "resume_builder/index.html")


def health(request):
    return JsonResponse({"status": "ok"})

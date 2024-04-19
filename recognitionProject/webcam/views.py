# views.py
import os
import json
import datetime
import cv2
import face_recognition
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .models import UserLogin

REGISTERED_DATA_FILE = os.path.join(settings.BASE_DIR, 'static', 'registered_data.json')

def load_registered_data():
    if os.path.exists(REGISTERED_DATA_FILE):
        with open(REGISTERED_DATA_FILE, 'r') as file:
            return json.load(file)
    else:
        return {}

def save_registered_data(data):
    with open(REGISTERED_DATA_FILE, 'w') as file:
        json.dump(data, file)

registered_data = load_registered_data()

# @api_view(['GET'])
# def index(request):
#     return JsonResponse({'message': 'Face Recognition API'})

@csrf_exempt
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        photo = request.FILES['photo']

        uploads_folder = os.path.join(settings.BASE_DIR, 'static', 'uploads')
        if not os.path.exists(uploads_folder):
            os.makedirs(uploads_folder)

        photo_path = os.path.join(uploads_folder, f'{datetime.date.today()}_{name}.jpg')
        with open(photo_path, 'wb') as destination:
            for chunk in photo.chunks():
                destination.write(chunk)

        registered_data[name] = f'{datetime.date.today()}_{name}.jpg'
        save_registered_data(registered_data)

        response = {'success': True, 'name': name}
        return JsonResponse(response)

@csrf_exempt
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        photo = request.FILES['photo']

        uploads_folder = os.path.join(settings.BASE_DIR, 'static', 'uploads')
        if not os.path.exists(uploads_folder):
            os.makedirs(uploads_folder)

        login_filename = os.path.join(uploads_folder, 'login_face.jpg')
        with open(login_filename, 'wb') as destination:
            for chunk in photo.chunks():
                destination.write(chunk)

        login_image = cv2.imread(login_filename)
        gray_image = cv2.cvtColor(login_image, cv2.COLOR_BGR2GRAY)

        face_cascade = cv2.CascadeClassifier(os.path.join(settings.BASE_DIR, 'Haarcascades/haarcascade_frontalface_default.xml'))
        faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) == 0:
            response = {'success': False}
            return JsonResponse(response)

        login_image = face_recognition.load_image_file(login_filename)
        login_face_encodings = face_recognition.face_encodings(login_image)

        for name, filename in registered_data.items():
            registered_photo = os.path.join(uploads_folder, filename)
            registered_image = face_recognition.load_image_file(registered_photo)
            registered_face_encodings = face_recognition.face_encodings(registered_image)

            if len(registered_face_encodings) > 0 and len(login_face_encodings) > 0:
                matches = face_recognition.compare_faces(registered_face_encodings, login_face_encodings[0])

                if any(matches):
                    response = {'success': True, 'name': name}
                    return JsonResponse(response)
        
        if not name:
            response = {'success': False, 'message': 'Username required'}
            return JsonResponse(response, status=400)
        
        UserLogin.objects.create(username=name, login_time=datetime.timezone.now())

        response = {'success': False}
        return JsonResponse(response)

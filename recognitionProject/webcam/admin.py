# admin.py
from django.contrib import admin
from .models import UserLogin

class UserLoginAdmin(admin.ModelAdmin):
    list_display = ('username', 'login_time')  # Update 'entry_time' to 'login_time'

admin.site.register(UserLogin, UserLoginAdmin)

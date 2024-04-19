from django.db import models

class UserLogin(models.Model):
    username = models.CharField(max_length=100)
    login_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
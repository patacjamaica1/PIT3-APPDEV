from django.urls import path
from .views import TaskListView, TaskCreateView, TaskDetailView

urlpatterns = [
    path('tasks/', TaskListView.as_view(), name='task-list'),  # Correct path for task list
    path('tasks/create/', TaskCreateView.as_view(), name='task-create'),  # Task create path
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),  # Task detail path
]

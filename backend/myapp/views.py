from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Task
from .serializers import TaskSerializer

# View to fetch all Tasks
class TaskListView(APIView):
    def get(self, request, *args, **kwargs):
        tasks = Task.objects.all()  # Get all Tasks
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

# View to create a new Task
class TaskCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Save new Task
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View to retrieve, update or delete a specific Task
class TaskDetailView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            task = Task.objects.get(pk=pk)  # Get Task by pk
        except Task.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        try:
            task = Task.objects.get(pk=pk)  # Get Task by pk
        except Task.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskSerializer(task, data=request.data)  # Update data
        if serializer.is_valid():
            serializer.save()  # Save updated Task
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        try:
            task = Task.objects.get(pk=pk)  # Get Task by pk
        except Task.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        task.delete()  # Delete Task
        return Response(status=status.HTTP_204_NO_CONTENT)

# View to update a specific Task (can be part of TaskDetailView, or separate)
class TaskUpdateView(APIView):
    def put(self, request, pk, *args, **kwargs):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()  # Save updated Task
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View to delete a specific Task (can be part of TaskDetailView, or separate)
class TaskDeleteView(APIView):
    def delete(self, request, pk, *args, **kwargs):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        task.delete()  # Delete Task
        return Response(status=status.HTTP_204_NO_CONTENT)

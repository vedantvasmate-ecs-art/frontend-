import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskRequest, TaskResponse, StatusUpdateRequest } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createTask(projectId: number, request: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.BASE_URL}/projects/${projectId}/tasks`, request);
  }

  getTasksByProject(projectId: number): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.BASE_URL}/projects/${projectId}/tasks`);
  }

  getTask(id: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.BASE_URL}/tasks/${id}`);
  }

  updateTask(id: number, request: TaskRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.BASE_URL}/tasks/${id}`, request);
  }

  updateTaskStatus(id: number, request: StatusUpdateRequest): Observable<TaskResponse> {
    return this.http.patch<TaskResponse>(`${this.BASE_URL}/tasks/${id}/status`, request);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/tasks/${id}`);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { TaskResponse, TaskStatus } from '../../../core/models/task.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, StatusBadgePipe],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: TaskResponse | null = null;
  isLoading = true;
  error = '';
  statusUpdating = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTask(id);
    }
  }

  loadTask(id: number): void {
    this.isLoading = true;
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        this.task = task;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load task';
        this.isLoading = false;
      }
    });
  }

  updateStatus(status: TaskStatus): void {
    if (!this.task || this.statusUpdating) return;
    this.statusUpdating = true;
    this.taskService.updateTaskStatus(this.task.id, { status }).subscribe({
      next: (updated) => {
        this.task = updated;
        this.statusUpdating = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update status';
        this.statusUpdating = false;
      }
    });
  }

  deleteTask(): void {
    if (!this.task) return;
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => this.router.navigate(['/projects', this.task!.projectId]),
        error: () => this.error = 'Failed to delete task'
      });
    }
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get canChangeStatus(): boolean {
    const user = this.authService.getCurrentUser();
    return this.isAdmin || (!!user && !!this.task?.assignedTo && user.id === this.task.assignedTo.id);
  }

  get isOverdue(): boolean {
    if (!this.task) return false;
    return this.task.status !== 'DONE' && new Date(this.task.dueDate) < new Date();
  }

  getStatusClass(status: string): string {
    return { 'TODO': 'status-todo', 'IN_PROGRESS': 'status-progress', 'DONE': 'status-done' }[status] || '';
  }

  getPriorityClass(priority: string): string {
    return { 'LOW': 'priority-low', 'MEDIUM': 'priority-medium', 'HIGH': 'priority-high' }[priority] || '';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectRequest } from '../../../core/models/project.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  formData: ProjectRequest = { name: '', description: '' };
  isEditMode = false;
  projectId: number | null = null;
  isLoading = false;
  error = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.projectId = Number(id);
      this.loadProject();
    }
  }

  loadProject(): void {
    if (!this.projectId) return;
    this.projectService.getProject(this.projectId).subscribe({
      next: (project) => {
        this.formData = { name: project.name, description: project.description };
      },
      error: () => this.error = 'Failed to load project'
    });
  }

  onSubmit(): void {
    this.error = '';
    this.fieldErrors = {};
    this.isLoading = true;

    const request$ = this.isEditMode
      ? this.projectService.updateProject(this.projectId!, this.formData)
      : this.projectService.createProject(this.formData);

    request$.subscribe({
      next: (project) => {
        this.router.navigate(['/projects', project.id]);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.error?.errors) {
          this.fieldErrors = err.error.errors;
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'An unexpected error occurred.';
        }
      }
    });
  }
}

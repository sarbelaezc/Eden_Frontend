import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-personnel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.scss'
})
export class PersonnelComponent {}

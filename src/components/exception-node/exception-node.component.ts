import { Component, Input } from '@angular/core';
import { ExceptionNode } from '../../models/exception-node.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-exception-node',
  templateUrl: './exception-node.component.html',
  styleUrls: ['./exception-node.component.scss'],
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class ExceptionNodeComponent {
  @Input() node!: ExceptionNode;
  @Input() level: number = 0;

  isExpanded: boolean = false;
  showMeta: boolean = false;

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}

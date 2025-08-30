import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ExceptionNode } from '../../models/exception-node.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExceptionNodeComponent } from '../exception-node/exception-node.component';

@Component({
  selector: 'app-stack-trace-visualizer',
  templateUrl: './stack-trace-visualizer.component.html',
  styleUrls: ['./stack-trace-visualizer.component.scss'],
  imports: [CommonModule, FormsModule, ExceptionNodeComponent]
})
export class StackTraceVisualizerComponent implements OnChanges {
  @Input() exceptions: ExceptionNode[] = [];

  // which top-level exception to visualize on the right
  selectedIndex: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if ('exceptions' in changes) {
      const hasData = Array.isArray(this.exceptions) && this.exceptions.length > 0;
      // auto-select the first item when new data arrives
      this.selectedIndex = hasData ? 0 : null;
    }
  }

  selectException(index: number): void {
    if (index >= 0 && index < this.exceptions.length) {
      this.selectedIndex = index;
    }
  }
}

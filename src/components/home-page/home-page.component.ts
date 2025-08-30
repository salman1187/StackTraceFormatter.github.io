import { Component, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { StackTraceParserService } from '../../services/stack-trace-parser.service';
import { ExceptionNode } from '../../models/exception-node.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StackTraceVisualizerComponent } from '../stack-trace-visualizer/stack-trace-visualizer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    StackTraceVisualizerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class HomePageComponent implements AfterViewInit {
  rawTrace: string = '';
  formattedTrace: string = '';
  parsedExceptions: ExceptionNode[] = [];
  selectedLanguage: string = 'csharp';
  textAreaRows: number = 10; // adaptive rows

  @ViewChild('inputTextArea') inputTextArea!: ElementRef;
  @ViewChild('formattedOutput') formattedOutput!: ElementRef;

  constructor(private parser: StackTraceParserService) {
    this.updateTextAreaRows();
  }

  ngAfterViewInit(): void {
    this.matchPanelHeights();
  }

  parseTrace(): void {
    if (this.rawTrace.trim()) {
      this.parsedExceptions = this.parser.parse(this.rawTrace.trim());
      this.formattedTrace = this.parser.normalizeStackTrace(this.rawTrace.trim());
      setTimeout(() => this.matchPanelHeights());
    } else {
      this.parsedExceptions = [];
      this.formattedTrace = '';
    }
  }

  clearAll(): void {
    this.rawTrace = '';
    this.formattedTrace = '';
    this.parsedExceptions = [];
    setTimeout(() => this.matchPanelHeights());
  }

  @HostListener('window:resize')
  onResize() {
    this.updateTextAreaRows();
    this.matchPanelHeights();
  }

  private updateTextAreaRows() {
    const width = window.innerWidth;
    if (width < 600) {
      this.textAreaRows = 6;
    } else if (width < 900) {
      this.textAreaRows = 8;
    } else {
      this.textAreaRows = 12;
    }
  }

  private matchPanelHeights() {
    if (this.inputTextArea && this.formattedOutput) {
      const inputHeight = this.inputTextArea.nativeElement.offsetHeight;
      this.formattedOutput.nativeElement.style.height = inputHeight + 'px';
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.formattedTrace);
  }
}

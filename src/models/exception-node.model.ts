import { StackFrame } from "./stack-frame.model";

export interface ExceptionNode {
  type: string;
  message: string;
  frames: StackFrame[];
  innerExceptions: ExceptionNode[];
  metadata?: string[]; // stores extra non-standard or skipped lines
}

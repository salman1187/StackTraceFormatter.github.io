import { Injectable } from "@angular/core";
import { ExceptionNode } from "../models/exception-node.model";
import { StackFrame } from "../models/stack-frame.model";
import { CSHARP_PATTERNS as P } from "../exception-patterns/csharp-patterns";

@Injectable({ providedIn: 'root' })
export class StackTraceParserService {

  parse(stackTrace: string): ExceptionNode[] {
    const normalized = this.normalizeStackTrace(stackTrace);
    const lines = normalized.split('\n').map(l => l.trimEnd());
    let index = 0;
    const exceptions: ExceptionNode[] = [];

    while (index < lines.length) {
      const node = this.parseException(lines, () => index++, () => index);
      if (node) exceptions.push(node);
      else index++;
    }

    console.log(exceptions);
    return exceptions;
  }

  private parseException(
    lines: string[],
    advance: () => void,
    getIndex: () => number
  ): ExceptionNode | null {
    if (getIndex() >= lines.length) return null;

    const headerRaw = lines[getIndex()];
    const header = headerRaw.trimStart();

    let m = header.match(P.EXCEPTION_HEADER);
    let type: string, message: string;

    if (m) {
      [, type, message] = m;
      advance();
    } else {
      m = header.match(P.INNER_EXCEPTION);
      if (m) {
        [, type, message] = m;
        advance();
      } else {
        type = "UnknownException";
        message = "No exception header found";
      }
    }

    const frames: StackFrame[] = [];
    const innerExceptions: ExceptionNode[] = [];
    const metadata: string[] = [];

    while (getIndex() < lines.length) {
      let raw = lines[getIndex()];
      let line = raw.trimStart();

      if (P.INNER_EXCEPTION.test(line)) {
        const inner = this.parseException(lines, advance, getIndex);
        if (inner) innerExceptions.push(inner);
        continue;
      }

      if (P.INNER_END.test(line)) {
        advance();
        break;
      }

      if (P.ASYNC_HOP.test(line)) {
        advance();
        continue;
      }

      if (P.EXCEPTION_HEADER.test(line)) {
        break;
      }

      let inlineEndsInner = false;
      if (P.INLINE_INNER_END.test(line)) {
        inlineEndsInner = true;
        line = line.replace(P.INLINE_INNER_END, '').trimEnd();
      }

      let fm = line.match(P.FRAME_WITH_FILE);
      if (fm) {
        frames.push({
          method: fm[1],
          params: (fm[2] || '').trim() || undefined,
          file: fm[3],
          line: parseInt(fm[4], 10),
        });
        advance();
        if (inlineEndsInner) break;
        continue;
      }

      fm = line.match(P.FRAME_NO_FILE);
      if (fm) {
        frames.push({
          method: fm[1],
          params: (fm[2] || '').trim() || undefined,
        });
        advance();
        if (inlineEndsInner) break;
        continue;
      }

      // Unknown line → store in metadata
      metadata.push(line);
      advance();
    }

    return { type, message, frames, innerExceptions, metadata: metadata.length ? metadata : undefined };
  }

  public normalizeStackTrace(raw: string): string {
    return raw
      .replace(/\r/g, '')
      .replace(/\s*--- End of inner exception stack trace ---\s*/g,
        '\n--- End of inner exception stack trace ---\n')
      .replace(/\s*--- End of stack trace from previous location where exception was thrown ---\s*/g,
        '\n--- End of stack trace from previous location where exception was thrown ---\n')
      .replace(/\s*--->\s*/g, '\n---> ')
      .replace(/\s+at\s+/g, '\n   at ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim();
  }
}

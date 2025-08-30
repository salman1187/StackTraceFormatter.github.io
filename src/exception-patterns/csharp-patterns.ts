export const CSHARP_PATTERNS = {
  // Top-level: "System.Type: Message"
  EXCEPTION_HEADER: /^\s*([\w\.\+`<>]+(?:\[[^\]]+\])?):\s(.+)$/,

  // Inner header: "---> (Inner Exception #0) System.Type: Message"
  INNER_EXCEPTION: /^\s*--->(?:\s+\(Inner Exception #\d+\))?\s+([\w\.\+`<>]+(?:\[[^\]]+\])?):\s*(.*)$/,

  // Explicit inner end (own line)
  INNER_END: /^\s*--- End of inner exception stack trace ---\s*$/,

  // Async hop separator
  ASYNC_HOP: /^\s*--- End of stack trace from previous location where exception was thrown ---\s*$/,

  // Frames
  FRAME_WITH_FILE: /^\s*at\s+([\w\.\+`<>\[\]]+)\((.*?)\)\s+in\s+(.+):line\s+(\d+)\s*$/,
  FRAME_NO_FILE:  /^\s*at\s+([\w\.\+`<>\[\]]+)\((.*?)\)\s*$/,

  // Inline inner end marker appended to a frame: "... )<---"
  INLINE_INNER_END: /<---\s*$/,
};

declare global {
  /** this formats a date value to a human-readable format */
  function formatDateNew(date: Date): string

  interface Window {
    MY_VAR: string
  }
}

export {}

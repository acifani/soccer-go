/**
 * Asserts if a alleged `error` is a Node.js system error.
 */
export const isErrorNodeSystemError = (error: unknown): error is NodeJS.ErrnoException => {
  return (
    'code' in (error as never) &&
    'errno' in (error as never) &&
    'code' in (error as never) &&
    'path' in (error as never) &&
    'syscall' in (error as never)
  )
}

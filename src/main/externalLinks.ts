// shell.openExternal hands a URL to the OS, which will happily launch whatever is
// registered for its scheme (file:, a custom protocol handler, ...). Every link this app
// opens is an https web page, so anything else is refused rather than passed through.
export function isSafeExternalUrl(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}

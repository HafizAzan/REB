export function isVideoUrl(url: string, kind?: 'IMAGE' | 'VIDEO') {
  if (kind === 'VIDEO') return true;
  if (kind === 'IMAGE') return false;
  return /\/video\/upload\/|\.(mp4|webm|mov)(\?|$)/i.test(url);
}

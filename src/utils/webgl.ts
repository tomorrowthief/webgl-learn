/**
 * WebGL 兼容性检测工具
 */

export function checkWebGLSupport(): { supported: boolean; version: number; message: string } {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  if (!gl) {
    return {
      supported: false,
      version: 0,
      message: '您的浏览器不支持 WebGL，请使用最新版 Chrome/Edge/Firefox/Safari 访问',
    };
  }

  const isWebGL2 = gl instanceof WebGL2RenderingContext;
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';

  return {
    supported: true,
    version: isWebGL2 ? 2 : 1,
    message: `WebGL ${isWebGL2 ? 2 : 1} — ${renderer}`,
  };
}

export function isWebGLSupported(): boolean {
  return checkWebGLSupport().supported;
}
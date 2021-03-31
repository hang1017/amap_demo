// 设置iframe页面的meta
export const resetIframeViewPort = () => {
  try {
    const meta = document.querySelector('meta[name="viewport"]');
    (window as any)._contentBackUp = meta.getAttribute('content');
    const scale = (window as any)._contentBackUp.split('initial-scale=')[1].split(',')[0];
    meta?.setAttribute(
      'content',
      'user-scalable=no, initial-scale=1.0, maximum-scale=1.0 minimal-ui',
    );
    const html = document.querySelector('html');
    (window as any)._fontSize = html.style.fontSize;
    html.style.fontSize = `${(window as any)._fontSize.split('px')[0] * scale}px`;
  } catch (error) {
    console.log('tool_setIframeViewPort', error);
  }
};

// 还原iframe页面的meta
export const backIframeViewPort = () => {
  try {
    // 容错
    if ((window as any)._fontSize && (window as any)._contentBackUp) {
      const meta = document.querySelector('meta[name="viewport"]');
      meta?.setAttribute('content', (window as any)._contentBackUp);
      const html = document.querySelector('html');
      html.style.fontSize = (window as any)._fontSize;
    }
  } catch (error) {
    console.log('tool_backIframeViewPort', error);
  }
};

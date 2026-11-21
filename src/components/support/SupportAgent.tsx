import { useEffect, useRef, useState } from 'react';

export default function SupportAgent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    function handleWidgetMessage(event: MessageEvent) {
      if (event.origin !== 'https://task-agentic.netlify.app') return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== 'cca-widget-resize') return;

      setChatOpen(event.data.open === true);
    }

    window.addEventListener('message', handleWidgetMessage);
    return () => window.removeEventListener('message', handleWidgetMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="https://task-agentic.netlify.app/"
      title="CupidCreativeX Customer Support Assistant"
      className="fixed bottom-0 right-0 z-[99999] border-0 bg-transparent"
      style={{
        width: chatOpen ? '440px' : '200px',
        height: chatOpen ? '760px' : '200px',
        maxWidth: '100vw',
        maxHeight: '100dvh',
        background: 'transparent',
        transition: 'width 180ms ease, height 180ms ease',
      }}
      allow="clipboard-write"
    />
  );
}

import React, { useEffect, useState } from 'react';

export default function VideoPlayer({ url }: { url: string }) {
  const [error, setError] = useState(false);

  if (!url) return null;

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getVimeoId = (url: string) => {
    const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const ytId = getYoutubeId(url);
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
        className="w-full h-full object-contain bg-black"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
        className="w-full h-full object-contain bg-black"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white p-4 text-center">
        <p className="mb-2">Unable to load video.</p>
        <p className="text-sm text-zinc-400 break-all">{url}</p>
      </div>
    );
  }

  // Fallback to video tag for raw mp4/webm etc. or if it's already an embed URL that didn't parse
  if (url.includes('youtube.com/embed/')) {
     return (
       <iframe
        src={url}
        className="w-full h-full object-contain bg-black"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>
     )
  }

  return (
    <video
      src={url}
      controls
      autoPlay
      playsInline
      onError={() => setError(true)}
      className="w-full h-full object-contain bg-black"
    >
      Your browser does not support the video tag.
    </video>
  );
}

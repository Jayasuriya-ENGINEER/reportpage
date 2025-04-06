
import React from 'react';

export const formatTimestamp = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const renderMessageContent = (content, type) => {
  switch (type) {
    case 'image':
      return <img src={content} alt="Image" className="max-w-full rounded-md" />;
    case 'video':
      return (
        <video controls className="max-w-full rounded-md">
          <source src={content} />
          Your browser does not support the video tag.
        </video>
      );
    case 'audio':
      return (
        <audio controls className="w-full">
          <source src={content} />
          Your browser does not support the audio tag.
        </audio>
      );
    default:
      return <p>{content}</p>;
  }
};

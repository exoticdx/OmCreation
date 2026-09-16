'use client';

import React from 'react';

interface BannerProps {
  imageUrl: string;
  linkUrl?: string;
  altText?: string;
}

export default function Banner({ imageUrl, linkUrl, altText }: BannerProps) {
  const content = (
    <div className="w-full h-auto overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <img 
        src={imageUrl} 
        alt={altText || 'Banner Image'} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );

  return (
    <div className="mb-6 px-4 md:px-8">
      {linkUrl ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

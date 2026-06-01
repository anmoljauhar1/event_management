import { useState } from 'react';

const ImageGallery = ({ images }) => {
  const [mainIndex, setMainIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-400 rounded">
        No images available
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-96 mb-4 rounded overflow-hidden">
        <img
          src={images[mainIndex].image}
          alt="Event"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setMainIndex(idx)}
            className={`flex-shrink-0 w-24 h-24 rounded overflow-hidden border-2 ${
              idx === mainIndex ? 'border-indigo-600' : 'border-transparent'
            }`}
          >
            <img src={img.image} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
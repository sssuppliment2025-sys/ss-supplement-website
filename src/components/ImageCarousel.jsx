import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  

  const images = [
    { id: 1, src: '/body1.jpg', alt: 'Body 1' },
    { id: 2, src: '/body2.jpg', alt: 'Body 2' },
    { id: 3, src: '/body3.jpg', alt: 'Body 3' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); 

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {/* Previous Button */}
        <button 
          className="carousel-btn carousel-btn-prev" 
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          &#10094;
        </button>

        {/* Image Display */}
        <div className="carousel-slides">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`carousel-slide ${
                index === currentIndex ? 'active' : ''
              }`}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="carousel-image"
              />
              {/* Text Overlay */}
              <div className="carousel-text-overlay">
                <div className="discount-tag">50% OFF</div>
                <h1 className="carousel-title">SS SUPPLEMENT</h1>
                <h2 className="carousel-subtitle">Premium Nutrition for Your Fitness Journey</h2>
                <p className="carousel-tagline">Fuel Your Body. Transform Your Strength.</p>
              </div>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button 
          className="carousel-btn carousel-btn-next" 
          onClick={goToNext}
          aria-label="Next slide"
        >
          &#10095;
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${
              index === currentIndex ? 'active' : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;

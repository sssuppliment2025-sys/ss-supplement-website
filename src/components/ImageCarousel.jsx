import React, { useState, useEffect, useRef } from "react";
import "./ImageCarousel.css";

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 swipe refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const images = [
    { id: 1, src: "/body1.jpg", alt: "Body 1" },
    { id: 2, src: "/body2.jpg", alt: "Body 2" },
    { id: 3, src: "/body3.jpg", alt: "Body 3" },
  ];

  // 🔹 autoplay (unchanged)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // 🔹 swipe handlers (MUST be inside component)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) < 50) return; // ignore small swipe

    if (diff > 0) {
      // swipe left → next
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    } else {
      // swipe right → prev
      setCurrentIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="carousel-no-padding">
      <div className="carousel-container">
        <div
          className="carousel-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* SLIDES */}
          <div
            className="carousel-slides"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((image) => (
              <div className="carousel-slide" key={image.id}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="carousel-image"
                />
              </div>
            ))}
          </div>

          {/* FLOATING DOTS */}
          <div className="carousel-dots carousel-dots-inside">
            {images.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;

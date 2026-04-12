interface PhotoCarouselProps {
  images: string[];
  currentIndex: number;
  height?: string;
  rounded?: string;
  objectFit?: "cover" | "contain";
  showDots?: boolean;
}

export const PhotoCarousel = ({
  images,
  currentIndex,
  height = "h-[350px] md:h-[450px]",
  rounded = "rounded-[40px]",
  objectFit = "cover",
  showDots = true,
}: PhotoCarouselProps) => {
  return (
    <div
      className={`relative w-full ${height} ${rounded} overflow-hidden shadow-sm`}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${
            index === currentIndex
              ? "opacity-100 scale-100 z-10"
              : "opacity-0 scale-105 z-0"
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index}`}
            className={`w-full h-full object-${objectFit}`}
          />
        </div>
      ))}

      {showDots && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === i ? "w-8 bg-brand-primary" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

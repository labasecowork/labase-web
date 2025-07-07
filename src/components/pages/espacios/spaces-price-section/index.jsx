import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import NavigationButtons from "../../shared/button-arrow/button.jsx";

import "swiper/css";
import "swiper/css/navigation";

export default function SpacesPriceSection({
  title = "NUESTROS ESPACIOS",
  subtitle = "PRECIOS",
  properties,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <section className="w-full mt-8 mx-auto pb-12 md:pb-24 ">
        {/* Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={32}
            loop={true}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            speed={2000}
            autoplay={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 2.5 },
              1280: { slidesPerView: 2.8 },
            }}
            onSwiper={setSwiper}
            className="w-full"
          >
            {properties.map((property) => (
              <SwiperSlide key={property.id}>
                <PropertyCard property={property} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex flex-col md:flex-row justify-between items-center mt-8 md:mt-12 gap-4 px-8 mx-auto max-w-7xl">
            <NavigationButtons
              onPrevious={() => swiper?.slidePrev()}
              onNext={() => swiper?.slideNext()}
            />

            <div className="flex gap-4 mt-4 md:mt-0">
              <a
                href="#"
                className="bg-stone-500 rounded-full w-fit text-stone-100 py-3 sm:py-4 px-8 sm:px-12 transition-colors duration-200 text-xs sm:text-sm tracking-widest font-medium uppercase  "
              >
                CONTACTANOS
              </a>
              <a
                href="#"
                className="bg-stone-800 rounded-full w-fit text-stone-100 py-3 sm:py-4 px-8 sm:px-12 transition-colors duration-200 text-xs sm:text-sm tracking-widest font-medium uppercase  "
              >
                RESERVAR
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PropertyCard({ property }) {
  return (
    <>
      <div className="group flex flex-col h-[650px] bg-stone-800 overflow-hidden hover:bg-[#82674E] transition cursor-pointer relative ">
        <div className="relative overflow-hidden h-full">
          <p className="text-2xl sm:text-3xl md:text-4xl font-secondary font-medium text-white mb-4 absolute z-20 bottom-0 left-4">
            {property.title}
          </p>
          {property.status && (
            <div className="absolute top-4 right-4 z-10 bg-stone-800 bg-opacity-75 text-white font-semibold text-xs sm:text-sm px-4 py-1.5 rounded-md">
              {property.status}
            </div>
          )}
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 "
          />
          <div className="absolute z-10 inset-0 bg-gradient-to-t from-black/70 to-transparent  transition-opacity duration-300" />
        </div>

        <div className="p-6">
          <p
            className="text-sm sm:text-base text-white/60 mb-5"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {property.description}
          </p>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-white uppercase font-medium">
            <span>{property.capacity} PERSONAS</span>
            <span className="w-1 h-1 rounded-full bg-stone-400 uppercase"></span>
            <span>{property.environment}</span>
          </div>
        </div>
      </div>
    </>
  );
}

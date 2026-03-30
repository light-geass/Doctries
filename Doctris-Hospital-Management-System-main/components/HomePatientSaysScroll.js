"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";

const HomePatientSaysScroll = ({ testimonials, autoPlay = true, interval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); 

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(timer);
  }, [index, autoPlay, interval]);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const active = testimonials[index];

  return (
    <div className="flex flex-col items-center text-center p-6 max-w-2xl mx-auto select-none">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;

            if (swipe < -1000) {
              nextSlide(); 
            } else if (swipe > 1000) {
              prevSlide(); 
            }
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <p className="italic text-gray-500 mb-4 text-md">
            "{active.text}"
          </p>

          <div className="flex justify-center mb-4">
            <img
              src={active.image}
              alt={active.name}
              className="w-20 h-20 rounded-full shadow-md object-cover"
            />
          </div>

          <div className="flex justify-center text-yellow-500 mb-2">
            {[...Array(active.rating)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>

          <h3 className="text-blue-600 font-semibold">
            - {active.name}{" "}
            <span className="text-gray-400 font-normal">{active.role}</span>
          </h3>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="flex mt-5 space-x-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === i ? "bg-blue-500 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePatientSaysScroll;

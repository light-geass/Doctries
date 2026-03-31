import React from "react";
import HomeSectionHeader from "./HomeSectionHeader";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

const testimonials = [
  {
    text: "The AI scan analysis was incredibly fast and surprisingly accurate. My doctor confirmed the AI findings matched his diagnosis exactly. This platform is the future of healthcare.",
    name: "Dean Tolle",
    role: "Patient – Cardiology",
    rating: 5,
    image: "/profileImages/01.jpg",
  },
  {
    text: "I uploaded an MRI and got an instant breakdown with findings and recommendations. It made my follow-up consultation so much more productive and focused.",
    name: "Sarah Lewis",
    role: "Patient – Neurology",
    rating: 5,
    image: "/profileImages/09.jpg",
  },
  {
    text: "As someone who lives far from a major city, having AI-powered diagnostics available from home is a game-changer. Doctris gave me peace of mind in minutes.",
    name: "John Martinez",
    role: "Patient – Orthopedics",
    rating: 5,
    image: "/profileImages/01.jpg",
  },
];

const HomePatientSays = () => {
  return (
    <div className="py-20 px-6 md:px-12 lg:px-24 transition-colors duration-300" style={{ backgroundColor: 'var(--bg)' }}>
      <HomeSectionHeader
        tag="Testimonials"
        title="What Our Patients Say"
        description="Real experiences from patients who have used Doctris for their medical needs."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 perspective-1000">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="card p-8 flex flex-col hover:shadow-2xl transition-all duration-500 fade-in tilt-3d"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <ChatBubbleLeftIcon className="w-10 h-10 mb-4" style={{ color: 'var(--border)' }} />

            <p className="leading-relaxed text-[15px] flex-grow italic mb-6" style={{ color: 'var(--text-muted)' }}>
              &quot;{t.text}&quot;
            </p>

            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, s) => (
                <StarIcon key={s} className="h-4 w-4 text-amber-400" />
              ))}
            </div>

            <div className="flex items-center gap-4 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-blue-100 shrink-0">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
                <p className="text-xs font-medium text-blue-600">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePatientSays;

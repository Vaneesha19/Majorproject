import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function PopularServices() {
  const router = useRouter();
  const popularServicesData = [
    { name: "Decorations", label: "Create Stunning Decor", image: "/flower.jpg" },
    { name: "Musical Bands", label: "Perform Live Music", image: "/music.jpg" },
    {
      name: "Wall Paintings",
      label: "Paint Unique Murals",
      image: "/mandala.jpg",
    },
    {
      name: "Voice Artists",
      label: "Bring Voices to Life",
      image: "/voice.jpg",
    },
    {
      name: "Photography",
      label: "Capture Moments",
      image: "/photography.jpeg",
    },
    { name: "Digital Art", label: "Design Stunning Visuals", image: "/illustrations.jpg" },
    {
      name: "Art Workshops",
      label: "Learn & Create Art",
      image: "/art.jpg",
    },
    { name: "Handmade Crafts", label: "Create Custom Art", image: "/gifts.webp" },
  ];
  return (
    <div className="mx-20 my-16">
      <h2 className="text-4xl mb-5 text-[#404145] font-bold">
        Popular Services
      </h2>
      <ul className="flex flex-wrap gap-16">
        {popularServicesData.map(({ name, label, image }) => {
          return (
            <li
              key={name}
              className="relative cursor-pointer"
              onClick={() => router.push(`/search?category=${name.toLowerCase()}`)}
            >
              <div className="absolute z-10 text-[ #626566] left-5 top-4">
                <span>{label}</span>
                <h6 className="font-extrabold text-2xl">{name}</h6>
              </div>
              <div className="h-80 w-72 ">
                <Image src={image} fill alt="service" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PopularServices;

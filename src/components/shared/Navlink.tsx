import Link from "next/link";
import React from "react";

const Navlink = ({
  link, 
  hoveredLink, 
  setHoveredLink
} : {
  link: {name: string; href: string};
  hoveredLink: string | null;
  setHoveredLink: (value: string | null) => void;
}) => {
  return (
    <Link
      key={link.name}
      className="relative text-text-muted text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105"
      href={link.href}
      onMouseEnter={() => setHoveredLink(link.name)}
      onMouseLeave={() => setHoveredLink(null)}
    >
      {link.name}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all duration-300 ${
          hoveredLink === link.name ? "w-full" : "w-0"
        }`}
      />
    </Link>
  );
};

export default Navlink;

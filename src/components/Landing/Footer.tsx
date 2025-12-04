"use client";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterProps {
  copyright: string;
  links: FooterLink[];
}

export default function Footer({ copyright }: Omit<FooterProps, 'links'>) {
  return (
    <footer className="mt-auto border-t border-border py-6 text-center">
      <p className="text-sm text-text-muted">{copyright}</p>
    </footer>
  );
}

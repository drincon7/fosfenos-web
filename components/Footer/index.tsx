"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";
// ==================== TIPOS Y CONFIGURACIÓN ====================
interface SocialLink {
  name: string;
  url: string;
  icon: ReactNode;
  ariaLabel: string;
}

interface FooterLink {
  label: string;
  url: string;
  isNew?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterConfig {
  brand: {
    name: string;
    logoLight: string;
    logoDark: string;
    description: string;
    contact: {
      label: string;
      email: string;
    };
  };
  sections: FooterSection[];
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
  };
  bottomLinks: FooterLink[];
  socialLinks: SocialLink[];
  copyright: {
    year: number;
    company: string;
  };
}

// ==================== CONFIGURACIÓN DE DATOS ====================
const footerConfig: FooterConfig = {
  brand: {
    name: "SuperHi",
    logoLight: "/images/logo/superhi-logo-light.svg",
    logoDark: "/images/logo/superhi-logo-dark.svg",
    description: "Transform your creative skills with our comprehensive courses.",
    contact: {
      label: "contact",
      email: "hello@superhi.com"
    }
  },
  sections: [
    {
      title: "Learn",
      links: [
        { label: "All courses", url: "/courses" },
        { label: "Code", url: "/code" },
        { label: "Design", url: "/design" },
        { label: "Project management", url: "/project-management" },
        { label: "SuperHi Editor", url: "/editor" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", url: "/about" },
        { label: "Student work", url: "/student-work" },
        { label: "SuperHi for Business", url: "/business", isNew: true },
        { label: "Careers", url: "/careers" },
        { label: "Newsletter", url: "/newsletter" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Return policy", url: "/return-policy" },
        { label: "Terms of use", url: "/terms" },
        { label: "Discrimination policy", url: "/discrimination-policy" },
        { label: "Code of conduct", url: "/code-of-conduct" },
        { label: "Contact us", url: "/contact" }
      ]
    }
  ],
  newsletter: {
    title: "Newsletter",
    description: "Subscribe to receive future updates",
    placeholder: "Email address"
  },
  bottomLinks: [
    { label: "English", url: "/language" },
    { label: "Privacy Policy", url: "/privacy" },
    { label: "Support", url: "/support" }
  ],
  socialLinks: [
    {
      name: "YouTube",
      url: "https://youtube.com/superhi",
      ariaLabel: "Follow us on YouTube",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      url: "https://instagram.com/superhi",
      ariaLabel: "Follow us on Instagram",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: "Facebook",
      url: "https://facebook.com/superhi",
      ariaLabel: "Follow us on Facebook",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ],
  copyright: {
    year: new Date().getFullYear(),
    company: "SuperHi"
  }
};

// ==================== COMPONENTES REUTILIZABLES ====================
const AnimatedSection = ({ 
  children, 
  delay = 0, 
  className = "" 
}: { 
  children: ReactNode; 
  delay?: number; 
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 }
    }}
    initial="hidden"
    whileInView="visible"
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    viewport={{ once: true }}
    className={`${className}`}
  >
    {children}
  </motion.div>
);

const FooterLink = ({ link, className = "" }: { link: FooterLink; className?: string }) => (
  <a
    href={link.url}
    className={`inline-flex items-center gap-2 transition-colors duration-200 hover:text-blue-500 ${className}`}
  >
    {link.label}
    {link.isNew && (
      <span className="px-2 py-0.5 text-xs font-semibold text-white bg-yellow-500 rounded-full">
        NEW
      </span>
    )}
  </a>
);

const NewsletterForm = ({ config }: { config: FooterConfig['newsletter'] }) => (
  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
    <div className="relative">
      <input
        type="email"
        placeholder={config.placeholder}
        className="w-full px-6 py-3 pr-12 text-gray-900 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        required
      />
      <button
        type="submit"
        aria-label="Subscribe to newsletter"
        className="absolute right-1 top-1 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
      >
        <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3.1175 1.17318L18.5025 9.63484C18.5678 9.67081 18.6223 9.72365 18.6602 9.78786C18.6982 9.85206 18.7182 9.92527 18.7182 9.99984C18.7182 10.0744 18.6982 10.1476 18.6602 10.2118C18.6223 10.276 18.5678 10.3289 18.5025 10.3648L3.1175 18.8265C3.05406 18.8614 2.98262 18.8792 2.91023 18.8781C2.83783 18.8769 2.76698 18.857 2.70465 18.8201C2.64232 18.7833 2.59066 18.7308 2.55478 18.6679C2.51889 18.6051 2.50001 18.5339 2.5 18.4615V1.53818C2.50001 1.46577 2.51889 1.39462 2.55478 1.33174C2.59066 1.26885 2.64232 1.2164 2.70465 1.17956C2.76698 1.14272 2.83783 1.12275 2.91023 1.12163C2.98262 1.12051 3.05406 1.13828 3.1175 1.17318ZM4.16667 10.8332V16.3473L15.7083 9.99984L4.16667 3.65234V9.16651H8.33333V10.8332H4.16667Z"/>
        </svg>
      </button>
    </div>
  </form>
);

// ==================== COMPONENTE PRINCIPAL ====================
const Footer = ({ 
  config = footerConfig,
  hasVideoBackground = true,
  overlayOpacity = 0.95 
}: { 
  config?: FooterConfig;
  hasVideoBackground?: boolean;
  overlayOpacity?: number;
}) => {
  return (
    <footer className={`relative ${hasVideoBackground ? 'min-h-screen' : ''}`}>
      {/* Video Background Container */}
      {hasVideoBackground && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Aquí irá tu video de las bolas de colores */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
            {/* Placeholder para el video - reemplaza esto con tu video */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Video Background Placeholder
            </div>
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className={`relative z-10 ${hasVideoBackground ? 'min-h-screen flex items-center' : ''}`}>
        <div 
          className={`w-full max-w-6xl mx-auto m-8 ${
            hasVideoBackground 
              ? `bg-white/[${overlayOpacity}] backdrop-blur-sm rounded-2xl shadow-2xl` 
              : 'bg-white'
          } p-8 lg:p-12`}
        >
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-8">
            {/* Brand Section */}
            <AnimatedSection delay={0.1} className="lg:col-span-4">
              <div className="space-y-6">
                <a href="/" className="inline-block">
                  <Image
                    width={120}
                    height={40}
                    src={config.brand.logoLight}
                    alt={`${config.brand.name} Logo`}
                    className="dark:hidden"
                  />
                  <Image
                    width={120}
                    height={40}
                    src={config.brand.logoDark}
                    alt={`${config.brand.name} Logo`}
                    className="hidden dark:block"
                  />
                </a>
                
                <p className="text-gray-600 leading-relaxed">
                  {config.brand.description}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {config.brand.contact.label}
                  </p>
                  <a
                    href={`mailto:${config.brand.contact.email}`}
                    className="text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors duration-200"
                  >
                    {config.brand.contact.email}
                  </a>
                </div>
              </div>
            </AnimatedSection>

            {/* Navigation Sections */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {config.sections.map((section, index) => (
                  <AnimatedSection key={section.title} delay={0.2 + index * 0.1}>
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {section.title}
                      </h3>
                      <ul className="space-y-3">
                        {section.links.map((link) => (
                          <li key={link.label}>
                            <FooterLink 
                              link={link} 
                              className="text-gray-600 hover:text-blue-500"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Newsletter Section */}
            <AnimatedSection delay={0.5} className="lg:col-span-2">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {config.newsletter.title}
                </h3>
                <p className="text-gray-600">
                  {config.newsletter.description}
                </p>
                <NewsletterForm config={config.newsletter} />
              </div>
            </AnimatedSection>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Bottom Links */}
              <AnimatedSection delay={0.6}>
                <ul className="flex flex-wrap items-center gap-6">
                  {config.bottomLinks.map((link) => (
                    <li key={link.label}>
                      <FooterLink 
                        link={link} 
                        className="text-gray-500 hover:text-gray-900"
                      />
                    </li>
                  ))}
                </ul>
              </AnimatedSection>

              {/* Copyright */}
              <AnimatedSection delay={0.7}>
                <p className="text-gray-500 text-center lg:text-left">
                  © {config.copyright.year} {config.copyright.company}, Inc.
                </p>
              </AnimatedSection>

              {/* Social Links */}
              <AnimatedSection delay={0.8}>
                <ul className="flex items-center gap-4">
                  {config.socialLinks.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.url}
                        aria-label={social.ariaLabel}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      >
                        {social.icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// ==================== EJEMPLOS DE USO ====================
/*
// Uso básico (sin video de fondo)
<Footer hasVideoBackground={false} />

// Con video de fondo y opacidad personalizada
<Footer hasVideoBackground={true} overlayOpacity={0.9} />

// Con configuración personalizada
const customConfig = {
  ...footerConfig,
  brand: {
    ...footerConfig.brand,
    name: "Mi Empresa",
    description: "Tu descripción personalizada"
  }
};
<Footer config={customConfig} />
*/
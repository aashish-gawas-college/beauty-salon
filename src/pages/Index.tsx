import React, { useEffect, useState } from "react";
import { Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppButton } from "@/components/WhatsAppButton";

interface Service {
  id: string;
  name: string;
  photo_url: string | null;
  short_description: string | null;
  duration: string | null;
  benefits: string[] | null;
}

interface GalleryItem {
  id: string;
  photo_url: string;
  caption: string | null;
}

interface ContentItem {
  id: string;
  title: string | null;
  body: string | null;
  philosophy: string | null;
  what_sets_apart: string[] | null;
}

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  is_active: boolean;
  display_order: number;
}

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [content, setContent] = useState<{
    home: ContentItem | null;
    about: ContentItem | null;
  }>({
    home: null,
    about: null,
  });
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch all services without limit
    const { data: servicesData } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true });

    const { data: galleryData } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    const { data: contentData } = await supabase
      .from("content")
      .select("*")
      .in("id", ["home", "about"]);

    const { data: socialMediaData } = await supabase
      .from("social_media")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    setServices(servicesData || []);
    setGallery(galleryData || []);
    setSocialMedia(socialMediaData || []);

    if (contentData) {
      const homeContent = contentData.find((c) => c.id === "home");
      const aboutContent = contentData.find((c) => c.id === "about");
      setContent({ home: homeContent || null, about: aboutContent || null });
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  // Fallback data for when database is empty
  const fallbackServices = [
    {
      id: "1",
      name: "Facial Treatments",
      photo_url:
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop",
      short_description: "Rejuvenating facial treatments for all skin types",
      duration: "60-90 minutes",
      benefits: ["Deep cleansing", "Anti-aging benefits", "Glowing skin"],
    },
    {
      id: "2",
      name: "Hair Styling",
      photo_url:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
      short_description: "Professional cuts, colors, and styling",
      duration: "2-3 hours",
      benefits: ["Color consultation", "Premium products", "Style that lasts"],
    },
    {
      id: "3",
      name: "Nail Care",
      photo_url:
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
      short_description: "Professional manicure and pedicure services",
      duration: "45-60 minutes",
      benefits: ["Nail shaping", "Cuticle care", "Long-lasting polish"],
    },
  ];

  const fallbackGallery = [
    {
      id: "1",
      photo_url:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop",
      caption: "Bridal Makeup",
    },
    {
      id: "2",
      photo_url:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
      caption: "Hair Styling",
    },
    {
      id: "3",
      photo_url:
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop",
      caption: "Facial Treatment",
    },
    {
      id: "4",
      photo_url:
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
      caption: "Nail Art",
    },
  ];

  const fallbackSocialMedia = [
    {
      id: "1",
      platform: "Instagram",
      url: "#",
      icon_name: "Instagram",
      is_active: true,
      display_order: 1,
    },
    {
      id: "2",
      platform: "Facebook",
      url: "#",
      icon_name: "Facebook",
      is_active: true,
      display_order: 2,
    },
  ];

  const displayServices = services.length > 0 ? services : fallbackServices;
  const displayGallery = gallery.length > 0 ? gallery : fallbackGallery;
  const displaySocialMedia =
    socialMedia.length > 0 ? socialMedia : fallbackSocialMedia;

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "instagram":
        return Instagram;
      case "facebook":
        return Facebook;
      default:
        return Instagram;
    }
  };

  useEffect(() => {
    const scriptId = "elfsight-platform-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all duration-300">
        <div className="container max-w-full px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent">
              Oshin Beauty Salon & Academy
            </div>

            {/* Hamburger Menu Button */}
            <button
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {[
                "Home",
                "Services",
                "Gallery",
                "About",
                "Reviews",
                "Contact",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-700 hover:text-pink-500 transition-colors duration-200 font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="mt-4 flex flex-col space-y-2 md:hidden">
              {[
                "Home",
                "Services",
                "Gallery",
                "About",
                "Reviews",
                "Contact",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    scrollToSection(item.toLowerCase());
                    setMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-pink-500 transition-colors duration-200 font-medium text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 mt-[64px] pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl  font-bold mb-6 bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-400 bg-clip-text text-transparent leading-tight">
              Oshin Beauty Salon & Academy{" "}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-8 font-light">
              {content.home?.title || "Where beauty blossoms"}
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              {content.home?.body ||
                "Discover your natural radiance at our luxurious beauty salon. We offer premium services in a serene, elegant environment designed to make you feel beautiful inside and out."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => scrollToSection("services")}
                className="bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white w-full sm:w-auto px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Services
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open("https://wa.me/918310298181", "_blank")
                }
                className="border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-3 text-lg transition-all duration-300"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience our range of premium beauty services, each designed to
              enhance your natural beauty
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:max-w-7xl mx-auto">
            {displayServices.map((service) => (
              <Card
                key={service.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      service.photo_url ||
                      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop"
                    }
                    alt={service.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.short_description}
                  </p>
                  {service.benefits && service.benefits.length > 0 && (
                    <ul className="space-y-2">
                      {service.duration && (
                        <li className="text-sm text-gray-500 flex items-center">
                          <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                          {service.duration}
                        </li>
                      )}
                      {service.benefits.slice(0, 3).map((benefit, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-500 flex items-center"
                        >
                          <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        id="gallery"
        className="py-20 px-4 bg-gradient-to-br from-pink-50 to-white"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Work</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our gallery to see the beautiful transformations we
              create
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayGallery.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={image.photo_url}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-medium">{image.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              {content.about?.title ||
                "About Oshin Beauty Salon & Academy & Academy"}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="text-xl mb-8">
                {content.about?.body ||
                  "At Oshin Beauty Salon & Academy & Academy, we believe that beauty is not just about appearance—it's about confidence, self-care, and feeling your absolute best."}
              </p>
              <div className="grid md:grid-cols-2 gap-12 text-left">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Our Philosophy
                  </h3>
                  <p className="mb-6">
                    {content.about?.philosophy ||
                      "Founded with a passion for enhancing natural beauty, our salon combines luxury with accessibility. We use only premium products and the latest techniques to ensure every client receives exceptional service."}
                  </p>
                  <p>
                    Our team of experienced professionals is dedicated to making
                    your beauty journey a memorable and relaxing experience.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    What Sets Us Apart
                  </h3>
                  <ul className="space-y-3">
                    {(
                      content.about?.what_sets_apart || [
                        "Personalized consultations for every service",
                        "Premium, cruelty-free products only",
                        "Relaxing, luxurious atmosphere",
                        "Highly trained and certified professionals",
                      ]
                    ).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        id="reviews"
        className="py-20 px-4 bg-gradient-to-br from-pink-50 to-white"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read reviews from our satisfied customers
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* Elfsight widget container */}
            <div
              className="elfsight-app-104a66d8-05cb-4e90-ac32-6ed078d83a3f"
              data-elfsight-app-lazy
            ></div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to enhance your natural beauty? Contact us today or book
              your appointment via WhatsApp
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* Contact Info */}
            <Card className="shadow-lg border-0 mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-800">Phone</p>
                      <p className="text-gray-600">+91 83102 98181</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-800">Address</p>
                      <p className="text-gray-600">
                        Oshin Beauty Salon & Academy
                        <br />
                        No. 47, Adonai's Corner Stone, Old Police Station Road,
                        near Noodle Cafe Kothanur, Bengaluru, Karnataka 560077
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Google Map */}
            <Card className="shadow-lg border-0 mb-8">
              <CardContent className="p-0">
                <div className="w-full rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.3551837556915!2d77.64857032450696!3d13.059563948850176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae171a26edb339%3A0x6556159d684fe13b!2sOshin%20Beauty%20Salon%20%26%20Academy!5e1!3m2!1sen!2sin!4v1751171841952!5m2!1sen!2sin"
                    width="100%"
                    height="450"
                    style={{ border: 0, maxWidth: "100%" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Oshin Beauty Salon & Academy & Academy Location"
                  />
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Button */}
            <div className="text-center">
              <Button
                onClick={() =>
                  window.open(
                    "https://wa.me/918310298181?text=Hi! I would like to book an appointment at Oshin Beauty Salon & Academy & Academy",
                    "_blank"
                  )
                }
                className="bg-green-500 hover:bg-green-600 text-white py-4 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 mx-auto"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.036 5.339c-3.635 0-6.591 2.956-6.591 6.59 0 1.158.297 2.25.82 3.202l-1.202 4.402 4.503-1.18c.929.508 1.997.777 3.121.777 3.633 0 6.591-2.956 6.591-6.592.001-3.633-2.958-6.591-6.591-6.591-.001 0-.001 0-.001 0-.05 0-.101-.001-.15-.008zm3.794 9.464c-.168.47-.962.897-1.505.971-.433.062-.994.056-1.601-.205-.263-.113-.601-.264-1.027-.461-1.804-.835-2.984-2.654-3.075-2.775-.092-.12-.757-1.006-.757-1.917s.478-1.362.647-1.548c.168-.186.368-.232.49-.232.122 0 .244.001.35.006.112.007.262-.043.41.312.151.36.513 1.252.557 1.342.045.091.075.196.015.317-.061.12-.091.196-.182.302-.091.105-.192.235-.274.315-.091.091-.186.189-.08.37.105.182.469.773 1.006 1.252.691.615 1.273.806 1.454.896.182.091.288.076.394-.045.105-.122.451-.526.572-.706.12-.181.24-.151.406-.091.166.061 1.07.505 1.254.595.182.091.303.136.348.212.045.075.045.436-.123.907z" />
                </svg>
                <span>Book via WhatsApp</span>
              </Button>
            </div>

            {/* Social Media */}
            <div className="flex justify-center space-x-6 pt-8">
              {displaySocialMedia.map((social) => {
                const IconComponent = getIconComponent(social.icon_name);
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors duration-200"
                  >
                    <IconComponent className="w-6 h-6 text-pink-500" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center break-words max-w-full">
          <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            Oshin Beauty Salon & Academy{" "}
          </div>
          <p className="text-gray-400 mb-6">Where beauty blossoms</p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Oshin Beauty Salon & Academy. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

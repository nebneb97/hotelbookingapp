import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the TheBooker team. We're available 24/7 to help with your hotel bookings in Kuala Lumpur.",
};
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const contactDetails = [
  {
    icon: FaPhone,
    label: "Phone",
    value: "+60 3-1234 5678",
    sub: "Mon – Sun, 9am – 10pm MYT",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: "hello@thebooker.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Address",
    value: "123 Jalan Bukit Bintang",
    sub: "50200 Kuala Lumpur, Malaysia",
  },
  {
    icon: FaClock,
    label: "Front Desk",
    value: "Open 24 hours",
    sub: "7 days a week",
  },
];

const ContactPage = () => {
  return (
    <section className="min-h-[80vh]">

      {/* Hero banner */}
      <div className="bg-slate-900 py-14 text-center">
        <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">
          We&apos;re here to help
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Have a question or need assistance with your booking? Our team is available around the clock.
        </p>
      </div>

      {/* Contact details strip */}
      <div className="bg-orange-600">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-orange-500">
            {contactDetails.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex items-center gap-3 px-6 py-5">
                <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">{value}</p>
                  <p className="text-orange-200 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form + info */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* Left */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Fill in the form and one of our team members will get back to you within 24 hours. For urgent booking issues, please call us directly.
            </p>

            <div className="space-y-5">
              {contactDetails.map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{value}</p>
                    <p className="text-gray-500 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-1">Send a Message</h2>
            <p className="text-gray-500 text-sm mb-6">We&apos;ll get back to you within 24 hours.</p>
            <ContactForm />
          </div>

        </div>
      </div>

    </section>
  );
};

export default ContactPage;

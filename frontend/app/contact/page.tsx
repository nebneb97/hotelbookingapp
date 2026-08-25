import ContactForm from "@/components/ContactForm";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const contactDetails = [
  {
    icon: FaPhone,
    label: "Phone",
    value: "+60 3-1234 5678",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: "hello@thebooker.com",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Address",
    value: "123 Jalan Bukit Bintang, 50200 Kuala Lumpur, Malaysia",
  },
  {
    icon: FaClock,
    label: "Front Desk",
    value: "Open 24 hours, 7 days a week",
  },
];

const ContactPage = () => {
  return (
    <section className="min-h-[80vh] py-16">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Have a question or need assistance? Our team is here to help 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <div className="space-y-5">
              {contactDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="text-orange-600 text-xl mt-0.5">
                    <Icon />
                  </div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-gray-600">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;

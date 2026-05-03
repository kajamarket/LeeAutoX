import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp message
    const message = `Hello my name is "${formData.name}", my phone number is "${formData.phone}" and I would like to make an enquiry on a "${formData.vehicle}". ${formData.details}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/14160000000?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <section id="contact" className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        {/* Left Column */}
        <div>
          <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6 mt-0">
            Ready to order<br />
            <span className="italic font-normal">your next vehicle?</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-10">
            Tell us what you're looking for and we'll get back to you within 24 hours with availability, pricing, and shipping details — no commitment required.
          </p>

          <div className="space-y-4 text-sm">
            <div>
              <span className="font-medium text-foreground">Email: </span>
              <a href="mailto:info@leeautox.com" className="text-muted-foreground hover:text-foreground">info@leeautox.com</a>
            </div>
            <div>
              <span className="font-medium text-foreground">WhatsApp: </span>
              <a href="https://wa.me/14160000000" className="text-muted-foreground hover:text-foreground">+1 (416) 000-0000</a>
            </div>
            <div>
              <span className="font-medium text-foreground">Base: </span>
              <span className="text-muted-foreground">Ontario, Canada</span>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Also looking for gadgets, laptops, or phones?<br />
              <a 
                href="https://leeplugshub.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:opacity-70 transition-opacity"
              >
                Visit Leeplugshub.com
              </a>
            </p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="group">
                  <label htmlFor="name" className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                    FULL NAME
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30"
                  />
                </div>

                <div className="group">
                  <label htmlFor="phone" className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                    PHONE NUMBER
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 ..."
                    className="w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30"
                  />
                </div>

                <div className="group">
                  <label htmlFor="vehicle" className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                    VEHICLE OF INTEREST
                  </label>
                  <input
                    id="vehicle"
                    type="text"
                    value={formData.vehicle}
                    onChange={handleChange}
                    placeholder="e.g. 2022 Toyota Land Cruiser, Ford F-150..."
                    className="w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30"
                  />
                </div>

                <div className="group">
                  <label htmlFor="details" className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                    ADDITIONAL DETAILS
                  </label>
                  <textarea
                    id="details"
                    rows={3}
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Budget, delivery location, preferred payment plan..."
                    className="w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-3 text-sm font-medium px-6 py-3 bg-foreground text-background hover:bg-foreground/80 transition-colors cursor-pointer"
                >
                  <span>Send enquiry</span>
                  <ArrowRight size={16} />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-muted/30 p-10 flex flex-col items-start gap-4"
              >
                <div className="w-10 h-10 bg-foreground flex items-center justify-center">
                  <ArrowRight size={18} className="text-background" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Enquiry sent via WhatsApp.</h3>
                <p className="text-muted-foreground text-sm">
                  We've received your request. Our team will also reach out within 24 hours with more options.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-mono underline mt-4 hover:opacity-70"
                >
                  Send another request
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

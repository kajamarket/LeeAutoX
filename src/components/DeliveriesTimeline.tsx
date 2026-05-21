import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';


interface TimelineStage {
  stage: string;
  title: string;
  description: string;
  image: string;
}


interface VehicleTimeline {
  id: number;
  name: string;
  price: string;
  stages: TimelineStage[];
}


export default function DeliveriesTimeline() {
  const { theme } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);


  // Define the 5 cars as ordered, displaying 2 and commenting out/disabling the other 3.
  const VEHICLES_DATA: VehicleTimeline[] = [
    {
      id: 1,
      name: '2021 HYUNDAI SONATA',
      price: '₦22,000,000 Total Landing Cost',
      stages: [
        {
          stage: 'STAGE 1',
          title: 'Auction Purchase & Budget Sourcing',
          description: 'A custom enquiry was processed for a clean "Run and Drive" 2021 Sonata. Our procurement specialists researched vehicle histories, reviewed bid files, and successfully won the car at a competitive dealer-only auction.',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800'
        },
        {
          stage: 'STAGE 2',
          title: 'Verification & Copart Yard Inspection',
          description: 'The Sonata was transferred to the Copart auction lot, where on-site technicians verified vehicle details, structural integrity, 4 CYL engine performance, and the guaranteed 85,000 mileage prior to transport clearance.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260515-WA0001.jpg'
        },
        {
          stage: 'STAGE 3',
          title: 'Secure Marine Containerization & Shipping',
          description: 'Loaded securely into a steel export container, bound for West Africa. Full documentation, custom seals, and maritime tracking keys were issued to keep both our team and the customer fully informed.',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
        },
        {
          stage: 'STAGE 4',
          title: 'Port Clearance & Handover in Nigeria',
          description: 'Arrived at the Lagos port (Apapa/Tin Can). Our clearing agency managed customs papers, port levies, and secure local transport. The car is now delivered safely to our lot, fully cleared and pristine.',
          image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'
        }
      ]
    },
    {
      id: 2,
      name: '2021 HYUNDAI SONATA ULTIMATE',
      price: '₦23,000,000 Total Landing Cost',
      stages: [
        {
          stage: 'STAGE 1',
          title: 'Luxury Sourcing & Consultation Match',
          description: 'Matching a highly specific client search for the elite "Ultimate" trim. Secured directly from a top-tier Canadian dealer auction featuring premium tech upgrades.',
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800'
        },
        {
          stage: 'STAGE 2',
          title: 'Top-Spec Feature Verification',
          description: 'On-site lot confirmation of the Sonata Ultimate\'s premium accessories: panoramic sunroof, 360 camera lines, head-up display (HUD), ambient lighting grids, and self-parking feature checks.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0021-scaled.jpg'
        },
        {
          stage: 'STAGE 3',
          title: 'Export Logistics & Sea Freight Splicing',
          description: 'Protected within a heavy duty cargo container, transit begins across global seas. Rigorous logistics checklists prevent any movement or environmental wear during deep sea transit.',
          image: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=800'
        },
        {
          stage: 'STAGE 4',
          title: 'Apapa Clearing & Client Doorstep Handover',
          description: 'Customs cleared directly from Lagos port, detailed to a mirror showroom finish, and delivered straight to the happy client\'s hands. An uncompromised milestone of professional service.',
          image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
        }
      ]
    }
    /*
    // CAR 3: 2017 HYUNDAI SONATA (Created and commented out as requested)
    ,
    {
      id: 3,
      name: '2017 HYUNDAI SONATA',
      price: '₦13,000,000',
      stages: [
        {
          stage: 'STAGE 1',
          title: 'Client Procurement Enquiry',
          description: 'Securing an affordable yet highly requested 2017 family sedan with distinct luxury elements like keyless entry and rear AC vents.',
          image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800'
        },
        {
          stage: 'STAGE 2',
          title: 'Auction Lot Verification',
          description: 'Lot check for panoramic sunroof function, active parking sensors, smart key fob, and engine compression stats.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0002.jpg'
        },
        {
          stage: 'STAGE 3',
          title: 'Containerization & Oceanic Cargo',
          description: 'Secured inside a global logistics vessel for safe shipping from North America directly to Africa.',
          image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800'
        },
        {
          stage: 'STAGE 4',
          title: 'Handover & Local Lot Storage',
          description: 'Completed port clearance and positioned at our Lagos lot for standard customer collection.',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'
        }
      ]
    }
    */
    /*
    // CAR 4: 2011 TOYOTA VENZA (Created and commented out as requested)
    ,
    {
      id: 4,
      name: '2011 TOYOTA VENZA',
      price: '₦13,000,000',
      stages: [
        {
          stage: 'STAGE 1',
          title: 'Clean Title Pre-Order Win',
          description: 'Locating a clean, accident-free classic crossover requested for its durability and supreme comfort features.',
          image: 'https://images.unsplash.com/photo-1424847651672-bf2c9e858b18?auto=format&fit=crop&q=80&w=800'
        },
        {
          stage: 'STAGE 2',
          title: 'Copart Lot Visual Validation',
          description: 'Verification of the premium leather interior, AWD running systems, clean state inspection, and reliable V6 metrics.',
          image: 'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/0326/7732bd8557c14091bc21f8b05b92c42d_ful.jpg'
        },
        {
          stage: 'STAGE 3',
          title: 'Shipping Port Transfer',
          description: 'Safely strapped and dispatched from the export terminal, setting out across international ocean lanes.',
          image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800'
        },
        {
          stage: 'STAGE 4',
          title: 'Nigeria Port Discharge',
          description: 'Fully cleared at Lagos customs and driven safely to either our lot or directly to the buyer\'s home.',
          image: 'https://images.unsplash.com/photo-1617469767053-d3b508a0d84d?auto=format&fit=crop&q=80&w=800'
        }
      ]
    }
    */
    /*
    // CAR 5: 2024 LEXUS RX 350H (Created and commented out as requested)
    ,
    {
      id: 5,
      name: '2024 LEXUS RX 350H',
      price: 'Contact for Pricing',
      stages: [
        {
          stage: 'STAGE 1',
          title: 'High-Level Procurement Order',
          description: 'Handling an elite order for latest-gen Lexus hybrid luxury tracking high-tier luxury trims globally.',
          image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800'
        },
        {
          stage: 'STAGE 2',
          title: 'Lot Specification Check',
          description: 'Sourcing validation of Ultrasonic Blue exterior, luxury hybrid drive unit, clean title, and safety suites.',
          image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Luxury.jpg'
        },
        {
          stage: 'STAGE 3',
          title: 'Encased Container Logistics',
          description: 'Custom container placement designed for maximum finish preservation during high seas crossing.',
          image: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=800'
        },
        {
          stage: 'STAGE 4',
          title: 'Premium Handover & Showcase',
          description: 'Cleared through Apapa customs and handoff completed directly to the executive purchaser in Lagos.',
          image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
        }
      ]
    }
    */
  ];


  const totalSlides = VEHICLES_DATA.length;


  const next = () => setActiveSlide((prev) => (prev + 1) % totalSlides);
  const prev = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);


  // Setup observer for scrolling focus / viewport tracking for auto sliding
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);


  // Safe auto sliding when section is focused (in view)
  useEffect(() => {
    if (!isIntersecting) return;
    const interval = setInterval(() => {
      next();
    }, 10000); // changes slides every 10 seconds
    return () => clearInterval(interval);
  }, [isIntersecting]);


  const activeVehicle = VEHICLES_DATA[activeSlide];


  return (
    <section 
      id="deliveries" 
      ref={sectionRef} 
      className={`relative px-6 md:px-12 py-24 overflow-hidden transition-colors duration-500 border-t border-b ${
        theme === 'dark' 
          ? 'bg-black text-white border-zinc-900' 
          : 'bg-[#FAFBFD] text-slate-950 border-slate-200'
      }`}
    >
      {/* Background Graffiti - Large logistics layout elements representing coordinates and transparency */}
      <div className={`absolute inset-0 z-0 pointer-events-none select-none overflow-hidden transition-colors duration-500 ${
        theme === 'dark' ? 'text-white opacity-[0.015]' : 'text-slate-900 opacity-[0.018]'
      }`}>
        <div className="absolute top-10 -left-10 text-[15vw] font-black leading-none tracking-tighter rotate-[-10deg] whitespace-nowrap">
          AUCTION LOGISTICS
        </div>
        <div className="absolute top-1/3 -right-20 text-[18vw] font-serif font-bold leading-none rotate-[8deg] whitespace-nowrap">
          PORT TO PORT
        </div>
        <div className="absolute -bottom-10 -left-5 text-[22vw] font-black leading-none tracking-tighter rotate-[-3deg] whitespace-nowrap">
          VERIFIED WINS
        </div>
        
        {/* Abstract design elements matching testimonials style map tracks */}
        <div className="absolute top-[20%] left-[25%] rotate-[30deg] flex gap-3">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`w-[1px] h-36 transition-colors duration-500 ${
                theme === 'dark' ? 'bg-white/20' : 'bg-slate-900'
              }`} 
            />
          ))}
        </div>
        <div className="absolute bottom-[30%] right-[15%] grid grid-cols-5 gap-3">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                theme === 'dark' ? 'bg-white/20' : 'bg-slate-900'
              }`} 
            />
          ))}
        </div>
        <div className="absolute top-[50%] left-[6%] text-[8vw] font-light tracking-widest rotate-[15deg]">
          ++++ LOGISTICS ++++
        </div>
        <div className={`absolute top-[70%] right-[5%] text-[7vw] font-light leading-none rotate-[-12deg] border-t pt-3 transition-colors duration-500 ${
          theme === 'dark' ? 'border-white/10' : 'border-slate-900/30'
        }`}>
          SECURE//W1
        </div>
        <div className={`absolute bottom-[5%] left-[40%] w-48 h-48 border rounded-full rotate-[15deg] transition-colors duration-500 ${
          theme === 'dark' ? 'border-white/10' : 'border-slate-900/40'
        }`} />
      </div>


      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header section with SEO optimized Title & Subtitle */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3">
            LEGITIMACY IN ACTION
          </span>
          <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight font-sans max-w-3xl mx-auto mb-4 uppercase transition-colors duration-500 ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>
            Verified Deliveries: From Global Auctions to Nigerian Roads
          </h2>
          <p className={`text-sm md:text-base max-w-2xl mx-auto tracking-wide font-sans transition-colors duration-500 ${
            theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
          }`}>
            Follow the transparent lifecycle journey of our premium vehicles as they move seamlessly from auction yards to port clearance and client handovers in Lagos.
          </p>
        </div>


        {/* Outer slider box */}
        <div className="relative min-h-[500px] mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {/* Active Slide Details Header */}
              <div className="text-center mb-10 max-w-lg mx-auto">
                <h3 className={`text-lg md:text-2xl font-black tracking-wider font-sans border-b-2 pb-2 inline-block transition-colors duration-500 ${
                  theme === 'dark' ? 'text-white border-white/20' : 'text-slate-950 border-[#2B59FF]/20'
                }`}>
                  {activeVehicle.name}
                </h3>
                <p className={`text-xs md:text-sm font-mono mt-2 font-semibold transition-colors duration-500 ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  {activeVehicle.price}
                </p>
              </div>


              {/* TIMELINE TIMELINE WRAPPER (Adapting the journey structure to React) */}
              <div className="relative max-w-4xl mx-auto">
                {/* Horizontal / Vertical Timeline Center Line */}
                <div className={`absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 transform md:-translate-x-1/2 transition-colors duration-500 ${
                  theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200'
                }`} />


                <div className="space-y-12 relative">
                  {activeVehicle.stages.map((item, idx) => {
                    const isEven = idx % 2 === 1;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`flex flex-col md:flex-row items-stretch justify-between w-full relative pl-[50px] md:pl-0 ${
                          isEven ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Content Card (Left or Right side on Desktop, always Right after bullet on Mobile) */}
                        <div className="w-full md:w-[45%] text-left">
                          <div className={`p-5 border transition-all duration-300 relative ${
                            theme === 'dark' 
                              ? 'bg-zinc-900 border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                              : 'bg-white border-slate-200/80 shadow-md hover:shadow-xl'
                          }`}>
                            {/* Accent flag */}
                            <span className="text-[10px] font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-2 py-1 inline-block mb-2">
                              {item.stage}
                            </span>
                            
                            <h4 className={`text-sm md:text-base font-bold mb-2 leading-tight uppercase tracking-tight transition-colors duration-500 ${
                              theme === 'dark' ? 'text-white' : 'text-slate-950'
                            }`}>
                              {item.title}
                            </h4>


                            {/* EVIDENCE IMAGE underneath the text for proof */}
                            <div className={`mt-4 border overflow-hidden select-none transition-colors duration-500 ${
                              theme === 'dark' ? 'border-zinc-800 bg-zinc-950' : 'border-slate-100 bg-slate-50'
                            }`}>
                              <img 
                                src={item.image} 
                                alt={`${activeVehicle.name} - ${item.stage}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-44 object-cover object-center grayscale-[15%] hover:grayscale-0 transition-all duration-500 hover:scale-105"
                              />
                            </div>
                          </div>
                        </div>


                        {/* Dot representation in center line */}
                        <div className="absolute left-[20px] md:left-1/2 w-4 h-4 bg-[#2B59FF] border-2 border-white rounded-full transform -translate-x-[9px] md:-translate-x-1/2 top-6 z-10 flex items-center justify-center shadow-lg shadow-[#2B59FF]/50 scale-125">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>


                        {/* Empty spacing for desktop flex alignment */}
                        <div className="hidden md:block w-[45%]" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>


        {/* Slider Button Controls and Indicators */}
        <div className="flex items-center justify-center gap-6 mt-12 relative z-10">
          <button
            onClick={prev}
            className={`w-12 h-12 border transition-all cursor-pointer flex items-center justify-center ${
              theme === 'dark'
                ? 'border-zinc-700 text-white bg-zinc-900 hover:bg-white hover:text-black hover:border-white shadow-lg'
                : 'border-slate-300 text-slate-900 bg-white hover:bg-slate-950 hover:text-white hover:border-slate-950 shadow-md hover:shadow-lg'
            }`}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>


          {/* Dots indicating slide progress */}
          <div className="flex items-center gap-2.5">
            {VEHICLES_DATA.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeSlide === i 
                    ? 'bg-[#2B59FF] scale-135 shadow-sm' 
                    : (theme === 'dark' ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-slate-300 hover:bg-slate-400')
                }`}
                aria-label={`Go to slide ${i+1}`}
              />
            ))}
          </div>


          <button
            onClick={next}
            className={`w-12 h-12 border transition-all cursor-pointer flex items-center justify-center ${
              theme === 'dark'
                ? 'border-zinc-700 text-white bg-zinc-900 hover:bg-white hover:text-black hover:border-white shadow-lg'
                : 'border-slate-300 text-slate-900 bg-white hover:bg-slate-950 hover:text-white hover:border-slate-950 shadow-md hover:shadow-lg'
            }`}
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>


        {/* Verified Quote Badge */}
        <div className={`text-center italic font-serif text-sm mt-16 pt-8 border-t max-w-md mx-auto transition-colors duration-500 ${
          theme === 'dark' ? 'text-zinc-500 border-zinc-850' : 'text-slate-500 border-slate-200'
        }`}>
          "Still delivering verified, clean, and top-tier vehicles securely to our client's doorstep."
        </div>
      </div>
    </section>
  );
}



import React, { useState } from 'react';
import { X, Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Logo } from './Logo';

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Helper to encode data for Netlify
    const encode = (data: any) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
            .join("&");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({ 
                "form-name": "contact", 
                "subject": `New Inquiry from ${formData.name} - Zero Geometry`,
                ...formData 
            })
        })
        .then(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            // Wait 2 seconds then close
            setTimeout(() => {
                 onBack();
            }, 2000);
        })
        .catch(error => {
            console.error(error);
            alert("Error sending message. Please try again or email us directly.");
            setIsSubmitting(false);
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="h-[100dvh] bg-[#0a0a0a] text-white flex flex-col lg:flex-row animate-in fade-in duration-500 overflow-y-auto">
             <button onClick={onBack} className="fixed top-6 right-6 md:top-8 md:right-8 z-50 p-2 hover:bg-white/10 rounded-full transition-colors text-white mix-blend-difference"><X size={32} /></button>
             
             {/* Info */}
             <div className="w-full lg:w-1/2 p-6 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 min-h-[50vh] lg:min-h-screen pt-20 lg:pt-0 shrink-0">
                <div className="w-16 h-16 md:w-24 md:h-24 mb-8 md:mb-12">
                  <Logo theme="light" className="w-full h-full" />
                </div>
                
                <h1 className="text-4xl md:text-7xl font-bold mb-8 md:mb-12 tracking-tighter font-poppins">Get in<br/>Touch</h1>
                <div className="space-y-8 md:space-y-12 font-poppins">
                    <div className="group">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Mail size={14} /> Email</p>
                        <a href="mailto:hello@zerogeometry.com" className="text-xl md:text-3xl hover:text-[#ccff00] transition-colors break-words">hello@zerogeometry.com</a>
                    </div>
                </div>
             </div>

             {/* Form */}
             <div className="w-full lg:w-1/2 p-6 md:p-16 flex items-center justify-center bg-[#0d0d0d] min-h-[50vh] lg:min-h-screen shrink-0">
                 <div className="w-full max-w-md py-8 lg:py-0">
                     <p className="text-gray-400 mb-8 font-poppins text-sm md:text-base">Use the form below to drop us a line about your project.</p>
                     
                     {isSuccess ? (
                         <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in">
                             <CheckCircle size={64} className="text-[#ccff00]" />
                             <h3 className="text-2xl font-bold">Message Sent</h3>
                             <p className="text-gray-500 text-center">We've received your message and will be in touch shortly.</p>
                         </div>
                     ) : (
                         <form 
                            className="space-y-6 md:space-y-8" 
                            onSubmit={handleSubmit}
                            name="contact"
                            data-netlify="true"
                            data-netlify-honeypot="bot-field"
                         >
                             {/* Hidden inputs for Netlify */}
                             <input type="hidden" name="form-name" value="contact" />
                             <input type="hidden" name="subject" value={`New Inquiry from ${formData.name || 'Visitor'} - Zero Geometry`} />
                             <div hidden>
                                <input name="bot-field" onChange={handleChange} />
                             </div>

                             <div className="group">
                                 <input 
                                    type="text" 
                                    name="name"
                                    placeholder="NAME" 
                                    className="w-full bg-transparent border-b border-gray-700 py-4 text-white focus:border-[#ccff00] outline-none transition-colors placeholder-gray-600 font-mono text-base md:text-sm" 
                                    required 
                                    value={formData.name}
                                    onChange={handleChange}
                                 />
                             </div>
                             <div className="group">
                                 <input 
                                    type="email" 
                                    name="email"
                                    placeholder="EMAIL" 
                                    className="w-full bg-transparent border-b border-gray-700 py-4 text-white focus:border-[#ccff00] outline-none transition-colors placeholder-gray-600 font-mono text-base md:text-sm" 
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                 />
                             </div>
                             <div className="group">
                                 <textarea 
                                    name="message"
                                    placeholder="MESSAGE" 
                                    rows={4} 
                                    className="w-full bg-transparent border-b border-gray-700 py-4 text-white focus:border-[#ccff00] outline-none transition-colors placeholder-gray-600 font-mono text-base md:text-sm resize-none" 
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                 ></textarea>
                             </div>
                             <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-white text-black font-bold px-8 py-5 rounded-full hover:bg-[#ccff00] transition-colors w-full flex justify-between items-center group text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                 <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                                 {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
                             </button>
                         </form>
                     )}
                 </div>
             </div>
        </div>
    );
};
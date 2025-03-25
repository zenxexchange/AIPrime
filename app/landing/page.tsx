'use client'

import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Check, Star, Brain, Sparkles, SwitchCamera, Clock, Layers, Wand,ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import openaiLogo from '../logos/openai.svg';
import geminiLogo from '../logos/gemini.svg';
import claudeLogo from '../logos/claude.svg';
import grokLogo from '../logos/grok.svg';

import supremeaiDashboard from '@/assets/supremeai-dashboard.png';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion } from "framer-motion";

const faqs = [
    {
      q: "What AI models does PrimeAI support?",
      a: "PrimeAI integrates OpenAI (GPT-4o), Google Gemini, Claude, and Grok, allowing seamless switching between models.",
    },
    {
      q: "Is PrimeAI free to use?",
      a: "We offer a free plan with limited access. Unlock all AI models and features with our Pro plan.",
    },
    {
      q: "Can I use PrimeAI for professional work?",
      a: "Absolutely! PrimeAI is designed for content creators, developers, and businesses who need high-quality AI assistance.",
    },
    {
      q: "How does PrimeAI compare to ChatGPT?",
      a: "Unlike ChatGPT, PrimeAI allows you to compare responses from multiple AI models in a single platform.",
    },
    {
      q: "What happens if I cancel my subscription?",
      a: "You’ll lose access to Pro features, but your data and chat history will remain available in your free account.",
    },
  ];
  


const hotspots = [
    {
      id: "model-selector",
      x: "34%", // Adjust to match the exact position on the image
      y: "5%",
      text: "Click here to switch between AI models like GPT-4o, Gemini, and Claude.",
    },
    {
      id: "new-chat",
      x: "64%",
      y: "47%",
      text: "Insert your prompt and add your own files to the chat.",
    },

    {
        id: "upload-file",
        x: "10%",
        y: "12%",
        text: "View your chat history and continue conversations.",
    },

    {
        id: "chat-history",
        x: "17%",
        y: "94%",
        text: "Simply manage your subscription and billing information.",
    },
  ];
  


const reviews = [
    {
      name: "Alex J.",
      role: "AI Researcher",
      content: "PrimeAI makes switching between OpenAI, Gemini, and Claude seamless! The best AI platform I've used so far.",
      rating: 5,
      date: "Feb 20, 2024"
    },
    {
      name: "Sophia R.",
      role: "Content Creator",
      content: "The ability to compare AI responses side-by-side has completely transformed my workflow. Highly recommend!",
      rating: 5,
      date: "Mar 2, 2024"
    },
    {
      name: "Daniel M.",
      role: "Entrepreneur",
      content: "I use PrimeAI daily to automate research and content generation. The results are way better than standalone AI tools.",
      rating: 5,
      date: "Jan 15, 2024"
    },
    {
      name: "Olivia C.",
      role: "Data Scientist",
      content: "Finally, an AI SaaS that brings all models into one place. The multimodal capabilities are a game-changer!",
      rating: 5,
      date: "Feb 5, 2024"
    },
    {
      name: "Ryan T.",
      role: "Software Engineer",
      content: "The Grok integration is insane. PrimeAI gives me the flexibility to test different AI models without switching apps.",
      rating: 5,
      date: "Mar 10, 2024"
    },
    {
      name: "Isabella N.",
      role: "Marketing Director",
      content: "Our entire marketing team now relies on PrimeAI for content ideation. It's like having an AI assistant on steroids!",
      rating: 5,
      date: "Feb 28, 2024"
    }
  ];

  const features = [
    {
      title: "Seamless AI Switching",
      description: "Instantly switch between OpenAI, Gemini, Claude, and Grok without losing context.",
      icon: <SwitchCamera className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: "Multimodal AI Support",
      description: "Analyze text, images, and PDFs with cutting-edge AI models.",
      icon: <Layers className="h-8 w-8 text-green-600 dark:text-green-400" />,
    },
    {
      title: "Real-Time AI Chat",
      description: "Get instant AI responses powered by the latest real-time browsing capabilities.",
      icon: <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
    },
    {
      title: "AI-Powered Creativity",
      description: "Generate high-quality content, images, and responses effortlessly.",
      icon: <Wand className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />,
    },
    {
      title: "Advanced AI Memory",
      description: "Save and retrieve past conversations for a personalized AI experience.",
      icon: <Brain className="h-8 w-8 text-pink-600 dark:text-pink-400" />,
    },
    {
      title: "Secure & Private",
      description: "Your data stays encrypted and never used for AI training.",
      icon: <Sparkles className="h-8 w-8 text-red-600 dark:text-red-400" />,
    },
  ];


export default function Home() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="flex min-h-screen flex-col">
{/* Navigation Bar */}
<nav className="fixed top-0 left-0 right-0 z-50 bg-red-600 dark:bg-black border-b dark:border-gray-800">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="SupremeAI Logo" width={50} height={50} />
            <span className="font-bold text-xl"></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/signup">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gray-100 text-black hover:bg-white-600 px-3 py-3 text-md font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

{/* Hero Section */}
<section className="pt-32 pb-20 text-center bg-gray-100 dark:bg-black">
  <div className="container mx-auto px-6">
    {/* Highlighted Badge */}
    <p className="text-sm text-white bg-gradient-to-r from-orange-600 to-red-600 px-5 py-2 inline-block rounded-full font-medium tracking-wide">
    PrimeAI: Multimodal AI with OpenAI, Gemini, Claude & Grok
    </p>

    {/* Headline */}
    <h1 className="mt-6 text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl">
      All AI models in one place
    </h1>

    {/* Subheading */}
    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
      Switch between OpenAI, Gemini, Claude, and Grok seamlessly. Get the best AI responses, all in one powerful SaaS platform.
    </p>

    {/* CTA Button */}
    <div className="mt-8">
      <Link href="/signup">
        <Button 
          size="lg" 
          className="bg-orange-600 text-white hover:bg-red-600 px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get Started for Free
        </Button>
      </Link>
    </div>



    {/* AI Model Logos */}
    <div className="mt-10 flex justify-center gap-12 items-center">
      <Image src={openaiLogo} alt="OpenAI" width={180} height={180} className="opacity-90 hover:opacity-100 transition-all duration-300" />
      <Image src={geminiLogo} alt="Gemini" width={180} height={180} className="opacity-90 hover:opacity-100 transition-all duration-300" />
      <Image src={claudeLogo} alt="Claude" width={180} height={180} className="opacity-90 hover:opacity-100 transition-all duration-300" />
      <Image src={grokLogo} alt="Grok" width={180} height={180} className="opacity-90 hover:opacity-100 transition-all duration-300" />
    </div>

  </div>
</section>

<section className="py-20 bg-white dark:bg-[#0D0D0D]">
      <div className="container mx-auto px-6">
        
        {/* Section Reviews */}
        <h2 className="text-4xl font-extrabold text-center dark:text-white">
          What Our Users Say
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mt-3 mb-12">
          Trusted by professionals, creators, and businesses worldwide.
        </p>
        
        {/* Review Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-black/40 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow dark:border dark:border-gray-800 backdrop-blur-sm"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-orange-300 dark:bg-white-800 flex items-center justify-center">
                  <span className="text-xl font-bold text-white-600 dark:text-white-300">
                    {review.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold dark:text-white">{review.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{review.role}</p>
                </div>
              </div>

              {/* Star Ratings */}
              <div className="flex gap-1 mb-3">
                {Array(review.rating).fill(0).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review Content */}
              <p className="text-gray-600 dark:text-gray-300 mb-3">{review.content}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">{review.date}</p>
            </div>
          ))}
        </div>
     
      </div>
    </section>

    <section className="py-20 bg-gray-100 dark:bg-[#111111]">
      <div className="container mx-auto px-6 text-center">
        
        {/* Section Heading */}
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Why Choose PrimeAI?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-3 mb-12">
          Powerful AI capabilities, all in one place.
        </p>

        {/* Feature Cards */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 dark:bg-black/40 rounded-xl shadow-lg hover:shadow-2xl transition-all dark:border dark:border-gray-800"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 flex flex-col items-center text-center bg-gray-200 dark:bg-[#1A1A1A]">
    
    <div className="relative max-w-4xl mx-auto">
      
      {/* Section Title */}
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
        Easy to use, powerful AI.
      </h2>
  
      {/* Section Subtitle */}
      <p className="text-gray-600 dark:text-gray-300 mt-3 mb-12">
      PrimeAI is designed to be intuitive and easy to use.
      </p>
  
      {/* Image Wrapper (Centered) */}
      <div className="relative flex justify-center">
        <Image
          src={supremeaiDashboard} // Replace with actual image path
          alt="SupremeAI Dashboard"
          width={900}
          height={500}
          className="rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        />
  
       {/* Interactive Hotspots */}
{hotspots.map((spot) => (
  <div
    key={spot.id}
    className="absolute"
    style={{ top: spot.y, left: spot.x, transform: "translate(-50%, -50%)" }}
  >
    {/* Pulsing Effect */}
    <motion.div
      className="w-5 h-5 bg-orange-500 rounded-full shadow-md cursor-pointer"
      animate={{ scale: [1, 1.5, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
      onClick={() => setActiveTooltip(activeTooltip === spot.id ? null : spot.id)}
    />

    {/* Tooltip (shown on click) */}
    {activeTooltip === spot.id && (
      <motion.div
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white dark:bg-white-800 text-sm text-black dark:text-black p-2 rounded-lg shadow-lg w-max"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
      >
        {spot.text}
      </motion.div>
    )}
          </div>
        ))}
      </div>
  
    </div>
  
  </section>


      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 dark:bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 dark:text-gray-300">Choose the plan that&apos;s right for you</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="rounded-lg border bg-white dark:bg-black/40 p-8 shadow-sm dark:border-gray-800 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Free</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Get started with basic AI features.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold dark:text-white">$0</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-6">
                {[
                  "Access to GPT-3.5 & Claude 3 Haiku",
                  "Limited messages per day",
                  "Basic AI capabilities",
                  "No priority access",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 dark:text-gray-300">
                    <Check className="h-5 w-5 text-orange-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/resumes" className="block">
                <Button className="w-full bg-orange-600 text-white hover:bg-orange-600">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="rounded-lg border-2 border-orange-600 bg-white dark:bg-black/40 p-8 shadow-md relative backdrop-blur-sm">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Premium</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Unlock full AI power with all models.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold dark:text-white">$19.99</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-6">
                {[
                  "Everything in Basic",
                  "Access to Premium AI models",
                  "Unlimited AI interactions",
                  "Priority AI model updates",
                  "Advanced AI features",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 dark:text-gray-300">
                    <Check className="h-5 w-5 text-orange-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/resumes" className="block">
                <Button className="w-full bg-orange-600 text-white hover:bg-orange-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-6">
        
        {/* Section Heading */}
        <h2 className="text-4xl font-extrabold text-center dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mt-3 mb-12">
          Everything you need to know about PrimeAI.
        </p>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border dark:border-gray-800 rounded-lg p-6 mb-4 bg-gray-50 dark:bg-black/40 backdrop-blur-sm cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold dark:text-white">{faq.q}</h3>
                {openIndex === index ? (
                  <ChevronUp className="text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="text-gray-600 dark:text-gray-400" />
                )}
              </div>
              
              {openIndex === index && (
                <p className="text-gray-600 dark:text-gray-300 mt-3">{faq.a}</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>

        <section className="bg-gradient-to-r from-orange-600 to-orange-400 py-20">
        <div className="container mx-auto px-6 text-center">
        
        {/* CTA Headline */}
        <h2 className="mb-6 text-4xl font-extrabold text-white">
          Ready to Experience the Best AI?
        </h2>

        {/* Subtext */}
        <p className="mb-8 text-lg text-white/90 max-w-2xl mx-auto">
          Join thousands of professionals who trust PrimeAI for their AI-powered workflow.
        </p>

        {/* CTA Button */}
        <Link href="/signup">
          <button 
            className="min-w-[200px] bg-white text-black hover:bg-gray-100 transition-all duration-300 py-3 px-6 text-lg font-semibold rounded-lg shadow-lg"
          >
            Get Started for Free
          </button>
        </Link>

      </div>
    </section>
    </main>
  );
}

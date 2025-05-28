
import React from 'react';

const ProcessSection = () => {
  const steps = [
    {
      number: 1,
      title: "Tell us who to protect",
      description: "You specify what (or who) needs monitoring",
      gradient: "from-[#247CFF] to-[#38C172]"
    },
    {
      number: 2,
      title: "We scan everything",
      description: "Open internet + AI ecosystem monitoring",
      gradient: "from-[#38C172] to-[#247CFF]"
    },
    {
      number: 3,
      title: "You receive reports",
      description: "Private, actionable insights + urgent alerts",
      gradient: "from-[#247CFF] to-[#1C1C1E]"
    },
    {
      number: 4,
      title: "We fix it quietly",
      description: "Prevention and resolution behind the scenes",
      gradient: "from-[#1C1C1E] to-[#247CFF]"
    }
  ];

  return (
    <section className="py-20 px-6 bg-[#D8DEE9]">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-[#0A0F2C] font-['Space_Grotesk'] tracking-tight">
          HOW IT WORKS
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step) => (
            <div key={step.number} className="group text-center">
              <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg group-hover:shadow-[0_0_25px_rgba(36,124,255,0.4)] transition-all duration-500 transform group-hover:scale-110 font-['Space_Grotesk']`}>
                {step.number}
              </div>
              <h3 className="font-bold mb-4 text-xl text-[#0A0F2C] group-hover:text-[#247CFF] transition-colors font-['Space_Grotesk'] tracking-wide">
                {step.title.toUpperCase()}
              </h3>
              <p className="text-[#1C1C1E] group-hover:text-[#0A0F2C] transition-colors font-['Inter']">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 bg-gradient-to-r from-[#0A0F2C] to-[#1C1C1E] text-white p-12 rounded-3xl border border-[#247CFF]/30 hover:border-[#247CFF]/50 transition-border duration-500">
          <p className="text-2xl font-bold mb-4 font-['Space_Grotesk'] tracking-wide">NO NEED TO LOG IN.</p>
          <p className="text-2xl font-bold mb-4 font-['Space_Grotesk'] tracking-wide">NO ALERTS UNLESS IT MATTERS.</p>
          <p className="text-2xl font-black text-[#247CFF] font-['Space_Grotesk'] tracking-wide">WE HANDLE IT ALL FOR YOU.</p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

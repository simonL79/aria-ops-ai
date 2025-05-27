
import React from 'react';

const ProcessSection = () => {
  const steps = [
    {
      number: 1,
      title: "Tell us who to protect",
      description: "You specify what (or who) needs monitoring"
    },
    {
      number: 2,
      title: "We scan everything",
      description: "Open internet + AI ecosystem monitoring"
    },
    {
      number: 3,
      title: "You receive reports",
      description: "Private, actionable insights + urgent alerts"
    },
    {
      number: 4,
      title: "We fix it quietly",
      description: "Prevention and resolution behind the scenes"
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">📬 How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 bg-blue-50 p-8 rounded-lg">
          <p className="text-lg font-medium mb-2">No need to log in.</p>
          <p className="text-lg font-medium mb-2">No alerts unless it matters.</p>
          <p className="text-lg font-bold text-blue-600">We handle it all for you.</p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

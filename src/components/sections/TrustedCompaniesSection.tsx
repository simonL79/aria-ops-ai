
import React from 'react';

const TrustedCompaniesSection = () => {
  const companies = [
    { name: "Goldman Sachs", logo: "Goldman\nSachs" },
    { name: "Deloitte", logo: "Deloitte." },
    { name: "Microsoft", logo: "Microsoft" },
    { name: "HSBC", logo: "HSBC" },
    { name: "GM", logo: "GM" }
  ];

  return (
    <section className="py-16 bg-black border-t border-gray-700">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 lg:gap-20">
          {companies.map((company, index) => (
            <div key={index} className="text-gray-400 text-xl md:text-2xl font-light tracking-wide opacity-60 hover:opacity-100 transition-opacity">
              {company.logo === "Goldman\nSachs" ? (
                <div className="text-center">
                  <div>Goldman</div>
                  <div>Sachs</div>
                </div>
              ) : (
                <div>{company.logo}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompaniesSection;

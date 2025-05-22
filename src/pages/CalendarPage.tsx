
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const CalendarPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Calendar</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid gap-4">
            <p className="text-gray-600">
              Your calendar events and scheduled monitoring activities will appear here.
              This feature is currently under development.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;

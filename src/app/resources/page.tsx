"use client";

import Navbar from '../components/Navbar';

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-cardtext mb-6">Emergency Resources</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Emergency Contacts */}
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-cardtext mb-4">Emergency Contacts</h2>
              <ul className="space-y-3 text-foreground">
                <li>Emergency: 911</li>
                <li>Poison Control: 1-800-222-1222</li>
                <li>Disaster Hotline: 1-800-985-5990</li>
                <li>Red Cross: 1-800-733-2767</li>
              </ul>
            </div>

            {/* Disaster Preparedness */}
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-cardtext mb-4">Preparedness Guides</h2>
              <ul className="space-y-3 text-foreground">
                <li>Hurricane Safety Guide</li>
                <li>Earthquake Preparation</li>
                <li>Flood Safety Tips</li>
                <li>Wildfire Protection</li>
              </ul>
            </div>

            {/* Recovery Resources */}
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-cardtext mb-4">Recovery Resources</h2>
              <ul className="space-y-3 text-foreground">
                <li>FEMA Assistance</li>
                <li>Insurance Claims Help</li>
                <li>Mental Health Support</li>
                <li>Community Aid Programs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

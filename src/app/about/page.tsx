"use client";

import Navbar from '../components/Navbar';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-cardtext mb-6">About Disaster Heroes</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-cardtext">Our Mission</h2>
              <p className="text-foreground">
                Disaster Heroes is dedicated to creating a more resilient world by connecting communities, 
                first responders, and resources during times of crisis. We believe in the power of 
                technology and human collaboration to save lives and minimize the impact of disasters.
              </p>
              
              <h2 className="text-2xl font-bold text-cardtext">Our Impact</h2>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>Helped 10,000+ people during natural disasters</li>
                <li>Connected 500+ emergency response teams</li>
                <li>Provided real-time updates in 100+ crisis situations</li>
                <li>Trained 5,000+ community volunteers</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-cardtext">Our Values</h2>
              <div className="grid gap-4">
                <div className="p-4 bg-card rounded-lg">
                  <h3 className="font-bold text-cardtext">Quick Response</h3>
                  <p>Every second counts in emergency situations</p>
                </div>
                <div className="p-4 bg-card rounded-lg">
                  <h3 className="font-bold text-cardtext">Community First</h3>
                  <p>Building stronger, more resilient communities</p>
                </div>
                <div className="p-4 bg-card rounded-lg">
                  <h3 className="font-bold text-cardtext">Innovation</h3>
                  <p>Using technology to improve disaster response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

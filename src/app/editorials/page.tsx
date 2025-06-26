"use client";

import Navbar from '../components/Navbar';

export default function EditorialsPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-footer mb-6">Disaster Management Editorials</h1>
          
          <div className="grid gap-8">
            {/* Featured Editorial */}
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <span className="text-sm text-blue-600 font-semibold">Featured</span>
              <h2 className="text-2xl font-bold text-footer mt-2">Climate Change and Natural Disasters: A Growing Concern</h2>
              <p className="mt-2 text-footer">
                An in-depth analysis of how climate change is affecting the frequency and intensity of natural disasters worldwide...
              </p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>By Dr. Sarah Johnson</span>
                <span className="mx-2">•</span>
                <span>5 min read</span>
              </div>
            </div>

            {/* Recent Editorials */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-card rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-footer">The Role of Technology in Disaster Response</h2>
                <p className="mt-2 text-footer">Exploring how modern technology is revolutionizing disaster response efforts...</p>
                <div className="mt-4 text-sm text-gray-500">3 days ago</div>
              </div>

              <div className="p-6 bg-card rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-footer">Community Resilience: Lessons from Recent Disasters</h2>
                <p className="mt-2 text-footer">Key takeaways from how communities have bounced back from major disasters...</p>
                <div className="mt-4 text-sm text-gray-500">1 week ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

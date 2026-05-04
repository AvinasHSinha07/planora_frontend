import { Metadata } from "next";
import { Briefcase, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers | Planora",
  description: "Join the team building the future of event management.",
};

const jobs = [
  { title: "Senior Frontend Engineer", team: "Engineering", type: "Full-time", location: "Remote / SF" },
  { title: "Product Designer", team: "Design", type: "Full-time", location: "Remote / NY" },
  { title: "Growth Marketing Manager", team: "Marketing", type: "Full-time", location: "London" },
  { title: "Customer Success Lead", team: "Operations", type: "Full-time", location: "Remote" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            Help us build <span className="text-primary italic">Gatherings</span>.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Join a remote-first team of creators, engineers, and designers dedicated to bringing people together.
          </p>
          <div className="pt-4">
             <Button size="lg" className="rounded-xl px-8 h-14 font-bold">See Open Positions</Button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-24">
         <div className="space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Open Roles</h2>
            <p className="text-muted-foreground">Find your next big challenge at Planora.</p>
         </div>

         <div className="grid gap-4">
            {jobs.map((job) => (
              <Link 
                key={job.title} 
                href="#" 
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                   <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                   <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-medium">
                         <Briefcase className="h-4 w-4" /> {job.team}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                         <MapPin className="h-4 w-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                         <Clock className="h-4 w-4" /> {job.type}
                      </span>
                   </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                   <ArrowUpRight className="h-5 w-5" />
                </div>
              </Link>
            ))}
         </div>
      </section>

      {/* Perks */}
      <section className="bg-muted/30 py-24 border-t">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Why Join Us?</h2>
            <div className="grid md:grid-cols-3 gap-12 text-center">
               <div className="space-y-4">
                  <div className="text-4xl">🌎</div>
                  <h4 className="font-bold">Remote-First</h4>
                  <p className="text-sm text-muted-foreground">Work from anywhere in the world, on your own schedule.</p>
               </div>
               <div className="space-y-4">
                  <div className="text-4xl">📈</div>
                  <h4 className="font-bold">Growth Oriented</h4>
                  <p className="text-sm text-muted-foreground">Generous budget for learning, books, and conferences.</p>
               </div>
               <div className="space-y-4">
                  <div className="text-4xl">🏥</div>
                  <h4 className="font-bold">Premium Health</h4>
                  <p className="text-sm text-muted-foreground">Comprehensive coverage for you and your family.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

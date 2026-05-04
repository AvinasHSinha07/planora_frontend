"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Music, Code, Briefcase, Camera, Heart, Utensils } from "lucide-react";

const categories = [
  { id: 1, name: "Technology", icon: Code, count: "120+ Events" },
  { id: 2, name: "Music & Arts", icon: Music, count: "85+ Events" },
  { id: 3, name: "Business", icon: Briefcase, count: "45+ Events" },
  { id: 4, name: "Photography", icon: Camera, count: "30+ Events" },
  { id: 5, name: "Health & Wellness", icon: Heart, count: "60+ Events" },
  { id: 6, name: "Food & Drink", icon: Utensils, count: "90+ Events" },
];

export default function CategoriesSection() {
  return (
    <section className="py-24 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Explore by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find the perfect event tailored to your unique interests and passions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-lg transition-all hover:-translate-y-2 cursor-pointer border-transparent hover:border-primary/20 bg-background/50 backdrop-blur">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{category.count}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

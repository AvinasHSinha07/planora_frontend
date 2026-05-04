"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Code, Briefcase, Camera, Heart, Utensils, Sparkles, Globe, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const iconMap: Record<string, any> = {
  "Technology": Code,
  "Music": Music,
  "Business": Briefcase,
  "Photography": Camera,
  "Health": Heart,
  "Food": Utensils,
  "Festival": Sparkles,
  "Show": Ticket,
  "Day Out": Globe
};

export default function CategoriesSection() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/categories");
      return data.data;
    },
  });

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Explore by Category</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
              Dive into specialized worlds of interest and find your next unforgettable experience.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 bg-muted animate-pulse rounded-3xl" />
            ))
          ) : (
            categories.map((category: any, index: number) => {
              const Icon = iconMap[category.name] || iconMap[category.name.split(' ')[0]] || Globe;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/events?category=${category.name}`}>
                    <Card className="group h-full border-none bg-card/50 backdrop-blur-xl hover:bg-card hover:shadow-2xl transition-all duration-500 rounded-[2rem] cursor-pointer overflow-hidden shadow-lg shadow-black/5">
                      <CardContent className="p-8 flex flex-col items-center text-center space-y-5">
                        <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                          <Icon className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{category.name}</h3>
                          <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mt-1 opacity-50">Discover</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] z-0" />
    </section>
  );
}

"use client";

import HeroSlider from "@/components/HeroSlider";
import MovieGrid from "@/components/MovieGrid";
import Footer from "@/components/Footer";
import AuthModals from "@/components/AuthModals";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FiltersPanel from "@/components/FilterPanel";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020d18]">
      <Navbar />

      <AuthModals />
      
      <HeroSlider /> 
      
      {/* Searchbar and filter section */}
      <section className="py-12 bg-[#020d18] border-t border-[#0b1b2b]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white uppercase mb-6">
            Find Your Next Movie
          </h2>
          
          <SearchBar /> 

          <FiltersPanel />

        </div>
      </section>
      
      <MovieGrid title="In Theater" viewAllLink="/movies" />
      
      <MovieGrid title="On TV" viewAllLink="/movies" />
      
      <Footer />
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bike, Footprints, Goal, Dumbbell, Waves, Mountain, X } from "lucide-react";

export interface Sport {
  id: string;
  name: string;
  icon: React.ReactNode;
  tag: string;
}

export const SPORTS: Sport[] = [
  { id: "patinaje", name: "Patinaje", icon: <Footprints className="h-4 w-4" />, tag: "patinaje" },
  { id: "ciclismo", name: "Ciclismo", icon: <Bike className="h-4 w-4" />, tag: "ciclismo" },
  { id: "futbol", name: "Fútbol", icon: <Goal className="h-4 w-4" />, tag: "futbol" },
  { id: "gym", name: "Gym / Fitness", icon: <Dumbbell className="h-4 w-4" />, tag: "gym" },
  { id: "natacion", name: "Natación", icon: <Waves className="h-4 w-4" />, tag: "natacion" },
  { id: "running", name: "Running", icon: <Mountain className="h-4 w-4" />, tag: "running" },
];

interface SportFilterProps {
  selectedSports: string[];
  onSportsChange: (sports: string[]) => void;
}

export const SportFilter = ({ selectedSports, onSportsChange }: SportFilterProps) => {
  const toggleSport = (sportId: string) => {
    if (selectedSports.includes(sportId)) {
      onSportsChange(selectedSports.filter(s => s !== sportId));
    } else {
      onSportsChange([...selectedSports, sportId]);
    }
  };

  const clearFilters = () => {
    onSportsChange([]);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Filtrar por deporte</h3>
        {selectedSports.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {SPORTS.map((sport) => {
          const isSelected = selectedSports.includes(sport.id);
          return (
            <Button
              key={sport.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSport(sport.id)}
              className={`
                flex items-center gap-2 transition-all
                ${isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-primary/10"
                }
              `}
            >
              {sport.icon}
              {sport.name}
            </Button>
          );
        })}
      </div>

      {selectedSports.length > 0 && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Deportes seleccionados:</span>
          {selectedSports.map(sportId => {
            const sport = SPORTS.find(s => s.id === sportId);
            if (!sport) return null;
            return (
              <Badge 
                key={sportId} 
                variant="secondary"
                className="flex items-center gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => toggleSport(sportId)}
              >
                {sport.name}
                <X className="h-3 w-3" />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to build query with sport filters
export function buildSportQuery(baseQuery?: string, selectedSports?: string[]): string | undefined {
  if (!selectedSports || selectedSports.length === 0) {
    return baseQuery;
  }

  const sportTags = selectedSports
    .map(sportId => {
      const sport = SPORTS.find(s => s.id === sportId);
      return sport ? `tag:${sport.tag}` : null;
    })
    .filter(Boolean)
    .join(" OR ");

  if (!sportTags) return baseQuery;

  if (baseQuery) {
    return `(${baseQuery}) AND (${sportTags})`;
  }

  return sportTags;
}

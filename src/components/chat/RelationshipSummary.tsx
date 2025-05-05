import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export default function RelationshipSummary() {
  const { user, partner } = useStore();
  const [analysis, setAnalysis] = useState({
    relationshipType: "Balanced",
    userInterest: 0,
    partnerInterest: 0,
    moodAnalysis: "Positive",
  });

  // Simulate fetching and analyzing chat data
  useEffect(() => {
    // In a real app, this would fetch actual chat data and calculate metrics
    // For now, we'll use simulated data
    
    // Simulate a delay before getting data
    const timer = setTimeout(() => {
      // Random relationship type
      const types = ["Balanced", "You seem more engaged", "Partner seems more engaged", "You're more expressive"];
      const relationshipType = types[Math.floor(Math.random() * types.length)];
      
      // Random interest levels
      const userInterest = 40 + Math.floor(Math.random() * 50);
      const partnerInterest = 40 + Math.floor(Math.random() * 50);
      
      // Random mood analysis
      const moods = ["Very positive", "Positive", "Slightly tense"];
      const moodAnalysis = moods[Math.floor(Math.random() * moods.length)];
      
      setAnalysis({
        relationshipType,
        userInterest,
        partnerInterest,
        moodAnalysis,
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper to determine badge color based on mood
  const getMoodBadgeColor = (mood: string) => {
    switch (mood) {
      case "Very positive":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "Positive":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Slightly tense":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Tense":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="py-1 px-2">
      <div className="text-xs text-gray-500 mb-1">Relationship Status</div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">Type:</span>
        <Badge variant="outline" className="text-xs bg-amber-50 hover:bg-amber-50">
          {analysis.relationshipType}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">Mood:</span>
        <Badge 
          variant="outline" 
          className={`text-xs ${getMoodBadgeColor(analysis.moodAnalysis)}`}
        >
          {analysis.moodAnalysis}
        </Badge>
      </div>
      
      <div className="space-y-1 mb-1">
        <div className="flex justify-between items-center text-xs">
          <span>{user?.name || "You"}</span>
          <span>{analysis.userInterest}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 rounded-full" 
            style={{ width: `${analysis.userInterest}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span>{partner?.name || "Partner"}</span>
          <span>{analysis.partnerInterest}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${analysis.partnerInterest}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
} 
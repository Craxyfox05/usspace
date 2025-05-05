"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, RefreshCcw, ExternalLink, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Define gift categories based on preferences
const giftCategories = {
  hobbies: {
    "Reading": ["Books", "E-reader", "Reading lamp", "Bookmarks", "Book subscription box"],
    "Gaming": ["Video games", "Gaming accessories", "Gaming gift cards", "Collectibles", "Gaming headphones"],
    "Cooking": ["Cooking utensils", "Recipe books", "Cooking classes", "Spice sets", "Kitchen gadgets"],
    "Sports": ["Sports equipment", "Team merchandise", "Fitness tracker", "Sports tickets", "Athletic wear"],
    "Hiking": ["Hiking boots", "Backpack", "Water bottle", "Trekking poles", "Outdoor gear"],
    "Photography": ["Camera accessories", "Photo album", "Camera bag", "Photography classes", "Photo frame"],
    "Art": ["Art supplies", "Art classes", "Museum tickets", "Art books", "Custom artwork"],
    "Music": ["Instrument accessories", "Concert tickets", "Music subscription", "Vinyl records", "Headphones"],
    "Movies": ["Movie tickets", "Streaming subscription", "Movie memorabilia", "Home theater accessories"],
    "Travel": ["Travel accessories", "Luggage", "Travel books", "Travel vouchers", "Travel pillow"],
    "Dancing": ["Dance classes", "Dance shoes", "Dance performance tickets", "Workout clothes"],
    "Writing": ["Fancy pen set", "Journal", "Writing workshop", "Desk accessories", "Writing software subscription"],
    "Crafts": ["Craft supplies", "Craft kit", "Craft storage", "Craft class", "Handmade gifts"],
    "Gardening": ["Plant collection", "Garden tools", "Seeds set", "Gardening books", "Plant pots"],
    "Yoga": ["Yoga mat", "Yoga clothes", "Yoga blocks", "Meditation app subscription", "Yoga retreat"]
  },
  food: {
    "Italian": ["Italian cookbook", "Pasta maker", "Olive oil gift set", "Italian wine"],
    "Japanese": ["Sushi making kit", "Japanese tea set", "Ramen kit", "Chopsticks set"],
    "Mexican": ["Mexican cookbook", "Taco kit", "Margarita set", "Hot sauce collection"],
    "Thai": ["Thai cookbook", "Curry set", "Mortar and pestle", "Coconut milk"],
    "Indian": ["Spice box", "Indian cookbook", "Naan making kit", "Chai set"],
    "Chinese": ["Wok", "Bamboo steamer", "Tea set", "Chinese cookbook"],
    "French": ["French cookbook", "Wine glasses", "Cheese board", "Macaron making kit"],
    "American": ["Grill accessories", "BBQ sauce set", "Burger press", "American cookbook"],
    "Mediterranean": ["Olive oil set", "Mezze plates", "Herb set", "Mediterranean cookbook"],
    "Korean": ["Korean BBQ set", "Kimchi making kit", "Korean snack box", "Korean cookbook"],
    "Desserts": ["Baking kit", "Dessert cookbook", "Specialty chocolate", "Ice cream maker"],
    "Seafood": ["Seafood cookbook", "Seafood tools", "Fish seasoning", "Seafood gift card"],
    "Vegetarian": ["Vegetarian cookbook", "Vegetable spiralizer", "Organic produce box", "Herb garden kit"],
    "Vegan": ["Vegan cookbook", "Plant-based milk maker", "Vegan snack box", "Vegan restaurant gift card"],
    "BBQ": ["BBQ tools", "BBQ sauce set", "Grill accessories", "Smoker box"]
  }
};

// Define popular shopping sites and their search URLs
const shoppingSites = {
  "Amazon": (query: string) => `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
  "Flipkart": (query: string) => `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
  "Myntra": (query: string) => `https://www.myntra.com/${encodeURIComponent(query.replace(/\s+/g, '-'))}`,
  "Nykaa": (query: string) => `https://www.nykaa.com/search/result/?q=${encodeURIComponent(query)}`,
  "Ajio": (query: string) => `https://www.ajio.com/search/?text=${encodeURIComponent(query)}`,
  "Snapdeal": (query: string) => `https://www.snapdeal.com/search?keyword=${encodeURIComponent(query)}`,
  "Tata CLiQ": (query: string) => `https://www.tatacliq.com/search/?searchCategory=all&text=${encodeURIComponent(query)}`,
  "Reliance Digital": (query: string) => `https://www.reliancedigital.in/search?q=${encodeURIComponent(query)}:relevance`,
  "Croma": (query: string) => `https://www.croma.com/searchB?q=${encodeURIComponent(query)}:relevance`
};

interface GiftSuggestionsProps {
  forPartner?: boolean;
  preferences?: {
    gender?: string;
    hobbies?: string[];
    foodPreferences?: string[];
    favoriteColors?: string[];
    interests?: string[];
    clothingSize?: string;
    shoeSize?: string;
    favoriteStores?: string[];
    wishlist?: string[];
  };
  partnerName?: string;
}

const GiftSuggestions: React.FC<GiftSuggestionsProps> = ({ 
  forPartner = false, 
  preferences, 
  partnerName = "your partner" 
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  // Function to generate gift suggestions based on preferences
  const generateSuggestions = () => {
    setIsGenerating(true);
    
    // If there are no preferences or incomplete profile
    if (!preferences || !preferences.hobbies || preferences.hobbies.length === 0) {
      setTimeout(() => {
        setSuggestions([
          "Complete profile for personalized suggestions",
          "Gift card to their favorite store",
          "Dinner at a nice restaurant",
          "Custom photo album",
          "Subscription box service"
        ]);
        setIsGenerating(false);
      }, 1000);
      return;
    }
    
    // Generate actual suggestions
    const newSuggestions: string[] = [];
    
    // Add suggestions from hobbies
    if (preferences.hobbies && preferences.hobbies.length > 0) {
      preferences.hobbies.forEach(hobby => {
        if (giftCategories.hobbies[hobby as keyof typeof giftCategories.hobbies]) {
          const hobbyGifts = giftCategories.hobbies[hobby as keyof typeof giftCategories.hobbies];
          if (hobbyGifts && hobbyGifts.length > 0) {
            // Add a random gift idea from this hobby
            const randomHobbyGift = hobbyGifts[Math.floor(Math.random() * hobbyGifts.length)];
            if (randomHobbyGift && !newSuggestions.includes(randomHobbyGift)) {
              newSuggestions.push(`${randomHobbyGift} (for ${hobby})`);
            }
          }
        }
      });
    }
    
    // Add suggestions from food preferences
    if (preferences.foodPreferences && preferences.foodPreferences.length > 0) {
      preferences.foodPreferences.forEach(food => {
        if (giftCategories.food[food as keyof typeof giftCategories.food]) {
          const foodGifts = giftCategories.food[food as keyof typeof giftCategories.food];
          if (foodGifts && foodGifts.length > 0) {
            // Add a random gift idea from this food preference
            const randomFoodGift = foodGifts[Math.floor(Math.random() * foodGifts.length)];
            if (randomFoodGift && !newSuggestions.includes(randomFoodGift)) {
              newSuggestions.push(`${randomFoodGift} (${food} cuisine)`);
            }
          }
        }
      });
    }
    
    // Add wishlist items if available
    if (preferences.wishlist && preferences.wishlist.length > 0) {
      const randomWishIndex = Math.floor(Math.random() * preferences.wishlist.length);
      const wishlistItem = preferences.wishlist[randomWishIndex];
      newSuggestions.push(`${wishlistItem} (from wishlist)`);
    }
    
    // Add favorite store suggestion if available
    if (preferences.favoriteStores && preferences.favoriteStores.length > 0) {
      const randomStoreIndex = Math.floor(Math.random() * preferences.favoriteStores.length);
      const store = preferences.favoriteStores[randomStoreIndex];
      newSuggestions.push(`Gift card to ${store}`);
    }
    
    // If we have color preferences, add a color-based suggestion
    if (preferences.favoriteColors && preferences.favoriteColors.length > 0) {
      const randomColorIndex = Math.floor(Math.random() * preferences.favoriteColors.length);
      const color = preferences.favoriteColors[randomColorIndex];
      const colorItems = ["Clothing item", "Accessories", "Home decor", "Watch", "Jewelry"];
      const randomItem = colorItems[Math.floor(Math.random() * colorItems.length)];
      newSuggestions.push(`${color} ${randomItem}`);
    }
    
    // Fill in with generic items if needed
    const genericGifts = [
      "Custom photo frame",
      "Experience gift (concert, class, etc.)",
      "Subscription box service",
      "Personalized calendar",
      "Customized playlist or music box",
      "Gourmet food basket",
      "Smart home device",
      "Wellness products",
      "Tech accessories",
      "Personalized jewelry"
    ];
    
    while (newSuggestions.length < 5) {
      const randomGenericIndex = Math.floor(Math.random() * genericGifts.length);
      const genericGift = genericGifts[randomGenericIndex];
      if (!newSuggestions.includes(genericGift)) {
        newSuggestions.push(genericGift);
      }
    }
    
    // Limit to 5 suggestions
    const finalSuggestions = newSuggestions.slice(0, 5);
    
    setTimeout(() => {
      setSuggestions(finalSuggestions);
      setIsGenerating(false);
    }, 1000);
  };
  
  // Generate initial suggestions
  useEffect(() => {
    generateSuggestions();
  }, [preferences]);
  
  // Get searchable term from suggestion
  const getSearchTerm = (suggestion: string) => {
    // Remove anything in parentheses
    return suggestion.replace(/\s*\([^)]*\)/g, '').trim();
  };
  
  // Get wishlist items to populate dropdown
  const getWishlistAndSuggestions = () => {
    const items: string[] = [];
    
    // Add wishlist items first if available
    if (preferences?.wishlist && preferences.wishlist.length > 0) {
      items.push(...preferences.wishlist);
    }
    
    // Add current suggestions
    items.push(...suggestions.map(getSearchTerm));
    
    // Remove duplicates
    return [...new Set(items)];
  };
  
  return (
    <Card>
      <CardHeader className="bg-red-50 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Gift className="mr-2 h-5 w-5" />
          Gift Ideas {forPartner ? `for ${partnerName}` : ""}
        </CardTitle>
        <CardDescription>
          Personalized suggestions based on {forPartner ? "their" : "your"} preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {!preferences || Object.keys(preferences).length === 0 ? (
          <div className="text-center p-4">
            <p className="mb-4 text-gray-600">
              Complete {forPartner ? `${partnerName}'s` : "your"} profile to get personalized gift suggestions.
            </p>
            <Button variant="outline" asChild>
              <Link href={forPartner ? "/couples" : "/settings"}>
                Update Profile
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="space-y-2 mb-4">
              {isGenerating ? (
                <div className="text-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-red-500 rounded-full border-t-transparent mx-auto mb-2"></div>
                  <p className="text-gray-500">Generating suggestions...</p>
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 p-2 rounded hover:bg-gray-50">
                    <span className="text-red-500 mr-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))
              )}
            </ul>
            
            <div className="flex justify-between items-center">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={generateSuggestions} 
                disabled={isGenerating} 
                className="flex items-center gap-1"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>New Ideas</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs text-gray-500 flex items-center gap-1"
                  >
                    <span>Shop Online</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {getWishlistAndSuggestions().length > 0 ? (
                    <>
                      {getWishlistAndSuggestions().map((item, index) => (
                        <DropdownMenuItem key={index} onClick={() => setSelectedItem(item)}>
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>{item}</span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="ml-2 p-1 rounded hover:bg-gray-100">
                              <ExternalLink className="h-3 w-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {Object.entries(shoppingSites).map(([site, getUrl]) => (
                                <DropdownMenuItem key={site} asChild>
                                  <Link href={getUrl(item)} target="_blank" rel="noopener noreferrer">
                                    {site}
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </DropdownMenuItem>
                      ))}
                    </>
                  ) : (
                    <DropdownMenuItem disabled>
                      No wishlist items. Add them in your profile.
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftSuggestions; 
"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const hobbiesOptions = [
  "Reading", "Gaming", "Cooking", "Sports", "Hiking", 
  "Photography", "Art", "Music", "Movies", "Travel", 
  "Dancing", "Writing", "Crafts", "Gardening", "Yoga"
];

const foodOptions = [
  "Italian", "Japanese", "Mexican", "Thai", "Indian", 
  "Chinese", "French", "American", "Mediterranean", "Korean",
  "Desserts", "Seafood", "Vegetarian", "Vegan", "BBQ"
];

const colorOptions = [
  "Red", "Blue", "Green", "Purple", "Pink", 
  "Black", "White", "Yellow", "Orange", "Brown", 
  "Teal", "Navy", "Gold", "Silver", "Gray"
];

// Indian regional cuisines
const indianCuisineOptions = [
  "North Indian", "South Indian", "Bengali", "Gujarati", 
  "Maharashtrian", "Punjabi", "Rajasthani", "Goan", 
  "Kashmiri", "Chettinad", "Hyderabadi", "Kerala", 
  "Assamese", "Bihari", "Odia"
];

// Indian festivals
const indianFestivalOptions = [
  "Diwali", "Holi", "Eid", "Navratri", "Durga Puja",
  "Ganesh Chaturthi", "Onam", "Pongal", "Lohri", 
  "Baisakhi", "Raksha Bandhan", "Janmashtami", 
  "Karwa Chauth", "Chhath Puja", "Christmas"
];

// Traditional clothing options
const traditionalClothingOptions = {
  male: ["Kurta", "Kurta Pajama", "Sherwani", "Dhoti", "Lungi", "Nehru Jacket", "Bandhgala"],
  female: ["Saree", "Salwar Kameez", "Lehenga", "Anarkali", "Churidar", "Kurti", "Sharara"]
};

const ProfileSurvey = () => {
  const { user, updateUserProfile } = useStore();
  const [profile, setProfile] = useState({
    gender: user?.gender || "",
    birthdate: user?.birthdate || undefined,
    hobbies: user?.hobbies || [],
    foodPreferences: user?.foodPreferences || [],
    favoriteColors: user?.favoriteColors || [],
    interests: user?.interests || [],
    clothingSize: user?.clothingSize || "",
    shoeSize: user?.shoeSize || "",
    favoriteStores: user?.favoriteStores || [],
    wishlist: user?.wishlist || [],
    // Added new fields for Indian preferences
    indianCuisines: user?.indianCuisines || [],
    favoriteFestivals: user?.favoriteFestivals || [],
    traditionalClothing: user?.traditionalClothing || [],
    homeState: user?.homeState || "",
    motherTongue: user?.motherTongue || "",
    musicPreference: user?.musicPreference || []
  });

  const [newInterest, setNewInterest] = useState("");
  const [newStore, setNewStore] = useState("");
  const [newWishlistItem, setNewWishlistItem] = useState("");
  const [newMusic, setNewMusic] = useState("");
  const [step, setStep] = useState(1);
  const totalSteps = 5; // Updated to 5 steps

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setProfile({
        gender: user.gender || "",
        birthdate: user.birthdate || undefined,
        hobbies: user.hobbies || [],
        foodPreferences: user.foodPreferences || [],
        favoriteColors: user.favoriteColors || [],
        interests: user.interests || [],
        clothingSize: user.clothingSize || "",
        shoeSize: user.shoeSize || "",
        favoriteStores: user.favoriteStores || [],
        wishlist: user.wishlist || [],
        // Added new fields for Indian preferences
        indianCuisines: user.indianCuisines || [],
        favoriteFestivals: user.favoriteFestivals || [],
        traditionalClothing: user.traditionalClothing || [],
        homeState: user.homeState || "",
        motherTongue: user.motherTongue || "",
        musicPreference: user.musicPreference || []
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    updateUserProfile({
      ...profile,
      profileCompleted: true
    });
    
    toast.success("Profile updated successfully!");
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({ 
        ...prev, 
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleAddStore = () => {
    if (newStore.trim() && !profile.favoriteStores.includes(newStore.trim())) {
      setProfile(prev => ({ 
        ...prev, 
        favoriteStores: [...prev.favoriteStores, newStore.trim()]
      }));
      setNewStore("");
    }
  };

  const handleRemoveStore = (store: string) => {
    setProfile(prev => ({
      ...prev,
      favoriteStores: prev.favoriteStores.filter(s => s !== store)
    }));
  };

  const handleAddWishlistItem = () => {
    if (newWishlistItem.trim() && !profile.wishlist.includes(newWishlistItem.trim())) {
      setProfile(prev => ({ 
        ...prev, 
        wishlist: [...prev.wishlist, newWishlistItem.trim()]
      }));
      setNewWishlistItem("");
    }
  };

  const handleAddMusic = () => {
    if (newMusic.trim() && !profile.musicPreference.includes(newMusic.trim())) {
      setProfile(prev => ({ 
        ...prev, 
        musicPreference: [...prev.musicPreference, newMusic.trim()]
      }));
      setNewMusic("");
    }
  };

  const handleRemoveMusic = (music: string) => {
    setProfile(prev => ({
      ...prev,
      musicPreference: prev.musicPreference.filter(m => m !== music)
    }));
  };

  const handleRemoveWishlistItem = (item: string) => {
    setProfile(prev => ({
      ...prev,
      wishlist: prev.wishlist.filter(i => i !== item)
    }));
  };

  const toggleCheckboxValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSaveProfile();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Personal Preferences Profile</CardTitle>
        <CardDescription>
          Help us get to know you better! This information will be used to suggest gifts and personalize your experience.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 mt-2 text-center">
            Step {step} of {totalSteps}
          </div>
        </div>
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <RadioGroup 
                id="gender"
                value={profile.gender} 
                onValueChange={value => setProfile(prev => ({ ...prev, gender: value }))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-binary" id="non-binary" />
                  <Label htmlFor="non-binary">Non-binary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                  <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !profile.birthdate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {profile.birthdate ? format(profile.birthdate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={profile.birthdate}
                    onSelect={(date) => setProfile(prev => ({ ...prev, birthdate: date }))}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1940}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500">
                We'll use this to celebrate your birthday and show countdown on your dashboard!
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="homeState">Home State/Region</Label>
              <Input 
                id="homeState"
                value={profile.homeState}
                onChange={e => setProfile(prev => ({ ...prev, homeState: e.target.value }))}
                placeholder="e.g. Maharashtra, Delhi, Karnataka"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherTongue">Mother Tongue</Label>
              <Input 
                id="motherTongue"
                value={profile.motherTongue}
                onChange={e => setProfile(prev => ({ ...prev, motherTongue: e.target.value }))}
                placeholder="e.g. Hindi, Tamil, Marathi, Bengali"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Clothing Size</Label>
              <Input 
                value={profile.clothingSize}
                onChange={e => setProfile(prev => ({ ...prev, clothingSize: e.target.value }))}
                placeholder="e.g. Medium, Large, 12, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Shoe Size</Label>
              <Input 
                value={profile.shoeSize}
                onChange={e => setProfile(prev => ({ ...prev, shoeSize: e.target.value }))}
                placeholder="e.g. 9, 42, etc."
              />
            </div>
          </div>
        )}
        
        {/* Step 2: Hobbies & Interests */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Hobbies</Label>
              <div className="grid grid-cols-3 gap-2">
                {hobbiesOptions.map(hobby => (
                  <div key={hobby} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`hobby-${hobby}`}
                      checked={profile.hobbies.includes(hobby)}
                      onCheckedChange={() => setProfile(prev => ({ 
                        ...prev, 
                        hobbies: toggleCheckboxValue(prev.hobbies, hobby)
                      }))}
                    />
                    <Label htmlFor={`hobby-${hobby}`}>{hobby}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Other Interests</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newInterest}
                  onChange={e => setNewInterest(e.target.value)}
                  placeholder="Add other interests..."
                  onKeyDown={e => e.key === 'Enter' && handleAddInterest()}
                />
                <Button type="button" onClick={handleAddInterest} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.interests.map(interest => (
                  <div key={interest} className="bg-red-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span>{interest}</span>
                    <button 
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Favorite Colors</Label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map(color => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`color-${color}`}
                      checked={profile.favoriteColors.includes(color)}
                      onCheckedChange={() => setProfile(prev => ({ 
                        ...prev, 
                        favoriteColors: toggleCheckboxValue(prev.favoriteColors, color)
                      }))}
                    />
                    <Label htmlFor={`color-${color}`}>{color}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Music Preferences</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newMusic}
                  onChange={e => setNewMusic(e.target.value)}
                  placeholder="Add music genre or artist..."
                  onKeyDown={e => e.key === 'Enter' && handleAddMusic()}
                />
                <Button type="button" onClick={handleAddMusic} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.musicPreference.map(music => (
                  <div key={music} className="bg-red-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span>{music}</span>
                    <button 
                      onClick={() => handleRemoveMusic(music)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Food & Shopping */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Food Preferences</Label>
              <div className="grid grid-cols-3 gap-2">
                {foodOptions.map(food => (
                  <div key={food} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`food-${food}`}
                      checked={profile.foodPreferences.includes(food)}
                      onCheckedChange={() => setProfile(prev => ({ 
                        ...prev, 
                        foodPreferences: toggleCheckboxValue(prev.foodPreferences, food)
                      }))}
                    />
                    <Label htmlFor={`food-${food}`}>{food}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Favorite Stores</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newStore}
                  onChange={e => setNewStore(e.target.value)}
                  placeholder="Add store..."
                  onKeyDown={e => e.key === 'Enter' && handleAddStore()}
                />
                <Button type="button" onClick={handleAddStore} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.favoriteStores.map(store => (
                  <div key={store} className="bg-red-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span>{store}</span>
                    <button 
                      onClick={() => handleRemoveStore(store)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Indian Cultural Preferences */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Favorite Indian Cuisines</Label>
              <div className="grid grid-cols-3 gap-2">
                {indianCuisineOptions.map(cuisine => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`cuisine-${cuisine}`}
                      checked={profile.indianCuisines.includes(cuisine)}
                      onCheckedChange={() => setProfile(prev => ({ 
                        ...prev, 
                        indianCuisines: toggleCheckboxValue(prev.indianCuisines, cuisine)
                      }))}
                    />
                    <Label htmlFor={`cuisine-${cuisine}`}>{cuisine}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Favorite Festivals</Label>
              <div className="grid grid-cols-3 gap-2">
                {indianFestivalOptions.map(festival => (
                  <div key={festival} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`festival-${festival}`}
                      checked={profile.favoriteFestivals.includes(festival)}
                      onCheckedChange={() => setProfile(prev => ({ 
                        ...prev, 
                        favoriteFestivals: toggleCheckboxValue(prev.favoriteFestivals, festival)
                      }))}
                    />
                    <Label htmlFor={`festival-${festival}`}>{festival}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Traditional Clothing Preferences</Label>
              <div className="grid grid-cols-3 gap-2">
                {profile.gender === 'male' && traditionalClothingOptions.male.map(clothing => (
                  <div key={clothing} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`clothing-${clothing}`}
                      checked={profile.traditionalClothing.includes(clothing)}
                      onCheckedChange={() => setProfile(prev => ({ 
                        ...prev, 
                        traditionalClothing: toggleCheckboxValue(prev.traditionalClothing, clothing)
                      }))}
                    />
                    <Label htmlFor={`clothing-${clothing}`}>{clothing}</Label>
                  </div>
                ))}
                {profile.gender === 'female' && traditionalClothingOptions.female.map(clothing => (
                  <div key={clothing} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`clothing-${clothing}`}
                      checked={profile.traditionalClothing.includes(clothing)}
                      onCheckedChange={() => setProfile(prev => ({ 
                        ...prev, 
                        traditionalClothing: toggleCheckboxValue(prev.traditionalClothing, clothing)
                      }))}
                    />
                    <Label htmlFor={`clothing-${clothing}`}>{clothing}</Label>
                  </div>
                ))}
                {profile.gender !== 'male' && profile.gender !== 'female' && (
                  <p className="col-span-3 text-gray-500">Please select your gender in Step 1 to see clothing options</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 5: Wishlist */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Wishlist Items</Label>
              <p className="text-sm text-gray-500">
                Add items you'd love to receive as gifts
              </p>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newWishlistItem}
                  onChange={e => setNewWishlistItem(e.target.value)}
                  placeholder="Add wishlist item..."
                  onKeyDown={e => e.key === 'Enter' && handleAddWishlistItem()}
                />
                <Button type="button" onClick={handleAddWishlistItem} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 mt-4">
                {profile.wishlist.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                    <span>{item}</span>
                    <button 
                      onClick={() => handleRemoveWishlistItem(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {profile.wishlist.length === 0 && (
                  <p className="text-center text-gray-400 py-6">Your wishlist is empty</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          Back
        </Button>
        
        <Button onClick={handleNext}>
          {step === totalSteps ? "Save Profile" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSurvey; 
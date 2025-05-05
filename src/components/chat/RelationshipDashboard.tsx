import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function RelationshipDashboard({ messages }: { messages: any[] }) {
  const { user, partner } = useStore();
  const [analysis, setAnalysis] = useState({
    userInterest: 0,
    partnerInterest: 0,
    userMsgCount: 0,
    partnerMsgCount: 0,
    userAvgLength: 0,
    partnerAvgLength: 0,
    relationshipType: "Balanced",
    moodAnalysis: "Positive",
    userEmojis: 0,
    partnerEmojis: 0
  });

  // Analyze the conversation
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const userMessages = messages.filter(msg => msg.sender === "me");
    const partnerMessages = messages.filter(msg => msg.sender === "partner");
    
    // Message counts
    const userMsgCount = userMessages.length;
    const partnerMsgCount = partnerMessages.length;
    
    // Average message lengths
    const userTotalLength = userMessages.reduce((sum, msg) => sum + msg.text.length, 0);
    const partnerTotalLength = partnerMessages.reduce((sum, msg) => sum + msg.text.length, 0);
    const userAvgLength = userMsgCount > 0 ? Math.round(userTotalLength / userMsgCount) : 0;
    const partnerAvgLength = partnerMsgCount > 0 ? Math.round(partnerTotalLength / partnerMsgCount) : 0;
    
    // Calculate emoji counts (simple approach: count characters like 😊, ❤️, etc.)
    const countEmojis = (text: string) => {
      const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}❤]/gu;
      const matches = text.match(emojiRegex);
      return matches ? matches.length : 0;
    };
    
    const userEmojis = userMessages.reduce((sum, msg) => sum + countEmojis(msg.text), 0);
    const partnerEmojis = partnerMessages.reduce((sum, msg) => sum + countEmojis(msg.text), 0);
    
    // Interest score (based on message length, frequency, and emoji usage)
    const userInterest = userMsgCount > 0 
      ? Math.min(100, Math.round((userAvgLength * 0.7 + (userEmojis / userMsgCount) * 30)))
      : 0;
    const partnerInterest = partnerMsgCount > 0 
      ? Math.min(100, Math.round((partnerAvgLength * 0.7 + (partnerEmojis / partnerMsgCount) * 30)))
      : 0;
    
    // Determine relationship type based on message patterns
    let relationshipType = "Balanced";
    const msgRatio = userMsgCount / (partnerMsgCount || 1);
    const lengthRatio = userAvgLength / (partnerAvgLength || 1);
    
    if (msgRatio > 1.5 && lengthRatio > 1.2) {
      relationshipType = "You seem more engaged";
    } else if (msgRatio < 0.7 && lengthRatio < 0.8) {
      relationshipType = "Partner seems more engaged";
    } else if (userEmojis > partnerEmojis * 2) {
      relationshipType = "You're more expressive";
    } else if (partnerEmojis > userEmojis * 2) {
      relationshipType = "Partner is more expressive";
    }
    
    // Check for angry tone (very simplified approach)
    const angryWords = ['angry', 'mad', 'upset', 'annoyed', 'frustrated', '😠', '😡', '🤬'];
    const hasAngryTone = (text: string) => {
      return angryWords.some(word => text.toLowerCase().includes(word));
    };
    
    const userAngryMessages = userMessages.filter(msg => hasAngryTone(msg.text)).length;
    const partnerAngryMessages = partnerMessages.filter(msg => hasAngryTone(msg.text)).length;
    
    let moodAnalysis = "Positive";
    const totalMessages = userMsgCount + partnerMsgCount;
    const angryPercentage = ((userAngryMessages + partnerAngryMessages) / totalMessages) * 100;
    
    if (angryPercentage > 20) {
      moodAnalysis = "Tense";
    } else if (angryPercentage > 10) {
      moodAnalysis = "Slightly tense";
    } else if (userEmojis + partnerEmojis > totalMessages * 0.5) {
      moodAnalysis = "Very positive";
    }
    
    setAnalysis({
      userInterest,
      partnerInterest,
      userMsgCount,
      partnerMsgCount,
      userAvgLength,
      partnerAvgLength,
      relationshipType,
      moodAnalysis,
      userEmojis,
      partnerEmojis
    });
  }, [messages]);

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Relationship Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interest">Interest</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Relationship Type:</div>
                <div className="text-sm font-semibold bg-amber-100 px-2 py-1 rounded-full">
                  {analysis.relationshipType}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Mood Analysis:</div>
                <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  analysis.moodAnalysis === "Positive" ? "bg-green-100 text-green-800" :
                  analysis.moodAnalysis === "Very positive" ? "bg-emerald-100 text-emerald-800" :
                  analysis.moodAnalysis === "Slightly tense" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {analysis.moodAnalysis}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Message Exchange:</div>
                <div className="bg-gray-100 p-2 rounded-md text-sm">
                  {analysis.userMsgCount > analysis.partnerMsgCount * 1.5 
                    ? "You're sending significantly more messages" 
                    : analysis.partnerMsgCount > analysis.userMsgCount * 1.5
                    ? "Your partner is sending significantly more messages"
                    : "You have a balanced conversation flow"}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="interest">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <Avatar className="h-10 w-10 mb-1">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback>{user?.name?.charAt(0) || "Y"}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs font-medium">{user?.name || "You"}</div>
                </div>
                
                <div className="flex-1 mx-2">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ width: `${analysis.userInterest}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 text-center">{analysis.userInterest}% interest</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <Avatar className="h-10 w-10 mb-1">
                    <AvatarImage src={partner?.avatar || ""} />
                    <AvatarFallback>{partner?.name?.charAt(0) || "P"}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs font-medium">{partner?.name || "Partner"}</div>
                </div>
                
                <div className="flex-1 mx-2">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${analysis.partnerInterest}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 text-center">{analysis.partnerInterest}% interest</div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Interest score is calculated based on message length, frequency, and emoji usage
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-red-50 p-2 rounded-md">
                <div className="text-xs font-medium text-gray-500">Your messages</div>
                <div className="text-lg font-bold">{analysis.userMsgCount}</div>
              </div>
              
              <div className="bg-blue-50 p-2 rounded-md">
                <div className="text-xs font-medium text-gray-500">Partner messages</div>
                <div className="text-lg font-bold">{analysis.partnerMsgCount}</div>
              </div>
              
              <div className="bg-red-50 p-2 rounded-md">
                <div className="text-xs font-medium text-gray-500">Your avg length</div>
                <div className="text-lg font-bold">{analysis.userAvgLength}</div>
              </div>
              
              <div className="bg-blue-50 p-2 rounded-md">
                <div className="text-xs font-medium text-gray-500">Partner avg length</div>
                <div className="text-lg font-bold">{analysis.partnerAvgLength}</div>
              </div>
              
              <div className="bg-red-50 p-2 rounded-md">
                <div className="text-xs font-medium text-gray-500">Your emojis</div>
                <div className="text-lg font-bold">{analysis.userEmojis}</div>
              </div>
              
              <div className="bg-blue-50 p-2 rounded-md">
                <div className="text-xs font-medium text-gray-500">Partner emojis</div>
                <div className="text-lg font-bold">{analysis.partnerEmojis}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 
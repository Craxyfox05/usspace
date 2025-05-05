"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Simple mode questions
const truthsSimple = [
  "What was your first impression of your partner?",
  "What's your most romantic memory together?",
  "What's something silly you love about your partner?",
  "What's your favorite physical feature of your partner?",
  "What's your favorite activity to do together?",
  "What was the best gift your partner ever gave you?",
  "What's a song that reminds you of your partner?",
  "What was your most embarrassing moment in front of your partner?",
  "What's something your partner does that always makes you smile?",
  "If you could relive one day with your partner, which would it be?",
  "What's your favorite date we've been on?",
  "When did you realize you had feelings for me?",
  "What's the first thing you noticed about me?",
  "What do you appreciate most about our relationship?",
  "What's your favorite picture of us together and why?"
];

const daresSimple = [
  "Send a cute selfie to your partner right now!",
  "Write a love note and read it aloud.",
  "Give your partner a compliment about something specific you admire.",
  "Do your best impression of your partner!",
  "Share a song that reminds you of your partner and explain why.",
  "Give your partner a hug for at least 30 seconds.",
  "Call your partner and tell them something you appreciate about them.",
  "Draw a portrait of your partner in 60 seconds and show it.",
  "Do a dance move that reminds you of your partner.",
  "Tell your partner about a memory that always makes you smile.",
  "Send your partner's favorite emoji 10 times in a row.",
  "Text your partner a photo of something that made you think of them today.",
  "Record yourself singing the chorus of 'your song'.",
  "Write down 3 things you're grateful for about your relationship.",
  "Find something in your house that represents your relationship and explain why."
];

// Hard mode questions
const truthsHard = [
  "What's a secret you've never told your partner?",
  "What's one thing you wish you could change about our relationship?",
  "Have you ever kept a secret from me? What was it?",
  "What's something about your past that you haven't shared yet?",
  "What's the most challenging thing about being in this relationship?",
  "What's a recurring thought you have about our relationship?",
  "What's something about me that sometimes frustrates you?",
  "What's a relationship fear that you struggle with?",
  "Have you ever had doubts about our relationship? When and why?",
  "What's one thing I do that you wish I would do differently?",
  "What's the hardest truth you've had to accept about me?",
  "What's one thing you compromised on that you sometimes regret?",
  "What's something you're still learning to accept about me?",
  "What's a boundary you've been afraid to set in our relationship?",
  "What's a conversation you've been avoiding having with me?"
];

const daresHard = [
  "Show the last 5 people you texted and what the messages were about.",
  "Show your partner the last 5 searches in your browser history.",
  "Let your partner post anything they want on your social media.",
  "Call a family member and tell them how much your partner means to you.",
  "Do 20 push-ups right now or forfeit the game.",
  "Let your partner choose your profile picture for the next week.",
  "Send a voice message telling your partner your most embarrassing memory.",
  "Text your partner's parents a compliment about your partner.",
  "Wear an outfit your partner chooses for your next outing.",
  "Delete the social media app you use most for 24 hours.",
  "Let your partner go through your phone for 2 minutes.",
  "Write a poem about your relationship in 3 minutes and read it aloud.",
  "Send your partner a photo from your awkward phase.",
  "Call your partner and leave a message expressing your feelings.",
  "Do an impression of how you think your partner sees you."
];

// Naughty mode questions
const truthsNaughty = [
  "What's something you find attractive that I don't know about?",
  "What's your favorite physical feature of mine?",
  "What's something you'd like to try with me that we haven't done yet?",
  "Where's the most adventurous place you'd like to kiss me?",
  "What's something I do that makes your heart race?",
  "What's a dream you've had about me that you haven't shared?",
  "What's the most attractive thing I've ever done without realizing it?",
  "What's something you've been too shy to tell me you enjoy?",
  "What do I wear that you find most attractive?",
  "If we could go anywhere for a romantic getaway, where would it be and why?",
  "What's a romantic scene from a movie you'd like to recreate with me?",
  "What's the most memorable moment we've shared together?",
  "When did you feel most connected to me?",
  "What's a compliment you've always wanted to give me but haven't?",
  "What's something that always makes you think of me?"
];

const daresNaughty = [
  "Send your partner a flirty text right now.",
  "Write down three things you find attractive about your partner.",
  "Plan a surprise date for your partner and describe it in detail.",
  "Give your partner a hand massage for 3 minutes.",
  "Whisper something sweet in your partner's ear.",
  "Show your partner which photo of them is your favorite and why.",
  "Feed your partner their favorite snack.",
  "Send your partner a voice message telling them what you love about them.",
  "Write a short romantic story starring you and your partner.",
  "Create a special nickname for your partner and use it for the rest of the day.",
  "Make a playlist of 5 songs that remind you of moments in your relationship.",
  "Draw a heart on your partner's hand and kiss it.",
  "Plan a perfect day together from morning to night.",
  "Tell your partner about a moment when you felt completely in love with them.",
  "Describe your partner in three words and explain your choices."
];

// Romantic mode questions (replacing Sex mode)
const truthsRomantic = [
  "What's a romantic fantasy you'd like to experience with me?",
  "What's the most intimate non-physical moment we've shared?",
  "What's something that would make you feel more connected to me?",
  "What's a romantic gesture you'd appreciate that I haven't done?",
  "What's something that instantly creates a romantic mood for you?",
  "What's your idea of perfect physical affection?",
  "What's a romantic tradition you'd like to start together?",
  "What makes you feel most loved and appreciated?",
  "What's something I do that makes you feel close to me?",
  "What's a way I could show my affection that would mean a lot to you?",
  "What's your favorite way to be shown love and affection?",
  "What's something we could do to deepen our emotional connection?",
  "What's a romantic surprise that would make your day?",
  "What's something I've done that made you feel deeply connected to me?",
  "What's a small gesture that means the world to you when I do it?"
];

const daresRomantic = [
  "Write a love letter to your partner expressing your feelings.",
  "Create a list of 10 reasons why you cherish your partner.",
  "Give your partner a gentle massage for 5 minutes.",
  "Plan a surprise date night and explain the details.",
  "Record yourself reciting a love poem for your partner.",
  "Recreate your first date or a special moment in your relationship.",
  "Cook or order your partner's favorite meal and set up a romantic dinner.",
  "Create a short video montage of your favorite memories together.",
  "Leave sweet notes for your partner to find throughout the day.",
  "Slow dance with your partner to a romantic song.",
  "Describe your perfect romantic evening together from start to finish.",
  "Create a relationship bucket list with things you want to experience together.",
  "Plan a surprise weekend getaway and share the details.",
  "Create a custom playlist of songs that tell your relationship story.",
  "Write and perform a song or poem about your relationship."
];

type ModeType = "simple" | "hard" | "naughty" | "romantic";
type ChallengeType = "truth" | "dare";

interface ChatMessage {
  id: string;
  sender: 'user' | 'partner' | 'system';
  text: string;
  time: string;
  isAnswer?: boolean;
}

export default function TruthOrDareGame() {
  const { user, partner } = useStore();
  const [challengeType, setChallengeType] = useState<ChallengeType>("truth");
  const [mode, setMode] = useState<ModeType>("simple");
  const [idx, setIdx] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [turn, setTurn] = useState<'user' | 'partner'>('user');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Generate a session ID on component mount
  useEffect(() => {
    const newSessionId = Math.random().toString(36).substring(2, 9);
    setSessionId(newSessionId);
    
    // Simulate partner coming online after a delay
    const timer = setTimeout(() => {
      setPartnerOnline(true);
      setIsOnline(true);
      addSystemMessage(`${partner?.name || "Partner"} has joined the game.`);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [partner?.name]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Get the appropriate question list based on mode and challenge type
  const getQuestions = () => {
    switch (mode) {
      case "simple":
        return challengeType === "truth" ? truthsSimple : daresSimple;
      case "hard":
        return challengeType === "truth" ? truthsHard : daresHard;
      case "naughty":
        return challengeType === "truth" ? truthsNaughty : daresNaughty;
      case "romantic":
        return challengeType === "truth" ? truthsRomantic : daresRomantic;
      default:
        return challengeType === "truth" ? truthsSimple : daresSimple;
    }
  };

  const handleNext = () => {
    const questions = getQuestions();
    const randomIndex = Math.floor(Math.random() * questions.length);
    setIdx(randomIndex);
    
    // Add the new question as a system message
    addSystemMessage(`New ${challengeType}: ${questions[randomIndex]}`);
    
    // Determine who goes first (alternate turns)
    setTurn(turn === 'user' ? 'partner' : 'user');
  };

  // Add a message to the chat
  const addMessage = (text: string, isAnswer: boolean = false) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAnswer: isAnswer
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    
    // If this was an answer, simulate partner's turn after a delay
    if (isAnswer) {
      setTurn('partner');
      simulatePartnerAnswer();
    }
  };

  // Add a system message to the chat
  const addSystemMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'system',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, newMessage]);
  };

  // Submit a chat message
  const submitMessage = () => {
    if (!inputMessage.trim()) return;
    
    // If it's the user's turn to answer
    if (turn === 'user') {
      addMessage(inputMessage, true);
    } else {
      // Regular chat message
      addMessage(inputMessage);
    }
  };

  // Submit an answer (when answering directly via the answer button)
  const submitAnswer = () => {
    if (!inputMessage.trim()) {
      toast.error("Please type your answer first");
      return;
    }
    
    if (turn !== 'user') {
      toast.error("It's not your turn to answer");
      return;
    }
    
    addMessage(inputMessage, true);
  };

  // Simulate partner's answer
  const simulatePartnerAnswer = () => {
    const delay = 2000 + Math.random() * 3000; // 2-5 seconds
    
    setTimeout(() => {
      const partnerResponses = [
        "I'd have to say yes, definitely.",
        "That's a tough one, but I think no.",
        "I've never really thought about it before...",
        "100% yes!",
        "I'd rather not answer that one 😳",
        "Yes, but don't tell anyone else!",
        "No way, that's not my thing.",
        "Maybe someday, but not right now.",
        "I've actually done that before!",
        "I've been wanting to try that for a long time.",
      ];
      
      const randomResponse = partnerResponses[Math.floor(Math.random() * partnerResponses.length)];
      
      const newMessage: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'partner',
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAnswer: true
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setTurn('user');
    }, delay);
  };

  // Color mapping for modes
  const getModeColor = () => {
    switch (mode) {
      case "simple": return "bg-blue-50";
      case "hard": return "bg-orange-50";
      case "naughty": return "bg-purple-50";
      case "romantic": return "bg-pink-50";
      default: return "bg-blue-50";
    }
  };

  // Emoji mapping for modes
  const getModeEmoji = () => {
    switch (mode) {
      case "simple": return "😊";
      case "hard": return "😰";
      case "naughty": return "😏";
      case "romantic": return "❤️";
      default: return "😊";
    }
  };

  return (
    <PageLayout>
      <div className="container max-w-6xl py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Truth or Dare</h1>
          <p className="text-gray-600">Choose your challenge type and mode, then have fun with your partner!</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Game Card */}
          <div className="w-full md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <span className="mr-2">{getModeEmoji()}</span>
                  Truth or Dare Game
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Mode selection */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-center">Select Mode:</h3>
                  <Tabs 
                    defaultValue="simple" 
                    className="w-full" 
                    value={mode} 
                    onValueChange={(value) => setMode(value as ModeType)}
                  >
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="simple" className="text-sm">Simple</TabsTrigger>
                      <TabsTrigger value="hard" className="text-sm">Hard</TabsTrigger>
                      <TabsTrigger value="naughty" className="text-sm">Naughty</TabsTrigger>
                      <TabsTrigger value="romantic" className="text-sm">Romantic</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Truth or Dare buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    className={`px-6 py-2 ${challengeType === "truth" ? "bg-red-500 hover:bg-red-600" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                    onClick={() => setChallengeType("truth")}
                  >
                    Truth
                  </Button>
                  <Button
                    className={`px-6 py-2 ${challengeType === "dare" ? "bg-red-500 hover:bg-red-600" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                    onClick={() => setChallengeType("dare")}
                  >
                    Dare
                  </Button>
                </div>
                
                {/* Challenge display */}
                <div className={`p-6 rounded-lg ${getModeColor()} text-center`}>
                  <div className="text-xl mb-2 font-bold">
                    {challengeType === "truth" ? "Truth" : "Dare"}
                  </div>
                  <div className="text-lg font-medium mb-4 min-h-[4rem]">
                    {getQuestions()[idx]}
                  </div>
                  <Button onClick={handleNext} className="bg-red-500 hover:bg-red-600">
                    Next Challenge
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  {mode === "simple" && "Fun, light-hearted questions to know each other better"}
                  {mode === "hard" && "More challenging and personal questions"}
                  {mode === "naughty" && "Flirty and suggestive challenges for couples"}
                  {mode === "romantic" && "Intimate and affectionate questions to deepen your connection"}
                </div>
                
                {/* Turn indicator */}
                <div className="flex justify-center">
                  <div className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                    {turn === 'user' 
                      ? "Your turn to answer!" 
                      : `Waiting for ${partner?.name || "partner"} to answer...`}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center">
                <Button variant="outline" asChild>
                  <Link href="/games">Back to Games</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="w-full md:w-1/3">
            <Card className="h-full flex flex-col">
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Live Chat</span>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    Session: {sessionId}
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-hidden p-0">
                {/* Online status */}
                <div className="px-4 py-2 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name?.charAt(0) || "Y"}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </div>
                    <span className="text-xs">{user?.name || "You"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{partner?.name || "Partner"}</span>
                    <div className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={partner?.avatar} />
                        <AvatarFallback>{partner?.name?.charAt(0) || "P"}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${partnerOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </div>
                  </div>
                </div>
                
                {/* Messages area */}
                <div className="h-[400px] overflow-y-auto p-4 flex flex-col gap-3">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-8">
                      Messages will appear here. Start the game to chat with your partner!
                    </div>
                  )}
                  
                  {chatMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : message.sender === 'system' ? 'justify-center' : 'justify-start'}`}
                    >
                      {message.sender === 'system' ? (
                        <div className="bg-gray-100 text-gray-600 text-xs rounded-lg px-3 py-2 max-w-[90%]">
                          {message.text}
                        </div>
                      ) : (
                        <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          <div 
                            className={`rounded-lg px-3 py-2 max-w-[220px] break-words ${
                              message.sender === 'user' 
                                ? message.isAnswer ? 'bg-red-100' : 'bg-blue-100' 
                                : message.isAnswer ? 'bg-red-100' : 'bg-gray-100'
                            } ${message.isAnswer ? 'font-medium' : ''}`}
                          >
                            {message.isAnswer && (
                              <div className="text-xs text-gray-500 mb-1">
                                Answer:
                              </div>
                            )}
                            {message.text}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {message.sender === 'user' ? 'You' : partner?.name || 'Partner'} • {message.time}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className="border-t p-3">
                {/* Quick answer button for current turn */}
                {turn === 'user' && (
                  <div className="flex justify-center w-full mb-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs bg-red-50 border-red-200 text-red-600 w-full"
                      onClick={submitAnswer}
                    >
                      Submit as Answer
                    </Button>
                  </div>
                )}
                
                <div className="flex gap-2 w-full">
                  <Input
                    placeholder={turn === 'user' ? "Type your answer..." : "Type a message..."}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitMessage()}
                    className="flex-grow"
                  />
                  <Button onClick={submitMessage} size="sm">
                    Send
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
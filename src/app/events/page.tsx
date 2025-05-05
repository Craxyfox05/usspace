"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { useStore, type Event } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, isSameDay, differenceInDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, parse, addMonths, subMonths } from "date-fns";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Demo events
const demoEvents = [
  {
    id: "evt1",
    title: "Our Anniversary",
    date: new Date("2024-06-15"),
    type: "anniversary" as const,
    description: "The day we became official!",
  },
  {
    id: "evt2",
    title: "Alex's Birthday",
    date: new Date("2024-08-22"),
    type: "birthday" as const,
    description: "Don't forget to get a gift!",
  },
  {
    id: "evt3",
    title: "Weekend Trip",
    date: new Date("2024-05-10"),
    type: "custom" as const,
    description: "Romantic getaway to the beach",
  },
];

const doodles = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    className: "absolute top-0 left-0 w-24 opacity-10 -z-10 rounded-full"
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
    className: "absolute top-10 right-0 w-20 opacity-10 -z-10 rounded-full"
  },
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
    className: "absolute bottom-0 left-10 w-24 opacity-10 -z-10 rounded-full"
  },
  {
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=200&q=80",
    className: "absolute bottom-5 right-5 w-20 opacity-10 -z-10 rounded-full"
  }
];

const eventTypes = [
  { value: "anniversary", label: "Anniversary" },
  { value: "birthday", label: "Birthday" },
  { value: "first-date", label: "First Date" },
  { value: "first-text", label: "First Text" },
  { value: "custom", label: "Other" },
];

export default function EventsPage() {
  const router = useRouter();
  const { isAuthenticated, events, addEvent } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [displayEvents, setDisplayEvents] = useState(demoEvents);
  const [selectedEvents, setSelectedEvents] = useState<typeof demoEvents>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event> & {reminder?: boolean, formDate: string}>({
    title: "",
    formDate: format(new Date(), "yyyy-MM-dd"),
    type: "anniversary",
    description: "",
    reminder: false,
  });
  const [notification, setNotification] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Set initial events from store or demo data
  useEffect(() => {
    if (events && events.length > 0) {
      setDisplayEvents([...events] as typeof demoEvents);
    }
  }, [events]);

  // Get selected day's events
  useEffect(() => {
    if (selectedDate) {
      const eventsOnDate = displayEvents.filter((event) =>
        isSameDay(new Date(event.date), selectedDate)
      );
      setSelectedEvents(eventsOnDate);
    }
  }, [selectedDate, displayEvents]);

  // Notification logic
  useEffect(() => {
    if (!events) return;
    const today = new Date();
    for (const event of events) {
      const days = differenceInDays(new Date(event.date), today);
      if (days > 0 && days <= 7) {
        setNotification(`${days} days until your ${event.title} ${event.type === "anniversary" ? "🎉" : event.type === "birthday" ? "🎂" : "💖"}`);
        break;
      }
    }
  }, [events]);

  if (!isAuthenticated) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const handleTypeChange = (value: string) => {
    setNewEvent({
      ...newEvent,
      type: value as Event['type'],
    });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert the string date to a Date object
      const eventDate = parse(newEvent.formDate, 'yyyy-MM-dd', new Date());
      
      addEvent({
        ...newEvent,
        date: eventDate,
        reminderEnabled: newEvent.reminder,
      } as Event);
      
      toast.success("Event added successfully!");
      
      setNewEvent({
        title: "",
        formDate: format(new Date(), "yyyy-MM-dd"),
        type: "anniversary",
        description: "",
        reminder: false,
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event");
    }
  };

  // Calendar date renderer with custom styling for dates with events
  const renderDateCell = (date: Date) => {
    const hasEvent = displayEvents.some((event) => isSameDay(new Date(event.date), date));
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    
    const classes = [
      "relative w-full h-full flex items-center justify-center rounded-full transition-colors",
      isSelected ? "bg-rose-500 text-white hover:bg-rose-600" : 
        hasEvent ? "bg-rose-100 hover:bg-rose-200" : 
        "hover:bg-gray-100"
    ].join(" ");
    
    return (
      <div className={classes}>
        {date.getDate()}
        {hasEvent && !isSelected && (
          <div className="absolute bottom-0.5 w-1 h-1 bg-rose-500 rounded-full" />
        )}
      </div>
    );
  };

  // Get event icon
  const getEventIcon = (type: string) => {
    switch (type) {
      case "birthday":
        return "🎂";
      case "anniversary":
        return "💍";
      case "first-date":
        return "💕";
      case "first-text":
        return "💌";
      default:
        return "🎉";
    }
  };

  return (
    <PageLayout>
      <div className="relative min-h-screen bg-white text-black">
        {/* Doodle Backgrounds */}
        {doodles.map((d, i) => (
          <Image key={i} src={d.src} alt="doodle" width={100} height={100} className={d.className} />
        ))}

        <div className="container max-w-7xl mx-auto py-10 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Our Special Dates
          </h1>

          {/* Notification */}
          {notification && (
            <div className="mb-6 p-3 rounded-lg bg-pink-50 text-pink-700 text-center font-semibold border border-pink-200">
              {notification}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Add Event Form */}
              <Card className="border-pink-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <PlusCircle className="h-5 w-5 mr-2 text-rose-500" />
                    Add a Special Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        placeholder="E.g., Our Anniversary" 
                        value={newEvent.title} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input 
                          id="formDate" 
                          name="formDate" 
                          type="date" 
                          value={newEvent.formDate} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="type">Event Type</Label>
                        <Select 
                          value={newEvent.type as string} 
                          onValueChange={handleTypeChange}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label} {getEventIcon(type.value)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        placeholder="Add some details about this special date..." 
                        value={newEvent.description as string} 
                        onChange={handleInputChange} 
                        className="resize-none h-20"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="reminder" 
                        checked={newEvent.reminder} 
                        onCheckedChange={(checked) => 
                          setNewEvent({ ...newEvent, reminder: !!checked })
                        } 
                      />
                      <label
                        htmlFor="reminder"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Set reminder
                      </label>
                    </div>
                    
                    <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600">
                      Save Date
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Event List with Countdown */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-rose-500" />
                  Upcoming Events
                </h2>
                
                {displayEvents && displayEvents.length > 0 ? (
                  <div className="space-y-3">
                    {displayEvents
                      .slice()
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(event => {
                        const eventDate = new Date(event.date);
                        const days = differenceInDays(eventDate, new Date());
                        const isPast = days < 0;
                        const isToday = days === 0;
                        
                        return (
                          <Card 
                            key={event.id} 
                            className={`border overflow-hidden transition-all ${
                              isToday ? "border-yellow-300 shadow-yellow-100" : 
                              isPast ? "border-gray-200" : "border-pink-200 shadow-sm"
                            }`}
                          >
                            <div className="flex items-stretch">
                              <div className={`w-2 ${
                                isToday ? "bg-yellow-400" : 
                                isPast ? "bg-gray-200" : "bg-rose-400"
                              }`} />
                              
                              <CardContent className="flex-1 p-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                  <div>
                                    <div className="font-semibold text-lg flex items-center">
                                      <span className="mr-2">{getEventIcon(event.type)}</span>
                                      {event.title}
                                    </div>
                                    <div className="text-gray-500 text-sm">{format(eventDate, "MMMM d, yyyy")}</div>
                                    {event.description && (
                                      <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                                    )}
                                  </div>
                                  
                                  <div className={`text-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                    isToday ? "bg-yellow-100 text-yellow-800" : 
                                    isPast ? "bg-gray-100 text-gray-600" : 
                                    days <= 7 ? "bg-rose-100 text-rose-800" : 
                                    "bg-pink-50 text-pink-700"
                                  }`}>
                                    {isToday ? "Today!" : 
                                     isPast ? `${Math.abs(days)} days ago` : 
                                     `In ${days} days`}
                                  </div>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                ) : (
                  <Card className="border-dashed border-2 border-gray-200">
                    <CardContent className="p-6 text-center text-gray-500">
                      <p>No events yet. Add your first special date!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Calendar Card */}
            <div className="lg:sticky lg:top-20 self-start">
              <Card className="border-pink-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 pb-3">
                  <CardTitle className="text-lg">Your Calendar</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="p-0"
                    classNames={{
                      months: "flex flex-col space-y-4",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center px-2 py-4",
                      caption_label: "text-sm font-medium text-gray-700 mx-8",
                      nav: "flex items-center gap-1",
                      nav_button: "p-1 bg-white border border-gray-200 text-gray-700 hover:bg-rose-50 rounded-md",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse",
                      head_row: "grid grid-cols-7 mb-1",
                      head_cell: "text-rose-500 font-medium text-xs uppercase tracking-wider text-center p-2",
                      row: "grid grid-cols-7 mt-2",
                      cell: "text-center py-1 relative hover:bg-rose-50 focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 flex items-center justify-center mx-auto rounded-full font-normal aria-selected:opacity-100",
                      day_selected: "bg-rose-500 text-white hover:bg-rose-600 font-medium",
                      day_today: "bg-rose-100 text-rose-900 font-medium",
                      day_outside: "text-gray-400 opacity-50",
                      day_disabled: "text-gray-400 opacity-50",
                      day_hidden: "invisible"
                    }}
                    components={{
                      IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                      IconRight: () => <ChevronRight className="h-4 w-4" />,
                      Head: () => (
                        <div className="grid grid-cols-7 gap-1 mt-2 mb-2">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
                            <div key={i} className="text-xs font-medium text-rose-500 text-center p-2">
                              {day}
                            </div>
                          ))}
                        </div>
                      )
                    }}
                  />
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-rose-50 to-pink-50 py-2 px-4 text-xs text-rose-700 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                    <span>Event day</span>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Selected Date Events */}
              {selectedEvents.length > 0 && selectedDate && (
                <Card className="mt-4 border-pink-100 shadow-sm">
                  <CardHeader className="pb-2 bg-gradient-to-r from-pink-50 to-rose-50">
                    <CardTitle className="text-sm font-medium">
                      Events on {format(selectedDate, "MMMM d, yyyy")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-2">
                      {selectedEvents.map((event) => (
                        <li key={event.id} className="text-sm flex items-center gap-2 p-2 rounded bg-rose-50/50 border border-rose-100">
                          <span>{getEventIcon(event.type)}</span>
                          <span className="font-medium">{event.title}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Replace existing custom CSS with better spacing */}
      <style jsx global>{`
        /* Reset margins and make the calendar more structured */
        .rdp {
          margin: 0;
        }
        
        .rdp-months {
          padding: 10px;
        }
        
        .rdp-month {
          margin: 0;
          padding: 0;
        }
        
        .rdp-caption {
          padding: 15px 10px;
          margin-bottom: 15px;
          border-bottom: 1px solid #fce7f3;
          position: relative;
          background: linear-gradient(to right, #fdf2f8, #fef3f2);
          border-radius: 8px 8px 0 0;
        }
        
        .rdp-caption_label {
          font-size: 1.05rem;
          font-weight: 600;
          text-align: center;
          width: 100%;
          padding: 0 40px;
          color: #be185d;
        }
        
        .rdp-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 8px;
          pointer-events: none;
        }
        
        .rdp-nav_button {
          width: 32px;
          height: 32px;
          pointer-events: auto;
          position: relative;
          z-index: 10;
          background-color: white;
          border: 1px solid #fecdd3;
          color: #e11d48;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .rdp-nav_button:hover {
          background-color: #fff1f2;
        }
        
        /* Ensure grid layout with proper spacing */
        .rdp-table {
          margin: 0;
        }
        
        .rdp-head_row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 10px;
        }
        
        .rdp-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin: 0;
          gap: 2px;
        }
        
        /* Fix date display */
        .rdp-cell {
          height: auto;
          width: auto;
          padding: 3px;
          text-align: center;
        }
        
        .rdp-day {
          max-width: 36px;
          height: 36px;
          margin: 0 auto;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }
        
        .rdp-day_selected {
          background-color: #f43f5e;
          color: white;
          font-weight: 500;
        }
        
        .rdp-day_today {
          background-color: #fce7f3;
          color: #be123c;
          font-weight: 500;
        }
        
        .rdp-button:hover:not([disabled]) {
          background-color: #fce7f3;
        }
      `}</style>
    </PageLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { useStore, type Event } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, isSameDay, differenceInDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth } from "date-fns";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  { value: "first", label: "First (Text/Kiss/Date)" },
  { value: "other", label: "Other" },
];

export default function EventsPage() {
  const router = useRouter();
  const { isAuthenticated, events, addEvent } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [displayEvents, setDisplayEvents] = useState(demoEvents);
  const [selectedEvents, setSelectedEvents] = useState<typeof demoEvents>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event> & {reminder?: boolean}>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const handleTypeChange = (value: "anniversary" | "birthday" | "custom") => {
    setNewEvent({
      ...newEvent,
      type: value,
    });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      ...newEvent,
      date: new Date(newEvent.date!),
      reminder: newEvent.reminder,
    } as Event);
    setNewEvent({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      type: "anniversary",
      description: "",
      reminder: false,
    });
  };

  // Calendar date renderer
  const renderDateCell = (date: Date) => {
    const hasEvent = displayEvents.some((event) => isSameDay(new Date(event.date), date));

    if (!hasEvent) return null;

    return (
      <div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2" />
    );
  };

  // Get event icon
  const getEventIcon = (type: string) => {
    switch (type) {
      case "birthday":
        return "🎂";
      case "anniversary":
        return "💍";
      default:
        return "🎉";
    }
  };

  // Calendar grid logic
  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <PageLayout>
      <div className="relative min-h-screen bg-white text-black">
        {/* Doodle Backgrounds */}
        {doodles.map((d, i) => (
          <Image key={i} src={d.src} alt="doodle" width={100} height={100} className={d.className} />
        ))}

        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Important Dates</h1>

          {/* Notification */}
          {notification && (
            <div className="mb-6 p-3 rounded-lg bg-pink-50 text-pink-700 text-center font-semibold border border-pink-200">
              {notification}
            </div>
          )}

          {/* Add Event Form */}
          <form onSubmit={handleAddEvent} className="mb-10 p-6 rounded-xl border border-gray-200 bg-white/80 shadow flex flex-col gap-4">
            <div className="font-semibold mb-2">Add a Special Date</div>
            <input type="text" name="title" placeholder="Event Title (e.g. Anniversary)" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="border rounded px-3 py-2" required />
            <input type="date" name="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="border rounded px-3 py-2" required />
            <select name="type" value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} className="border rounded px-3 py-2">
              {eventTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <textarea name="description" placeholder="Description (optional)" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="border rounded px-3 py-2" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={newEvent.reminder} onChange={e => setNewEvent({ ...newEvent, reminder: e.target.checked })} />
              Set Reminder (Email/Push)
            </label>
            <button type="submit" className="bg-pink-500 text-white rounded px-4 py-2 font-semibold hover:bg-pink-600 transition">Save Date</button>
          </form>

          {/* Event List with Countdown */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            {events && events.length > 0 ? (
              <div className="space-y-4">
                {events.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => {
                  const days = differenceInDays(new Date(event.date), new Date());
                  return (
                    <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white/90 border border-gray-100 rounded-lg p-4 shadow-sm">
                      <div>
                        <div className="font-semibold text-lg">{event.title} {event.type === "anniversary" ? "💍" : event.type === "birthday" ? "🎂" : "💖"}</div>
                        <div className="text-gray-500 text-sm">{format(new Date(event.date), "MMMM d, yyyy")}</div>
                        {event.description && <div className="text-gray-600 text-sm italic mt-1">{event.description}</div>}
                      </div>
                      <div className="text-center mt-2 md:mt-0">
                        <div className="text-2xl font-bold text-pink-500">{days > 0 ? `${days} days left` : days === 0 ? "Today!" : "Passed"}</div>
                        {"reminder" in event && event.reminder && <div className="text-xs text-pink-400 mt-1">Reminder set</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">No events yet. Add your special dates!</div>
            )}
          </div>

          {/* Calendar View */}
          <div className="bg-white/80 rounded-xl border border-gray-200 shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => setCalendarMonth(prev => addDays(startOfMonth(prev), -1))} className="text-pink-500 font-bold text-xl">&#8592;</button>
              <div className="font-semibold text-lg">{format(calendarMonth, "MMMM yyyy")}</div>
              <button onClick={() => setCalendarMonth(prev => addDays(endOfMonth(prev), 1))} className="text-pink-500 font-bold text-xl">&#8594;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-gray-500 mb-2">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((d, i) => {
                const isEvent = events && events.some(ev => isSameDay(new Date(ev.date), d));
                return (
                  <div key={i} className={`h-12 flex items-center justify-center rounded-lg border ${isSameMonth(d, calendarMonth) ? "bg-white" : "bg-gray-50"} ${isEvent ? "border-pink-400 bg-pink-50 font-bold text-pink-600" : "border-gray-200"}`}>
                    {format(d, "d")}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

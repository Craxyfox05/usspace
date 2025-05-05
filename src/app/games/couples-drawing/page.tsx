"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const colors = ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff", "#ff9900"];
const brushSizes = [2, 5, 10, 15, 20];

export default function CouplesDrawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentSize, setCurrentSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingComplete, setDrawingComplete] = useState(false);
  const [drawingDataUrl, setDrawingDataUrl] = useState<string | null>(null);
  const { user, partner, addGameResult } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set initial canvas background to white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get position
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get position
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get data URL for the drawing
    const dataUrl = canvas.toDataURL('image/png');
    setDrawingDataUrl(dataUrl);
    setDrawingComplete(true);

    // In a real app, you would save this to your backend
    toast.success("Drawing saved successfully!");
    
    // Record as a tie game (both partners win in this collaborative activity)
    addGameResult('couples-drawing', 'tie');
  };

  return (
    <PageLayout>
      <div className="container max-w-4xl py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Couple's Drawing</h1>
          <p className="text-gray-600">Create art together on a shared canvas!</p>
        </div>

        {!drawingComplete ? (
          <Card>
            <CardHeader>
              <CardTitle>Drawing Canvas</CardTitle>
              <CardDescription>
                Express your creativity together! Take turns drawing or work on different parts simultaneously.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border ${currentColor === color ? 'border-black border-2' : 'border-gray-300'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setCurrentColor(color)}
                  />
                ))}
              </div>

              <div className="mb-4 flex gap-2">
                {brushSizes.map(size => (
                  <button
                    key={size}
                    className={`flex items-center justify-center rounded-full ${currentSize === size ? 'bg-gray-200' : 'bg-white'} border border-gray-300 w-10 h-10`}
                    onClick={() => setCurrentSize(size)}
                  >
                    <div
                      className="rounded-full bg-black"
                      style={{ width: size, height: size }}
                    />
                  </button>
                ))}
              </div>

              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-80 md:h-96 touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={endDrawing}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={clearCanvas}>
                Clear Canvas
              </Button>
              <Button onClick={saveDrawing}>
                Save Drawing
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Masterpiece</CardTitle>
              <CardDescription>
                Here's the artwork you created together!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {drawingDataUrl && (
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <img 
                    src={drawingDataUrl} 
                    alt="Your couple's drawing" 
                    className="w-full h-auto"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setDrawingComplete(false)}>
                Draw Something New
              </Button>
              <Button asChild>
                <Link href="/games">
                  Back to Games
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </PageLayout>
  );
} 
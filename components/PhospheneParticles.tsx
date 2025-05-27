"use client";
import { useEffect, useRef } from "react";

const PhospheneParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 10 + Math.random() * 20,
      dx: -0.5 + Math.random(),
      dy: -0.5 + Math.random(),
      opacity: 0.1 + Math.random() * 0.3
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(173,216,230,${p.opacity})`); // azul claro
        gradient.addColorStop(1, `rgb(0, 191, 255)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
      }
      requestAnimationFrame(draw);
    };

    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default PhospheneParticles;

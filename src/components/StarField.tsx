import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

class StarFieldAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private animationId: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.createStars();
    this.animate();
  }

  resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createStars();
  };

  createStars() {
    const numberOfStars = Math.floor((window.innerWidth * window.innerHeight) / 2000);
    this.stars = Array.from({ length: numberOfStars }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random(),
    }));
  }

  updateStar(star: Star) {
    star.x += star.speedX;
    star.y += star.speedY;

    // Wrap around screen
    if (star.x < 0) star.x = window.innerWidth;
    if (star.x > window.innerWidth) star.x = 0;
    if (star.y < 0) star.y = window.innerHeight;
    if (star.y > window.innerHeight) star.y = 0;

    // Twinkle effect
    star.opacity = Math.sin(Date.now() * 0.001 + star.x * 0.01 + star.y * 0.01) * 0.4 + 0.6;
    if (star.opacity < 0.2) star.opacity = 0.2;
  }

  drawStar(star: Star) {
    this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  animate = () => {
    // Clear with subtle fading effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.stars.forEach(star => {
      this.updateStar(star);
      this.drawStar(star);
    });

    this.animationId = requestAnimationFrame(this.animate);
  };

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

export const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starFieldRef = useRef<StarFieldAnimation | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      starFieldRef.current = new StarFieldAnimation(canvasRef.current);

      const handleResize = () => {
        if (starFieldRef.current) {
          starFieldRef.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (starFieldRef.current) {
          starFieldRef.current.destroy();
        }
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 -z-10 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
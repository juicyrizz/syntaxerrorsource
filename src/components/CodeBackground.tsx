import React, { useEffect, useRef } from 'react';

interface CodeParticle {
  x: number;
  y: number;
  char: string;
  opacity: number;
  speed: number;
  color: string;
  size: number;
}

class CodeBackgroundAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: CodeParticle[] = [];
  private animationId: number = 0;
  private codeChars = ['0', '1', '{', '}', '(', ')', ';', '<', '>', '/', '*', '+', '-', '=', '[', ']', '!', '?', '#', '$', '%', '&'];
  private colors = ['#FF6B6B', '#ADF8FF', '#FFD700', '#00FF00', '#FF00FF', '#FFFFFF'];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.createParticles();
    this.animate();
  }

  resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createParticles();
  };

  createParticles() {
    const numberOfParticles = Math.floor((window.innerWidth * window.innerHeight) / 8000);
    this.particles = Array.from({ length: numberOfParticles }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      char: this.codeChars[Math.floor(Math.random() * this.codeChars.length)],
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 2 + 0.5,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      size: Math.random() * 16 + 12
    }));
  }

  updateParticle(particle: CodeParticle) {
    particle.y += particle.speed;
    
    if (particle.y > window.innerHeight + 50) {
      particle.y = -50;
      particle.x = Math.random() * window.innerWidth;
      particle.char = this.codeChars[Math.floor(Math.random() * this.codeChars.length)];
      particle.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    if (Math.random() < 0.002) {
      particle.char = this.codeChars[Math.floor(Math.random() * this.codeChars.length)];
      particle.x += (Math.random() - 0.5) * 20;
    }

    particle.opacity = Math.sin(Date.now() * 0.003 + particle.x * 0.01) * 0.3 + 0.5;
    if (particle.opacity < 0.1) particle.opacity = 0.1;
  }

  drawParticle(particle: CodeParticle) {
    this.ctx.font = `${particle.size}px 'Roboto Mono', monospace`;
    this.ctx.fillStyle = particle.color;
    this.ctx.globalAlpha = particle.opacity;
    
    this.ctx.shadowColor = particle.color;
    this.ctx.shadowBlur = 10;
    
    this.ctx.fillText(particle.char, particle.x, particle.y);
    
    this.ctx.shadowBlur = 0;
  }

  drawGlitchLines() {
    if (Math.random() < 0.01) {
      const y = Math.random() * window.innerHeight;
      const height = Math.random() * 3 + 1;
      
      this.ctx.globalAlpha = 0.3;
      this.ctx.fillStyle = Math.random() < 0.5 ? '#FF6B6B' : '#ADF8FF';
      this.ctx.fillRect(0, y, window.innerWidth, height);
    }
  }

  animate = () => {
    // Clear with fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw glitch lines occasionally
    this.drawGlitchLines();

    // Update and draw particles
    this.particles.forEach(particle => {
      this.updateParticle(particle);
      this.drawParticle(particle);
    });

    this.ctx.globalAlpha = 1;
    this.animationId = requestAnimationFrame(this.animate);
  };

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

export const CodeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<CodeBackgroundAnimation | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      animationRef.current = new CodeBackgroundAnimation(canvasRef.current);

      const handleResize = () => {
        if (animationRef.current) {
          animationRef.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
          animationRef.current.destroy();
        }
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 -z-5 pointer-events-none opacity-30"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
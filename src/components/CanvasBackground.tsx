import React, { useEffect, useRef } from 'react';

interface CanvasBackgroundProps {
  paused?: boolean;
}

const CanvasBackground = ({ paused = false }: CanvasBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // --- Starfield setup ---
    const numStars = 400;
    const stars = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.2 + 0.05,
      opacity: Math.random() * 0.5 + 0.2
    }));

    // --- 3D Wireframe Setup ---
    const numVertices = 150;
    let radius = Math.min(width, height) * 0.4;
    let vertices: { x: number, y: number, z: number }[] = [];
    
    const generateVertices = (r: number) => {
      const v = [];
      const phi = Math.PI * (3 - Math.sqrt(5)); 
      for (let i = 0; i < numVertices; i++) {
        const y = 1 - (i / (numVertices - 1)) * 2; 
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        v.push({ x: x * r, y: y * r, z: z * r });
      }
      return v;
    };

    vertices = generateVertices(radius);

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // --- Draw Stars ---
      stars.forEach(star => {
        if (!pausedRef.current) {
          star.x -= star.speed;
          if (star.x < 0) {
            star.x = width;
            star.y = Math.random() * height;
          }
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Draw Wireframe Sphere ---
      if (!pausedRef.current) {
        angleY += 0.0015;
        angleX += 0.0008;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected = vertices.map(v => {
        // Rotate X
        const y1 = v.y * cosX - v.z * sinX;
        const z1 = v.y * sinX + v.z * cosX;
        // Rotate Y
        const x2 = v.x * cosY + z1 * sinY;
        const z2 = -v.x * sinY + z1 * cosY;

        const scale = 1000 / (1000 + z2);
        return {
          x: centerX + x2 * scale,
          y: centerY + y1 * scale,
          z: z2
        };
      });

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 0.5;
      
      ctx.beginPath();
      const threshold = (radius * 0.45) * (radius * 0.45);
      
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dz = projected[i].z - projected[j].z;
          const distSq = dx*dx + dy*dy + dz*dz;
          
          if (distSq < threshold) {
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
          }
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      radius = Math.min(width, height) * 0.4;
      vertices = generateVertices(radius);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default CanvasBackground;

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ShaderGradientCanvasProps {
  colors?: string[]; // Array of hex strings e.g. ["#FAF7F2", "#F4DCD2", "#D97757", "#6B2D38"]
  speed?: number;
  grainIntensity?: number;
  className?: string;
  interactive?: boolean;
}

export function ShaderGradientCanvas({
  colors = ["#FAF7F2", "#F4DCD2", "#D97757", "#6B2D38"],
  speed = 0.5,
  grainIntensity = 0.045,
  className = "",
  interactive = true,
}: ShaderGradientCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    let animationFrameId: number;
    let isVisible = true;

    // Parse hex colors into THREE.Color
    const c1 = new THREE.Color(colors[0] || "#FAF7F2");
    const c2 = new THREE.Color(colors[1] || "#F4DCD2");
    const c3 = new THREE.Color(colors[2] || "#D97757");
    const c4 = new THREE.Color(colors[3] || "#6B2D38");

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "low-power",
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_color1: { value: c1 },
      u_color2: { value: c2 },
      u_color3: { value: c3 },
      u_color4: { value: c4 },
      u_speed: { value: speed },
      u_grain: { value: grainIntensity },
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform vec3 u_color3;
      uniform vec3 u_color4;
      uniform float u_speed;
      uniform float u_grain;
      varying vec2 vUv;

      // Simplex-like noise helper
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,
                            0.366025403784439,
                           -0.577350269189626,
                            0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Pseudo random for subtle film grain
      float random(vec2 p) {
        return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        float t = u_time * u_speed * 0.18;

        // Interaction subtle warp
        vec2 mouseOffset = (u_mouse - 0.5) * 0.15;
        vec2 coord = uv + mouseOffset * sin(t);

        // Multi-octave wave distortion
        float n1 = snoise(coord * 2.2 + vec2(t * 0.4, -t * 0.3));
        float n2 = snoise(coord * 3.5 - vec2(-t * 0.25, t * 0.45) + vec2(n1 * 0.6));
        float n3 = snoise(coord * 1.4 + vec2(t * 0.15, t * 0.2) - vec2(n2 * 0.4));

        float mix1 = smoothstep(-0.6, 0.8, n1);
        float mix2 = smoothstep(-0.5, 0.7, n2);
        float mix3 = smoothstep(-0.4, 0.9, n3);

        vec3 colorA = mix(u_color1, u_color2, mix1);
        vec3 colorB = mix(u_color3, u_color4, mix2);
        vec3 finalColor = mix(colorA, colorB, mix3 * 0.85);

        // Warm highlight center
        float centerGlow = 1.0 - length(uv - vec2(0.5, 0.45)) * 0.65;
        finalColor += u_color2 * max(0.0, centerGlow * 0.15);

        // Film grain texture
        if (u_grain > 0.0) {
          float grain = (random(uv * u_time) - 0.5) * u_grain;
          finalColor += grain;
        }

        gl_FragColor = vec4(finalColor, 0.92);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.u_resolution.value.set(width, height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      uniforms.u_mouse.value.set(
        Math.max(0, Math.min(1, x)),
        Math.max(0, Math.min(1, y))
      );
    };

    window.addEventListener("resize", handleResize);
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Pause rendering when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Visibility change handler (tab switch)
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible || isPaused) return;

      const delta = clock.getDelta();
      uniforms.u_time.value += delta;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [colors, speed, grainIntensity, interactive, reducedMotion, isPaused]);

  return (
    <div
      ref={containerRef}
      className={`shader-gradient-wrap ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        ...(reducedMotion
          ? {
              background: `radial-gradient(circle at 30% 30%, ${colors[1] || "#F4DCD2"}, transparent 60%),
                           radial-gradient(circle at 75% 70%, ${colors[2] || "#D97757"}44, transparent 55%),
                           ${colors[0] || "#FAF7F2"}`,
            }
          : {}),
      }}
      aria-hidden="true"
    />
  );
}

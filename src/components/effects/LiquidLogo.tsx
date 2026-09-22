"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface LiquidLogoProps {
  text?: string;
  subtext?: string;
  variant?: "chrome" | "gold" | "rosegold";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LiquidLogo({
  text = "MAMA",
  subtext = "ATELIER · PALI",
  variant = "gold",
  size = "md",
  className = "",
}: LiquidLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Dimensions based on size
  const dimensions = {
    sm: { width: 140, height: 42, fontSize: 26, subSize: 9 },
    md: { width: 220, height: 64, fontSize: 40, subSize: 11 },
    lg: { width: 340, height: 96, fontSize: 62, subSize: 14 },
  }[size];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    const width = dimensions.width;
    const height = dimensions.height;

    // 1. Create offscreen canvas for crisp typography mask
    const textCanvas = document.createElement("canvas");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    textCanvas.width = width * dpr;
    textCanvas.height = height * dpr;
    const ctx = textCanvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // Render luxury serif logo
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = `650 ${dimensions.fontSize}px 'Fraunces', Georgia, serif`;
    ctx.letterSpacing = "0.08em";
    ctx.fillText(text, width / 2, height * 0.42);

    if (subtext) {
      ctx.font = `500 ${dimensions.subSize}px 'Outfit', sans-serif`;
      ctx.letterSpacing = "0.22em";
      ctx.fillText(subtext, width / 2, height * 0.78);
    }

    const maskTexture = new THREE.CanvasTexture(textCanvas);
    maskTexture.generateMipmaps = false;
    maskTexture.minFilter = THREE.LinearFilter;

    // 2. Three.js scene for Liquid Chrome / Molten Metal Shader
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Color tones based on variant
    const variantColors = {
      chrome: {
        base: new THREE.Color("#dcdde1"),
        reflection: new THREE.Color("#ffffff"),
        shadow: new THREE.Color("#485460"),
        warmth: new THREE.Color("#f5f6fa"),
      },
      gold: {
        base: new THREE.Color("#dfb56c"),
        reflection: new THREE.Color("#fff2d6"),
        shadow: new THREE.Color("#5e3e19"),
        warmth: new THREE.Color("#d97757"),
      },
      rosegold: {
        base: new THREE.Color("#e5998a"),
        reflection: new THREE.Color("#fff0ed"),
        shadow: new THREE.Color("#562529"),
        warmth: new THREE.Color("#e06b52"),
      },
    }[variant];

    const uniforms = {
      u_time: { value: 0 },
      u_mask: { value: maskTexture },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_hover: { value: 0.0 },
      u_baseColor: { value: variantColors.base },
      u_reflectColor: { value: variantColors.reflection },
      u_shadowColor: { value: variantColors.shadow },
      u_warmthColor: { value: variantColors.warmth },
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
      uniform sampler2D u_mask;
      uniform vec2 u_mouse;
      uniform float u_hover;
      uniform vec3 u_baseColor;
      uniform vec3 u_reflectColor;
      uniform vec3 u_shadowColor;
      uniform vec3 u_warmthColor;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        float maskVal = texture2D(u_mask, uv).r;

        if (maskVal < 0.08) {
          discard;
        }

        // Mouse ripple wave
        float distToMouse = length(uv - u_mouse);
        float mouseWave = sin(distToMouse * 24.0 - u_time * 4.5) * exp(-distToMouse * 4.0) * u_hover;

        // Fluid normal wave computation
        float t = u_time * 0.9;
        float waveX = sin(uv.y * 14.0 + t + mouseWave * 3.0) * 0.025;
        float waveY = cos(uv.x * 12.0 - t * 0.8 + mouseWave * 3.0) * 0.025;

        vec2 sampleUv = uv + vec2(waveX, waveY);

        // Edge detection for bevel & liquid chrome specular
        float step = 0.005;
        float mL = texture2D(u_mask, uv - vec2(step, 0.0)).r;
        float mR = texture2D(u_mask, uv + vec2(step, 0.0)).r;
        float mU = texture2D(u_mask, uv + vec2(0.0, step)).r;
        float mD = texture2D(u_mask, uv - vec2(0.0, step)).r;

        vec3 normal = normalize(vec3((mL - mR) + waveX * 6.0, (mD - mU) + waveY * 6.0, 0.45));

        // Chrome environment lighting simulation (sky + warm horizon + molten gold specular)
        vec3 lightDir = normalize(vec3(0.5, 0.8, 0.8));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfDir = normalize(lightDir + viewDir);

        float diff = max(dot(normal, lightDir), 0.0);
        float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

        // Liquid metal color blending
        vec3 col = mix(u_shadowColor, u_baseColor, diff * 0.7 + 0.3);
        col = mix(col, u_warmthColor, fresnel * 0.6);
        col += u_reflectColor * (spec * 1.35 + fresnel * 0.75);

        // Soft internal metallic shimmer
        float shimmer = sin(uv.x * 20.0 + uv.y * 15.0 + t * 2.5) * 0.08;
        col += shimmer * u_reflectColor;

        gl_FragColor = vec4(col, maskVal);
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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      uniforms.u_mouse.value.set(x, y);
    };

    container.addEventListener("mousemove", handleMouseMove);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    });
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      uniforms.u_time.value += delta;
      uniforms.u_hover.value += ((isHovered ? 1.0 : 0.25) - uniforms.u_hover.value) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      maskTexture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [text, subtext, variant, size, dimensions, isHovered]);

  return (
    <div
      ref={containerRef}
      className={`liquid-logo-wrap ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
      }}
      title={`${text} ${subtext}`}
    />
  );
}

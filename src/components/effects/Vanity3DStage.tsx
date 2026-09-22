"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Vanity3DStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightingMode, setLightingMode] = useState<"studio" | "golden" | "midnight">("studio");
  const [isInteracting, setIsInteracting] = useState(false);

  // References for runtime lighting updates
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    let isVisible = true;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xfff5ee, 1.4);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const pointLight = new THREE.PointLight(0xffdfa8, 2.0, 5);
    pointLight.position.set(0, 0, 1.2);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // Stage Group
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // 1. Marble Vanity Pedestal (Round base)
    const baseGeo = new THREE.CylinderGeometry(1.9, 2.0, 0.22, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xfdfaf6,
      roughness: 0.18,
      metalness: 0.05,
    });
    const pedestal = new THREE.Mesh(baseGeo, baseMat);
    pedestal.position.y = -1.35;
    stageGroup.add(pedestal);

    // Gold pedestal rim
    const rimGeo = new THREE.TorusGeometry(1.95, 0.03, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdfb56c,
      metalness: 0.95,
      roughness: 0.2,
    });
    const rimMesh = new THREE.Mesh(rimGeo, goldMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -1.25;
    stageGroup.add(rimMesh);

    // 2. LUXURY PERFUME BOTTLE (Center-Left)
    const bottleGroup = new THREE.Group();
    bottleGroup.position.set(-0.55, -0.2, 0.1);

    // Glass body
    const perfumeGlassGeo = new THREE.BoxGeometry(0.95, 1.35, 0.55);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 0.4,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      thickness: 0.4,
    });
    const perfumeGlass = new THREE.Mesh(perfumeGlassGeo, glassMat);
    bottleGroup.add(perfumeGlass);

    // Inner amber nectar perfume fluid
    const fluidGeo = new THREE.BoxGeometry(0.82, 1.05, 0.42);
    const fluidMat = new THREE.MeshPhysicalMaterial({
      color: 0xe68a48,
      emissive: 0xd97757,
      emissiveIntensity: 0.25,
      transmission: 0.5,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
    });
    const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
    fluidMesh.position.y = -0.1;
    bottleGroup.add(fluidMesh);

    // Gold Atomizer & Collar
    const atomizerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.35, 24);
    const atomizer = new THREE.Mesh(atomizerGeo, goldMat);
    atomizer.position.y = 0.85;
    bottleGroup.add(atomizer);

    // Crystal Perfume Cap
    const capGeo = new THREE.BoxGeometry(0.48, 0.38, 0.38);
    const cap = new THREE.Mesh(capGeo, glassMat);
    cap.position.y = 1.2;
    bottleGroup.add(cap);

    stageGroup.add(bottleGroup);

    // 3. GOLDEN COMPACT POWDER CASE (Center-Right)
    const compactGroup = new THREE.Group();
    compactGroup.position.set(0.7, -0.65, 0.25);
    compactGroup.rotation.y = -0.45;
    compactGroup.rotation.x = 0.25;

    // Bottom saucer
    const compactBottomGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.12, 36);
    const compactBottom = new THREE.Mesh(compactBottomGeo, goldMat);
    compactGroup.add(compactBottom);

    // Powder cake inside
    const powderGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.08, 36);
    const powderMat = new THREE.MeshStandardMaterial({
      color: 0xf5dfd0,
      roughness: 0.9,
    });
    const powder = new THREE.Mesh(powderGeo, powderMat);
    powder.position.y = 0.05;
    compactGroup.add(powder);

    // Opened Lid with Mirror Reflection
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.06, -0.65);
    lidGroup.rotation.x = -Math.PI * 0.42; // Opened at ~110° angle

    const lidGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.08, 36);
    const lid = new THREE.Mesh(lidGeo, goldMat);
    lidGroup.add(lid);

    const mirrorGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.02, 36);
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.02,
    });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.y = -0.04;
    lidGroup.add(mirror);

    compactGroup.add(lidGroup);
    stageGroup.add(compactGroup);

    // 4. FLOATING GOLD SPARKLE PARTICLES
    const sparklesCount = 24;
    const sparkleGeo = new THREE.SphereGeometry(0.028, 12, 12);
    const sparkleMat = new THREE.MeshStandardMaterial({
      color: 0xffea9f,
      emissive: 0xffbb33,
      emissiveIntensity: 0.8,
    });
    const sparklesGroup = new THREE.Group();
    const sparkleNodes: { mesh: THREE.Mesh; angle: number; radius: number; speed: number; y: number }[] = [];

    for (let i = 0; i < sparklesCount; i++) {
      const sp = new THREE.Mesh(sparkleGeo, sparkleMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.0 + Math.random() * 1.2;
      const y = (Math.random() - 0.5) * 2.2;
      sp.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      sparklesGroup.add(sp);
      sparkleNodes.push({
        mesh: sp,
        angle,
        radius,
        speed: 0.5 + Math.random() * 0.8,
        y,
      });
    }
    stageGroup.add(sparklesGroup);

    // Drag to Orbit Logic
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotY = 0.2;
    let rotX = 0.05;
    let targetRotY = 0.2;
    let targetRotX = 0.05;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetRotY = nx * 0.45;
        targetRotX = ny * 0.15;
        return;
      }
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      targetRotY += dx * 0.012;
      targetRotX += dy * 0.012;
      targetRotX = Math.max(-0.35, Math.min(0.35, targetRotX));
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 500);
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (isVisible = e.isIntersecting));
    });
    observer.observe(container);

    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;

      if (!isDragging) {
        targetRotY += 0.003; // slow auto idle orbit
      }

      stageGroup.rotation.y = rotY;
      stageGroup.rotation.x = rotX;
      stageGroup.position.y = Math.sin(elapsed * 1.4) * 0.05;

      // Animate floating sparkles
      sparkleNodes.forEach((sp, idx) => {
        sp.angle += 0.006 * sp.speed;
        sp.mesh.position.x = Math.cos(sp.angle) * sp.radius;
        sp.mesh.position.z = Math.sin(sp.angle) * sp.radius;
        sp.mesh.position.y = sp.y + Math.sin(elapsed * sp.speed + idx) * 0.15;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update lighting mood dynamically
  const switchLighting = (mode: "studio" | "golden" | "midnight") => {
    setLightingMode(mode);
    if (!keyLightRef.current || !ambientLightRef.current || !pointLightRef.current) return;

    if (mode === "studio") {
      ambientLightRef.current.color.setHex(0xfff5ee);
      ambientLightRef.current.intensity = 1.4;
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 2.5;
      pointLightRef.current.color.setHex(0xffdfa8);
    } else if (mode === "golden") {
      ambientLightRef.current.color.setHex(0xffe8cc);
      ambientLightRef.current.intensity = 1.6;
      keyLightRef.current.color.setHex(0xff9944);
      keyLightRef.current.intensity = 3.2;
      pointLightRef.current.color.setHex(0xff7722);
    } else {
      ambientLightRef.current.color.setHex(0x5a2d3b);
      ambientLightRef.current.intensity = 1.1;
      keyLightRef.current.color.setHex(0xd97757);
      keyLightRef.current.intensity = 2.2;
      pointLightRef.current.color.setHex(0xe85d75);
    }
  };

  return (
    <div className="vanity-3d-card" style={{ position: "relative", width: "100%", height: "100%", minHeight: 460 }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: 460,
          cursor: isInteracting ? "grabbing" : "grab",
          touchAction: "none",
        }}
        title="3D Luxury Cosmetic Vanity - Click & drag to rotate 360°"
      />

      {/* 360 Badge */}
      <div
        className="liquid-glass-badge"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          pointerEvents: "none",
          fontSize: "0.74rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span className="live-pulse" />
        <span>3D Atelier Stage · 360°</span>
      </div>

      {/* Lighting Mood Switcher */}
      <div
        className="liquid-glass-panel-inner"
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          padding: "10px 14px",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <span className="eyebrow" style={{ fontSize: "0.68rem" }}>Interactive Vanity Lighting</span>
          <strong style={{ display: "block", fontSize: "0.88rem" }}>
            {lightingMode === "studio" ? "Atelier High-Glitz Studio" : lightingMode === "golden" ? "Sunset Golden Hour" : "Midnight Velvet Aura"}
          </strong>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "studio", label: "✨ Studio" },
            { id: "golden", label: "🌅 Golden" },
            { id: "midnight", label: "💎 Velvet" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => switchLighting(item.id as any)}
              className={`vanity-mood-btn ${lightingMode === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

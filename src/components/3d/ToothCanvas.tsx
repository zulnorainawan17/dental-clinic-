import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Sparkles, Eye, ShieldCheck } from 'lucide-react';

export const ToothCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<'3d' | 'anatomy'>('3d');
  const [showAnnotations, setShowAnnotations] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 6.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Root Group for rotation and float
    const toothGroup = new THREE.Group();
    scene.add(toothGroup);

    // ==========================================
    // PROCEDURAL ANATOMICAL MOLAR TOOTH GEOMETRY
    // ==========================================
    
    // 1. CROWN GEOMETRY
    const crownRadialSegments = 64;
    const crownHeightSegments = 32;
    const crownGeo = new THREE.CylinderGeometry(
      1.15, // top radius
      0.9,  // bottom radius
      1.5,  // height
      crownRadialSegments,
      crownHeightSegments
    );

    const posAttr = crownGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      // Convert (x,z) to polar angle
      const angle = Math.atan2(z, x);
      const dist = Math.sqrt(x * x + z * z);

      // Squarish-oval anatomical crown shape (buccal/lingual contours)
      const squareMod = 1 + 0.12 * Math.cos(4 * angle) - 0.03 * Math.cos(8 * angle);
      x *= squareMod;
      z *= squareMod;

      // Occlusal Surface (Top cusps and central developmental grooves)
      if (y > 0.1) {
        const topFactor = Math.pow((y - 0.1) / 0.65, 1.2);
        
        // 4 distinct cusps (Mesiobuccal, Distobuccal, Mesiolingual, Distolingual)
        const cusp1 = Math.exp(-Math.pow(x - 0.5, 2) * 4 - Math.pow(z - 0.5, 2) * 4) * 0.35;
        const cusp2 = Math.exp(-Math.pow(x + 0.5, 2) * 4 - Math.pow(z - 0.5, 2) * 4) * 0.32;
        const cusp3 = Math.exp(-Math.pow(x - 0.5, 2) * 4 - Math.pow(z + 0.5, 2) * 4) * 0.30;
        const cusp4 = Math.exp(-Math.pow(x + 0.5, 2) * 4 - Math.pow(z + 0.5, 2) * 4) * 0.28;

        // Central pit / groove dip in center
        const centralPit = -0.22 * Math.exp(-dist * dist * 3.5);

        y += (cusp1 + cusp2 + cusp3 + cusp4 + centralPit) * topFactor;
      } else {
        // Cervical height of contour (natural bulge around mid-crown)
        const bulge = Math.sin(((y + 0.75) / 0.85) * Math.PI) * 0.12;
        x *= (1 + bulge);
        z *= (1 + bulge);
      }

      posAttr.setXYZ(i, x, y, z);
    }
    crownGeo.computeVertexNormals();

    // 2. ROOT GEOMETRY (Dual anatomical roots)
    const createRootGeometry = (isLeft: boolean) => {
      const rootGeo = new THREE.CylinderGeometry(0.42, 0.08, 1.7, 32, 24);
      const rPos = rootGeo.attributes.position;
      const xOffset = isLeft ? -0.42 : 0.42;

      for (let i = 0; i < rPos.count; i++) {
        let x = rPos.getX(i);
        let y = rPos.getY(i);
        let z = rPos.getZ(i);

        // Flatten root slightly on mesial/distal sides
        x *= 0.82;

        // Smooth anatomical curve outwards then inwards towards root apex
        const progress = (0.85 - y) / 1.7; // 0 at top of root, 1 at tip
        const curveX = (isLeft ? -1 : 1) * Math.sin(progress * Math.PI * 0.8) * 0.18;
        const curveZ = Math.sin(progress * Math.PI) * 0.08;

        x += xOffset + curveX;
        z += curveZ;

        rPos.setXYZ(i, x, y, z);
      }
      rootGeo.translate(0, -1.35, 0);
      rootGeo.computeVertexNormals();
      return rootGeo;
    };

    const leftRootGeo = createRootGeometry(true);
    const rightRootGeo = createRootGeometry(false);

    // 3. FURCATION BRIDGE (Seamless junction between roots)
    const furcationGeo = new THREE.SphereGeometry(0.48, 24, 16);
    furcationGeo.scale(1.2, 0.6, 0.9);
    furcationGeo.translate(0, -0.65, 0);

    // ==========================================
    // LUXURY SWISS CERAMIC / ENAMEL MATERIALS
    // ==========================================
    
    // Glossy Porcelain Enamel Material for Crown
    const crownMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f8fafc'),
      emissive: new THREE.Color('#0284c7'),
      emissiveIntensity: 0.06,
      roughness: 0.12,
      metalness: 0.05,
      transmission: 0.35, // Soft translucent porcelain
      thickness: 1.1,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      sheen: 0.9,
      sheenColor: new THREE.Color('#38bdf8'),
      reflectivity: 0.9,
      specularIntensity: 1.0
    });

    // Slightly warmer ivory tone for Tooth Roots (Dentin / Cementum)
    const rootMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f1f5f9'),
      emissive: new THREE.Color('#0369a1'),
      emissiveIntensity: 0.04,
      roughness: 0.28,
      metalness: 0.02,
      transmission: 0.15,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      ior: 1.48
    });

    // Meshes
    const crownMesh = new THREE.Mesh(crownGeo, crownMaterial);
    const leftRootMesh = new THREE.Mesh(leftRootGeo, rootMaterial);
    const rightRootMesh = new THREE.Mesh(rightRootGeo, rootMaterial);
    const furcationMesh = new THREE.Mesh(furcationGeo, rootMaterial);

    crownMesh.castShadow = true;
    leftRootMesh.castShadow = true;
    rightRootMesh.castShadow = true;

    toothGroup.add(crownMesh);
    toothGroup.add(leftRootMesh);
    toothGroup.add(rightRootMesh);
    toothGroup.add(furcationMesh);

    // Position whole tooth centrally
    toothGroup.position.set(0, 0.3, 0);

    // ==========================================
    // PRECISION LASER SCAN RING & LIGHTING
    // ==========================================

    // Orbital Futuristic Tech Ring (Medical Precision Scanner)
    const scannerRingGeo = new THREE.TorusGeometry(2.1, 0.015, 16, 100);
    const scannerRingMat = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      emissive: '#0ea5e9',
      emissiveIntensity: 1.2,
      metalness: 0.9,
      roughness: 0.1
    });
    const scannerRing = new THREE.Mesh(scannerRingGeo, scannerRingMat);
    scannerRing.rotation.x = Math.PI / 2.5;
    scene.add(scannerRing);

    // Second decorative dashed ring
    const outerRingGeo = new THREE.TorusGeometry(2.4, 0.008, 16, 100);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: '#0284c7',
      transparent: true,
      opacity: 0.4
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.y = Math.PI / 3;
    scene.add(outerRing);

    // Floating Sparkle Particles Aura
    const particleCount = 90;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 6.5;
      particlePos[i + 1] = (Math.random() - 0.5) * 6.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 6.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Soft Ground Shadow Receiver
    const shadowPlaneGeo = new THREE.PlaneGeometry(8, 8);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // LIGHTING SUITE
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Key Light (Warm Sunlight / Dental Clinic Light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Cool Sky Blue Fill Light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    fillLight.position.set(-5, -1, 3);
    scene.add(fillLight);

    // Cyan Rim Light from behind for high-end pop
    const rimLight = new THREE.PointLight(0x0ea5e9, 3.5, 12);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // ==========================================
    // INTERACTIVE ROTATION & MOUSE CONTROLS
    // ==========================================
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocityX = 0;
    let velocityY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      velocityX = deltaX * 0.008;
      velocityY = deltaY * 0.008;

      toothGroup.rotation.y += velocityX;
      toothGroup.rotation.x += velocityY;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch controls for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      velocityX = deltaX * 0.008;
      velocityY = deltaY * 0.008;

      toothGroup.rotation.y += velocityX;
      toothGroup.rotation.x += velocityY;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElem.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    // Reset view function on double click
    const handleDblClick = () => {
      toothGroup.rotation.set(0, 0, 0);
      velocityX = 0;
      velocityY = 0;
    };
    domElem.addEventListener('dblclick', handleDblClick);

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Inertia decay when user releases drag
      if (!isDragging) {
        toothGroup.rotation.y += velocityX;
        toothGroup.rotation.x += velocityY;

        velocityX *= 0.94;
        velocityY *= 0.94;

        // Auto slow idle spin if velocity dies down
        if (Math.abs(velocityX) < 0.001 && Math.abs(velocityY) < 0.001) {
          toothGroup.rotation.y += 0.006;
        }
      }

      // Smooth levitation float
      toothGroup.position.y = 0.3 + Math.sin(elapsedTime * 1.6) * 0.12;

      // Rotate scanner ring
      scannerRing.rotation.z = elapsedTime * 0.35;
      outerRing.rotation.x = elapsedTime * 0.25;

      // Pulse particle system
      particleSystem.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      domElem.removeEventListener('dblclick', handleDblClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="relative w-full h-full min-h-[400px] sm:min-h-[480px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* WebGL Canvas Mounting Point */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing z-0" />

      {/* Decorative Glow Ambient Backdrop */}
      <div className="absolute w-80 h-80 rounded-full bg-sky-500/20 dark:bg-sky-400/15 blur-3xl pointer-events-none z-0" />

      {/* Interactive Floating Hotspot Annotations (Tooth Anatomy) */}
      {showAnnotations && (
        <div className="absolute inset-0 pointer-events-none z-10 hidden sm:block">
          {/* Anatomical Crown Hotspot */}
          <div className="absolute top-[28%] right-[18%] flex items-center gap-2 animate-bounce">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-4 ring-sky-400/30" />
            <div className="glass-panel px-3 py-1 rounded-lg text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-lg border border-white/60 dark:border-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-sky-500" />
              Porcelain Crown
            </div>
          </div>

          {/* Root Structure Hotspot */}
          <div className="absolute bottom-[28%] left-[18%] flex items-center gap-2">
            <div className="glass-panel px-3 py-1 rounded-lg text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-lg border border-white/60 dark:border-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Dual Anatomic Root
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/30" />
          </div>
        </div>
      )}

      {/* Floating Control Bar Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        <div className="glass-panel px-4 py-1.5 rounded-full border border-white/70 dark:border-slate-800 shadow-xl flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>Drag to rotate 3D Tooth</span>
        </div>

        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className="p-2 rounded-full glass-panel hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-lg transition-colors"
          title="Toggle Labels"
        >
          <Eye className={`w-3.5 h-3.5 ${showAnnotations ? 'text-sky-500' : 'text-slate-400'}`} />
        </button>
      </div>
    </div>
  );
};

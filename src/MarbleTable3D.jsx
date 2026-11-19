import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createPlateCanvas, createSearCanvas, createWoodCanvas } from './textures.js';

const APEX_Z = -3.35;
const TABLE_RADIUS = 4.35;
const pad = (n) => String(n).padStart(2, '0');

const std = (color, roughness = 0.4, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, ...extra });
const canvasTexture = (canvas) => {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};
const labelTexture = (title, subtitle, background) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#FFF4E4';
  ctx.font = '700 35px sans-serif';
  ctx.fillText(title.toUpperCase(), 28, 72, 450);
  ctx.fillStyle = '#F2B84B';
  ctx.fillRect(28, 98, 115, 7);
  ctx.fillStyle = 'rgba(255,244,228,.8)';
  ctx.font = '24px sans-serif';
  ctx.fillText(subtitle, 28, 150, 450);
  ctx.fillStyle = 'rgba(255,244,228,.55)';
  ctx.font = '18px sans-serif';
  ctx.fillText('ETOILE ROYALE  •  LUXEMBOURG', 28, 335, 450);
  return canvasTexture(canvas);
};

function addPart(group, geometry, material, [x, y, z] = [0, 0, 0], rotation) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

function buildFood(dishType, steak, gold) {
  const g = new THREE.Group();
  const cyl = (rt, rb, h, seg = 28) => new THREE.CylinderGeometry(rt, rb, h, seg);
  const ruby = () => std('#BE123C', 0.15, { transparent: true, opacity: 0.9 });
  const glass = () =>
    new THREE.MeshPhysicalMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.45, roughness: 0.08, metalness: 0.1 });

  switch (dishType) {
    case 'wagyu': {
      // Steak — centred on plate
      const cut = addPart(g, new THREE.SphereGeometry(0.3, 40, 32), steak, [0, 0.09, 0], [0, 0.24, 0]);
      cut.scale.set(1.25, 0.5, 0.88);
      // Butter pat on top
      addPart(g, cyl(0.11, 0.11, 0.045, 24), std('#FEF08A', 0.25), [0, 0.185, 0]);
      // Asparagus spears — tighter cluster near steak, not far off-plate
      addPart(g, new THREE.SphereGeometry(0.07, 16, 12), std('#286B3D', 0.65), [0.28, 0.07, -0.12]).scale.set(2.2, 0.22, 0.6);
      addPart(g, new THREE.SphereGeometry(0.065, 16, 12), std('#286B3D', 0.65), [0.28, 0.07, 0.04]).scale.set(2.0, 0.22, 0.55);
      break;
    }
    case 'tomahawk': {
      // Steak body
      const cut = addPart(g, new THREE.SphereGeometry(0.3, 40, 32), steak, [-0.1, 0.09, 0]);
      cut.scale.set(1.1, 0.46, 1.05);
      // Bone handle — closer in, mostly horizontal
      addPart(g, cyl(0.038, 0.048, 0.65, 24), std('#F4E7D1', 0.32), [0.3, 0.1, 0], [0, 0, Math.PI / 2]);
      // Carrot garnish
      addPart(g, new THREE.ConeGeometry(0.028, 0.22, 12), std('#EA580C', 0.3), [0.05, 0.07, 0.25], [0, 0, Math.PI / 2]);
      addPart(g, new THREE.ConeGeometry(0.028, 0.22, 12), std('#EA580C', 0.3), [0.05, 0.07, -0.22], [0, 0, Math.PI / 2]);
      break;
    }
    case 'filet': {
      // Steak — centred
      const cut = addPart(g, new THREE.SphereGeometry(0.26, 40, 32), steak, [-0.05, 0.11, 0]);
      cut.scale.set(1.1, 0.62, 0.95);
      // Pommes purée quenelle beside steak
      const puree = addPart(g, new THREE.SphereGeometry(0.14, 20, 16), std('#FEF3C7', 0.35), [0.26, 0.07, 0.1]);
      puree.scale.set(1.35, 0.6, 0.9);
      // Peppercorn sauce pool
      addPart(g, cyl(0.18, 0.18, 0.012, 32), std('#3B1E0A', 0.4), [0, 0.055, 0]);
      break;
    }
    case 'truffle': {
      // Steak
      const cut = addPart(g, new THREE.SphereGeometry(0.27, 40, 32), steak, [0, 0.1, 0]);
      cut.scale.set(1.05, 0.5, 0.95);
      // Truffle slices fanned on top
      const truffle = std('#1C1917', 0.5);
      for (let t = 0; t < 4; t++) {
        addPart(g, cyl(0.09, 0.09, 0.016, 20), truffle,
          [(t - 1.5) * 0.06, 0.2 + t * 0.009, (t % 2 === 0 ? 1 : -1) * 0.03],
          [0, 0, (t - 1.5) * 0.14]);
      }
      // 24k gold leaf sheet on top
      addPart(g, new THREE.BoxGeometry(0.08, 0.008, 0.08), gold, [0.02, 0.235, 0.02]);
      break;
    }
    case 'berry_drink': {
      // Goblet base
      addPart(g, cyl(0.16, 0.18, 0.02), glass(), [0, 0.01, 0]);
      // Stem
      addPart(g, cyl(0.018, 0.022, 0.26, 16), glass(), [0, 0.14, 0]);
      // Bowl outline
      addPart(g, cyl(0.2, 0.13, 0.33, 32), glass(), [0, 0.43, 0]);
      // Berry fill
      addPart(g, cyl(0.18, 0.11, 0.25, 32), ruby(), [0, 0.4, 0]);
      // Gold rim
      addPart(g, new THREE.TorusGeometry(0.2, 0.008, 12, 36), gold, [0, 0.6, 0], [Math.PI / 2, 0, 0]);
      // Mint sprig (green sphere flatten)
      const mint = addPart(g, new THREE.SphereGeometry(0.055, 12, 10), std('#16A34A', 0.5), [0.1, 0.63, 0]);
      mint.scale.set(1.6, 0.4, 1.0);
      break;
    }
    case 'fondant': {
      // Chocolate cake cylinder
      addPart(g, cyl(0.22, 0.24, 0.2, 32), std('#291510', 0.5), [0, 0.1, 0]);
      // Molten centre reveal
      addPart(g, cyl(0.1, 0.1, 0.05, 20), std('#7B2200', 0.3), [0, 0.205, 0]);
      // Vanilla gelato scoop
      const scoop = addPart(g, new THREE.SphereGeometry(0.11, 20, 16), std('#FFFBEB', 0.28), [0.3, 0.09, 0.1]);
      scoop.scale.set(1.1, 0.95, 1.0);
      // Gold leaf
      addPart(g, new THREE.BoxGeometry(0.065, 0.009, 0.065), gold, [0, 0.21, 0]);
      break;
    }
    case 'pistachio': {
      // Entremet dome — centred
      const dome = addPart(g, new THREE.SphereGeometry(0.25, 32, 24), std('#15803D', 0.25), [0, 0.11, 0]);
      dome.scale.set(1.15, 0.75, 1.15);
      // Mirror glaze sheen ring
      addPart(g, new THREE.TorusGeometry(0.22, 0.012, 10, 40), std('#166534', 0.2), [0, 0.08, 0], [Math.PI / 2, 0, 0]);
      // Raspberry on top
      addPart(g, new THREE.SphereGeometry(0.055, 14, 12), std('#9F1239', 0.35), [0, 0.28, 0]);
      // Gold leaf
      addPart(g, new THREE.BoxGeometry(0.06, 0.009, 0.06), gold, [0.09, 0.24, 0.05]);
      break;
    }
    default: { // royal_experience: miniature five-course progression
      // Steak portion
      const cut = addPart(g, new THREE.SphereGeometry(0.19, 32, 24), steak, [-0.2, 0.07, 0.08]);
      cut.scale.set(1.15, 0.45, 0.85);
      // Risotto portion
      addPart(g, cyl(0.17, 0.2, 0.08), std('#FDE68A', 0.32), [0.18, 0.04, 0.1]);
      // Fondant cylinder
      addPart(g, cyl(0.11, 0.12, 0.12, 24), std('#291510', 0.5), [0.16, 0.06, -0.2]);
      // Berry drink flute
      addPart(g, cyl(0.07, 0.055, 0.32, 24), ruby(), [-0.22, 0.16, -0.2]);
      break;
    }
  }

  // Scale up all food slightly so it reads clearly from the overhead camera
  g.scale.setScalar(1.4);
  return g;
}

function disposeScene(scene) {
  scene.traverse((obj) => {
    obj.geometry?.dispose();
    const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
    mats.forEach((m) => {
      m.map?.dispose();
      m.dispose();
    });
  });
}

export default function MarbleTable3D({
  dishes, activeIndex, onSelectDish, autoTour, onToggleAutoTour,
  ticket, doneness, onDoneness, onAddDish, onInspectProp, onOpenMenu
}) {
  const mountRef = useRef(null);
  const dishGroupsRef = useRef([]);
  const tableRef = useRef(null);
  const callbacks = useRef({});
  callbacks.current = { onSelectDish, onToggleAutoTour, onInspectProp };
  const state = useRef({
    dragging: false, startX: 0, dist: 0, activeIndex, autoTour, dirty: true,
    zoom: 9.8, targetZoom: 9.8, tourAt: 0, rotation: 0, targetRotation: 0, startRotation: 0, dragRotation: 0
  });
  const [failed, setFailed] = useState(false);
  const [hoveredProp, setHoveredProp] = useState('');
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = dishes.length;

  useEffect(() => {
    state.current.autoTour = autoTour;
  }, [autoTour]);

  useEffect(() => {
    const s = state.current;
    s.activeIndex = activeIndex;
    dishGroupsRef.current.forEach((group, index) => { group.visible = index === activeIndex; });
    if (tableRef.current) {
      const desired = activeIndex * (Math.PI * 2 / count) - Math.PI / 2;
      s.targetRotation = desired + Math.round((s.rotation - desired) / (Math.PI * 2)) * Math.PI * 2;
    }
    s.dirty = true;
  }, [activeIndex, count]);

  useEffect(() => {
    const container = mountRef.current;
    const s = state.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    } catch (error) {
      setFailed(error instanceof Error ? error.message : 'WebGL is unavailable.');
      return undefined;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    const canvasEl = renderer.domElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    const cameraTarget = new THREE.Vector3();
    const updateCamera = () => {
      const distance = Math.sqrt(s.zoom * s.zoom + (s.zoom * 0.5) ** 2);
      const visibleHalfWidth = distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
      cameraTarget.set(visibleHalfWidth - 0.08, 0, 0);
      camera.position.set(cameraTarget.x, s.zoom, -s.zoom * 0.5);
      camera.lookAt(cameraTarget);
    };
    updateCamera();

    scene.add(new THREE.HemisphereLight('#F5D7FF', '#271520', 1.5));
    const key = new THREE.DirectionalLight('#FFD18B', 3.2);
    key.position.set(-3.2, 10.5, -4.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0005;
    scene.add(key);

    const gold = std('#C9A24D', 0.25, { metalness: 0.85 });

    const table = new THREE.Group();
    scene.add(table);

    const radius = TABLE_RADIUS;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    const slabGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.28, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.03, bevelThickness: 0.03, curveSegments: 96
    });
    slabGeo.rotateX(Math.PI / 2);
    const slab = new THREE.Mesh(slabGeo, new THREE.MeshPhysicalMaterial({
      map: canvasTexture(createWoodCanvas()), roughness: 0.38, metalness: 0.04, clearcoat: 0.22, clearcoatRoughness: 0.42
    }));
    slab.position.y = 0.14;
    slab.receiveShadow = true;
    table.add(slab);

    const edgeRing = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.02, 0.045, 16, 144), gold);
    edgeRing.rotation.x = Math.PI / 2;
    edgeRing.position.y = 0.155;
    table.add(edgeRing);
    tableRef.current = table;
    const initialRotation = activeIndex * (Math.PI * 2 / count) - Math.PI / 2;
    s.rotation = initialRotation;
    s.targetRotation = initialRotation;
    table.rotation.y = initialRotation;

    const propTargets = [];

    const sauces = [
      { id: 'chimichurri', x: -1.1, z: -3.2, color: '#5D8F42' },
      { id: 'pepper', x: 1.1, z: -3.2, color: '#3A1D20' },
      { id: 'butter', x: -1.1, z: -1.75, color: '#F1B84A' },
      { id: 'salt', x: 1.1, z: -1.75, color: '#E9D9B6' }
    ];
    sauces.forEach(({ id, x, z, color }) => {
      const bowl = new THREE.Group();
      bowl.position.set(x, 0.17, z);
      const ceramic = std('#F7E8D0', 0.2, { metalness: 0.08 });
      const cup = addPart(bowl, new THREE.LatheGeometry([
        new THREE.Vector2(0.16, 0), new THREE.Vector2(0.28, 0.04),
        new THREE.Vector2(0.33, 0.13), new THREE.Vector2(0.34, 0.2),
        new THREE.Vector2(0.29, 0.23)
      ], 48), ceramic, [0, 0, 0]);
      cup.userData.propId = id;
      propTargets.push(cup);
      const sauce = addPart(bowl, new THREE.CylinderGeometry(0.24, 0.24, 0.025, 40), std(color, 0.26), [0, 0.19, 0]);
      sauce.userData.propId = id;
      propTargets.push(sauce);
      addPart(bowl, new THREE.TorusGeometry(0.3, 0.018, 10, 48), gold, [0, 0.21, 0], [Math.PI / 2, 0, 0]);
      table.add(bowl);
    });

    const ticketMesh = addPart(table, new THREE.PlaneGeometry(0.94, 1.12), new THREE.MeshBasicMaterial({
      map: labelTexture('Order ticket', 'CUT • TEMP • SAUCE', '#37182F'), side: THREE.DoubleSide
    }), [-1.55, 0.19, -2.3], [-Math.PI / 2, 0, -0.2]);
    ticketMesh.userData.propId = 'ticket';
    propTargets.push(ticketMesh);
    addPart(table, new THREE.BoxGeometry(1, 0.06, 1.18), std('#2A1723', 0.42), [-1.55, 0.15, -2.3], [0, -0.2, 0]);
    const bookMesh = addPart(table, new THREE.PlaneGeometry(1.18, 0.9), new THREE.MeshBasicMaterial({
      map: labelTexture('The cut book', 'TURN THE PAGE', '#7B2144'), side: THREE.DoubleSide
    }), [1.55, 0.19, -2.3], [-Math.PI / 2, 0, 0.2]);
    bookMesh.userData.propId = 'menu';
    propTargets.push(bookMesh);
    addPart(table, new THREE.BoxGeometry(1.24, 0.08, 0.96), std('#301523', 0.38), [1.55, 0.15, -2.3], [0, 0.2, 0]);

    const plateTargets = [];
    dishGroupsRef.current = [];
    const steak = new THREE.MeshStandardMaterial({ map: canvasTexture(createSearCanvas()), roughness: 0.3, metalness: 0.08 });
    dishes.forEach((dish, i) => {
      const angle = i * (Math.PI * 2 / count);
      const serving = new THREE.Group();
      serving.position.set(Math.sin(angle) * -APEX_Z, 0.175, -Math.cos(angle) * -APEX_Z);
      serving.rotation.y = -angle;
      serving.visible = i === activeIndex;
      dishGroupsRef.current.push(serving);
      table.add(serving);

      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.76, 0.66, 0.08, 64),
        new THREE.MeshStandardMaterial({ map: canvasTexture(createPlateCanvas(dish.dishType)), roughness: 0.15, metalness: 0.05 })
      );
      plate.castShadow = true;
      plate.receiveShadow = true;
      plate.userData.dishIndex = i;
      serving.add(plate);
      plateTargets.push(plate);

      const food = buildFood(dish.dishType, steak, gold);
      food.position.y = 0.055;
      serving.add(food);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onDown = (e) => {
      s.dragging = true;
      s.startX = e.clientX;
      s.dist = 0;
      s.startRotation = s.rotation;
      s.dragRotation = s.rotation;
      canvasEl.setPointerCapture?.(e.pointerId);
      if (s.autoTour) callbacks.current.onToggleAutoTour(false);
    };
    const onMove = (e) => {
      if (!s.dragging) {
        const rect = canvasEl.getBoundingClientRect();
        pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const activePlateTargets = plateTargets.filter((plate) => plate.parent.visible);
        const propHit = raycaster.intersectObjects([...activePlateTargets, ...propTargets], false)[0];
        const propId = propHit?.object.userData.propId || (propHit?.object.userData.dishIndex !== undefined ? 'steak' : '');
        setHoveredProp((current) => current === propId ? current : propId);
        canvasEl.style.cursor = propId ? 'pointer' : 'grab';
      }
      if (!s.dragging) return;
      const dx = e.clientX - s.startX;
      s.dist = Math.abs(dx);
      s.dragRotation = s.startRotation + dx * 0.0065;
      s.dirty = true;
    };
    const onUp = (e) => {
      if (!s.dragging) return;
      s.dragging = false;
      if (s.dist < 6) {
        const rect = canvasEl.getBoundingClientRect();
        pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects([...plateTargets.filter((plate) => plate.parent.visible), ...propTargets], false)[0];
        if (hit) {
          if (hit.object.userData.dishIndex !== undefined) {
            callbacks.current.onSelectDish(hit.object.userData.dishIndex);
            callbacks.current.onInspectProp('steak');
          }
          else if (hit.object.userData.propId) callbacks.current.onInspectProp(hit.object.userData.propId);
          return;
        }
      } else if (s.dist > 35) {
        const direction = e.clientX < s.startX ? 1 : -1;
        const next = (s.activeIndex + direction + count) % count;
        s.activeIndex = next;
        callbacks.current.onSelectDish(next);
      }
      s.dirty = true;
    };
    const onWheel = (e) => {
      e.preventDefault();
      s.targetZoom = Math.max(9.2, Math.min(14.5, s.targetZoom + Math.sign(e.deltaY) * 0.65));
      s.dirty = true;
    };
    const onLeave = () => {
      if (!s.dragging) {
        setHoveredProp('');
        canvasEl.style.cursor = 'grab';
      }
    };
    canvasEl.addEventListener('pointerdown', onDown);
    canvasEl.addEventListener('pointermove', onMove);
    canvasEl.addEventListener('pointerleave', onLeave);
    canvasEl.addEventListener('pointerup', onUp);
    canvasEl.addEventListener('pointercancel', onUp);
    canvasEl.addEventListener('wheel', onWheel, { passive: false });

    const resize = new ResizeObserver(() => {
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateCamera();
      s.dirty = true;
    });
    resize.observe(container);

    // Draws only while something is changing; an idle table costs nothing.
    let frame;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (s.autoTour && !s.dragging && performance.now() - s.tourAt > 3200) {
        const next = (s.activeIndex + 1) % count;
        s.tourAt = performance.now();
        s.activeIndex = next;
        callbacks.current.onSelectDish(next);
      }
      const rotationTarget = s.dragging ? s.dragRotation : s.targetRotation;
      const rotationDiff = rotationTarget - s.rotation;
      if (Math.abs(rotationDiff) > 0.001) {
        s.rotation += reduced ? rotationDiff : rotationDiff * 0.1;
        table.rotation.y = s.rotation;
        s.dirty = true;
      }
      const zoomDiff = s.targetZoom - s.zoom;
      if (Math.abs(zoomDiff) > 0.01) {
        s.zoom += zoomDiff * 0.12;
        updateCamera();
        s.dirty = true;
      }
      if (s.dirty) {
        renderer.render(scene, camera);
        s.dirty = false;
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      canvasEl.removeEventListener('pointerdown', onDown);
      canvasEl.removeEventListener('pointermove', onMove);
      canvasEl.removeEventListener('pointerleave', onLeave);
      canvasEl.removeEventListener('pointerup', onUp);
      canvasEl.removeEventListener('pointercancel', onUp);
      canvasEl.removeEventListener('wheel', onWheel);
      disposeScene(scene);
      renderer.dispose();
      canvasEl.remove();
      tableRef.current = null;
    };
  }, [dishes, count, reduced]);

  const go = (i) => {
    if (autoTour) onToggleAutoTour(false);
    onSelectDish(((i % count) + count) % count);
  };
  const toggleTour = () => {
    state.current.tourAt = performance.now();
    onToggleAutoTour(!autoTour);
  };

  return (
    <div className="stage">
      <div className="stage-bar">
        <span aria-live="polite">
          Course {pad(activeIndex + 1)} of {pad(count)}: {dishes[activeIndex].name}
        </span>
        {!reduced && (
          <button type="button" className="btn btn-quiet btn-sm" aria-pressed={autoTour} onClick={toggleTour}>
            {autoTour ? 'Pause tour' : 'Start tour'}
          </button>
        )}
      </div>

      <div className="stage-scene">
        <div
          ref={mountRef}
          className="stage-canvas"
          role="img"
          aria-label="Interactive round 3D steakhouse table, partly cropped at the edge. Drag to rotate and reveal one course at a time."
        />
        {hoveredProp && <span className="scene-hover-label" role="status">{hoveredProp === 'menu' ? 'Open the cut book' : hoveredProp === 'ticket' ? 'Inspect your order ticket' : hoveredProp === 'steak' ? 'Binchotan-seared steak' : `Inspect ${hoveredProp} sauce`}</span>}
        <button type="button" className="scene-menu-trigger" onClick={onOpenMenu}>Open the cut book ↗</button>
      </div>
      {failed && (
        <p className="stage-fallback">
          3D view could not start ({failed}). Browse every course in the carte below.
        </p>
      )}

      <div className="stage-nav">
        <button type="button" className="btn btn-quiet btn-sm" onClick={() => go(activeIndex - 1)}>
          Previous
        </button>
        <div className="dots">
          {dishes.map((d, i) => (
            <button
              key={d.id}
              type="button"
              className="dot"
              aria-label={`Show ${d.name}`}
              aria-current={i === activeIndex ? 'true' : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button type="button" className="btn btn-quiet btn-sm" onClick={() => go(activeIndex + 1)}>
          Next
        </button>
      </div>
      <div className="stage-ticket">
        <div className="ticket-heading">
          <div><span className="ticket-eyebrow">YOUR TABLE</span><strong>Order ticket</strong></div>
          <button type="button" className="ticket-menu" onClick={() => onInspectProp('ticket')} aria-label="Inspect order ticket">↗</button>
        </div>
        <label className="ticket-doneness" htmlFor="ticket-doneness">
          <span>Doneness</span>
          <select id="ticket-doneness" value={doneness} onChange={(event) => onDoneness(event.target.value)}>
            {['Rare', 'Medium-Rare', 'Medium', 'Medium-Well', 'Well-Done'].map((level) => <option key={level}>{level}</option>)}
          </select>
        </label>
        {ticket.length ? (
          <ul className="ticket-items">
            {ticket.map((item, index) => (
              <li key={`${item.id}-${item.temperature}-${index}`}>
                <span>{item.quantity}× {item.name}<small>{item.temperature}</small></span>
                <b>€{item.price * item.quantity}</b>
              </li>
            ))}
          </ul>
        ) : <p className="ticket-empty">Your first cut goes here.</p>}
        <div className="ticket-total">
          <span>{ticket.reduce((sum, item) => sum + item.quantity, 0)} ITEMS</span>
          <strong>€{ticket.reduce((sum, item) => sum + item.price * item.quantity, 0)}</strong>
        </div>
        <button type="button" className="btn btn-primary btn-sm btn-wide" onClick={() => onAddDish(dishes[activeIndex], doneness)}>
          + Add {dishes[activeIndex].name}
        </button>
      </div>
      <p className="stage-hint">Drag the round table to reveal each course · scroll to zoom · tap a sauce, ticket or menu book.</p>
    </div>
  );
}

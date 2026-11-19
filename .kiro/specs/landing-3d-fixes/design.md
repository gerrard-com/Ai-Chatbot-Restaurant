# Landing Page & 3D Table Visual Quality Bugfix Design

## Overview

This document addresses two critical bugs reported by users: (1) the landing page component not rendering despite being properly integrated into the application, and (2) poor visual quality of the 3D marble table scene including inadequate lighting, unclear food items, suboptimal camera angles, and low material quality. The fix approach involves diagnosing the sessionStorage-based routing logic for the landing page issue, and implementing professional-grade Three.js lighting, camera, and material enhancements for the 3D scene to achieve a polished, restaurant-quality visual presentation.

## Glossary

- **Bug_Condition_LandingPage (C1)**: The condition where the landing page fails to display on initial app load
- **Bug_Condition_3DQuality (C2)**: The condition where the 3D table scene renders with poor visual quality (bad lighting, unclear food, poor materials)
- **Property_LandingPage (P1)**: The landing page must display first on fresh visits before the main app
- **Property_3DQuality (P2)**: The 3D table must render with professional quality including dramatic lighting, clear food items, optimal camera angle, and refined materials
- **Preservation**: All existing app functionality (navigation, reservations, menu, concierge) must remain unchanged
- **sessionStorage**: Browser API used to persist the "has entered" flag across page refreshes
- **Three.js**: WebGL rendering library used for the 3D table scene in `MarbleTable3D.jsx`
- **Three-point lighting**: Professional lighting setup with key light (main), fill light (shadows), and rim/back light (depth)
- **PBR materials**: Physically Based Rendering materials that simulate real-world material properties

## Bug Details

### Bug Condition 1: Landing Page Not Rendering

The landing page fails to display when users first open the application. Despite the component being properly created and integrated with conditional rendering logic in `App.jsx`, the landing page is bypassed.

**Formal Specification:**
```
FUNCTION isBugCondition_LandingPage(appState)
  INPUT: appState containing sessionStorage state and landed flag
  OUTPUT: boolean
  
  RETURN sessionStorage.getItem('etoile-entered') === null
         AND landed === true
         AND userHasNotSeenLandingPage === true
END FUNCTION
```

**Examples:**

- **Fresh browser visit**: User opens app for the first time → Expected: Landing page displays → Actual: Main app displays immediately
- **Incognito mode**: User opens app in private browsing → Expected: Landing page displays → Actual: Main app displays immediately
- **Cleared storage**: User clears browser data and revisits → Expected: Landing page displays → Actual: Main app displays immediately
- **After landing page entry**: User clicks "Enter" button → Expected: Main app displays and flag persists → This works correctly

### Bug Condition 2: 3D Table Poor Visual Quality

The 3D marble table scene renders with inadequate visual quality that fails to convey the luxury restaurant aesthetic.

**Formal Specification:**
```
FUNCTION isBugCondition_3DQuality(scene)
  INPUT: scene containing Three.js rendering setup
  OUTPUT: boolean
  
  RETURN scene.lights.length < 3
         OR scene.shadowQuality === LOW
         OR scene.foodScale < MINIMUM_VISIBLE_THRESHOLD
         OR scene.cameraAngle !== OPTIMAL_SHOWCASE_ANGLE
         OR scene.materialQuality === BASIC_STANDARD
END FUNCTION
```

**Examples:**

- **Current lighting**: Single hemisphere + one directional light → Expected: Dramatic three-point lighting with soft shadows → Actual: Flat, uninspiring illumination
- **Food visibility**: Food items are small and hard to see from camera angle → Expected: Food clearly visible with proper scale and positioning → Actual: Food looks toy-like and insignificant
- **Camera angle**: Current overhead angle is functional but not cinematic → Expected: Slightly angled view for depth and drama → Actual: Direct overhead feels flat
- **Materials**: Basic MeshStandardMaterial with simple properties → Expected: Enhanced materials with clearcoat, metalness, refined roughness → Actual: Materials look plastic and cheap

## Expected Behavior

### Bug Condition 1 - Landing Page Expected Behavior

When a user visits the application for the first time (or with cleared storage), the landing page SHALL display with full entrance animations, allowing the user to read about the restaurant and click "Enter the restaurant" to proceed to the main application. The sessionStorage flag SHALL be set only after the user explicitly enters, and SHALL persist across page refreshes during the same browser session.

### Bug Condition 2 - 3D Table Expected Behavior

The 3D table scene SHALL render with professional restaurant-quality visuals including:
- **Dramatic three-point lighting** with a warm key light, subtle fill light, and rim light for depth
- **Food items scaled and positioned** for clear visibility from the camera angle
- **Optimized camera positioning** at a slight angle (not directly overhead) for cinematic depth
- **Enhanced materials** with PBR properties including clearcoat for marble, proper metalness for gold accents, and realistic roughness values
- **Soft, realistic shadows** that add depth without being harsh
- **Warm color temperature** matching the luxury restaurant aesthetic

### Preservation Requirements

**Unchanged Behaviors:**

- All navigation functionality (scrolling to sections, mobile menu, header links) must continue working
- The 3D table interactivity (drag to rotate, click dishes/props, auto-tour, zoom) must remain unchanged
- Reservation form, menu flipbook, concierge chat, and all other features must work exactly as before
- Existing themes (dark/light toggle) must continue functioning
- Performance characteristics must not degrade significantly (target: maintain 60fps on the 3D scene)

**Scope:**

All inputs and user interactions that do NOT involve the initial page load or 3D scene visual quality should be completely unaffected by this fix. This includes:
- Form submissions and validation
- Chat/concierge functionality
- Menu filtering and search
- Modal dialogs
- Toast notifications
- All keyboard shortcuts and accessibility features

## Hypothesized Root Cause

### Landing Page Issue

Based on the code analysis in `App.jsx`, the most likely cause is:

1. **Incorrect initial state**: The `useState` initialization reads from `sessionStorage` and may be returning a truthy value when it shouldn't
   - Line: `return sessionStorage.getItem('etoile-entered') === '1';`
   - Issue: If this returns `true` on first load, landing is bypassed
   - Possible cause: sessionStorage may already have the key set, or the comparison is not strict enough

2. **Missing null check**: The code checks for `'1'` but doesn't explicitly handle `null` case
   - When sessionStorage key doesn't exist, `getItem` returns `null`
   - The comparison `null === '1'` correctly returns `false`, so `landed` should be `false`
   - However, there may be timing issues or the key may be set elsewhere

3. **Race condition**: If sessionStorage is being set by another script or previous session data isn't clearing
   - Browser extensions or dev tools may interfere
   - Previous development iterations may have left the flag set

### 3D Table Visual Quality Issues

Based on the code in `MarbleTable3D.jsx`, the issues are:

1. **Insufficient lighting setup**: Only two lights (hemisphere + one directional)
   - Lines 283-288: Basic HemisphereLight and single DirectionalLight
   - Missing: fill light for shadows, rim light for depth, ambient adjustments
   - The key light intensity (3.2) is high but lacks supporting lights

2. **Camera positioning**: Direct overhead view lacks cinematic quality
   - Lines 275-277: Camera positioned directly above with simple lookAt
   - Result: Flat viewing angle that doesn't showcase depth
   - Fix needed: Slightly angled camera with adjusted lookAt target

3. **Food scaling**: Food group scaled to 1.4 but may still be too small relative to plates
   - Line 225: `g.scale.setScalar(1.4);`
   - May need additional scaling or camera FOV adjustment
   - Food positioning within plates may also need refinement

4. **Material quality**: Basic MeshStandardMaterial without enhanced properties
   - Materials use simple roughness values without clearcoat, sheen, or advanced PBR
   - Marble (wood canvas) lacks depth and luxury feel
   - Gold material needs higher metalness and more refined properties

5. **Shadow quality**: PCFSoftShadowMap is used but shadow map size may be insufficient
   - Line 267: `key.shadow.mapSize.set(1024, 1024);`
   - May need higher resolution (2048x2048) for softer, more realistic shadows
   - Shadow bias and camera frustum may need adjustment

## Correctness Properties

Property 1: Bug Condition - Landing Page Display

_For any_ application initialization where sessionStorage does NOT contain the 'etoile-entered' key (or contains null), the fixed application SHALL render the LandingPage component first, allowing the user to view the landing content and explicitly choose to enter the main restaurant application.

**Validates: Requirements 2.1**

Property 2: Bug Condition - 3D Table Professional Quality

_For any_ render of the MarbleTable3D component, the fixed scene SHALL produce professional-quality visuals with dramatic three-point lighting setup, clearly visible and properly scaled food items, an optimized camera angle that provides cinematic depth, enhanced PBR materials with clearcoat and refined properties, and soft realistic shadows at appropriate resolution.

**Validates: Requirements 2.2**

Property 3: Preservation - Application Functionality

_For any_ user interaction that does NOT involve the initial landing page decision or visual inspection of the 3D table quality, the fixed application SHALL produce exactly the same behavior as the original application, preserving all navigation, forms, chat, menu, reservation, and interactive features.

**Validates: Requirements 3.1, 3.2, 3.3**

Property 4: Preservation - 3D Table Interactivity

_For any_ user interaction with the 3D table (drag, click, zoom, auto-tour), the fixed scene SHALL respond with the same interactive behavior as the original, preserving all event handlers, state management, and functional capabilities while only enhancing the visual rendering quality.

**Validates: Requirements 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

#### Fix 1: Landing Page Rendering

**File**: `src/App.jsx`

**Function**: `useState` initialization for `landed` state

**Specific Changes**:

1. **Strengthen sessionStorage check**: Add explicit null handling
   - Current: `return sessionStorage.getItem('etoile-entered') === '1';`
   - Fixed: `return sessionStorage.getItem('etoile-entered') === '1' || false;`
   - Better: Check if window/sessionStorage is available and handle SSR cases

2. **Add defensive initialization**: Ensure sessionStorage is accessible
   ```javascript
   const [landed, setLanded] = useState(() => {
     try {
       return sessionStorage.getItem('etoile-entered') === '1';
     } catch {
       return false; // Fallback if sessionStorage unavailable
     }
   });
   ```

3. **Add debugging/verification**: Temporarily log the initial state to confirm behavior
   - Verify that on fresh load, `landed` is actually `false`
   - Confirm the landing page render path is reached

#### Fix 2: 3D Table Visual Quality Enhancement

**File**: `src/MarbleTable3D.jsx`

**Function**: Scene setup in `useEffect` (lines 246-370)

**Specific Changes**:

1. **Implement Three-Point Lighting**:
   - **Key Light** (existing directional light - enhance):
     ```javascript
     const key = new THREE.DirectionalLight('#FFDBA8', 4.5); // Warmer, brighter
     key.position.set(-5, 12, -6); // More dramatic angle
     key.castShadow = true;
     key.shadow.mapSize.set(2048, 2048); // Higher resolution shadows
     key.shadow.bias = -0.0003;
     key.shadow.camera.near = 0.5;
     key.shadow.camera.far = 25;
     key.shadow.camera.left = -10;
     key.shadow.camera.right = 10;
     key.shadow.camera.top = 10;
     key.shadow.camera.bottom = -10;
     ```

   - **Fill Light** (new - softens shadows):
     ```javascript
     const fill = new THREE.DirectionalLight('#9B7DFF', 1.2);
     fill.position.set(4, 8, 3);
     scene.add(fill);
     ```

   - **Rim/Back Light** (new - adds depth):
     ```javascript
     const rim = new THREE.DirectionalLight('#FFE4B5', 2.0);
     rim.position.set(0, 5, 6); // Behind the table
     scene.add(rim);
     ```

   - **Adjust Hemisphere Light**:
     ```javascript
     scene.add(new THREE.HemisphereLight('#F5D7FF', '#271520', 0.8)); // Reduce intensity
     ```

2. **Enhance Camera Positioning**:
   ```javascript
   const updateCamera = () => {
     const distance = Math.sqrt(s.zoom * s.zoom + (s.zoom * 0.7) ** 2); // Increase depth factor
     const visibleHalfWidth = distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
     cameraTarget.set(visibleHalfWidth - 0.08, 0.3, 0.2); // Raise target slightly
     camera.position.set(
       cameraTarget.x, 
       s.zoom * 0.92, // Slightly lower for more angle
       -s.zoom * 0.65 // Pull back more for perspective
     );
     camera.lookAt(cameraTarget);
   };
   ```

3. **Increase Food Scale**:
   - Change line 225: `g.scale.setScalar(1.7);` (up from 1.4)
   - Adjust individual food item scales if needed for balance

4. **Enhance Materials**:
   - **Marble/Wood (table slab)**:
     ```javascript
     const slab = new THREE.Mesh(slabGeo, new THREE.MeshPhysicalMaterial({
       map: canvasTexture(createWoodCanvas()),
       roughness: 0.28, // Smoother
       metalness: 0.08,
       clearcoat: 0.45, // Add glossy finish
       clearcoatRoughness: 0.25,
       reflectivity: 0.6
     }));
     ```

   - **Gold accents** (line 294):
     ```javascript
     const gold = new THREE.MeshPhysicalMaterial({
       color: '#D4AF37',
       roughness: 0.18, // More refined
       metalness: 0.95, // Highly metallic
       clearcoat: 0.3,
       clearcoatRoughness: 0.2,
       reflectivity: 0.8
     });
     ```

   - **Steak texture**:
     ```javascript
     const steak = new THREE.MeshStandardMaterial({
       map: canvasTexture(createSearCanvas()),
       roughness: 0.25, // Slightly glossy meat
       metalness: 0.12,
       emissive: '#1a0a05', // Subtle warm glow
       emissiveIntensity: 0.15
     });
     ```

   - **Plate material**:
     ```javascript
     const plate = new THREE.Mesh(
       new THREE.CylinderGeometry(0.76, 0.66, 0.08, 64),
       new THREE.MeshPhysicalMaterial({
         map: canvasTexture(createPlateCanvas(dish.dishType)),
         roughness: 0.10, // Very smooth porcelain
         metalness: 0.02,
         clearcoat: 0.55, // Glazed ceramic shine
         clearcoatRoughness: 0.15,
         reflectivity: 0.5
       })
     );
     ```

5. **Optimize Renderer Settings**:
   ```javascript
   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   renderer.toneMapping = THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure = 1.15; // Slightly brighter
   renderer.outputColorSpace = THREE.SRGBColorSpace; // Ensure correct color space
   ```

6. **Add Ambient Occlusion (optional, if performance allows)**:
   ```javascript
   // After scene creation, if using postprocessing
   // This is optional - only add if frame rate remains stable
   const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.3);
   scene.add(ambientLight);
   ```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed code, then verify the fixes work correctly and preserve existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate both bugs BEFORE implementing the fixes. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan for Landing Page**: 
- Open the application in fresh browser session (clear storage)
- Open in incognito/private browsing mode
- Use browser dev tools to inspect sessionStorage on page load
- Run tests on the UNFIXED code to observe that landing page is skipped

**Test Cases for Landing Page**:
1. **Fresh Browser Test**: Clear all storage, open app → Landing should show but doesn't (will fail on unfixed code)
2. **Incognito Mode Test**: Open app in private window → Landing should show but doesn't (will fail on unfixed code)
3. **Manual Storage Clear Test**: Run `sessionStorage.clear()` in console, refresh → Landing should show but doesn't (will fail on unfixed code)
4. **After Entry Test**: Click "Enter the restaurant", refresh page → Main app should persist (should pass on unfixed code)

**Expected Counterexamples for Landing Page**:
- Landing page component never renders even when storage is empty
- Possible causes: initial state always returns `true`, storage key is pre-set, SSR/hydration issue

**Test Plan for 3D Table Quality**:
- Load the application and inspect the 3D table scene visually
- Take screenshots of current lighting, food visibility, camera angle
- Use Three.js Inspector browser extension to examine scene graph
- Compare with reference images of professional 3D restaurant renders
- Run tests on UNFIXED code to capture current poor quality

**Test Cases for 3D Table**:
1. **Lighting Inspection**: Count lights in scene → Should have 3+ with varied positions (will fail on unfixed code with only 2 lights)
2. **Food Visibility Test**: Measure food item size relative to plates → Should be clearly visible (will fail on unfixed code - too small)
3. **Camera Angle Test**: Check camera position values → Should have perspective depth (will fail on unfixed code - too flat)
4. **Material Quality Test**: Inspect material properties → Should have clearcoat, enhanced properties (will fail on unfixed code - basic materials)
5. **Shadow Quality Test**: Examine shadow map resolution → Should be 2048x2048 or higher (will fail on unfixed code - 1024x1024)

**Expected Counterexamples for 3D Table**:
- Only 2 lights in scene (hemisphere + 1 directional) instead of 3+ point lighting
- Food scale too small (1.4x) resulting in toy-like appearance
- Camera directly overhead creating flat, uninspiring view
- Materials lack clearcoat, advanced PBR properties, appear plastic
- Shadow map resolution insufficient for soft, realistic shadows

### Fix Checking

**Goal**: Verify that for all inputs where the bug conditions hold, the fixed code produces the expected behavior.

**Pseudocode for Landing Page Fix:**
```
FOR ALL sessionStorage state WHERE storage is empty OR null DO
  result := App_fixed.render()
  ASSERT result.component === LandingPage
  ASSERT result.visible === true
END FOR
```

**Pseudocode for 3D Table Fix:**
```
FOR ALL 3D scene renders WHERE MarbleTable3D is mounted DO
  result := MarbleTable3D_fixed.render()
  ASSERT result.lights.length >= 4
  ASSERT result.foodScale >= 1.6
  ASSERT result.cameraAngle.depth > ORIGINAL.depth
  ASSERT result.materials.includes('clearcoat')
  ASSERT result.shadowMapSize >= 2048
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug conditions do NOT hold, the fixed code produces the same result as the original code.

**Pseudocode for General Preservation:**
```
FOR ALL user interactions WHERE interaction != landingPageLoad AND interaction != 3DVisualInspection DO
  ASSERT App_original(interaction) = App_fixed(interaction)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for all interactive features, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Navigation Preservation**: Test all header links, scroll-to-section, mobile menu → Behavior must remain identical
2. **3D Interaction Preservation**: Test drag rotation, click events, zoom, auto-tour → All interactions must work identically
3. **Form Preservation**: Test reservation form submission, validation, state management → Must work identically
4. **Chat Preservation**: Test concierge opening, message sending, dish recommendations → Must work identically
5. **Menu Preservation**: Test flipbook pagination, filtering, search, dish modals → Must work identically
6. **Theme Toggle Preservation**: Test dark/light mode switching → Must work identically
7. **Responsive Preservation**: Test all features at mobile/tablet/desktop breakpoints → Must work identically

### Unit Tests

#### Landing Page Tests:
- Test initial state calculation with empty sessionStorage
- Test initial state calculation with sessionStorage containing '1'
- Test `enterApp` function sets storage and updates state correctly
- Test LandingPage render when `landed` is false
- Test main App render when `landed` is true

#### 3D Table Tests:
- Test light creation (verify count, positions, intensities)
- Test camera positioning calculation (verify angles, distance)
- Test food scale application (verify final scale values)
- Test material property application (verify clearcoat, roughness, metalness)
- Test shadow map configuration (verify resolution, bias)

### Property-Based Tests

#### Landing Page:
- Generate random sessionStorage states and verify correct landing page display logic
- Generate random user entry sequences and verify flag persistence works correctly
- Test across multiple browser contexts (tabs, windows) to verify storage isolation

#### 3D Table:
- Generate random dish configurations and verify lighting quality remains consistent
- Generate random camera zoom levels and verify visual quality is maintained
- Generate random rotation angles and verify food remains visible and well-lit
- Test material appearance across different viewing angles for realism

### Integration Tests

#### Landing Page Flow:
- Test complete user journey: fresh visit → view landing → click enter → use app → refresh → still in app
- Test that clearing storage at any point brings back landing page
- Test that landing page renders correctly with all animations and content

#### 3D Table Visual Quality:
- Test that scene loads with all 4+ lights properly positioned
- Test that food items are clearly visible and properly scaled across all dishes
- Test that camera provides good viewing angle with depth perspective
- Test that materials look refined (marble sheen, gold metallic quality, ceramic glaze)
- Test that shadows are soft and realistic without harsh edges
- Test that performance remains smooth (60fps target) with enhanced visuals
- Test that scene responds correctly to user interactions (drag, zoom) with new camera setup

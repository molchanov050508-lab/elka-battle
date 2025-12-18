// ===== REALISTIC DETAILED CHRISTMAS TREE =====
// High-detailed realistic tree with proper materials and lighting
console.log("🎄 Realistic Detailed Christmas Tree loading...");

class RealisticChristmasTree {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.tree = null;
        this.gifts = [];
        this.decorations = [];
        this.snowflakes = [];
        this.time = 0;
        this.isInitialized = false;
        
        // Realistic settings
        this.settings = {
            treeSegments: 24,           // High poly count
            trunkSegments: 12,
            enableShadows: true,
            enablePostProcessing: false,
            treeScale: 1.0,
            animationSpeed: 1.0,
            snowEnabled: true,
            windEnabled: true
        };
        
        // Colors and materials
        this.materials = {
            pineGreen: 0x1B5E20,       // Dark pine green
            pineGreenLight: 0x388E3C,  // Light pine green
            pineGreenTip: 0x4CAF50,    // Tip green
            trunkBrown: 0x5D4037,      // Dark brown
            trunkDark: 0x3E2723,       // Darker brown
            starGold: 0xFFD700,        // Gold
            starGlow: 0xFFAB00,        // Orange glow
            ornamentRed: 0xF44336,     // Red
            ornamentBlue: 0x2196F3,    // Blue
            ornamentGold: 0xFFC107,    // Gold
            ornamentSilver: 0xE0E0E0,  // Silver
            ribbonRed: 0xD32F2F,       // Dark red
            ribbonGold: 0xFF9800       // Gold ribbon
        };
    }

    init(canvasId = 'tree-canvas') {
        return new Promise((resolve, reject) => {
            try {
                console.log("🎄 Creating Realistic Christmas Tree...");
                
                const canvas = document.getElementById(canvasId);
                if (!canvas) throw new Error('Canvas not found');

                // === 1. SCENE SETUP ===
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x0F172A);
                
                // Add fog for depth
                this.scene.fog = new THREE.FogExp2(0x0F172A, 0.02);

                // === 2. HIGH-QUALITY RENDERER ===
                this.renderer = new THREE.WebGLRenderer({
                    canvas: canvas,
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance',
                    precision: 'highp'
                });
                
                this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                this.renderer.outputEncoding = THREE.sRGBEncoding;
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 1.2;
                
                if (this.settings.enableShadows) {
                    this.renderer.shadowMap.enabled = true;
                    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                }

                // === 3. PERSPECTIVE CAMERA ===
                const width = canvas.clientWidth;
                const height = canvas.clientHeight;
                this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
                this.camera.position.set(3, 4, 8);
                this.camera.lookAt(0, 2, 0);

                // === 4. PROFESSIONAL LIGHTING ===
                this.setupProfessionalLighting();

                // === 5. CREATE REALISTIC TREE ===
                this.createRealisticTree();

                // === 6. CREATE REALISTIC DECORATIONS ===
                this.createRealisticDecorations();

                // === 7. CREATE REALISTIC GIFTS ===
                this.createRealisticGifts();

                // === 8. CREATE SNOW ===
                if (this.settings.snowEnabled) {
                    this.createRealisticSnow();
                }

                // === 9. CREATE GROUND ===
                this.createGround();

                // === 10. ORBIT CONTROLS ===
                if (typeof THREE.OrbitControls !== 'undefined') {
                    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                    this.controls.enableDamping = true;
                    this.controls.dampingFactor = 0.05;
                    this.controls.minDistance = 3;
                    this.controls.maxDistance = 20;
                    this.controls.maxPolarAngle = Math.PI / 2;
                    this.controls.autoRotate = true;
                    this.controls.autoRotateSpeed = 0.5;
                }

                // === 11. START ANIMATION LOOP ===
                this.animate();

                // === 12. HANDLE RESIZE ===
                this.setupResizeHandler();

                this.isInitialized = true;
                console.log("✅ Realistic Christmas Tree ready!");
                
                resolve(this);
                
            } catch (error) {
                console.error('❌ Tree initialization error:', error);
                reject(error);
            }
        });
    }

    setupProfessionalLighting() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(10, 20, 10);
        sunLight.castShadow = this.settings.enableShadows;
        
        if (this.settings.enableShadows) {
            sunLight.shadow.mapSize.width = 2048;
            sunLight.shadow.mapSize.height = 2048;
            sunLight.shadow.camera.near = 0.5;
            sunLight.shadow.camera.far = 50;
            sunLight.shadow.camera.left = -10;
            sunLight.shadow.camera.right = 10;
            sunLight.shadow.camera.top = 10;
            sunLight.shadow.camera.bottom = -10;
            sunLight.shadow.bias = -0.0001;
        }
        
        this.scene.add(sunLight);

        // Fill light for soft shadows
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-10, 10, -10);
        this.scene.add(fillLight);

        // Christmas tree glow light
        const treeLight = new THREE.PointLight(0x32CD32, 1.5, 20);
        treeLight.position.set(0, 3, 0);
        treeLight.castShadow = this.settings.enableShadows;
        this.scene.add(treeLight);
        this.treeLight = treeLight;

        // Rim light for edge definition
        const rimLight = new THREE.DirectionalLight(0x88ccff, 0.2);
        rimLight.position.set(-5, 5, 5);
        this.scene.add(rimLight);
    }

    createRealisticTree() {
        const treeGroup = new THREE.Group();
        treeGroup.name = 'RealisticChristmasTree';

        // === REALISTIC TRUNK ===
        const trunkHeight = 2.0;
        const trunkGeometry = new THREE.CylinderGeometry(
            0.3, 0.5, trunkHeight, this.settings.trunkSegments
        );
        
        // Create bark texture effect programmatically
        const trunkMaterial = new THREE.MeshPhongMaterial({
            color: this.materials.trunkBrown,
            shininess: 10,
            specular: 0x222222,
            bumpScale: 0.05
        });
        
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        treeGroup.add(trunk);

        // === DETAILED TREE LEVELS ===
        const levels = [
            { radius: 2.5, height: 2.0, y: 2.5, segments: this.settings.treeSegments, color: this.materials.pineGreen },
            { radius: 2.0, height: 1.8, y: 3.8, segments: this.settings.treeSegments - 2, color: this.materials.pineGreenLight },
            { radius: 1.5, height: 1.6, y: 4.9, segments: this.settings.treeSegments - 4, color: this.materials.pineGreen },
            { radius: 1.0, height: 1.4, y: 5.8, segments: this.settings.treeSegments - 6, color: this.materials.pineGreenLight },
            { radius: 0.5, height: 1.2, y: 6.5, segments: this.settings.treeSegments - 8, color: this.materials.pineGreenTip }
        ];

        this.treeLevels = [];
        
        levels.forEach((level, index) => {
            const coneGeometry = new THREE.ConeGeometry(
                level.radius,
                level.height,
                level.segments,
                1, // height segments
                false, // open ended
                0, // theta start
                Math.PI * 2 // theta length
            );
            
            // Add surface detail to geometry
            const positionAttribute = coneGeometry.attributes.position;
            const normalAttribute = coneGeometry.attributes.normal;
            
            for (let i = 0; i < positionAttribute.count; i++) {
                const x = positionAttribute.getX(i);
                const y = positionAttribute.getY(i);
                const z = positionAttribute.getZ(i);
                
                // Calculate distance from center
                const distance = Math.sqrt(x * x + z * z);
                const heightRatio = y / level.height;
                
                // Add realistic pine needle effect
                if (distance > 0.1) {
                    const noise = Math.sin(y * 20 + distance * 10) * 0.05;
                    const radialOffset = Math.sin(y * 15) * 0.1;
                    
                    const newX = x * (1 + noise) + (x / distance) * radialOffset;
                    const newZ = z * (1 + noise) + (z / distance) * radialOffset;
                    
                    positionAttribute.setXYZ(i, newX, y, newZ);
                }
            }
            
            positionAttribute.needsUpdate = true;
            coneGeometry.computeVertexNormals();
            
            // Realistic pine material
            const coneMaterial = new THREE.MeshPhongMaterial({
                color: level.color,
                emissive: 0x006400,
                emissiveIntensity: 0.1,
                shininess: 30,
                specular: 0x222222,
                transparent: true,
                opacity: 0.95,
                side: THREE.DoubleSide
            });
            
            const cone = new THREE.Mesh(coneGeometry, coneMaterial);
            cone.position.y = level.y;
            cone.castShadow = true;
            cone.receiveShadow = true;
            treeGroup.add(cone);
            
            this.treeLevels.push({
                mesh: cone,
                baseScale: 1,
                windPhase: Math.random() * Math.PI * 2
            });
        });

        // === DETAILED STAR ===
        this.createDetailedStar(treeGroup);

        // === PINE NEEDLE CLUSTERS ===
        this.createPineNeedles(treeGroup);

        this.tree = treeGroup;
        this.scene.add(treeGroup);

        // Scale tree
        treeGroup.scale.setScalar(this.settings.treeScale);
    }

    createDetailedStar(parent) {
        // Complex star geometry
        const starShape = new THREE.Shape();
        const outerRadius = 0.5;
        const innerRadius = 0.2;
        const points = 5;
        
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / points;
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) starShape.moveTo(x, y);
            else starShape.lineTo(x, y);
        }
        starShape.closePath();
        
        const extrudeSettings = {
            depth: 0.2,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 1,
            bevelSize: 0.05,
            bevelThickness: 0.05
        };
        
        const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
        
        // Realistic gold material
        const starMaterial = new THREE.MeshPhongMaterial({
            color: this.materials.starGold,
            emissive: this.materials.starGlow,
            emissiveIntensity: 0.5,
            shininess: 150,
            specular: 0xFFD700,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.y = 7.2;
        star.rotation.x = Math.PI / 2;
        star.castShadow = true;
        parent.add(star);
        this.star = star;
        
        // Create star glow effect
        const glowGeometry = new THREE.SphereGeometry(0.7, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 7.2;
        parent.add(glow);
        this.starGlow = glow;
    }

    createPineNeedles(parent) {
        const needleCount = 200;
        const needleGeometry = new THREE.ConeGeometry(0.02, 0.2, 3);
        const needleMaterial = new THREE.MeshPhongMaterial({
            color: this.materials.pineGreenTip,
            shininess: 10
        });
        
        this.needles = [];
        
        for (let i = 0; i < needleCount; i++) {
            const needle = new THREE.Mesh(needleGeometry, needleMaterial);
            
            // Position on tree surface
            const level = Math.floor(Math.random() * 5);
            const angle = Math.random() * Math.PI * 2;
            const radius = (1.0 - level * 0.15) * (1.5 + Math.random() * 0.5);
            const y = 2.5 + level * 1.0 + Math.random() * 0.8;
            
            needle.position.set(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );
            
            // Random rotation
            needle.rotation.x = Math.random() * Math.PI;
            needle.rotation.y = Math.random() * Math.PI;
            needle.rotation.z = Math.random() * Math.PI;
            
            needle.userData = {
                windPhase: Math.random() * Math.PI * 2,
                basePosition: needle.position.clone()
            };
            
            parent.add(needle);
            this.needles.push(needle);
        }
    }

    createRealisticDecorations() {
        // === REALISTIC ORNAMENTS ===
        this.createRealisticOrnaments();
        
        // === REALISTIC GARLAND ===
        this.createRealisticGarland();
        
        // === TREE TOP RIBBON ===
        this.createTreeRibbon();
    }

    createRealisticOrnaments() {
        const ornamentCount = 30;
        this.ornaments = [];
        
        const ornamentTypes = [
            { geometry: new THREE.SphereGeometry(0.15, 16, 16), color: this.materials.ornamentRed, type: 'ball' },
            { geometry: new THREE.SphereGeometry(0.12, 16, 16), color: this.materials.ornamentBlue, type: 'ball' },
            { geometry: new THREE.SphereGeometry(0.18, 16, 16), color: this.materials.ornamentGold, type: 'ball' },
            { geometry: new THREE.ConeGeometry(0.1, 0.25, 8), color: this.materials.ornamentSilver, type: 'cone' }
        ];
        
        for (let i = 0; i < ornamentCount; i++) {
            const type = ornamentTypes[Math.floor(Math.random() * ornamentTypes.length)];
            
            // Create shiny ornament material
            const ornamentMaterial = new THREE.MeshPhongMaterial({
                color: type.color,
                emissive: type.color,
                emissiveIntensity: 0.2,
                shininess: 100,
                specular: 0xFFFFFF,
                transparent: true,
                opacity: 0.95
            });
            
            const ornament = new THREE.Mesh(type.geometry, ornamentMaterial);
            
            // Position on tree
            const level = Math.floor(Math.random() * 5);
            const angle = Math.random() * Math.PI * 2;
            const radius = (0.8 - level * 0.1) * (1.0 + Math.random() * 0.5);
            const y = 2.5 + level * 1.0 + Math.random() * 0.8;
            
            ornament.position.set(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );
            
            // Add hook
            const hookGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 6);
            const hookMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
            const hook = new THREE.Mesh(hookGeometry, hookMaterial);
            hook.position.y = 0.1;
            ornament.add(hook);
            
            ornament.castShadow = true;
            ornament.userData = {
                type: 'ornament',
                rotationSpeed: 0.01 + Math.random() * 0.02,
                floatSpeed: Math.random() * 0.005,
                floatPhase: Math.random() * Math.PI * 2,
                baseY: y
            };
            
            this.scene.add(ornament);
            this.ornaments.push(ornament);
            this.decorations.push(ornament);
        }
    }

    createRealisticGarland() {
        const garlandPoints = [];
        const segments = 50;
        
        // Create spiral garland
        for (let i = 0; i <= segments; i++) {
            const progress = i / segments;
            const angle = progress * Math.PI * 2 * 3; // 3 turns
            
            // Spiral parameters
            const radius = 1.8 * (1 - progress * 0.3);
            const y = 2.0 + progress * 5.0;
            
            garlandPoints.push(
                new THREE.Vector3(
                    Math.cos(angle) * radius,
                    y,
                    Math.sin(angle) * radius
                )
            );
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(garlandPoints);
        const material = new THREE.LineBasicMaterial({
            color: 0xFF4444,
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });
        
        this.garland = new THREE.Line(geometry, material);
        this.scene.add(this.garland);
        
        // Add garland bulbs
        this.garlandBulbs = [];
        for (let i = 0; i < segments; i += 3) {
            const point = garlandPoints[i];
            const bulbGeometry = new THREE.SphereGeometry(0.08, 8, 8);
            const bulbMaterial = new THREE.MeshPhongMaterial({
                color: Math.random() > 0.5 ? 0xFF4444 : 0x44FF44,
                emissive: Math.random() > 0.5 ? 0xFF4444 : 0x44FF44,
                emissiveIntensity: 0.5,
                shininess: 100
            });
            
            const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
            bulb.position.copy(point);
            this.scene.add(bulb);
            this.garlandBulbs.push(bulb);
        }
    }

    createTreeRibbon() {
        const ribbonWidth = 0.1;
        const ribbonHeight = 4.0;
        const ribbonGeometry = new THREE.PlaneGeometry(ribbonWidth, ribbonHeight);
        const ribbonMaterial = new THREE.MeshPhongMaterial({
            color: this.materials.ribbonRed,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        
        const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        ribbon.position.y = ribbonHeight / 2 + 1;
        ribbon.rotation.y = Math.PI / 4;
        this.scene.add(ribbon);
        
        // Add second ribbon
        const ribbon2 = ribbon.clone();
        ribbon2.rotation.y = -Math.PI / 4;
        this.scene.add(ribbon2);
    }

    createRealisticGifts() {
        const giftConfigs = [
            { x: -2.0, z: -1.5, color: this.materials.ornamentRed, size: 0.6, ribbon: this.materials.ribbonGold },
            { x: 1.8, z: -1.0, color: this.materials.ornamentBlue, size: 0.5, ribbon: 0xFFFFFF },
            { x: -1.2, z: 1.8, color: this.materials.ornamentGold, size: 0.7, ribbon: this.materials.ribbonRed },
            { x: 1.5, z: 1.2, color: 0x9C27B0, size: 0.55, ribbon: 0xFFFFFF }
        ];
        
        this.gifts = [];
        
        giftConfigs.forEach((config, index) => {
            const gift = this.createDetailedGift(
                config.x,
                0.2,
                config.z,
                config.color,
                config.size,
                config.ribbon
            );
            
            this.gifts.push(gift);
            this.scene.add(gift);
            
            // Animate entrance
            this.animateGiftEntrance(gift, index * 300);
        });
    }

    createDetailedGift(x, y, z, color, size, ribbonColor) {
        const giftGroup = new THREE.Group();
        
        // Main gift box
        const boxGeometry = new THREE.BoxGeometry(size, size, size);
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 80,
            specular: 0x333333,
            emissive: color,
            emissiveIntensity: 0.1
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;
        box.receiveShadow = true;
        giftGroup.add(box);
        
        // Ribbons with thickness
        const ribbonGeometry = new THREE.BoxGeometry(size * 1.3, size * 0.08, size * 0.08);
        const ribbonMaterial = new THREE.MeshPhongMaterial({
            color: ribbonColor,
            shininess: 150,
            specular: 0x888888
        });
        
        // Horizontal ribbon
        const ribbonH = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        ribbonH.castShadow = true;
        giftGroup.add(ribbonH);
        
        // Vertical ribbon
        const ribbonVGeometry = new THREE.BoxGeometry(size * 0.08, size * 1.3, size * 0.08);
        const ribbonV = new THREE.Mesh(ribbonVGeometry, ribbonMaterial);
        ribbonV.castShadow = true;
        giftGroup.add(ribbonV);
        
        // Bow on top
        this.createDetailedBow(giftGroup, size, ribbonColor);
        
        giftGroup.position.set(x, y + size / 2, z);
        
        giftGroup.userData = {
            type: 'gift',
            baseY: y + size / 2,
            floatPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.005 + Math.random() * 0.01,
            wobblePhase: Math.random() * Math.PI * 2
        };
        
        return giftGroup;
    }

    createDetailedBow(parent, giftSize, ribbonColor) {
        const bowGroup = new THREE.Group();
        
        // Bow loops
        const loopGeometry = new THREE.TorusGeometry(giftSize * 0.15, giftSize * 0.05, 8, 12);
        const loopMaterial = new THREE.MeshPhongMaterial({
            color: ribbonColor,
            shininess: 120
        });
        
        const loop1 = new THREE.Mesh(loopGeometry, loopMaterial);
        loop1.rotation.x = Math.PI / 2;
        loop1.position.y = giftSize * 0.6;
        bowGroup.add(loop1);
        
        const loop2 = loop1.clone();
        loop2.rotation.z = Math.PI / 2;
        bowGroup.add(loop2);
        
        // Bow center
        const centerGeometry = new THREE.SphereGeometry(giftSize * 0.08, 10, 10);
        const center = new THREE.Mesh(centerGeometry, loopMaterial);
        center.position.y = giftSize * 0.6;
        bowGroup.add(center);
        
        parent.add(bowGroup);
    }

    createRealisticSnow() {
        const snowflakeCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(snowflakeCount * 3);
        const sizes = new Float32Array(snowflakeCount);
        const velocities = new Float32Array(snowflakeCount);
        
        for (let i = 0; i < snowflakeCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;     // x
            positions[i * 3 + 1] = Math.random() * 15;        // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
            
            sizes[i] = Math.random() * 0.1 + 0.05;            // size
            velocities[i] = Math.random() * 0.02 + 0.01;      // fall speed
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.snow = new THREE.Points(geometry, material);
        this.snow.userData = {
            velocities: velocities,
            positions: positions
        };
        this.scene.add(this.snow);
    }

    createGround() {
        const groundGeometry = new THREE.CircleGeometry(10, 32);
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x1A237E,
            shininess: 10,
            side: THREE.DoubleSide
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Add snow on ground
        const snowGeometry = new THREE.CircleGeometry(8, 32);
        const snowMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const snowGround = new THREE.Mesh(snowGeometry, snowMaterial);
        snowGround.rotation.x = -Math.PI / 2;
        snowGround.position.y = -0.09;
        this.scene.add(snowGround);
    }

    animateGiftEntrance(gift, delay = 0) {
        const targetY = gift.position.y;
        gift.position.y = -3;
        gift.scale.set(0.1, 0.1, 0.1);
        
        setTimeout(() => {
            const startTime = Date.now();
            const duration = 1500;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Elastic ease out with bounce
                const ease = 1 - Math.pow(1 - progress, 4);
                const bounce = Math.sin(progress * Math.PI * 4) * (1 - progress) * 0.5;
                
                gift.position.y = -3 + (targetY + 3) * ease + bounce;
                gift.scale.setScalar(0.1 + 0.9 * ease);
                gift.rotation.y = progress * Math.PI * 8;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
        }, delay);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.render();
    }

    update() {
        const deltaTime = 0.016; // 60fps
        this.time += deltaTime * this.settings.animationSpeed;
        
        // === TREE WIND ANIMATION ===
        if (this.treeLevels && this.settings.windEnabled) {
            const windStrength = Math.sin(this.time * 0.5) * 0.02;
            
            this.treeLevels.forEach((level, index) => {
                const windPhase = level.windPhase + this.time * (0.5 + index * 0.1);
                const wind = Math.sin(windPhase) * windStrength * (1 - index * 0.2);
                
                level.mesh.rotation.z = wind;
                level.mesh.rotation.x = wind * 0.5;
            });
        }
        
        // === NEEDLE WIND ANIMATION ===
        if (this.needles && this.settings.windEnabled) {
            this.needles.forEach(needle => {
                const windPhase = needle.userData.windPhase + this.time * 2;
                const wind = Math.sin(windPhase) * 0.1;
                
                needle.rotation.x += wind * deltaTime;
                needle.rotation.y += wind * 0.5 * deltaTime;
            });
        }
        
        // === STAR ANIMATION ===
        if (this.star) {
            this.star.rotation.y += deltaTime;
            const pulse = Math.sin(this.time * 2) * 0.15 + 0.85;
            this.star.scale.setScalar(pulse);
            
            if (this.starGlow) {
                this.starGlow.scale.setScalar(1 + Math.sin(this.time * 3) * 0.2);
                this.starGlow.rotation.y += deltaTime * 0.3;
            }
            
            // Star glow intensity
            if (this.star.material.emissiveIntensity !== undefined) {
                this.star.material.emissiveIntensity = 0.5 + Math.sin(this.time * 3) * 0.3;
            }
        }
        
        // === ORNAMENTS ANIMATION ===
        if (this.ornaments) {
            this.ornaments.forEach(ornament => {
                ornament.rotation.y += ornament.userData.rotationSpeed;
                
                // Gentle floating
                const float = Math.sin(this.time * ornament.userData.floatSpeed + 
                    ornament.userData.floatPhase) * 0.05;
                ornament.position.y = ornament.userData.baseY + float;
                
                // Gentle swing
                ornament.rotation.x = Math.sin(this.time * 0.3 + ornament.userData.floatPhase) * 0.05;
            });
        }
        
        // === GARLAND BULBS ANIMATION ===
        if (this.garlandBulbs) {
            this.garlandBulbs.forEach((bulb, index) => {
                const pulse = Math.sin(this.time * 3 + index * 0.3) * 0.3 + 0.7;
                bulb.scale.setScalar(pulse);
                
                // Twinkle effect
                if (Math.random() > 0.98) {
                    bulb.visible = !bulb.visible;
                    setTimeout(() => bulb.visible = true, 50);
                }
            });
        }
        
        // === GIFTS ANIMATION ===
        this.gifts.forEach(gift => {
            gift.rotation.y += gift.userData.rotationSpeed;
            
            // Floating
            const float = Math.sin(this.time + gift.userData.floatPhase) * 0.03;
            gift.position.y = gift.userData.baseY + float;
            
            // Gentle wobble
            gift.rotation.z = Math.sin(this.time * 0.5 + gift.userData.wobblePhase) * 0.02;
        });
        
        // === TREE LIGHT ANIMATION ===
        if (this.treeLight) {
            const lightPulse = Math.sin(this.time * 1.5) * 0.4 + 0.6;
            this.treeLight.intensity = 1.0 + lightPulse * 0.5;
            
            // Color shift
            const hue = (this.time * 0.02) % 1;
            this.treeLight.color.setHSL(hue, 0.8, 0.7);
        }
        
        // === SNOW ANIMATION ===
        if (this.snow && this.settings.snowEnabled) {
            const positions = this.snow.userData.positions;
            const velocities = this.snow.userData.velocities;
            
            for (let i = 0; i < positions.length / 3; i++) {
                // Move down
                positions[i * 3 + 1] -= velocities[i];
                
                // Gentle horizontal drift
                positions[i * 3] += Math.sin(this.time * 0.5 + i) * 0.005;
                positions[i * 3 + 2] += Math.cos(this.time * 0.5 + i) * 0.005;
                
                // Reset if too low
                if (positions[i * 3 + 1] < -5) {
                    positions[i * 3] = (Math.random() - 0.5) * 20;
                    positions[i * 3 + 1] = 15;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
                }
            }
            
            this.snow.geometry.attributes.position.needsUpdate = true;
        }
        
        // === CONTROLS UPDATE ===
        if (this.controls) {
            this.controls.update();
        }
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            if (!this.renderer || !this.camera) return;
            
            const canvas = this.renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    // === PUBLIC API ===
    
    addGift() {
        const colors = [
            this.materials.ornamentRed,
            this.materials.ornamentBlue,
            this.materials.ornamentGold,
            0x9C27B0, // Purple
            0x4CAF50, // Green
            0xFF9800  // Orange
        ];
        
        const ribbonColors = [0xFFFFFF, 0xFFD700, 0xF44336, 0x2196F3];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const ribbonColor = ribbonColors[Math.floor(Math.random() * ribbonColors.length)];
        const size = 0.4 + Math.random() * 0.3;
        const x = (Math.random() - 0.5) * 4;
        const z = (Math.random() - 0.5) * 4;
        
        const gift = this.createDetailedGift(x, 0.2, z, color, size, ribbonColor);
        this.gifts.push(gift);
        this.scene.add(gift);
        
        // Animate entrance
        this.animateGiftEntrance(gift, 0);
        
        return gift;
    }
    
    toggleSnow() {
        if (this.snow) {
            this.settings.snowEnabled = !this.settings.snowEnabled;
            this.snow.visible = this.settings.snowEnabled;
            return this.settings.snowEnabled;
        }
        return false;
    }
    
    setTreeScale(scale) {
        this.settings.treeScale = Math.max(0.5, Math.min(scale, 2.0));
        if (this.tree) {
            this.tree.scale.setScalar(this.settings.treeScale);
        }
    }
    
    toggleWind() {
        this.settings.windEnabled = !this.settings.windEnabled;
        return this.settings.windEnabled;
    }
    
    dispose() {
        if (this.controls) {
            this.controls.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        console.log('🎄 Realistic tree disposed');
    }
}

// === GLOBAL INITIALIZATION ===
window.initTree3D = function() {
    console.log('🎄 Initializing Realistic Christmas Tree...');
    
    try {
        const realisticTree = new RealisticChristmasTree();
        realisticTree.init('tree-canvas').then(tree => {
            window.RealisticTree = tree;
            console.log('✅ Realistic Tree ready!');
            
            // Connect UI
            const addBtn = document.getElementById('add-gift-btn');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    tree.addGift();
                    
                    // Haptic feedback for Telegram
                    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) {
                        Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                    }
                });
            }
            
        }).catch(error => {
            console.error('Tree initialization failed:', error);
        });
        
    } catch (error) {
        console.error('Failed to initialize tree:', error);
    }
};

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initTree3D);
} else {
    setTimeout(window.initTree3D, 100);
}

console.log('🎄 Realistic Detailed Christmas Tree script loaded!');

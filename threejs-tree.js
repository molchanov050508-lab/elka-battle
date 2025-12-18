// ===== ELEGANT CHRISTMAS TREE =====
// Beautiful tree with optimized performance
console.log("🎄 Elegant Christmas Tree loading...");

class ElegantChristmasTree {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.tree = null;
        this.gifts = [];
        this.decorations = [];
        this.time = 0;
        this.isInitialized = false;
        
        // Optimized settings
        this.settings = {
            enableShadows: true,
            treeScale: 1.0,
            animationSpeed: 1.0,
            snowEnabled: false,
            windEnabled: true,
            lightsEnabled: true
        };
        
        // Harmonious color palette
        this.colors = {
            treeDarkGreen: 0x1B5E20,
            treeGreen: 0x2E7D32,
            treeLightGreen: 0x4CAF50,
            trunkBrown: 0x5D4037,
            starGold: 0xFFD700,
            starGlow: 0xFFAB00,
            ornamentRed: 0xF44336,
            ornamentBlue: 0x2196F3,
            ornamentGold: 0xFFC107,
            ornamentSilver: 0xE0E0E0,
            ornamentGreen: 0x4CAF50,
            ornamentPurple: 0x9C27B0,
            ribbonGold: 0xFF9800,
            ribbonSilver: 0xE0E0E0,
            groundBlue: 0x1A237E,
            groundSnow: 0xFFFFFF
        };
    }

    init(canvasId = 'tree-canvas') {
        return new Promise((resolve, reject) => {
            try {
                console.log("🎄 Creating Elegant Christmas Tree...");
                
                const canvas = document.getElementById(canvasId);
                if (!canvas) throw new Error('Canvas not found');

                // === SCENE SETUP ===
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x0F172A);
                
                // Gentle fog for depth
                this.scene.fog = new THREE.FogExp2(0x0F172A, 0.015);

                // === RENDERER ===
                this.renderer = new THREE.WebGLRenderer({
                    canvas: canvas,
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                });
                
                this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                this.renderer.outputEncoding = THREE.sRGBEncoding;
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 1.1;
                
                if (this.settings.enableShadows) {
                    this.renderer.shadowMap.enabled = true;
                    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                }

                // === CAMERA ===
                const width = canvas.clientWidth;
                const height = canvas.clientHeight;
                this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
                this.camera.position.set(0, 3, 10);
                this.camera.lookAt(0, 2, 0);

                // === LIGHTING ===
                this.setupElegantLighting();

                // === CREATE TREE ===
                this.createElegantTree();

                // === DECORATIONS ===
                this.createElegantDecorations();

                // === GIFTS ===
                this.createElegantGifts();

                // === GROUND ===
                this.createElegantGround();

                // === CONTROLS ===
                if (typeof THREE.OrbitControls !== 'undefined') {
                    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                    this.controls.enableDamping = true;
                    this.controls.dampingFactor = 0.05;
                    this.controls.minDistance = 5;
                    this.controls.maxDistance = 15;
                    this.controls.maxPolarAngle = Math.PI / 2;
                    this.controls.autoRotate = true;
                    this.controls.autoRotateSpeed = 0.3;
                }

                // === ANIMATION ===
                this.animate();

                // === RESIZE HANDLER ===
                this.setupResizeHandler();

                this.isInitialized = true;
                console.log("✅ Elegant Christmas Tree ready!");
                
                resolve(this);
                
            } catch (error) {
                console.error('❌ Tree initialization error:', error);
                reject(error);
            }
        });
    }

    setupElegantLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main light
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = this.settings.enableShadows;
        
        if (this.settings.enableShadows) {
            mainLight.shadow.mapSize.width = 1024;
            mainLight.shadow.mapSize.height = 1024;
            mainLight.shadow.camera.near = 0.5;
            mainLight.shadow.camera.far = 50;
            mainLight.shadow.bias = -0.001;
        }
        
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Tree glow
        const treeLight = new THREE.PointLight(0x4CAF50, 1.2, 15);
        treeLight.position.set(0, 3, 0);
        this.scene.add(treeLight);
        this.treeLight = treeLight;

        // Accent light for ornaments
        const accentLight = new THREE.PointLight(0xFFD700, 0.5, 10);
        accentLight.position.set(2, 4, 2);
        this.scene.add(accentLight);
    }

    createElegantTree() {
        const treeGroup = new THREE.Group();
        treeGroup.name = 'ElegantChristmasTree';

        // === TRUNK ===
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2.0, 8);
        const trunkMaterial = new THREE.MeshPhongMaterial({
            color: this.colors.trunkBrown,
            shininess: 15,
            specular: 0x111111
        });
        
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.0;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        treeGroup.add(trunk);

        // === LAYERED BRANCHES ===
        this.createLayeredBranches(treeGroup);

        // === TREE TOP STAR ===
        this.createTreeStar(treeGroup);

        this.tree = treeGroup;
        this.scene.add(treeGroup);
        treeGroup.scale.setScalar(this.settings.treeScale);
    }

    createLayeredBranches(parent) {
        const layers = 6;
        this.branches = [];
        
        for (let layer = 0; layer < layers; layer++) {
            const layerHeight = 2.0 + layer * 0.8;
            const layerRadius = 1.8 - layer * 0.25;
            const branchCount = 8 + layer * 2;
            
            // Create layer group
            const layerGroup = new THREE.Group();
            layerGroup.position.y = layerHeight;
            
            for (let i = 0; i < branchCount; i++) {
                const angle = (i / branchCount) * Math.PI * 2;
                const branch = this.createSingleBranch(angle, layer);
                layerGroup.add(branch);
                
                this.branches.push({
                    mesh: branch,
                    baseRotation: angle,
                    layer: layer,
                    swayPhase: Math.random() * Math.PI * 2
                });
            }
            
            parent.add(layerGroup);
            
            // Add some needles to this layer
            this.addNeedleClusters(layerGroup, layer);
        }
    }

    createSingleBranch(angle, layer) {
        const branchGroup = new THREE.Group();
        
        // Branch curve
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.cos(angle) * 0.3, -0.2, Math.sin(angle) * 0.3),
            new THREE.Vector3(Math.cos(angle) * (1.5 - layer * 0.2), -0.8, Math.sin(angle) * (1.5 - layer * 0.2))
        );
        
        // Tube geometry for branch
        const tubeGeometry = new THREE.TubeGeometry(
            curve,
            5, // segments
            0.08 - layer * 0.01, // radius
            6, // radial segments
            false // closed
        );
        
        // Color based on layer
        const greenColor = layer % 2 === 0 ? this.colors.treeGreen : this.colors.treeLightGreen;
        
        const branchMaterial = new THREE.MeshPhongMaterial({
            color: greenColor,
            shininess: 20,
            side: THREE.DoubleSide
        });
        
        const branch = new THREE.Mesh(tubeGeometry, branchMaterial);
        branch.castShadow = true;
        branch.receiveShadow = true;
        
        branchGroup.add(branch);
        
        // Add sub-branches
        const subBranches = 2 + Math.floor(layer / 2);
        for (let j = 0; j < subBranches; j++) {
            const subBranch = this.createSubBranch();
            subBranch.position.copy(curve.getPoint(0.3 + j * 0.3));
            branchGroup.add(subBranch);
        }
        
        return branchGroup;
    }

    createSubBranch() {
        const length = 0.3 + Math.random() * 0.3;
        const geometry = new THREE.ConeGeometry(0.03, length, 4);
        geometry.rotateX(Math.PI / 2);
        
        const material = new THREE.MeshPhongMaterial({
            color: this.colors.treeLightGreen,
            side: THREE.DoubleSide
        });
        
        const branch = new THREE.Mesh(geometry, material);
        branch.castShadow = true;
        
        // Random rotation
        branch.rotation.y = Math.random() * Math.PI;
        branch.rotation.z = Math.random() * 0.5 - 0.25;
        
        return branch;
    }

    addNeedleClusters(parent, layer) {
        const clusterCount = 10 + layer * 5;
        
        for (let i = 0; i < clusterCount; i++) {
            const cluster = new THREE.Group();
            
            // Cluster position
            const angle = Math.random() * Math.PI * 2;
            const distance = 0.5 + Math.random() * (1.0 - layer * 0.15);
            
            cluster.position.set(
                Math.cos(angle) * distance,
                Math.random() * 0.5 - 0.25,
                Math.sin(angle) * distance
            );
            
            // Create needles in cluster
            const needles = 3 + Math.floor(Math.random() * 4);
            for (let j = 0; j < needles; j++) {
                const needle = this.createNeedle();
                needle.position.set(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1
                );
                cluster.add(needle);
            }
            
            parent.add(cluster);
        }
    }

    createNeedle() {
        const geometry = new THREE.ConeGeometry(0.01, 0.15, 3);
        const material = new THREE.MeshBasicMaterial({
            color: this.colors.treeLightGreen
        });
        
        const needle = new THREE.Mesh(geometry, material);
        needle.rotation.x = Math.random() * Math.PI;
        needle.rotation.y = Math.random() * Math.PI;
        
        return needle;
    }

    createTreeStar(parent) {
        // Star geometry
        const starGeometry = new THREE.SphereGeometry(0.15, 8, 6);
        const starMaterial = new THREE.MeshPhongMaterial({
            color: this.colors.starGold,
            emissive: this.colors.starGlow,
            emissiveIntensity: 0.3,
            shininess: 100
        });
        
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.y = 6.8;
        star.castShadow = true;
        parent.add(star);
        this.star = star;
        
        // Glow effect
        const glowGeometry = new THREE.SphereGeometry(0.25, 12, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.starGlow,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 6.8;
        parent.add(glow);
        this.starGlow = glow;
        
        // Light rays
        this.createStarRays(parent);
    }

    createStarRays(parent) {
        const rayCount = 6;
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            const length = 0.4;
            
            const rayGeometry = new THREE.ConeGeometry(0.02, length, 4);
            rayGeometry.rotateX(Math.PI / 2);
            
            const rayMaterial = new THREE.MeshBasicMaterial({
                color: this.colors.starGold,
                transparent: true,
                opacity: 0.5
            });
            
            const ray = new THREE.Mesh(rayGeometry, rayMaterial);
            ray.position.y = 6.8;
            ray.rotation.y = angle;
            ray.rotation.z = Math.PI / 4;
            
            parent.add(ray);
        }
    }

    createElegantDecorations() {
        this.createOrnaments();
        this.createGarland();
    }

    createOrnaments() {
        this.ornaments = [];
        const ornamentCount = 25;
        
        const ornamentTypes = [
            { shape: 'sphere', size: 0.1, color: this.colors.ornamentRed },
            { shape: 'sphere', size: 0.08, color: this.colors.ornamentBlue },
            { shape: 'sphere', size: 0.12, color: this.colors.ornamentGold },
            { shape: 'cone', size: 0.15, color: this.colors.ornamentSilver },
            { shape: 'sphere', size: 0.09, color: this.colors.ornamentGreen },
            { shape: 'sphere', size: 0.11, color: this.colors.ornamentPurple }
        ];
        
        for (let i = 0; i < ornamentCount; i++) {
            const type = ornamentTypes[Math.floor(Math.random() * ornamentTypes.length)];
            let geometry;
            
            if (type.shape === 'sphere') {
                geometry = new THREE.SphereGeometry(type.size, 12, 10);
            } else {
                geometry = new THREE.ConeGeometry(type.size * 0.4, type.size * 1.5, 8);
            }
            
            const material = new THREE.MeshPhongMaterial({
                color: type.color,
                shininess: 80,
                specular: 0x333333,
                emissive: type.color,
                emissiveIntensity: 0.1
            });
            
            const ornament = new THREE.Mesh(geometry, material);
            
            // Position on tree
            const layer = Math.floor(Math.random() * 4) + 1;
            const angle = Math.random() * Math.PI * 2;
            const distance = 0.8 - layer * 0.15;
            const height = 1.5 + layer * 1.0 + Math.random() * 0.5;
            
            ornament.position.set(
                Math.cos(angle) * distance,
                height,
                Math.sin(angle) * distance
            );
            
            ornament.castShadow = true;
            
            // Hook
            const hookGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.05, 6);
            const hookMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
            const hook = new THREE.Mesh(hookGeometry, hookMaterial);
            hook.position.y = type.size + 0.03;
            ornament.add(hook);
            
            ornament.userData = {
                rotationSpeed: 0.005 + Math.random() * 0.01,
                floatPhase: Math.random() * Math.PI * 2,
                baseY: height,
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            this.scene.add(ornament);
            this.ornaments.push(ornament);
            this.decorations.push(ornament);
        }
    }

    createGarland() {
        const points = [];
        const segments = 40;
        
        // Spiral garland
        for (let i = 0; i <= segments; i++) {
            const progress = i / segments;
            const angle = progress * Math.PI * 2 * 2.5;
            
            const radius = 1.2 * (1 - progress * 0.4);
            const height = 1.2 + progress * 5.0;
            
            points.push(
                new THREE.Vector3(
                    Math.cos(angle) * radius,
                    height,
                    Math.sin(angle) * radius
                )
            );
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xFF4444,
            transparent: true,
            opacity: 0.7
        });
        
        this.garland = new THREE.Line(geometry, material);
        this.scene.add(this.garland);
        
        // Garland lights
        this.garlandLights = [];
        for (let i = 0; i < segments; i += 2) {
            const point = points[i];
            const lightGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const lightMaterial = new THREE.MeshPhongMaterial({
                color: Math.random() > 0.5 ? 0xFF4444 : 0x44FF44,
                emissive: Math.random() > 0.5 ? 0xFF4444 : 0x44FF44,
                emissiveIntensity: 0.3
            });
            
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.copy(point);
            this.scene.add(light);
            this.garlandLights.push(light);
        }
    }

    createElegantGifts() {
        const giftConfigs = [
            { x: -1.8, z: -1.2, color: this.colors.ornamentRed, size: 0.5, ribbon: this.colors.ribbonGold },
            { x: 1.6, z: -0.9, color: this.colors.ornamentBlue, size: 0.45, ribbon: this.colors.ribbonSilver },
            { x: -1.0, z: 1.6, color: this.colors.ornamentGold, size: 0.6, ribbon: this.colors.ornamentRed },
            { x: 1.2, z: 1.0, color: this.colors.ornamentPurple, size: 0.4, ribbon: this.colors.ribbonGold }
        ];
        
        this.gifts = [];
        
        giftConfigs.forEach((config, index) => {
            const gift = this.createGift(
                config.x,
                0.15,
                config.z,
                config.color,
                config.size,
                config.ribbon
            );
            
            this.gifts.push(gift);
            this.scene.add(gift);
            
            this.animateGiftEntrance(gift, index * 200);
        });
    }

    createGift(x, y, z, color, size, ribbonColor) {
        const giftGroup = new THREE.Group();
        
        // Box
        const boxGeometry = new THREE.BoxGeometry(size, size, size);
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 60
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;
        box.receiveShadow = true;
        giftGroup.add(box);
        
        // Ribbons
        const ribbonGeometry = new THREE.BoxGeometry(size * 1.2, size * 0.1, size * 0.1);
        const ribbonMaterial = new THREE.MeshPhongMaterial({
            color: ribbonColor,
            shininess: 100
        });
        
        const ribbonH = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        const ribbonV = ribbonH.clone();
        ribbonV.rotation.y = Math.PI / 2;
        
        giftGroup.add(ribbonH);
        giftGroup.add(ribbonV);
        
        // Bow
        this.createBow(giftGroup, size * 0.6, ribbonColor);
        
        giftGroup.position.set(x, y + size / 2, z);
        
        giftGroup.userData = {
            baseY: y + size / 2,
            floatPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.003 + Math.random() * 0.005
        };
        
        return giftGroup;
    }

    createBow(parent, size, color) {
        const bowGroup = new THREE.Group();
        
        // Loops
        const loopGeometry = new THREE.TorusGeometry(size * 0.2, size * 0.05, 6, 10);
        const loopMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 80
        });
        
        const loop1 = new THREE.Mesh(loopGeometry, loopMaterial);
        loop1.rotation.x = Math.PI / 2;
        loop1.position.y = size * 0.7;
        bowGroup.add(loop1);
        
        const loop2 = loop1.clone();
        loop2.rotation.z = Math.PI / 2;
        bowGroup.add(loop2);
        
        // Center
        const centerGeometry = new THREE.SphereGeometry(size * 0.08, 8, 8);
        const center = new THREE.Mesh(centerGeometry, loopMaterial);
        center.position.y = size * 0.7;
        bowGroup.add(center);
        
        parent.add(bowGroup);
    }

    createElegantGround() {
        // Ground
        const groundGeometry = new THREE.CircleGeometry(8, 24);
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: this.colors.groundBlue,
            shininess: 5
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.05;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Snow patch
        const snowGeometry = new THREE.CircleGeometry(6, 20);
        const snowMaterial = new THREE.MeshPhongMaterial({
            color: this.colors.groundSnow,
            transparent: true,
            opacity: 0.7
        });
        
        const snow = new THREE.Mesh(snowGeometry, snowMaterial);
        snow.rotation.x = -Math.PI / 2;
        snow.position.y = -0.04;
        this.scene.add(snow);
    }

    animateGiftEntrance(gift, delay) {
        setTimeout(() => {
            const startY = -2;
            const targetY = gift.position.y;
            gift.position.y = startY;
            gift.scale.set(0.1, 0.1, 0.1);
            
            const startTime = Date.now();
            const duration = 1200;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Elastic ease out
                const ease = 1 - Math.pow(1 - progress, 3);
                const bounce = Math.sin(progress * Math.PI * 3) * (1 - progress) * 0.3;
                
                gift.position.y = startY + (targetY - startY) * ease + bounce;
                gift.scale.setScalar(0.1 + 0.9 * ease);
                gift.rotation.y = progress * Math.PI * 4;
                
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
        const delta = 0.016;
        this.time += delta * this.settings.animationSpeed;
        
        // === BRANCHES SWAY ===
        if (this.branches && this.settings.windEnabled) {
            this.branches.forEach(branch => {
                const sway = Math.sin(this.time * 0.8 + branch.swayPhase) * 0.02;
                const verticalSway = Math.sin(this.time * 0.5 + branch.swayPhase) * 0.01;
                
                branch.mesh.rotation.z = sway * (1 - branch.layer * 0.1);
                branch.mesh.position.y += verticalSway * 0.1;
            });
        }
        
        // === STAR ANIMATION ===
        if (this.star) {
            this.star.rotation.y += delta * 0.5;
            
            const pulse = Math.sin(this.time * 1.5) * 0.1 + 0.9;
            this.star.scale.setScalar(pulse);
            
            if (this.starGlow) {
                const glowPulse = Math.sin(this.time * 2) * 0.15 + 0.85;
                this.starGlow.scale.setScalar(glowPulse);
                
                // Color pulse
                const intensity = 0.2 + Math.sin(this.time * 1.8) * 0.1;
                this.star.material.emissiveIntensity = intensity;
            }
        }
        
        // === ORNAMENTS ANIMATION ===
        if (this.ornaments) {
            this.ornaments.forEach(ornament => {
                ornament.rotation.y += ornament.userData.rotationSpeed;
                
                // Gentle float
                const float = Math.sin(this.time * 0.5 + ornament.userData.floatPhase) * 0.03;
                ornament.position.y = ornament.userData.baseY + float;
                
                // Gentle swing
                const swing = Math.sin(this.time * 0.3 + ornament.userData.floatPhase) * 0.04;
                ornament.rotation.x = swing;
                
                // Pulse glow
                const pulse = Math.sin(this.time * 1.2 + ornament.userData.pulsePhase) * 0.1 + 0.9;
                ornament.material.emissiveIntensity = 0.1 * pulse;
            });
        }
        
        // === GARLAND LIGHTS ===
        if (this.garlandLights) {
            this.garlandLights.forEach((light, index) => {
                const pulse = Math.sin(this.time * 2 + index * 0.3) * 0.2 + 0.8;
                light.scale.setScalar(pulse);
                
                // Random twinkle
                if (Math.random() > 0.99) {
                    light.material.emissiveIntensity = 1;
                    setTimeout(() => {
                        light.material.emissiveIntensity = 0.3;
                    }, 50);
                }
            });
        }
        
        // === GIFTS ANIMATION ===
        this.gifts.forEach(gift => {
            gift.rotation.y += gift.userData.rotationSpeed;
            
            const float = Math.sin(this.time + gift.userData.floatPhase) * 0.02;
            gift.position.y = gift.userData.baseY + float;
            
            // Gentle wobble
            const wobble = Math.sin(this.time * 0.4 + gift.userData.floatPhase) * 0.015;
            gift.rotation.z = wobble;
        });
        
        // === TREE LIGHT ===
        if (this.treeLight && this.settings.lightsEnabled) {
            const pulse = Math.sin(this.time * 0.8) * 0.2 + 0.8;
            this.treeLight.intensity = 0.8 + pulse * 0.4;
            
            // Subtle color shift
            const hueShift = Math.sin(this.time * 0.1) * 0.05;
            const color = new THREE.Color(0x4CAF50).offsetHSL(hueShift, 0, 0);
            this.treeLight.color.copy(color);
        }
        
        // === CONTROLS ===
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
        const resize = () => {
            if (!this.renderer || !this.camera) return;
            
            const canvas = this.renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        };
        
        window.addEventListener('resize', resize);
        this.resizeHandler = resize;
    }

    // === PUBLIC API ===
    
    addGift() {
        const colors = [
            this.colors.ornamentRed,
            this.colors.ornamentBlue,
            this.colors.ornamentGold,
            this.colors.ornamentPurple,
            this.colors.ornamentGreen,
            this.colors.treeLightGreen
        ];
        
        const ribbonColors = [this.colors.ribbonGold, this.colors.ribbonSilver, 0xFFFFFF];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const ribbonColor = ribbonColors[Math.floor(Math.random() * ribbonColors.length)];
        const size = 0.35 + Math.random() * 0.25;
        const x = (Math.random() - 0.5) * 3;
        const z = (Math.random() - 0.5) * 3;
        
        const gift = this.createGift(x, 0.15, z, color, size, ribbonColor);
        this.gifts.push(gift);
        this.scene.add(gift);
        
        this.animateGiftEntrance(gift, 0);
        
        return gift;
    }
    
    toggleLights() {
        this.settings.lightsEnabled = !this.settings.lightsEnabled;
        if (this.treeLight) {
            this.treeLight.visible = this.settings.lightsEnabled;
        }
        return this.settings.lightsEnabled;
    }
    
    toggleWind() {
        this.settings.windEnabled = !this.settings.windEnabled;
        return this.settings.windEnabled;
    }
    
    setScale(scale) {
        this.settings.treeScale = Math.max(0.6, Math.min(scale, 1.5));
        if (this.tree) {
            this.tree.scale.setScalar(this.settings.treeScale);
        }
    }
    
    dispose() {
        if (this.controls) {
            this.controls.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        console.log('🎄 Tree disposed');
    }
}

// === INITIALIZATION ===
window.initElegantTree = function() {
    console.log('🎄 Initializing Elegant Christmas Tree...');
    
    try {
        const tree = new ElegantChristmasTree();
        tree.init('tree-canvas').then(initializedTree => {
            window.ElegantTree = initializedTree;
            console.log('✅ Elegant Tree ready!');
            
            // Connect UI
            const addBtn = document.getElementById('add-gift-btn');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    initializedTree.addGift();
                    
                    // Haptic feedback
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                        Telegram.WebApp.HapticFeedback.impactOccurred('light');
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

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initElegantTree);
} else {
    setTimeout(window.initElegantTree, 100);
}

console.log('🎄 Elegant Christmas Tree script loaded!');

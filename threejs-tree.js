// ===== ULTRA-DETAILED BRANCHED CHRISTMAS TREE =====
// Maximum detail with individual branches and needles
console.log("🎄 Ultra-Detailed Branched Christmas Tree loading...");

class UltraDetailedBranchedTree {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.tree = null;
        this.branches = [];
        this.needles = [];
        this.decorations = [];
        this.gifts = [];
        this.snowflakes = [];
        this.time = 0;
        this.isInitialized = false;
        
        // Ultra-detailed settings
        this.settings = {
            branchCount: 120,          // Number of main branches
            needlesPerBranch: 50,      // Needles per branch
            enableWind: true,
            windStrength: 0.3,
            enableShadows: true,
            enableSnow: true,
            detailLevel: 'ultra',
            animationSpeed: 1.0
        };
        
        // Realistic colors
        this.colors = {
            trunkDark: 0x5D4037,
            trunkLight: 0x8D6E63,
            branchDark: 0x795548,
            branchLight: 0xA1887F,
            needleDark: 0x1B5E20,
            needleMid: 0x388E3C,
            needleLight: 0x4CAF50,
            needleTip: 0x81C784,
            starGold: 0xFFD700,
            starGlow: 0xFFAB00,
            ornamentRed: 0xF44336,
            ornamentBlue: 0x2196F3,
            ornamentGold: 0xFFC107,
            ornamentSilver: 0xE0E0E0,
            ribbonRed: 0xD32F2F,
            ribbonGold: 0xFF9800
        };
    }

    init(canvasId = 'tree-canvas') {
        return new Promise((resolve, reject) => {
            try {
                console.log("🌲 Creating Ultra-Detailed Branched Tree...");
                
                const canvas = document.getElementById(canvasId);
                if (!canvas) throw new Error('Canvas not found');

                // === 1. ULTRA-QUALITY RENDERER ===
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x0F172A);
                this.scene.fog = new THREE.FogExp2(0x0F172A, 0.015);
                
                this.renderer = new THREE.WebGLRenderer({
                    canvas: canvas,
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    precision: 'highp',
                    logarithmicDepthBuffer: true
                });
                
                this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                this.renderer.outputEncoding = THREE.sRGBEncoding;
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 1.0;
                
                if (this.settings.enableShadows) {
                    this.renderer.shadowMap.enabled = true;
                    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                    this.renderer.shadowMap.autoUpdate = true;
                }

                // === 2. PERSPECTIVE CAMERA ===
                const width = canvas.clientWidth;
                const height = canvas.clientHeight;
                this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
                this.camera.position.set(5, 6, 10);
                this.camera.lookAt(0, 3, 0);

                // === 3. CINEMATIC LIGHTING ===
                this.setupCinematicLighting();

                // === 4. CREATE ULTRA-DETAILED TREE WITH BRANCHES ===
                this.createUltraDetailedTree();

                // === 5. CREATE REALISTIC TRUNK ===
                this.createRealisticTrunk();

                // === 6. CREATE INDIVIDUAL NEEDLES ===
                this.createIndividualNeedles();

                // === 7. CREATE DECORATIONS ===
                this.createDetailedDecorations();

                // === 8. CREATE GIFTS ===
                this.createUltraDetailedGifts();

                // === 9. CREATE ENVIRONMENT ===
                this.createDetailedEnvironment();

                // === 10. CONTROLS ===
                if (typeof THREE.OrbitControls !== 'undefined') {
                    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                    this.controls.enableDamping = true;
                    this.controls.dampingFactor = 0.05;
                    this.controls.minDistance = 3;
                    this.controls.maxDistance = 30;
                    this.controls.maxPolarAngle = Math.PI / 2;
                    this.controls.autoRotate = false;
                }

                // === 11. ANIMATION LOOP ===
                this.animate();

                // === 12. RESIZE HANDLER ===
                this.setupResizeHandler();

                this.isInitialized = true;
                console.log("✅ Ultra-Detailed Branched Tree ready!");
                
                resolve(this);
                
            } catch (error) {
                console.error('❌ Tree initialization error:', error);
                reject(error);
            }
        });
    }

    setupCinematicLighting() {
        // Sun light (main key light)
        const sunLight = new THREE.DirectionalLight(0xFFF5E1, 1.2);
        sunLight.position.set(15, 25, 15);
        sunLight.castShadow = this.settings.enableShadows;
        
        if (this.settings.enableShadows) {
            sunLight.shadow.mapSize.width = 4096;
            sunLight.shadow.mapSize.height = 4096;
            sunLight.shadow.camera.near = 0.1;
            sunLight.shadow.camera.far = 100;
            sunLight.shadow.camera.left = -20;
            sunLight.shadow.camera.right = 20;
            sunLight.shadow.camera.top = 20;
            sunLight.shadow.camera.bottom = -20;
            sunLight.shadow.bias = -0.0001;
        }
        this.scene.add(sunLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x88CCFF, 0.4);
        fillLight.position.set(-10, 15, -10);
        this.scene.add(fillLight);

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
        this.scene.add(ambientLight);

        // Tree glow light
        const treeGlow = new THREE.PointLight(0x32CD32, 1.0, 25);
        treeGlow.position.set(0, 5, 0);
        treeGlow.castShadow = this.settings.enableShadows;
        this.scene.add(treeGlow);
        this.treeGlow = treeGlow;

        // Rim light for specular highlights
        const rimLight = new THREE.DirectionalLight(0x88AAFF, 0.3);
        rimLight.position.set(-8, 10, 5);
        this.scene.add(rimLight);
    }

    createUltraDetailedTree() {
        this.tree = new THREE.Group();
        this.tree.name = 'UltraDetailedBranchedTree';

        // Create hierarchical branch structure
        this.createBranchStructure();

        this.scene.add(this.tree);
    }

    createBranchStructure() {
        const trunkHeight = 2.5;
        const branchLevels = 5;
        const branchesPerLevel = 8;
        
        // Main trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.4, trunkHeight, 12);
        const trunkMaterial = new THREE.MeshPhongMaterial({
            color: this.colors.trunkDark,
            shininess: 20,
            specular: 0x111111,
            bumpScale: 0.1
        });
        
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        this.tree.add(trunk);

        // Create branch levels
        for (let level = 0; level < branchLevels; level++) {
            const levelHeight = trunkHeight + (level * 1.2);
            const branchCount = branchesPerLevel - level;
            const branchLength = 1.2 - (level * 0.15);
            const branchThickness = 0.08 - (level * 0.01);
            
            for (let i = 0; i < branchCount; i++) {
                const angle = (i / branchCount) * Math.PI * 2 + (level * 0.3);
                const branch = this.createDetailedBranch(
                    angle,
                    levelHeight,
                    branchLength,
                    branchThickness,
                    level
                );
                
                this.tree.add(branch);
                this.branches.push(branch);
            }
        }

        // Create top branches (crown)
        this.createTopBranches(trunkHeight + (branchLevels * 1.2));
    }

    createDetailedBranch(angle, height, length, thickness, level) {
        const branchGroup = new THREE.Group();
        
        // Main branch segment
        const segmentCount = 3;
        let currentHeight = height;
        let currentLength = length;
        let currentThickness = thickness;
        
        for (let seg = 0; seg < segmentCount; seg++) {
            const segmentLength = currentLength * (0.8 - seg * 0.2);
            const segmentGeometry = new THREE.CylinderGeometry(
                currentThickness * 0.7,
                currentThickness,
                segmentLength,
                6
            );
            
            const segmentMaterial = new THREE.MeshPhongMaterial({
                color: seg === 0 ? this.colors.branchDark : this.colors.branchLight,
                shininess: 15,
                specular: 0x222222
            });
            
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.position.y = currentHeight;
            segment.rotation.z = -Math.PI / 4 + (seg * Math.PI / 8);
            segment.castShadow = true;
            
            // Rotate to correct angle
            segment.rotation.y = angle;
            
            branchGroup.add(segment);
            
            // Update for next segment
            currentHeight += Math.sin(segment.rotation.z) * segmentLength;
            currentThickness *= 0.7;
        }
        
        // Add sub-branches
        const subBranchCount = 3 + level;
        for (let i = 0; i < subBranchCount; i++) {
            const subBranch = this.createSubBranch(
                angle + (i - subBranchCount/2) * 0.3,
                currentHeight,
                length * 0.4,
                thickness * 0.5,
                level + 1
            );
            branchGroup.add(subBranch);
        }
        
        // Add pine clusters
        this.addPineClusters(branchGroup, angle, height, length, level);
        
        branchGroup.userData = {
            type: 'branch',
            baseAngle: angle,
            baseHeight: height,
            windPhase: Math.random() * Math.PI * 2,
            level: level
        };
        
        return branchGroup;
    }

    createSubBranch(angle, height, length, thickness, level) {
        const subBranchGroup = new THREE.Group();
        
        const segmentGeometry = new THREE.CylinderGeometry(
            thickness * 0.5,
            thickness,
            length,
            5
        );
        
        const segmentMaterial = new THREE.MeshPhongMaterial({
            color: this.colors.branchLight,
            shininess: 10
        });
        
        const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
        segment.position.y = height;
        segment.rotation.z = -Math.PI / 6;
        segment.rotation.y = angle;
        segment.castShadow = true;
        
        subBranchGroup.add(segment);
        
        // Add tiny twigs at the end
        if (level < 3) {
            const twigCount = 2;
            for (let i = 0; i < twigCount; i++) {
                const twigGeometry = new THREE.CylinderGeometry(
                    thickness * 0.3,
                    thickness * 0.5,
                    length * 0.3,
                    4
                );
                
                const twig = new THREE.Mesh(twigGeometry, segmentMaterial);
                twig.position.y = height + Math.sin(segment.rotation.z) * length;
                twig.rotation.z = -Math.PI / 12 * (i === 0 ? 1 : -1);
                twig.rotation.y = angle + (i === 0 ? 0.2 : -0.2);
                
                subBranchGroup.add(twig);
            }
        }
        
        return subBranchGroup;
    }

    addPineClusters(branchGroup, angle, height, length, level) {
        const clusterCount = 8 + level * 2;
        const clusterPositions = [];
        
        // Calculate positions along branch
        for (let i = 0; i < clusterCount; i++) {
            const t = i / (clusterCount - 1);
            const clusterHeight = height + Math.sin(-Math.PI / 4) * length * t;
            const clusterDistance = Math.cos(-Math.PI / 4) * length * t * 0.8;
            
            clusterPositions.push({
                x: Math.cos(angle) * clusterDistance,
                y: clusterHeight,
                z: Math.sin(angle) * clusterDistance
            });
        }
        
        // Create pine needle clusters
        clusterPositions.forEach(pos => {
            const cluster = this.createPineNeedleCluster(pos.x, pos.y, pos.z, level);
            branchGroup.add(cluster);
        });
    }

    createPineNeedleCluster(x, y, z, level) {
        const clusterGroup = new THREE.Group();
        clusterGroup.position.set(x, y, z);
        
        const needleCount = 15 + level * 5;
        const spread = 0.3 + level * 0.1;
        
        for (let i = 0; i < needleCount; i++) {
            const needle = this.createSingleNeedle(level);
            
            // Random position within cluster
            needle.position.set(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread * 0.5,
                (Math.random() - 0.5) * spread
            );
            
            // Random rotation
            needle.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            clusterGroup.add(needle);
            this.needles.push(needle);
        }
        
        return clusterGroup;
    }

    createSingleNeedle(level) {
        // Create detailed pine needle geometry
        const length = 0.15 + Math.random() * 0.1;
        const width = 0.008;
        
        const needleGeometry = new THREE.CylinderGeometry(width, width * 0.5, length, 4);
        
        // Bend the needle
        const positionAttribute = needleGeometry.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
            const y = positionAttribute.getY(i);
            const bend = Math.sin(y / length * Math.PI) * 0.02;
            positionAttribute.setX(i, positionAttribute.getX(i) + bend);
        }
        positionAttribute.needsUpdate = true;
        needleGeometry.computeVertexNormals();
        
        // Color based on level (darker at bottom, lighter at top)
        let needleColor;
        if (level < 2) needleColor = this.colors.needleDark;
        else if (level < 4) needleColor = this.colors.needleMid;
        else needleColor = this.colors.needleLight;
        
        const needleMaterial = new THREE.MeshPhongMaterial({
            color: needleColor,
            shininess: 30,
            specular: 0x222222,
            transparent: true,
            opacity: 0.9
        });
        
        const needle = new THREE.Mesh(needleGeometry, needleMaterial);
        needle.castShadow = true;
        
        needle.userData = {
            type: 'needle',
            windPhase: Math.random() * Math.PI * 2,
            basePosition: needle.position.clone(),
            baseRotation: needle.rotation.clone()
        };
        
        return needle;
    }

    createTopBranches(topHeight) {
        const topBranchCount = 6;
        
        for (let i = 0; i < topBranchCount; i++) {
            const angle = (i / topBranchCount) * Math.PI * 2;
            const branch = this.createTopBranch(angle, topHeight);
            this.tree.add(branch);
            this.branches.push(branch);
        }
        
        // Add star on top
        this.createDetailedTopStar(topHeight + 0.8);
    }

    createTopBranch(angle, height) {
        const branchGroup = new THREE.Group();
        
        // Main top branch
        const branchGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.8, 6);
        const branchMaterial = new THREE.MeshPhongMaterial({
            color: this.colors.branchLight,
            shininess: 20
        });
        
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        branch.position.y = height;
        branch.rotation.z = -Math.PI / 3;
        branch.rotation.y = angle;
        branch.castShadow = true;
        
        branchGroup.add(branch);
        
        // Add pine clusters to top branches
        const clusterPositions = [0.3, 0.6];
        clusterPositions.forEach(pos => {
            const clusterX = Math.cos(angle) * Math.cos(branch.rotation.z) * pos;
            const clusterY = height + Math.sin(branch.rotation.z) * pos;
            const clusterZ = Math.sin(angle) * Math.cos(branch.rotation.z) * pos;
            
            const cluster = this.createPineNeedleCluster(clusterX, clusterY, clusterZ, 4);
            branchGroup.add(cluster);
        });
        
        return branchGroup;
    }

    createDetailedTopStar(height) {
        // Complex star geometry
        const starGroup = new THREE.Group();
        
        // Main star body
        const starGeometry = this.createComplexStarGeometry(0.4, 0.2, 5);
        const starMaterial = new THREE.MeshPhongMaterial({
            color: this.colors.starGold,
            emissive: this.colors.starGlow,
            emissiveIntensity: 0.6,
            shininess: 200,
            specular: 0xFFD700,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.y = height;
        star.castShadow = true;
        starGroup.add(star);
        this.star = star;
        
        // Star glow effect
        const glowGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.4,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = height;
        starGroup.add(glow);
        this.starGlow = glow;
        
        // Star rays
        const rayCount = 8;
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            const rayGeometry = new THREE.ConeGeometry(0.05, 0.3, 4);
            const ray = new THREE.Mesh(rayGeometry, starMaterial);
            ray.position.y = height;
            ray.rotation.y = angle;
            ray.rotation.x = Math.PI / 2;
            starGroup.add(ray);
        }
        
        this.tree.add(starGroup);
    }

    createComplexStarGeometry(outerRadius, innerRadius, points) {
        const shape = new THREE.Shape();
        
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / points;
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();
        
        const extrudeSettings = {
            depth: 0.15,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.05,
            bevelThickness: 0.05
        };
        
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    createRealisticTrunk() {
        // Already created in branch structure
        // Additional trunk details could be added here
    }

    createIndividualNeedles() {
        // Already created in pine clusters
    }

    createDetailedDecorations() {
        // Create detailed Christmas balls
        this.createDetailedOrnaments();
        
        // Create realistic garland
        this.createRealisticGarland();
        
        // Add ribbons
        this.addDetailedRibbons();
    }

    createDetailedOrnaments() {
        const ornamentCount = 25;
        this.ornaments = [];
        
        for (let i = 0; i < ornamentCount; i++) {
            const ornament = this.createSingleOrnament();
            this.scene.add(ornament);
            this.ornaments.push(ornament);
            this.decorations.push(ornament);
        }
    }

    createSingleOrnament() {
        const types = [
            { geometry: new THREE.SphereGeometry(0.12, 16, 16), color: this.colors.ornamentRed, type: 'ball' },
            { geometry: new THREE.SphereGeometry(0.15, 16, 16), color: this.colors.ornamentBlue, type: 'ball' },
            { geometry: new THREE.SphereGeometry(0.1, 16, 16), color: this.colors.ornamentGold, type: 'ball' },
            { geometry: new THREE.IcosahedronGeometry(0.1, 0), color: this.colors.ornamentSilver, type: 'crystal' }
        ];
        
        const type = types[Math.floor(Math.random() * types.length)];
        
        // High-quality ornament material
        const ornamentMaterial = new THREE.MeshPhongMaterial({
            color: type.color,
            emissive: type.color,
            emissiveIntensity: 0.3,
            shininess: 150,
            specular: 0xFFFFFF,
            transparent: true,
            opacity: 0.95,
            envMapIntensity: 0.5
        });
        
        const ornament = new THREE.Mesh(type.geometry, ornamentMaterial);
        
        // Position on tree (attach to a branch)
        if (this.branches.length > 0) {
            const branch = this.branches[Math.floor(Math.random() * this.branches.length)];
            const branchPosition = new THREE.Vector3();
            branch.getWorldPosition(branchPosition);
            
            // Offset from branch
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                Math.random() * 0.4,
                (Math.random() - 0.5) * 0.3
            );
            
            ornament.position.copy(branchPosition).add(offset);
        } else {
            // Fallback position
            ornament.position.set(
                (Math.random() - 0.5) * 2,
                1 + Math.random() * 4,
                (Math.random() - 0.5) * 2
            );
        }
        
        ornament.castShadow = true;
        ornament.userData = {
            type: 'ornament',
            rotationSpeed: 0.005 + Math.random() * 0.01,
            floatSpeed: Math.random() * 0.003,
            floatPhase: Math.random() * Math.PI * 2,
            basePosition: ornament.position.clone()
        };
        
        // Add ornament hook
        const hookGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.08, 6);
        const hookMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
        const hook = new THREE.Mesh(hookGeometry, hookMaterial);
        hook.position.y = 0.06;
        hook.rotation.x = Math.PI / 2;
        ornament.add(hook);
        
        return ornament;
    }

    createRealisticGarland() {
        // Create spiral garland around tree
        const points = [];
        const turns = 3;
        const segments = 60;
        
        for (let i = 0; i <= segments; i++) {
            const progress = i / segments;
            const angle = progress * Math.PI * 2 * turns;
            const radius = 1.5 * (1 - progress * 0.2);
            const height = 1.0 + progress * 5.0;
            
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
            linewidth: 1,
            transparent: true,
            opacity: 0.7
        });
        
        this.garland = new THREE.Line(geometry, material);
        this.scene.add(this.garland);
        
        // Add garland lights
        this.garlandLights = [];
        for (let i = 0; i < points.length; i += 2) {
            const lightGeometry = new THREE.SphereGeometry(0.06, 8, 8);
            const lightMaterial = new THREE.MeshPhongMaterial({
                color: Math.random() > 0.5 ? 0xFF4444 : 0x44FF44,
                emissive: Math.random() > 0.5 ? 0xFF4444 : 0x44FF44,
                emissiveIntensity: 0.8,
                shininess: 100
            });
            
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.copy(points[i]);
            this.scene.add(light);
            this.garlandLights.push(light);
        }
    }

    addDetailedRibbons() {
    // Добавь 4 ленты
    for (let i = 0; i < 4; i++) {
        const ribbon = this.createSingleRibbon(i, 4);
        this.scene.add(ribbon);
        this.decorations.push(ribbon);
    }
}

createSingleRibbon(index, totalRibbons) {
    const ribbonGroup = new THREE.Group();
    
    const segments = 10;
    const length = 3.0;
    const width = 0.05;
    
    const angle = (index / totalRibbons) * Math.PI * 2;
    const startHeight = 5.0;
    
    for (let i = 0; i < segments; i++) {
        const segmentLength = length / segments;
        const segmentGeometry = new THREE.PlaneGeometry(width, segmentLength);
        const segmentMaterial = new THREE.MeshPhongMaterial({
            color: index % 2 === 0 ? this.colors.ribbonRed : this.colors.ribbonGold,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9 - i * 0.08
        });
        
        const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
        segment.position.y = startHeight - i * segmentLength;
        
        // Curve ribbon
        const curve = Math.sin(i / segments * Math.PI) * 0.3;
        segment.position.x = Math.cos(angle) * curve;
        segment.position.z = Math.sin(angle) * curve;
        
        // Rotate to follow curve
        segment.lookAt(
            Math.cos(angle) * (curve + 0.1),
            startHeight - (i + 1) * segmentLength,
            Math.sin(angle) * (curve + 0.1)
        );
        
        ribbonGroup.add(segment);
    }
    
    ribbonGroup.userData = {
        type: 'ribbon',
        windPhase: Math.random() * Math.PI * 2,
        baseAngle: angle
    };
    
    return ribbonGroup;
}
    createUltraDetailedGifts() {
        const giftConfigs = [
            { x: -2.2, z: -1.8, color: this.colors.ornamentRed, size: 0.7, ribbon: 0xFFFFFF },
            { x: 2.0, z: -1.3, color: this.colors.ornamentBlue, size: 0.6, ribbon: this.colors.ribbonGold },
            { x: -1.5, z: 2.0, color: this.colors.ornamentGold, size: 0.8, ribbon: 0xFFFFFF },
            { x: 1.8, z: 1.5, color: 0x9C27B0, size: 0.65, ribbon: this.colors.ribbonGold }
        ];
        
        this.gifts = [];
        
        giftConfigs.forEach((config, index) => {
            const gift = this.createUltraDetailedGift(
                config.x,
                0.1,
                config.z,
                config.color,
                config.size,
                config.ribbon
            );
            
            this.gifts.push(gift);
            this.scene.add(gift);
            
            // Animate entrance
            this.animateGiftEntrance(gift, index * 400);
        });
    }

    createUltraDetailedGift(x, y, z, color, size, ribbonColor) {
        const giftGroup = new THREE.Group();
        
        // Main gift box with beveled edges
        const boxGeometry = new THREE.BoxGeometry(size, size, size, 2, 2, 2);
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            specular: 0x444444,
            emissive: color,
            emissiveIntensity: 0.1
        });
        
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;
        box.receiveShadow = true;
        giftGroup.add(box);
        
        // Detailed ribbons
        this.createGiftRibbons(giftGroup, size, ribbonColor);
        
        // Detailed bow
        this.createDetailedBow(giftGroup, size, ribbonColor);
        
        // Gift wrapping pattern (simulated with geometry)
        this.createWrappingPattern(giftGroup, size, color);
        
        giftGroup.position.set(x, y + size / 2, z);
        
        giftGroup.userData = {
            type: 'gift',
            baseY: y + size / 2,
            floatPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.003 + Math.random() * 0.005,
            wobblePhase: Math.random() * Math.PI * 2,
            size: size
        };
        
        return giftGroup;
    }

    createGiftRibbons(giftGroup, size, ribbonColor) {
        // Vertical ribbon
        const vertRibbonGeometry = new THREE.BoxGeometry(size * 0.08, size * 1.3, size * 0.08, 2, 2, 2);
        const vertRibbonMaterial = new THREE.MeshPhongMaterial({
            color: ribbonColor,
            shininess: 150,
            specular: 0x888888
        });
        
        const vertRibbon = new THREE.Mesh(vertRibbonGeometry, vertRibbonMaterial);
        vertRibbon.castShadow = true;
        giftGroup.add(vertRibbon);
        
        // Horizontal ribbon
        const horzRibbonGeometry = new THREE.BoxGeometry(size * 1.3, size * 0.08, size * 0.08, 2, 2, 2);
        const horzRibbon = new THREE.Mesh(horzRibbonGeometry, vertRibbonMaterial);
        horzRibbon.castShadow = true;
        giftGroup.add(horzRibbon);
        
        // Ribbon ends (curled)
        const ribbonEndGeometry = new THREE.TorusGeometry(size * 0.04, size * 0.02, 4, 8, Math.PI);
        const ribbonEndMaterial = new THREE.MeshPhongMaterial({
            color: ribbonColor,
            shininess: 120
        });
        
        // Add curled ends to vertical ribbon
        const vertEnd1 = new THREE.Mesh(ribbonEndGeometry, ribbonEndMaterial);
        vertEnd1.position.y = size / 2 + size * 0.04;
        vertEnd1.rotation.x = Math.PI / 2;
        giftGroup.add(vertEnd1);
        
        const vertEnd2 = vertEnd1.clone();
        vertEnd2.position.y = -size / 2 - size * 0.04;
        giftGroup.add(vertEnd2);
        
        // Add curled ends to horizontal ribbon
        const horzEnd1 = new THREE.Mesh(ribbonEndGeometry, ribbonEndMaterial);
        horzEnd1.position.x = size / 2 + size * 0.04;
        horzEnd1.rotation.z = Math.PI / 2;
        giftGroup.add(horzEnd1);
        
        const horzEnd2 = horzEnd1.clone();
        horzEnd2.position.x = -size / 2 - size * 0.04;
        giftGroup.add(horzEnd2);
    }

    createDetailedBow(giftGroup, size, ribbonColor) {
        const bowGroup = new THREE.Group();
        bowGroup.position.y = size / 2 + size * 0.1;
        
        // Bow loops
        const loopGeometry = new THREE.TorusGeometry(size * 0.15, size * 0.05, 6, 12, Math.PI);
        const loopMaterial = new THREE.MeshPhongMaterial({
            color: ribbonColor,
            shininess: 120
        });
        
        const loop1 = new THREE.Mesh(loopGeometry, loopMaterial);
        loop1.rotation.x = Math.PI / 2;
        bowGroup.add(loop1);
        
        const loop2 = loop1.clone();
        loop2.rotation.z = Math.PI / 2;
        bowGroup.add(loop2);
        
        // Bow center knot
        const centerGeometry = new THREE.SphereGeometry(size * 0.08, 10, 10);
        const center = new THREE.Mesh(centerGeometry, loopMaterial);
        bowGroup.add(center);
        
        // Bow tails
        const tailLength = size * 0.4;
        const tailGeometry = new THREE.ConeGeometry(size * 0.03, tailLength, 4);
        const tailMaterial = new THREE.MeshPhongMaterial({
            color: ribbonColor,
            shininess: 100
        });
        
        const tail1 = new THREE.Mesh(tailGeometry, tailMaterial);
        tail1.position.y = -tailLength / 2;
        tail1.rotation.x = Math.PI;
        bowGroup.add(tail1);
        
        const tail2 = tail1.clone();
        tail2.rotation.z = Math.PI / 2;
        bowGroup.add(tail2);
        
        giftGroup.add(bowGroup);
    }

    createWrappingPattern(giftGroup, size, color) {
        // Create simple pattern with geometry
        const patternGroup = new THREE.Group();
        
        // Add some dots as pattern
        const dotCount = 8;
        const dotGeometry = new THREE.SphereGeometry(size * 0.03, 4, 4);
        const dotMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < dotCount; i++) {
            const dot = new THREE.Mesh(dotGeometry, dotMaterial);
            
            // Position on gift faces
            const face = Math.floor(Math.random() * 6);
            let x, y, z;
            
            switch(face) {
                case 0: // front
                    x = (Math.random() - 0.5) * size * 0.8;
                    y = (Math.random() - 0.5) * size * 0.8;
                    z = size / 2 + 0.01;
                    break;
                case 1: // back
                    x = (Math.random() - 0.5) * size * 0.8;
                    y = (Math.random() - 0.5) * size * 0.8;
                    z = -size / 2 - 0.01;
                    break;
                case 2: // right
                    x = size / 2 + 0.01;
                    y = (Math.random() - 0.5) * size * 0.8;
                    z = (Math.random() - 0.5) * size * 0.8;
                    break;
                case 3: // left
                    x = -size / 2 - 0.01;
                    y = (Math.random() - 0.5) * size * 0.8;
                    z = (Math.random() - 0.5) * size * 0.8;
                    break;
                case 4: // top
                    x = (Math.random() - 0.5) * size * 0.8;
                    y = size / 2 + 0.01;
                    z = (Math.random() - 0.5) * size * 0.8;
                    break;
                case 5: // bottom
                    x = (Math.random() - 0.5) * size * 0.8;
                    y = -size / 2 - 0.01;
                    z = (Math.random() - 0.5) * size * 0.8;
                    break;
            }
            
            dot.position.set(x, y, z);
            patternGroup.add(dot);
        }
        
        giftGroup.add(patternGroup);
    }

    createDetailedEnvironment() {
        // Create snow-covered ground
        this.createSnowyGround();
        
        // Create falling snow
        if (this.settings.enableSnow) {
            this.createFallingSnow();
        }
        
        // Create ambient particles
        this.createAmbientParticles();
    }

    createSnowyGround() {
        // Ground plane
        const groundGeometry = new THREE.CircleGeometry(15, 32);
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x2C3E50,
            shininess: 10,
            side: THREE.DoubleSide
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Snow layer
        const snowGeometry = new THREE.CircleGeometry(12, 32);
        const snowMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        
        const snow = new THREE.Mesh(snowGeometry, snowMaterial);
        snow.rotation.x = -Math.PI / 2;
        snow.position.y = -0.09;
        snow.receiveShadow = true;
        this.scene.add(snow);
        
        // Add some snow piles
        this.createSnowPiles();
    }

    createSnowPiles() {
        const pileCount = 8;
        
        for (let i = 0; i < pileCount; i++) {
            const angle = (i / pileCount) * Math.PI * 2;
            const distance = 2 + Math.random() * 3;
            
            const pileGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 8, 8);
            const pileMaterial = new THREE.MeshPhongMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.95
            });
            
            const pile = new THREE.Mesh(pileGeometry, pileMaterial);
            pile.position.set(
                Math.cos(angle) * distance,
                0.1,
                Math.sin(angle) * distance
            );
            pile.receiveShadow = true;
            this.scene.add(pile);
        }
    }

    createFallingSnow() {
        const snowflakeCount = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(snowflakeCount * 3);
        const sizes = new Float32Array(snowflakeCount);
        const velocities = new Float32Array(snowflakeCount);
        const rotations = new Float32Array(snowflakeCount);
        
        for (let i = 0; i < snowflakeCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 25;    // x
            positions[i * 3 + 1] = Math.random() * 20;       // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 25; // z
            
            sizes[i] = 0.05 + Math.random() * 0.1;           // size
            velocities[i] = 0.01 + Math.random() * 0.02;     // fall speed
            rotations[i] = Math.random() * Math.PI * 2;      // rotation
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });
        
        this.snow = new THREE.Points(geometry, material);
        this.snow.userData = {
            positions: positions,
            velocities: velocities,
            rotations: rotations
        };
        this.scene.add(this.snow);
    }

    createAmbientParticles() {
        // Add some floating dust/glitter particles
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = Math.random() * 8;
            positions[i + 2] = (Math.random() - 0.5) * 10;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xFFD700,
            size: 0.03,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    animateGiftEntrance(gift, delay = 0) {
        const targetY = gift.position.y;
        gift.position.y = -5;
        gift.scale.set(0.1, 0.1, 0.1);
        
        setTimeout(() => {
            const startTime = Date.now();
            const duration = 2000;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Complex easing with bounce
                const ease = 1 - Math.pow(1 - progress, 5);
                const bounce = Math.sin(progress * Math.PI * 5) * (1 - progress) * 0.8;
                
                gift.position.y = -5 + (targetY + 5) * ease + bounce;
                gift.scale.setScalar(0.1 + 0.9 * ease);
                gift.rotation.y = progress * Math.PI * 12;
                gift.rotation.x = Math.sin(progress * Math.PI * 3) * 0.5;
                
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
        const deltaTime = 0.016;
        this.time += deltaTime * this.settings.animationSpeed;
        
        // === WIND ANIMATION ===
        if (this.settings.enableWind && this.settings.windStrength > 0) {
            const windTime = this.time * 0.5;
            const windStrength = this.settings.windStrength;
            
            // Animate branches
            this.branches.forEach(branch => {
                const windPhase = branch.userData.windPhase + windTime * (1 + branch.userData.level * 0.3);
                const wind = Math.sin(windPhase) * windStrength * (0.5 + branch.userData.level * 0.1);
                
                branch.rotation.z = wind * 0.2;
                branch.rotation.y = branch.userData.baseAngle + wind * 0.1;
            });
            
            // Animate needles
            this.needles.forEach(needle => {
                const windPhase = needle.userData.windPhase + windTime * 2;
                const wind = Math.sin(windPhase) * windStrength * 0.3;
                
                needle.rotation.x = needle.userData.baseRotation.x + wind;
                needle.rotation.y = needle.userData.baseRotation.y + wind * 0.5;
            });
        }
        
        // === STAR ANIMATION ===
        if (this.star) {
            this.star.rotation.y += deltaTime * 0.5;
            this.star.rotation.x = Math.sin(this.time * 0.3) * 0.1 + Math.PI / 2;
            
            const pulse = Math.sin(this.time * 2) * 0.2 + 0.8;
            this.star.scale.setScalar(pulse);
            
            if (this.starGlow) {
                const glowPulse = Math.sin(this.time * 3) * 0.3 + 0.7;
                this.starGlow.scale.setScalar(glowPulse);
            }
            
            // Star glow intensity
            if (this.star.material.emissiveIntensity !== undefined) {
                this.star.material.emissiveIntensity = 0.6 + Math.sin(this.time * 4) * 0.4;
            }
        }
        
        // === ORNAMENTS ANIMATION ===
        if (this.ornaments) {
            this.ornaments.forEach(ornament => {
                ornament.rotation.y += ornament.userData.rotationSpeed;
                
                // Gentle floating
                const float = Math.sin(this.time * ornament.userData.floatSpeed + 
                    ornament.userData.floatPhase) * 0.03;
                ornament.position.y = ornament.userData.basePosition.y + float;
                
                // Gentle swing
                const swing = Math.sin(this.time * 0.5 + ornament.userData.floatPhase) * 0.05;
                ornament.rotation.x = swing;
                ornament.rotation.z = swing * 0.5;
            });
        }
        
        // === GARLAND LIGHTS ANIMATION ===
        if (this.garlandLights) {
            this.garlandLights.forEach((light, index) => {
                const pulse = Math.sin(this.time * 3 + index * 0.2) * 0.4 + 0.6;
                light.scale.setScalar(pulse);
                
                // Twinkle effect
                if (Math.random() > 0.99) {
                    light.visible = !light.visible;
                    setTimeout(() => light.visible = true, 100);
                }
                
                // Color shift
                const hue = (this.time * 0.1 + index * 0.05) % 1;
                light.material.color.setHSL(hue, 0.9, 0.6);
                light.material.emissive.setHSL(hue, 0.9, 0.6);
            });
        }
        
        // === GIFTS ANIMATION ===
        this.gifts.forEach(gift => {
            gift.rotation.y += gift.userData.rotationSpeed;
            
            // Floating
            const float = Math.sin(this.time + gift.userData.floatPhase) * 0.02;
            gift.position.y = gift.userData.baseY + float;
            
            // Gentle wobble
            const wobble = Math.sin(this.time * 0.3 + gift.userData.wobblePhase) * 0.01;
            gift.rotation.x = wobble;
            gift.rotation.z = wobble * 0.7;
            
            // Scale breathing
            const breath = Math.sin(this.time * 0.5 + gift.userData.floatPhase) * 0.005;
            gift.scale.x = 1 + breath;
            gift.scale.y = 1 + breath * 0.8;
            gift.scale.z = 1 + breath;
        });
        
        // === SNOW ANIMATION ===
        if (this.snow && this.settings.enableSnow) {
            const positions = this.snow.userData.positions;
            const velocities = this.snow.userData.velocities;
            
            for (let i = 0; i < positions.length / 3; i++) {
                // Move down
                positions[i * 3 + 1] -= velocities[i];
                
                // Gentle wind drift
                const windDrift = Math.sin(this.time * 0.3 + i) * 0.008;
                positions[i * 3] += windDrift;
                positions[i * 3 + 2] += Math.cos(this.time * 0.3 + i) * 0.008;
                
                // Slight rotation
                const rotation = this.snow.userData.rotations[i] + velocities[i] * 10;
                this.snow.userData.rotations[i] = rotation;
                
                // Reset if too low
                if (positions[i * 3 + 1] < -5) {
                    positions[i * 3] = (Math.random() - 0.5) * 25;
                    positions[i * 3 + 1] = 20;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
                    velocities[i] = 0.01 + Math.random() * 0.02;
                }
            }
            
            this.snow.geometry.attributes.position.needsUpdate = true;
        }
        
        // === TREE GLOW ANIMATION ===
        if (this.treeGlow) {
            const glowPulse = Math.sin(this.time * 1.2) * 0.3 + 0.7;
            this.treeGlow.intensity = 0.8 + glowPulse * 0.2;
            
            // Color shift
            const hue = (this.time * 0.02) % 1;
            this.treeGlow.color.setHSL(hue, 0.7, 0.6);
        }
        
        // === PARTICLES ANIMATION ===
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Gentle floating motion
                positions[i + 1] += Math.sin(this.time * 0.5 + i) * 0.001;
                
                // Circular motion
                const angle = this.time * 0.1 + i * 0.01;
                positions[i] += Math.cos(angle) * 0.001;
                positions[i + 2] += Math.sin(angle) * 0.001;
                
                // Reset if out of bounds
                if (positions[i + 1] > 10 || positions[i + 1] < -2) {
                    positions[i + 1] = Math.random() * 8;
                }
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
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
            this.colors.ornamentRed,
            this.colors.ornamentBlue,
            this.colors.ornamentGold,
            0x9C27B0, // Purple
            0x4CAF50, // Green
            0xFF9800  // Orange
        ];
        
        const ribbonColors = [0xFFFFFF, 0xFFD700, 0xF44336, 0x2196F3];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const ribbonColor = ribbonColors[Math.floor(Math.random() * ribbonColors.length)];
        const size = 0.5 + Math.random() * 0.3;
        const x = (Math.random() - 0.5) * 4;
        const z = (Math.random() - 0.5) * 4;
        
        const gift = this.createUltraDetailedGift(x, 0.1, z, color, size, ribbonColor);
        this.gifts.push(gift);
        this.scene.add(gift);
        
        // Animate entrance
        this.animateGiftEntrance(gift, 0);
        
        return gift;
    }
    
    toggleWind() {
        this.settings.enableWind = !this.settings.enableWind;
        return this.settings.enableWind;
    }
    
    toggleSnow() {
        if (this.snow) {
            this.settings.enableSnow = !this.settings.enableSnow;
            this.snow.visible = this.settings.enableSnow;
            return this.settings.enableSnow;
        }
        return false;
    }
    
    setWindStrength(strength) {
        this.settings.windStrength = Math.max(0, Math.min(strength, 1));
    }
    
    dispose() {
        // Cleanup
        if (this.controls) {
            this.controls.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        console.log('🎄 Ultra-detailed tree disposed');
    }
}

// === GLOBAL INITIALIZATION ===
window.initTree3D = function() {
    console.log('🎄 Initializing Ultra-Detailed Branched Tree...');
    
    try {
        const ultraTree = new UltraDetailedBranchedTree();
        ultraTree.init('tree-canvas').then(tree => {
            window.UltraDetailedTree = tree;
            console.log('✅ Ultra-Detailed Tree ready!');
            
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

console.log('🎄 Ultra-Detailed Branched Christmas Tree script loaded!');

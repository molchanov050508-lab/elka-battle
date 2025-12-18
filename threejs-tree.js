// ===== ПРОСТАЯ НО КРАСИВАЯ ЁЛКА =====
console.log("🎄 Simple but beautiful tree loading...");

window.initTree3D = function() {
    console.log("🌲 Initializing tree...");
    
    try {
        const canvas = document.getElementById('tree-canvas');
        if (!canvas) {
            console.error("Canvas not found!");
            return;
        }

        // === 1. BASIC SETUP ===
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0d1525);
        
        const camera = new THREE.PerspectiveCamera(
            60, 
            canvas.clientWidth / canvas.clientHeight, 
            0.1, 
            1000
        );
        camera.position.set(0, 3, 8);
        
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // === 2. LIGHTS ===
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);
        
        // Point light for glow
        const pointLight = new THREE.PointLight(0xffaa00, 1, 20);
        pointLight.position.set(0, 4, 0);
        scene.add(pointLight);
        
        // === 3. CREATE BEAUTIFUL TREE ===
        const treeGroup = new THREE.Group();
        
        // TRUNK
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b4513,
            roughness: 0.8
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 0.75;
        treeGroup.add(trunk);
        
        // TREE LEVELS (BEAUTIFUL CONES)
        const levels = [
            { radius: 1.8, height: 1.5, y: 1.9, color: 0x0a5 },
            { radius: 1.4, height: 1.2, y: 2.9, color: 0x0b6 },
            { radius: 1.0, height: 1.0, y: 3.7, color: 0x0c7 },
            { radius: 0.6, height: 0.8, y: 4.3, color: 0x0d8 }
        ];
        
        levels.forEach(level => {
            const coneGeometry = new THREE.ConeGeometry(
                level.radius, 
                level.height, 
                12
            );
            const coneMaterial = new THREE.MeshStandardMaterial({ 
                color: level.color,
                roughness: 0.6,
                emissive: 0x00aa00,
                emissiveIntensity: 0.2
            });
            const cone = new THREE.Mesh(coneGeometry, coneMaterial);
            cone.position.y = level.y;
            treeGroup.add(cone);
        });
        
        // STAR WITH GLOW
        const starGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const starMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffd700,
            emissive: 0xffaa00,
            emissiveIntensity: 0.8,
            roughness: 0.1
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.y = 4.8;
        treeGroup.add(star);
        
        scene.add(treeGroup);
        
        // === 4. SIMPLE GIFTS ===
        const gifts = [];
        const giftPositions = [
            { x: -1.5, z: -1.2, color: 0xff4444 },
            { x: 1.3, z: -0.8, color: 0x44ff44 },
            { x: -0.7, z: 1.4, color: 0x4444ff }
        ];
        
        giftPositions.forEach(pos => {
            const giftGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
            const giftMaterial = new THREE.MeshStandardMaterial({ 
                color: pos.color,
                roughness: 0.4
            });
            const gift = new THREE.Mesh(giftGeometry, giftMaterial);
            gift.position.set(pos.x, 0.3, pos.z);
            scene.add(gift);
            gifts.push(gift);
        });
        
        // === 5. ANIMATION ===
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.02;
            
            // Rotate tree slowly
            treeGroup.rotation.y += 0.005;
            
            // Pulsing star
            star.scale.x = 1 + Math.sin(time * 2) * 0.1;
            star.scale.y = 1 + Math.sin(time * 2) * 0.1;
            star.scale.z = 1 + Math.sin(time * 2) * 0.1;
            
            // Rotate gifts
            gifts.forEach((gift, i) => {
                gift.rotation.y += 0.01;
                // Floating animation
                gift.position.y = 0.3 + Math.sin(time + i) * 0.1;
            });
            
            // Tree pulse effect
            treeGroup.children.forEach((child, i) => {
                if (i > 0 && i < 5) { // Only cones
                    const pulse = Math.sin(time * 1.5 + i) * 0.05;
                    child.scale.x = 1 + pulse;
                    child.scale.y = 1 + pulse;
                    child.scale.z = 1 + pulse;
                }
            });
            
            // Render
            renderer.render(scene, camera);
        }
        
        // Start animation
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
        
        console.log("✅ Beautiful tree loaded!");
        
        // Return public methods
        return {
            addGift: function() {
                const colors = [0xff4444, 0x44ff44, 0x4444ff, 0xff44ff, 0xffff44];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const x = (Math.random() - 0.5) * 3;
                const z = (Math.random() - 0.5) * 3;
                
                const giftGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const giftMaterial = new THREE.MeshStandardMaterial({ 
                    color: color,
                    roughness: 0.4
                });
                const gift = new THREE.Mesh(giftGeometry, giftMaterial);
                gift.position.set(x, 0.3, z);
                scene.add(gift);
                gifts.push(gift);
                
                console.log("🎁 Gift added!");
                return gift;
            }
        };
        
    } catch (error) {
        console.error("❌ Tree error:", error);
        return null;
    }
};

// Auto-init when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initTree3D);
} else {
    setTimeout(window.initTree3D, 100);
}

console.log("🎄 Simple beautiful tree script loaded!");

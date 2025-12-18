// ===== ПОЛНОЦЕННАЯ 3D ЁЛКА ДЛЯ ПРОДАКШЕНА =====

// Проверка поддержки WebGL
function isWebGLAvailable() {
    try {
        const canvas = document.createElement("canvas");
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
    } catch (e) {
        return false;
    }
}

// Класс 3D ёлки
class ChristmasTree3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.gifts = [];
        this.giftCount = 3; // Начальное количество подарков
        this.isInitialized = false;
        
        // Настройки производительности
        this.settings = {
            enableShadows: true,
            enableAntialias: true,
            enableAnimations: true,
            maxGifts: 50,
            treeScale: 1.0
        };
    }

    async init(containerId = "tree-canvas") {
        try {
            console.log(" Инициализация 3D ёлки...");
            
            if (!isWebGLAvailable()) {
                throw new Error("WebGL не поддерживается");
            }

            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error("Контейнер не найден");
            }

            // ===== 1. СОЗДАНИЕ СЦЕНЫ =====
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x0d1525);
            this.scene.fog = new THREE.Fog(0x0d1525, 10, 25);

            // ===== 2. КАМЕРА =====
            this.camera = new THREE.PerspectiveCamera(
                60, // FOV
                container.clientWidth / container.clientHeight,
                0.1,
                1000
            );
            this.camera.position.set(0, 3, 8);
            this.camera.lookAt(0, 2, 0);

            // ===== 3. РЕНДЕРЕР (ОПТИМИЗИРОВАННЫЙ) =====
            this.renderer = new THREE.WebGLRenderer({
                canvas: container,
                antialias: this.settings.enableAntialias,
                alpha: false,
                powerPreference: "high-performance",
                precision: "mediump"
            });
            
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Ограничиваем для производительности
            
            if (this.settings.enableShadows) {
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                this.renderer.shadowMap.autoUpdate = false; // Оптимизация
            }

            // ===== 4. ОСВЕЩЕНИЕ =====
            this.setupLights();

            // ===== 5. СОЗДАЁМ ЁЛКУ =====
            await this.createTree();

            // ===== 6. СОЗДАЁМ ПОДАРКИ =====
            this.createInitialGifts();

            // ===== 7. ДЕКОРАЦИИ =====
            this.createDecorations();

            // ===== 8. УПРАВЛЕНИЕ =====
            this.setupControls();

            // ===== 9. ЗАПУСК АНИМАЦИИ =====
            this.animate();

            // ===== 10. ОБРАБОТКА РЕСАЙЗА =====
            this.setupResizeHandler();

            this.isInitialized = true;
            console.log(" 3D ёлка успешно инициализирована");
            
            // Обновляем счетчик подарков
            this.updateGiftCounter();
            
            return true;
            
        } catch (error) {
            console.error(" Ошибка инициализации 3D:", error);
            this.showFallback();
            return false;
        }
    }

    setupLights() {
        // 1. Ambient Light (освещение сцен)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // 2. Directional Light (основной источник)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = this.settings.enableShadows;
        
        if (this.settings.enableShadows) {
            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;
            directionalLight.shadow.camera.near = 0.5;
            directionalLight.shadow.camera.far = 50;
            directionalLight.shadow.camera.left = -10;
            directionalLight.shadow.camera.right = 10;
            directionalLight.shadow.camera.top = 10;
            directionalLight.shadow.camera.bottom = -10;
        }
        
        this.scene.add(directionalLight);

        // 3. Point Light (для эффекта гирлянды)
        const pointLight = new THREE.PointLight(0xff4444, 1, 15);
        pointLight.position.set(0, 3, 0);
        this.scene.add(pointLight);
        this.pointLight = pointLight;

        // 4. Hemisphere Light (для реалистичности)
        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x228b22, 0.3);
        this.scene.add(hemisphereLight);
    }

    async createTree() {
        const treeGroup = new THREE.Group();
        treeGroup.name = "ChristmasTree";

        // === СТВОЛ ===
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.9,
            metalness: 0.1
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 0.75;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        trunk.name = "Trunk";
        treeGroup.add(trunk);

        // === ЯРУСЫ ЁЛКИ ===
        const levels = [
            { radius: 1.8, height: 1.5, y: 1.9, color: 0x0a5, segments: 12 },
            { radius: 1.4, height: 1.2, y: 2.9, color: 0x0b6, segments: 10 },
            { radius: 1.0, height: 1.0, y: 3.7, color: 0x0c7, segments: 8 },
            { radius: 0.6, height: 0.8, y: 4.3, color: 0x0d8, segments: 6 }
        ];

        levels.forEach((level, index) => {
            const coneGeometry = new THREE.ConeGeometry(
                level.radius,
                level.height,
                level.segments
            );
            
            const coneMaterial = new THREE.MeshStandardMaterial({
                color: level.color,
                roughness: 0.8,
                metalness: 0.2,
                side: THREE.DoubleSide
            });
            
            const cone = new THREE.Mesh(coneGeometry, coneMaterial);
            cone.position.y = level.y;
            cone.castShadow = true;
            cone.receiveShadow = true;
            cone.name = `TreeLevel_${index}`;
            treeGroup.add(cone);
        });

        // === ЗВЕЗДА НА МАКУШКЕ ===
        const starGeometry = this.createStarGeometry(0.4, 0.2, 5);
        const starMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.y = 4.8;
        star.castShadow = true;
        star.name = "Star";
        treeGroup.add(star);
        this.star = star;

        // === СНЕГ НА ВЕТКАХ ===
        this.addSnowOnBranches(treeGroup);

        this.tree = treeGroup;
        this.scene.add(treeGroup);

        // Анимация появления
        treeGroup.scale.set(0, 0, 0);
        this.animateTreeAppearance(treeGroup);
    }

    createStarGeometry(outerRadius, innerRadius, points) {
        const shape = new THREE.Shape();
        const step = Math.PI / points;
        
        for (let i = 0; i < 2 * points; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = i * step;
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                shape.moveTo(x, y);
            } else {
                shape.lineTo(x, y);
            }
        }
        
        shape.closePath();
        
        const extrudeSettings = {
            depth: 0.2,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.05,
            bevelThickness: 0.05
        };
        
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    addSnowOnBranches(treeGroup) {
        const snowCount = 100;
        const snowGeometry = new THREE.SphereGeometry(0.05, 4, 4);
        const snowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        for (let i = 0; i < snowCount; i++) {
            const snow = new THREE.Mesh(snowGeometry, snowMaterial);
            
            // Распределяем снег по ярусам
            const level = Math.floor(Math.random() * 4);
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (1.8 - level * 0.4);
            
            snow.position.x = Math.cos(angle) * distance;
            snow.position.z = Math.sin(angle) * distance;
            snow.position.y = 1.9 + level * 0.9 + Math.random() * 0.5;
            
            treeGroup.add(snow);
        }
    }

    animateTreeAppearance(treeGroup) {
        const targetScale = this.settings.treeScale;
        let currentScale = 0;
        
        const animate = () => {
            currentScale += 0.05;
            if (currentScale > targetScale) {
                currentScale = targetScale;
            }
            
            treeGroup.scale.set(currentScale, currentScale, currentScale);
            
            if (currentScale < targetScale) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    createInitialGifts() {
        const giftPositions = [
            { x: -1.5, z: -1.2, color: 0xff4444, size: 0.6 },
            { x: 1.3, z: -0.8, color: 0x44ff44, size: 0.5 },
            { x: -0.7, z: 1.4, color: 0x4444ff, size: 0.7 }
        ];

        giftPositions.forEach(pos => {
            this.addGift(pos.x, 0.3, pos.z, pos.color, pos.size);
        });
    }

    createDecorations() {
        // === ГИРЛЯНДА ===
        const garlandPoints = [];
        const pointsCount = 24;
        
        for (let i = 0; i < pointsCount; i++) {
            const angle = (i / pointsCount) * Math.PI * 2;
            const radius = 1.2 - (i % 3) * 0.2;
            const y = 1.5 + (i / pointsCount) * 3;
            
            garlandPoints.push(
                new THREE.Vector3(
                    Math.cos(angle) * radius,
                    y,
                    Math.sin(angle) * radius
                )
            );
        }
        
        const garlandGeometry = new THREE.BufferGeometry().setFromPoints(garlandPoints);
        const garlandMaterial = new THREE.LineBasicMaterial({
            color: 0xff4444,
            linewidth: 2
        });
        
        const garland = new THREE.Line(garlandGeometry, garlandMaterial);
        this.scene.add(garland);
        this.garland = garland;

        // === ОГНИ ===
        this.createLightsOnTree();
    }

    createLightsOnTree() {
        const lightCount = 20;
        const lightGeometry = new THREE.SphereGeometry(0.08, 6, 6);
        
        for (let i = 0; i < lightCount; i++) {
            const lightMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0xff4444 : 0x44ff44
            });
            
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 1.5;
            const y = 1.5 + Math.random() * 3;
            
            light.position.set(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );
            
            this.scene.add(light);
            this.treeLights = this.treeLights || [];
            this.treeLights.push(light);
        }
    }

    addGift(x, y, z, color = 0xff0000, size = 0.5) {
        if (this.gifts.length >= this.settings.maxGifts) {
            console.warn("Достигнут лимит подарков");
            return null;
        }

        const giftGroup = new THREE.Group();
        
        // ОСНОВНОЙ БОКС
        const boxGeometry = new THREE.BoxGeometry(size, size, size);
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.4,
            metalness: 0.3
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;
        box.receiveShadow = true;
        giftGroup.add(box);
        
        // ЛЕНТОЧКИ
        const ribbonWidth = size * 1.1;
        const ribbonHeight = size * 0.1;
        
        // Горизонтальная лента
        const ribbonHGeometry = new THREE.BoxGeometry(ribbonWidth, ribbonHeight, ribbonHeight);
        const ribbonHMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.8
        });
        const ribbonH = new THREE.Mesh(ribbonHGeometry, ribbonHMaterial);
        ribbonH.castShadow = true;
        giftGroup.add(ribbonH);
        
        // Вертикальная лента
        const ribbonVGeometry = new THREE.BoxGeometry(ribbonHeight, ribbonWidth, ribbonHeight);
        const ribbonVMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.8
        });
        const ribbonV = new THREE.Mesh(ribbonVGeometry, ribbonVMaterial);
        ribbonV.castShadow = true;
        giftGroup.add(ribbonV);
        
        // БАНТ СВЕРХУ
        const bowGeometry = new THREE.SphereGeometry(size * 0.15, 8, 8);
        const bowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.1,
            metalness: 0.9
        });
        const bow = new THREE.Mesh(bowGeometry, bowMaterial);
        bow.position.y = size / 2;
        bow.castShadow = true;
        giftGroup.add(bow);
        
        giftGroup.position.set(x, y + size / 2, z);
        giftGroup.userData = {
            type: "gift",
            id: this.gifts.length,
            color: color,
            size: size
        };
        
        this.gifts.push(giftGroup);
        this.scene.add(giftGroup);
        
        // Анимация появления
        this.animateGiftAppearance(giftGroup);
        
        // Обновляем счетчик
        this.updateGiftCounter();
        
        return giftGroup;
    }

    animateGiftAppearance(giftGroup) {
        const targetY = giftGroup.position.y;
        giftGroup.position.y = -2;
        giftGroup.scale.set(0.1, 0.1, 0.1);
        
        let progress = 0;
        const duration = 1000; // 1 секунда
        
        const animate = (timestamp) => {
            if (!this.startTime) this.startTime = timestamp;
            progress = (timestamp - this.startTime) / duration;
            
            if (progress > 1) progress = 1;
            
            // Параболическая анимация
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const bounce = Math.sin(progress * Math.PI * 4) * (1 - progress) * 0.3;
            
            giftGroup.position.y = -2 + (targetY + 2) * easeOut + bounce;
            giftGroup.scale.x = 0.1 + 0.9 * easeOut;
            giftGroup.scale.y = 0.1 + 0.9 * easeOut;
            giftGroup.scale.z = 0.1 + 0.9 * easeOut;
            
            giftGroup.rotation.y = progress * Math.PI * 2;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.startTime = null;
            }
        };
        
        requestAnimationFrame(animate);
    }

    setupControls() {
        // OrbitControls для вращения камеры
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.8;
        this.controls.enableZoom = true;
        this.controls.zoomSpeed = 0.8;
        this.controls.enablePan = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 15;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // Обработка кликов по подаркам
        this.renderer.domElement.addEventListener("click", (event) => this.onCanvasClick(event));
        
        // Touch события
        this.setupTouchControls();
    }

    setupTouchControls() {
        let touchStart = null;
        let touchStartTime = null;
        
        this.renderer.domElement.addEventListener("touchstart", (event) => {
            if (event.touches.length === 1) {
                touchStart = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
                touchStartTime = Date.now();
                event.preventDefault();
            }
        }, { passive: false });
        
        this.renderer.domElement.addEventListener("touchend", (event) => {
            if (touchStart && event.changedTouches.length === 1) {
                const touchEnd = {
                    x: event.changedTouches[0].clientX,
                    y: event.changedTouches[0].clientY
                };
                
                const dx = touchEnd.x - touchStart.x;
                const dy = touchEnd.y - touchStart.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const duration = Date.now() - touchStartTime;
                
                // Если это был короткий тап (не свайп)
                if (distance < 10 && duration < 300) {
                    this.onCanvasClick(event);
                }
                
                touchStart = null;
                touchStartTime = null;
            }
        });
    }

    onCanvasClick(event) {
        if (!this.camera || !this.controls) return;
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = {
            x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
            y: -((event.clientY - rect.top) / rect.height) * 2 + 1
        };
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouse.x, mouse.y), this.camera);
        
        // Проверяем пересечение с подарками
        const intersects = raycaster.intersectObjects(this.gifts, true);
        
        if (intersects.length > 0) {
            const gift = intersects[0].object.parent;
            if (gift.userData && gift.userData.type === "gift") {
                this.onGiftClick(gift.userData.id);
                return;
            }
        }
        
        // Если кликнули не по подарку, сбрасываем выделение
        this.deselectAllGifts();
    }

    onGiftClick(giftId) {
        console.log(" Клик по подарку:", giftId);
        
        const gift = this.gifts[giftId];
        if (!gift) return;
        
        // Анимация выделения
        this.selectGift(gift);
        
        // Показываем информацию
        if (window.showToast) {
            window.showToast(`Подарок #${giftId + 1}\nЦвет: ${gift.userData.color.toString(16)}`, "info");
        }
        
        // Тактильный отклик в Telegram
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) {
            Telegram.WebApp.HapticFeedback.impactOccurred("light");
        }
    }

    selectGift(gift) {
        // Сбрасываем выделение у всех подарков
        this.deselectAllGifts();
        
        // Подсвечиваем выбранный подарок
        gift.children.forEach(child => {
            if (child.isMesh) {
                child.material.emissive = new THREE.Color(0x333333);
                child.material.emissiveIntensity = 0.5;
                child.material.needsUpdate = true;
            }
        });
        
        // Анимация подпрыгивания
        const originalY = gift.position.y;
        let height = 0;
        
        const jump = () => {
            height += 0.2;
            gift.position.y = originalY + Math.sin(height) * 0.2;
            
            if (height < Math.PI) {
                requestAnimationFrame(jump);
            } else {
                gift.position.y = originalY;
            }
        };
        
        jump();
        
        this.selectedGift = gift;
    }

    deselectAllGifts() {
        this.gifts.forEach(gift => {
            gift.children.forEach(child => {
                if (child.isMesh) {
                    child.material.emissive = new THREE.Color(0x000000);
                    child.material.emissiveIntensity = 0;
                    child.material.needsUpdate = true;
                }
            });
        });
        
        this.selectedGift = null;
    }

    updateGiftCounter() {
        const counterElement = document.getElementById("gift-count");
        if (counterElement) {
            counterElement.textContent = this.gifts.length;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Обновление анимаций
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Анимация звезды
        if (this.star) {
            this.star.rotation.y += 0.01;
            this.star.scale.x = 1 + Math.sin(Date.now() * 0.002) * 0.1;
            this.star.scale.y = 1 + Math.sin(Date.now() * 0.002) * 0.1;
            this.star.scale.z = 1 + Math.sin(Date.now() * 0.002) * 0.1;
        }
        
        // Анимация гирлянды
        if (this.pointLight && this.settings.enableAnimations) {
            const time = Date.now() * 0.001;
            this.pointLight.intensity = 0.7 + Math.sin(time * 3) * 0.3;
            
            // Плавное изменение цвета
            const hue = (time * 0.1) % 1;
            this.pointLight.color.setHSL(hue, 1, 0.5);
        }
        
        // Анимация огоньков на ёлке
        if (this.treeLights && this.settings.enableAnimations) {
            this.treeLights.forEach((light, index) => {
                const time = Date.now() * 0.001 + index * 0.1;
                light.scale.x = 1 + Math.sin(time * 2) * 0.3;
                light.scale.y = 1 + Math.sin(time * 2) * 0.3;
                light.scale.z = 1 + Math.sin(time * 2) * 0.3;
                
                // Мерцание
                if (Math.random() > 0.95) {
                    light.visible = !light.visible;
                }
            });
        }
        
        // Медленное вращение ёлки если нет пользовательского ввода
        if (this.tree && !this.controls?.autoRotate) {
            const timeSinceLastInteraction = Date.now() - (this.lastInteractionTime || 0);
            if (timeSinceLastInteraction > 5000) { // 5 секунд бездействия
                this.tree.rotation.y += 0.001;
            }
        }
        
        // Обновление управления
        if (this.controls) {
            this.controls.update();
            
            // Отслеживаем взаимодействие
            if (this.controls.object.position.x !== this.lastCameraPos?.x ||
                this.controls.object.position.y !== this.lastCameraPos?.y ||
                this.controls.object.position.z !== this.lastCameraPos?.z) {
                this.lastInteractionTime = Date.now();
                this.lastCameraPos = this.controls.object.position.clone();
            }
        }
        
        // Рендеринг
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    setupResizeHandler() {
        window.addEventListener("resize", () => {
            const container = this.renderer.domElement.parentElement;
            if (!container || !this.camera || !this.renderer) return;
            
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    showFallback() {
        const container = document.getElementById("tree-container");
        if (!container) return;
        
        container.innerHTML = `
            <div class="fallback-container">
                <div class="fallback-tree">
                    <div class="star"></div>
                    <div class="level"></div>
                    <div class="level"></div>
                    <div class="level"></div>
                    <div class="gifts" id="fallback-gifts"></div>
                    <div class="trunk"></div>
                </div>
                <p class="fallback-message">Используется упрощённая версия</p>
            </div>
        `;
        
        // Добавляем начальные подарки
        const giftsContainer = document.getElementById("fallback-gifts");
        if (giftsContainer) {
            for (let i = 0; i < this.giftCount; i++) {
                const gift = document.createElement("span");
                gift.className = "gift";
                gift.textContent = "";
                gift.style.animationDelay = `${i * 0.1}s`;
                giftsContainer.appendChild(gift);
            }
        }
        
        // Стили для фолбэка
        const styles = `
            .fallback-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .fallback-tree {
                text-align: center;
                font-size: 28px;
                line-height: 1.4;
                animation: float 4s infinite ease-in-out;
            }
            .fallback-tree .star {
                color: gold;
                font-size: 40px;
                margin-bottom: 15px;
                animation: spin 3s infinite linear;
                display: inline-block;
            }
            .fallback-tree .level {
                margin: 4px 0;
            }
            .fallback-tree .gifts {
                margin: 20px 0;
            }
            .fallback-tree .gift {
                margin: 0 10px;
                display: inline-block;
                animation: bounce 1s infinite alternate;
                cursor: pointer;
            }
            .fallback-tree .trunk {
                width: 50px;
                height: 60px;
                background: linear-gradient(to bottom, #8B4513, #A0522D);
                border-radius: 10px;
                margin: 10px auto 0;
            }
            .fallback-message {
                margin-top: 20px;
                color: #8a94a6;
                font-size: 14px;
                text-align: center;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes bounce {
                from { transform: translateY(0); }
                to { transform: translateY(-10px); }
            }
        `;
        
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        // Обработчики для подарков
        setTimeout(() => {
            document.querySelectorAll(".gift").forEach((gift, index) => {
                gift.addEventListener("click", () => {
                    if (window.showToast) {
                        window.showToast(`Подарок #${index + 1}`, "info");
                    }
                    
                    gift.style.animation = "none";
                    setTimeout(() => {
                        gift.style.animation = "bounce 1s infinite alternate";
                    }, 100);
                });
            });
        }, 100);
    }

    // === ПУБЛИЧНЫЕ МЕТОДЫ ===
    
    addRandomGift() {
        if (this.gifts.length >= this.settings.maxGifts) {
            if (window.showToast) {
                window.showToast("Достигнут лимит подарков!", "warning");
            }
            return null;
        }
        
        const colors = [
            0xff4444, // красный
            0x44ff44, // зеленый
            0x4444ff, // синий
            0xff44ff, // розовый
            0xffff44, // желтый
            0xff8844  // оранжевый
        ];
        
        const x = (Math.random() - 0.5) * 3;
        const z = (Math.random() - 0.5) * 3;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 0.4 + Math.random() * 0.3;
        
        const gift = this.addGift(x, 0.3, z, color, size);
        
        if (window.showToast) {
            window.showToast(" Новый подарок добавлен!", "success");
        }
        
        return gift;
    }
    
    removeGift(giftId) {
        if (giftId >= 0 && giftId < this.gifts.length) {
            const gift = this.gifts[giftId];
            this.scene.remove(gift);
            this.gifts.splice(giftId, 1);
            
            // Обновляем IDs оставшихся подарков
            this.gifts.forEach((gift, index) => {
                gift.userData.id = index;
            });
            
            this.updateGiftCounter();
            return true;
        }
        return false;
    }
    
    clearAllGifts() {
        this.gifts.forEach(gift => {
            this.scene.remove(gift);
        });
        this.gifts = [];
        this.updateGiftCounter();
    }
    
    getGiftCount() {
        return this.gifts.length;
    }
    
    resetCamera() {
        if (this.controls) {
            this.controls.reset();
        }
    }
    
    setTreeScale(scale) {
        this.settings.treeScale = Math.max(0.5, Math.min(scale, 2.0));
        if (this.tree) {
            this.tree.scale.setScalar(this.settings.treeScale);
        }
    }
    
    toggleAnimations(enabled) {
        this.settings.enableAnimations = enabled;
    }
    
    toggleShadows(enabled) {
        this.settings.enableShadows = enabled;
        if (this.renderer) {
            this.renderer.shadowMap.enabled = enabled;
        }
    }
    
    // Экспорт ёлки как изображения
    captureScreenshot() {
        if (!this.renderer) return null;
        
        // Временно меняем фон на белый для screenshot
        const originalBackground = this.scene.background;
        this.scene.background = new THREE.Color(0xffffff);
        
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL("image/png");
        
        // Восстанавливаем оригинальный фон
        this.scene.background = originalBackground;
        
        return dataURL;
    }
}

// ===== ГЛОБАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ =====
window.initTree3D = async function() {
    console.log(" Запуск 3D ёлки...");
    
    try {
        const tree3D = new ChristmasTree3D();
        const success = await tree3D.init("tree-canvas");
        
        if (success) {
            window.Tree3D = tree3D;
            console.log(" 3D ёлка готова!");
            
            // Настраиваем кнопки управления
            setupTreeControls(tree3D);
            
            return tree3D;
        }
    } catch (error) {
        console.error("Ошибка инициализации 3D:", error);
        return null;
    }
};

function setupTreeControls(tree3D) {
    // Кнопка добавления подарка
    const addGiftBtn = document.getElementById("add-gift-btn");
    if (addGiftBtn) {
        addGiftBtn.addEventListener("click", () => {
            tree3D.addRandomGift();
            
            // Тактильный отклик
            if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) {
                Telegram.WebApp.HapticFeedback.impactOccurred("medium");
            }
        });
    }
    
    // Автоповорот после бездействия
    let inactivityTimer;
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (tree3D.controls) {
                tree3D.controls.autoRotate = true;
                tree3D.controls.autoRotateSpeed = 0.5;
            }
        }, 10000); // 10 секунд
    }
    
    // Следим за активностью
    const events = ["mousedown", "mousemove", "wheel", "touchstart", "touchmove"];
    events.forEach(event => {
        document.addEventListener(event, resetInactivityTimer, { passive: true });
    });
    
    resetInactivityTimer();
}

// Глобальная функция для toast уведомлений
window.showToast = function(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    const icons = {
        success: "check-circle",
        error: "exclamation-circle",
        warning: "exclamation-triangle",
        info: "info-circle"
    };
    
    const icon = icons[type] || "info-circle";
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Автоматическое удаление
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(10px)";
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
};

console.log(" Three.js модуль загружен");

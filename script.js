document.addEventListener("DOMContentLoaded", function () {
    /**************************************************************************/
    /* 视频延迟播放处理 & IntersectionObserver */
    /**************************************************************************/
    let video = document.getElementById("background-video");
    let source = video.querySelector("source");

    // ✅ 监听视频是否可以流畅播放
    video.addEventListener("canplaythrough", function () {
        console.log("🎥 视频可播放，开始播放！");
        setTimeout(() => video.play(), 200); // ✅ 延迟播放，确保 `source` 加载完成
    });

    // ✅ 避免 `play()` 被 `load()` 终止
    video.play().catch(error => {
        console.warn("⚠️ 自动播放失败，尝试静音播放", error);
        video.muted = true;
        setTimeout(() => video.play(), 200);
    });

    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log("📺 开始加载视频...");
                if (!source.src) { // 确保只加载一次
                    source.src = "./assets/videos/video01.mp4"; // ✅ 相对路径
                    video.load();
                }
                observer.unobserve(video); // 只触发一次
            }
        });
    });
    observer.observe(video);

    /**************************************************************************/
    /* 粒子背景特效 */
    /**************************************************************************/
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let particles = [];
    const particleCount = 120;
    const maxDistance = 240;
    let mouse = { x: null, y: null };

    window.addEventListener("mousemove", (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener("touchmove", (event) => {
        if (event.touches.length > 0) {
            mouse.x = event.touches[0].clientX;
            mouse.y = event.touches[0].clientY;
        }
    });

    window.addEventListener("touchstart", (event) => {
        if (event.touches.length > 0) {
            mouse.x = event.touches[0].clientX;
            mouse.y = event.touches[0].clientY;
        }
    });

    window.addEventListener("touchend", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5);
            this.speedY = (Math.random() - 0.5);
            this.hue = 0; // 初始白色
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            // 颜色渐变
            this.hue += 0.2;
            if (this.hue > 180) this.hue = 120;

            // 边界检测
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }

        draw() {
            let color;
            if (this.hue < 60) {
                color = `rgba(255, 255, 255, 1)`;
            } else if (this.hue < 150) {
                color = `hsl(${this.hue}, 100%, 50%)`; // 蓝绿色
            } else {
                color = `hsl(120, 75%, 50%)`; // 酸橙绿
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < maxDistance) {
                    let opacity = 0.85 - distance / maxDistance;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function drawMouseLines() {
        if (mouse.x == null || mouse.y == null) return;
        for (let i = 0; i < particles.length; i++) {
            let dx = particles[i].x - mouse.x;
            let dy = particles[i].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < maxDistance * 1.5) {
                let opacity = 1 - distance / (maxDistance * 1.5);
                ctx.strokeStyle = `rgba(50, 205, 50, ${opacity})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let particle of particles) {
            particle.update();
            particle.draw();
        }
        drawLines();
        drawMouseLines();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /**************************************************************************/
    /* 代码行滚动打印效果 */
    /**************************************************************************/
    let codeContainer = document.getElementById("code-animation");
    let codeLines = [
        "function welcome() {",
        "    console.log('欢迎来到 Jeremy 的网站!');",
        "}",
        "welcome();",
        "",
        "const message = '探索我的项目，了解更多关于我的信息';",
        "alert(message);",
        "// 正在加载...",
        "// 连接到服务器...",
        "// 获取最新项目...",
        "// 载入 AI 模型...",
        "// 初始化 UI 渲染...",
        "// Done ✅"
    ];

    let index = 0;
    let charIndex = 0;
    let currentLine = "";
    let lineHeight = 24;
    let maxLines = Math.floor(window.innerHeight / lineHeight);
    let scrollOffset = 0;
    let scrollSpeed = 0.3;
    let isTyping = false;
    let isFilled = false;

    function typeNextChar() {
        if (charIndex < codeLines[index].length) {
            currentLine += codeLines[index][charIndex];
            charIndex++;
            if (codeContainer.lastChild) {
                codeContainer.lastChild.textContent = "> " + currentLine;
            }
            setTimeout(typeNextChar, 10);
        } else {
            index++;
            charIndex = 0;
            isTyping = false;
            setTimeout(addCodeLine, 40);
        }
    }

    function addCodeLine() {
        if (index >= codeLines.length) {
            index = 0; // 循环
        }
        if (!isTyping) {
            isTyping = true;
            currentLine = "";
            let newLine = document.createElement("div");
            newLine.textContent = "> ";
            newLine.style.height = `${lineHeight}px`;
            codeContainer.appendChild(newLine);
            typeNextChar();

            if (codeContainer.children.length > maxLines) {
                isFilled = true;
            }
        }
    }

    let initialOffset = -24;

    function startScrolling() {
        function scrollStep() {
            if (isFilled) {
                scrollOffset += scrollSpeed;
                codeContainer.style.transform = `translateY(${initialOffset - scrollOffset}px)`;
                if (scrollOffset >= lineHeight) {
                    scrollOffset = 0;
                    codeContainer.style.transform = `translateY(${initialOffset}px)`;
                    if (codeContainer.children.length > 0) {
                        codeContainer.removeChild(codeContainer.children[0]);
                    }
                }
            }
            requestAnimationFrame(scrollStep);
        }
        requestAnimationFrame(scrollStep);
    }

    addCodeLine();
    startScrolling();

    window.addEventListener("resize", function () {
        maxLines = Math.floor(window.innerHeight / lineHeight);
    });

    /**************************************************************************/
    /* Intro Screen -> 进入网站 */
    /**************************************************************************/
    let introScreen = document.getElementById("intro-screen");
    let enterButton = document.getElementById("enter-btn");

    enterButton.addEventListener("click", function () {
        introScreen.classList.add("fade-out");
        setTimeout(() => {
            introScreen.style.display = "none";
            // 显示正文
            document.body.classList.remove("hide-content");
            document.body.style.overflow = "auto";
            // 显示导航栏
            document.body.classList.add("show-header");
        }, 1000);
    });

    /**************************************************************************/
    /* 滚动时自动隐藏或显示导航栏（可选） */
    /**************************************************************************/
    window.addEventListener("scroll", function () {
        let header = document.querySelector("header");
        if (window.scrollY > 50) {
            header.style.top = "-100px";
        } else {
            header.style.top = "0";
        }
    });

    /**************************************************************************/
    /* 表单提交处理 */
    /**************************************************************************/
    let form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            let confirmationMessage = document.createElement("p");
            confirmationMessage.textContent = "✅ 你的留言已提交！我会尽快回复。";
            confirmationMessage.style.color = "green";
            confirmationMessage.style.fontWeight = "bold";
            form.appendChild(confirmationMessage);

            setTimeout(() => {
                confirmationMessage.remove();
            }, 5000);
        });
    }

    /**************************************************************************/
    /* 3D 模型展示 (Three.js) —— 不使用 import，直接用全局变量 */
    /**************************************************************************/
    // 获取 3D 容器
    const canvasContainer = document.getElementById("3d-model-viewer");

    // 创建场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
        75,
        canvasContainer.clientWidth / canvasContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 5);

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);

    // 轨道控制器（全局 OrbitControls）
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // 使用全局 OBJLoader
    const objLoader = new THREE.OBJLoader();
    objLoader.load(
        'assets/models/my_model.obj',
        (object) => {
            object.scale.set(1, 1, 1);
            object.position.set(0, 0, 0);
            scene.add(object);
            console.log("✅ 3D 模型加载完成");
        },
        (xhr) => {
            console.log(`模型加载进度: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
        },
        (error) => {
            console.error('❌ 3D 模型加载失败:', error);
        }
    );

    // 窗口变化时更新
    window.addEventListener('resize', () => {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    });

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    /**************************************************************************/
    /* PDF 翻页显示 (turn.js) */
    /**************************************************************************/
    let pdfBook = document.getElementById("pdf-book");
    let totalPages = 24; // 总页数
    let basePath = "assets/portfolio/pdf-page";

    // ✅ 自动生成 PDF 页
    for (let i = 1; i <= totalPages; i++) {
        let pageDiv = document.createElement("div");
        pageDiv.classList.add("page");

        let img = document.createElement("img");
        img.src = `${basePath}${i}.jpg`;
        img.alt = `Page ${i}`;

        pageDiv.appendChild(img);
        pdfBook.appendChild(pageDiv);
    }

    if ($("#pdf-book").length && !$("#pdf-book").data("initialized")) {
        $("#pdf-book").turn({
            width: 1000,
            height: 800,
            autoCenter: true,
            display: "double",
            acceleration: true,
            elevation: 50,
            gradients: true,
            when: {
                turned: function (event, page) {
                    console.log("📖 翻到第 " + page + " 页");
                }
            }
        });
        $("#pdf-book").data("initialized", true);
    }

    $("#pdf-book").click(function (event) {
        let bookOffset = $(this).offset().left;
        let centerX = bookOffset + $(this).width() / 2;

        if (event.pageX < centerX) {
            console.log("⬅️ 翻上一页");
            $("#pdf-book").turn("previous");
        } else {
            console.log("➡️ 翻下一页");
            $("#pdf-book").turn("next");
        }
    });

    $(document).keydown(function (e) {
        if (e.keyCode == 37) $("#pdf-book").turn("previous");
        if (e.keyCode == 39) $("#pdf-book").turn("next");
    });

    function resizeBook() {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let bookWidth = windowWidth * 0.8;
        let bookHeight = windowHeight * 1;
        let aspectRatio = 1000 / 800;

        if (bookWidth / bookHeight > aspectRatio) {
            bookWidth = bookHeight * aspectRatio;
        } else {
            bookHeight = bookWidth / aspectRatio;
        }

        $("#pdf-book").turn("size", bookWidth, bookHeight);
    }

    window.addEventListener("resize", resizeBook);
    resizeBook();
});

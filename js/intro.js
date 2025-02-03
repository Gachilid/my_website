document.addEventListener("DOMContentLoaded", function () {

    // ================== 点击进入网站按钮 ==================
    let enterButton = document.getElementById("enter-btn");
    enterButton.addEventListener("click", function () {
        // 可以先做淡出，再跳转
        let introScreen = document.getElementById("intro-screen");
        introScreen.classList.add("fade-out");
        setTimeout(() => {
            // 跳转到 main.html
            window.location.href = "main.html";
        }, 1000);
    });

    // ================== 粒子背景特效 ==================
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

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5);
            this.speedY = (Math.random() - 0.5);
            this.hue = 0;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.hue += 0.2;
            if (this.hue > 180) this.hue = 120;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            let color;
            if (this.hue < 60) {
                color = `rgba(255,255,255,1)`;
            } else if (this.hue < 150) {
                color = `hsl(${this.hue},100%,50%)`;
            } else {
                color = `hsl(120,75%,50%)`;
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
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDistance) {
                    let opacity = 0.85 - dist / maxDistance;
                    ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
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
        for (let p of particles) {
            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDistance * 1.5) {
                let opacity = 1 - dist / (maxDistance * 1.5);
                ctx.strokeStyle = `rgba(50,205,50,${opacity})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of particles) {
            p.update();
            p.draw();
        }
        drawLines();
        drawMouseLines();
        requestAnimationFrame(animateParticles);
    }
    initParticles();
    animateParticles();

    // ================== 代码行滚动打印效果 ==================
    let codeContainer = document.getElementById("code-animation");
    let codeLines = [
        "function welcome() {",
        "  console.log('欢迎来到 Jeremy 的网站!');",
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
    let index = 0, charIndex = 0;
    let currentLine = "";
    let lineHeight = 24;
    let maxLines = Math.floor(window.innerHeight / lineHeight);
    let scrollOffset = 0, scrollSpeed = 0.3;
    let isTyping = false, isFilled = false;

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
            newLine.style.height = lineHeight + "px";
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

});
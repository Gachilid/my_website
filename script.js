document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 120; // 颗粒数量
    const maxDistance = 240; // 连接线的最大距离
    let mouse = { x: null, y: null };


    // 监听鼠标移动
    window.addEventListener("mousemove", (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // 窗口大小改变时，调整画布尺寸
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = (Math.random() - 0.5) * 1;
            this.hue = 0; // 初始白色
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // 颜色渐变逻辑
            this.hue += 0.2; // 颜色随时间变换

            if (this.hue > 180) this.hue = 120; // 限制颜色范围 (120-180)

            // 边界检测
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }

        draw() {
            let color;
            if (this.hue < 60) {
                color = `rgba(255, 255, 255, 1)`; // 白色
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



    // 初始化粒子
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // 绘制粒子连接线
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // 连接粒子之间的线
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

    // 鼠标跟随特效
    function drawMouseLines() {
        for (let i = 0; i < particles.length; i++) {
            let dx = particles[i].x - mouse.x;
            let dy = particles[i].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance * 1.5) {
                let opacity = 1 - distance / (maxDistance * 1.5);
                ctx.strokeStyle = `rgba(50, 205, 50, ${opacity})`; // 酸橙绿 (LimeGreen)
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let particle of particles) {
            particle.update();
            particle.draw();
        }

        drawLines();
        drawMouseLines();

        requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    // 获取进入页面元素
    let introScreen = document.getElementById("intro-screen");
    let enterButton = document.getElementById("enter-btn");
    let codeContainer = document.getElementById("code-animation");


    // ✅ 代码内容（模拟终端输出）
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
    let lineHeight = 24; // ✅ 每行代码的高度
    let maxLines = Math.floor(window.innerHeight / lineHeight); // ✅ 计算屏幕最大可容纳行数
    let scrollOffset = 0; // ✅ 记录滚动的偏移量
    let scrollSpeed = 0.3; // ✅ 控制滚动速度（可以调整数值来优化效果）
    let isScrolling = false; // ✅ 代码是否正在滚动
    let isTyping = false; // ✅ 是否正在打印
    let isFilled = false; // ✅ 是否填满屏幕

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
            index = 0; // ✅ 代码循环
        }

        if (!isTyping) {
            isTyping = true;
            currentLine = "";

            let newLine = document.createElement("div");
            newLine.textContent = "> ";
            newLine.style.position = "relative";
            newLine.style.height = `${lineHeight}px`; // ✅ 让行高匹配，保证滚动平滑
            codeContainer.appendChild(newLine);

            typeNextChar();

            // ✅ 当代码超出最大行数时，启动平滑滚动
            if (codeContainer.children.length > maxLines) {
                isFilled = true; // ✅ 标记代码已经填满屏幕
            }
        }
    }

    let initialOffset = -24; // ✅ 让代码流起始位置向上提高两行（2 * 24px）

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

    addCodeLine(); // ✅ 启动代码流
    startScrolling(); // ✅ 确保滚动始终执行

    // 📌 监听“进入网站”按钮的点击事件
    enterButton.addEventListener("click", function () {
        // ✅ 让整个 intro-screen 淡出
        introScreen.classList.add("fade-out");

        setTimeout(() => {
            // ✅ 完全隐藏 intro-screen，显示主页面内容
            introScreen.style.display = "none";
            document.body.classList.remove("hide-content");
            document.body.style.overflow = "auto";
        }, 1000);
    });

    // 📌 窗口大小变化时重新计算 maxLines
    window.addEventListener("resize", function () {
        maxLines = Math.floor(window.innerHeight / 20);
    });

    // ✅ 确保页面加载时隐藏主内容
    document.body.classList.add("hide-content");

    // 📌 监听滚动事件，确保滚动到最上方时导航栏始终可见
    window.addEventListener("scroll", function () {
        let header = document.querySelector("header");

        // 🚀 滚动超过 50px，隐藏导航栏
        if (window.scrollY > 50) {
            header.style.top = "-100px"; // 向上隐藏
        } else {
            header.style.top = "0"; // 露出导航栏
        }
    });

    // 📌 监听表单提交事件，防止页面刷新，并显示提交成功信息
    let form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // ✅ 创建并显示提交成功信息
        let confirmationMessage = document.createElement("p");
        confirmationMessage.textContent = "✅ 你的留言已提交！我会尽快回复。";
        confirmationMessage.style.color = "green";
        confirmationMessage.style.fontWeight = "bold";

        // ✅ 添加到表单下方
        form.appendChild(confirmationMessage);

        // ✅ 5 秒后自动移除提示信息
        setTimeout(() => {
            confirmationMessage.remove();
        }, 5000);
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // ====== 表单提交处理 ======
    let form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            let msg = document.createElement("p");
            msg.textContent = "✅ 你的留言已提交！我会尽快回复。";
            msg.style.color = "green";
            msg.style.fontWeight = "bold";
            form.appendChild(msg);
            setTimeout(() => msg.remove(), 5000);
        });
    }

    // 你也可以在这里写滚动事件、导航栏动画等
});
document.addEventListener("DOMContentLoaded", function () {
    let pdfBook = document.getElementById("pdf-book");
    let totalPages = 24; // 根据你的实际页数
    let basePath = "assets/portfolio/pdf-page"; // e.g. pdf-page1.jpg, pdf-page2.jpg...

    // 生成页
    for (let i = 1; i <= totalPages; i++) {
        let pageDiv = document.createElement("div");
        pageDiv.classList.add("page");
        let img = document.createElement("img");
        img.src = `${basePath}${i}.jpg`;
        img.alt = `Page ${i}`;
        pageDiv.appendChild(img);
        pdfBook.appendChild(pageDiv);
    }

    // 初始化 turn.js
    if ($("#pdf-book").length && !$("#pdf-book").data("initialized")) {
        $("#pdf-book").turn({
            width: 1000,
            height: 800,
            autoCenter: true,
            display: "double",
            elevation: 50,
            gradients: true,
            when: {
                turned: function (e, page) {
                    console.log("📖 翻到第 " + page + " 页");
                }
            }
        });
        $("#pdf-book").data("initialized", true);
    }

    // 点击翻页
    $("#pdf-book").click(function (event) {
        let offsetLeft = $(this).offset().left;
        let centerX = offsetLeft + $(this).width() / 2;
        if (event.pageX < centerX) {
            console.log("⬅️ 翻上一页");
            $("#pdf-book").turn("previous");
        } else {
            console.log("➡️ 翻下一页");
            $("#pdf-book").turn("next");
        }
    });

    // 键盘翻页
    $(document).keydown(function (e) {
        if (e.keyCode === 37) $("#pdf-book").turn("previous");
        if (e.keyCode === 39) $("#pdf-book").turn("next");
    });

    // 响应式调整
    function resizeBook() {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let bookWidth = windowWidth * 0.8;
        let bookHeight = windowHeight * 0.8;
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
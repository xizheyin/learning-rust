// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="ch0.html"><strong aria-hidden="true">1.</strong> 本书介绍</a></li><li class="chapter-item expanded "><a href="ch1.html"><strong aria-hidden="true">2.</strong> Rust语言背景与发展</a></li><li class="chapter-item expanded "><a href="ch2.html"><strong aria-hidden="true">3.</strong> Rust开发工具与环境</a></li><li class="chapter-item expanded "><a href="ch3.html"><strong aria-hidden="true">4.</strong> 计算机基础</a></li><li class="chapter-item expanded "><a href="ch4.html"><strong aria-hidden="true">5.</strong> 程序编译与执行流程</a></li><li class="chapter-item expanded "><a href="ch5.html"><strong aria-hidden="true">6.</strong> Rust语言特性（与C对比）</a></li><li class="chapter-item expanded "><a href="ch6.html"><strong aria-hidden="true">7.</strong> 变量、数据类型与基本运算</a></li><li class="chapter-item expanded "><a href="ch7.html"><strong aria-hidden="true">8.</strong> 流程控制与模式匹配</a></li><li class="chapter-item expanded "><a href="ch8.html"><strong aria-hidden="true">9.</strong> 函数</a></li><li class="chapter-item expanded "><a href="ch9.html"><strong aria-hidden="true">10.</strong> ...</a></li><li class="chapter-item expanded "><a href="chn.html"><strong aria-hidden="true">11.</strong> struct+trait设计哲学</a></li><li class="chapter-item expanded "><a href="chn+1.html"><strong aria-hidden="true">12.</strong> 如何解决编程问题</a></li><li class="chapter-item expanded "><a href="chn+2.html"><strong aria-hidden="true">13.</strong> 现代软件开发标准流程</a></li><li class="chapter-item expanded "><a href="chn+3.html"><strong aria-hidden="true">14.</strong> AI辅助编程：提升开发效率的新工具</a></li><li class="chapter-item expanded "><a href="copyright.html"><strong aria-hidden="true">15.</strong> 版权声明</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);

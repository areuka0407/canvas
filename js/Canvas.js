class Canvas {
    constructor(){
        this.$header = document.querySelector("header");

        this.$aside = document.querySelector("aside");

        this.$viewport = document.querySelector("#viewport");
        this.$viewport.style.width = window.innerWidth - this.$aside.offsetWidth + "px";
        this.$viewport.style.height = window.innerHeight - this.$header.offsetHeight + "px";

        this.currentTool = null;
        this.history = [];

        this.drowing = null;
        this.toolList = {
            pen: () => new Pen(this),
        }

        this.init();
    }

    get tool(){
        let list = Array.from(this.$aside.querySelectorAll(".tool"));
        let find = list.find(x => x.classList.contains("active"));
        return find ? this.toolList[find.id] : null;
    }

    init(){
        this.asideEvent();
        this.canvasEvent();
        this.render();
    }

    asideEvent(){
        this.$aside.querySelectorAll(".tool").forEach(x => {
            x.addEventListener("click", e => {
                let exist = this.$aside.querySelector(".tool.active");
                if(exist) exist.classList.remove("active");
                x.classList.add("active");
            });
        });
    }

    canvasEvent(){
        window.addEventListener("resize", () => {
            this.$viewport.style.width = window.innerWidth - this.$aside.offsetWidth;
            this.$viewport.style.height = window.innerHeight - this.$header.offsetHeight;
        });

        this.$viewport.addEventListener("mousedown", e => {
            if(this.drowing !== null || e.which !== 1) return;
            this.drowing = this.tool();
            this.drowing.mousedown && this.drowing.mousedown();
        });
    }

    render(){
        requestAnimationFrame(() => this.render());
    }
}


window.addEventListener("load", () => {
    const app = new Canvas();
});
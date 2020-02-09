class ColorPicker {
    constructor($target){
        this.color = "#fff";
        this.background = "#f00";

        this.status = 0;
        this.$target = $target;
        this.$target.close = this.close;

        this.mouseTarget = null;
        
        this.$root = `<div class="picker">
                        <div class="main-color">
                            <div class="cursor"></div>
                            <canvas width="300" height="300"/>
                        </div>
                        <div class="sub-color">
                            <div class="cursor"></div>
                            <canvas width="30" height="300"/>
                        </div>
                      </div>`.parseHTML();
        this.$mainColor = this.$root.querySelector(".main-color canvas");
        this.$mainCursor = this.$mainColor.previousElementSibling;
        this.mainCtx = this.$mainColor.getContext("2d");
        this.$mainColor.addEventListener("dragstart", e => e.preventDefault());
        
        this.$subColor = this.$root.querySelector(".sub-color canvas");
        this.$subCursor = this.$subColor.previousElementSibling;
        this.subCtx = this.$subColor.getContext("2d");

        this.init();
    }

    update(){
        const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = this.$mainCursor;
        let x = offsetLeft + offsetWidth / 2;
        let y = offsetTop + offsetHeight / 2;
        this.color = (Array.from(this.mainCtx.getImageData(x, y, 1, 1).data)).parseRGB();
        this.$target.dataset.color = this.color;
        this.$target.style.background = this.color;
    }

    init(){
        this.fillSubColor();
        this.fillMainColor();

        this.targetEvent();
        this.cursorEvent();
    }

    fillSubColor(){
        const {width, height} = this.$subColor;
        let sgrd = this.subCtx.createLinearGradient(0, 0, 0, height);
        sgrd.addColorStop(0, "#f00");
        sgrd.addColorStop(0.166, "#ff0");
        sgrd.addColorStop(0.333, "#0f0");
        sgrd.addColorStop(0.5, "#0ff");
        sgrd.addColorStop(0.666, "#00f");
        sgrd.addColorStop(0.833, "#f0f");
        sgrd.addColorStop(1, "#f00");

        this.subCtx.fillStyle = sgrd;
        this.subCtx.fillRect(0, 0, width, height);
    }

    fillMainColor(){
        const {width, height} = this.$mainColor;
        let mgrd;

        // 주조색
        this.mainCtx.fillStyle = this.background;
        this.mainCtx.fillRect(0, 0, width, height);

        // 흰색
        mgrd = this.mainCtx.createLinearGradient(0, 0, width, 0);
        mgrd.addColorStop(0, "#ffff");
        mgrd.addColorStop(1, "#fff0");
        this.mainCtx.fillStyle = mgrd;
        this.mainCtx.fillRect(0, 0, width, height);

        // 검정색
        mgrd = this.mainCtx.createLinearGradient(0, 0, 0, height);
        mgrd.addColorStop(0, "transparent")
        mgrd.addColorStop(1, "#000f");
        this.mainCtx.fillStyle = mgrd;
        this.mainCtx.fillRect(0, 0, width, height);
    }

    targetEvent(){
        this.$target.addEventListener("click", e => {
            let list = ".picker".selectAll();
            list.filter(x => x !== this.$root).forEach(x => x.close());
            (!list.includes(this.$root)) && this.open(e);
        });

        window.addEventListener("click", e => {
            let target = e.target;
            while(target !== null && target !== this.$root) target = target.parentElement;
            if(target !== this.$root && this.mouseTarget === null) this.close();
        });
    }

    cursorEvent(){
        // 메인 커서
        this.$mainColor.addEventListener("mousedown", e => {
            if(e.which !== 1) return;
            this.mouseTarget = this.$mainColor;

            const [X,Y] = this.takeXY(e, "main");
            this.$mainCursor.style.top = Y + "px";
            this.$mainCursor.style.left = X + "px";

            this.update();
        });

        window.addEventListener("mousemove", e => {
            if(e.which !== 1 || this.mouseTarget !== this.$mainColor) return;
            const [X,Y] = this.takeXY(e, "main");
            this.$mainCursor.style.top = Y + "px";
            this.$mainCursor.style.left = X + "px";

            this.update();

            const {offsetWidth, offsetHeight} = this.$mainColor;
            if(X > offsetWidth / 2 || Y > offsetHeight / 2) this.$mainCursor.classList.add("white");
            else this.$mainCursor.classList.remove("white");
        });

        // 서브 커서
        this.$subColor.addEventListener("mousedown", e => {
            if(e.which !== 1) return;
            this.mouseTarget = this.$subColor;
            
            let [X,Y] = this.takeXY(e, "sub");
            Y++;
            this.$subCursor.style.top = Y + "px";

            let color = Array.from(this.subCtx.getImageData(15, Y, 1, 1).data);
            this.background = color.parseRGB();
            this.fillMainColor();
            this.update();
        });

        window.addEventListener("mousemove", e => {
            if(e.which !== 1 || this.mouseTarget !== this.$subColor) return;
            let [X,Y] = this.takeXY(e, "sub");
            Y++;
            this.$subCursor.style.top = Y + "px";

            let color = Array.from(this.subCtx.getImageData(15, Y, 1, 1).data);
            this.background = color.parseRGB();
            this.fillMainColor();
            this.update();
        });

        window.addEventListener("click", () => {
            this.mouseTarget = null;
        });
    }

    takeXY(e, target){
        const $target = this["$"+target+"Color"];
        const cursor = this["$"+target+"Cursor"];
        const {top, left} = offset($target);
        const {offsetWidth, offsetHeight} = $target;
        const {pageX, pageY} = e;

        let minX = -(cursor.offsetWidth / 2);
        let maxX = offsetWidth - cursor.offsetWidth / 2;
        let minY = -(cursor.offsetHeight / 2);
        let maxY = offsetHeight - cursor.offsetHeight / 2;

        let x = pageX - left;
        x = x < minX ? minX : x > maxX ? maxX : x;

        let y =  pageY - top;
        y = y < minY ? minY : y > maxY ? maxY : y;

        return [x, y];
    }

    open(e){
        if(this.status === 1) return;
        const {pageX, pageY} = e;
        let style = this.$root.style;
        style.left = pageX + "px";
        style.top = pageY + "px";

        document.body.append(this.$root); 
        setTimeout(() => {
            this.status = 1;
            style.opacity = "1";
            style.transform = "translateY(0)";
        });
    }

    close(){
        if(this.status === 0) return;
        let style = this.$root.style;
        style.opacity = "0";
        style.transform = "translateY(-30px)";
        setTimeout(() => {
            this.$root.remove();
            this.status = 0;
        }, 300);
    }
}


window.addEventListener("load", () => {
    ".color-picker".selectAll().forEach(item => new ColorPicker(item));
});
// 画布应用主逻辑
class CanvasApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.phoneFrame = document.getElementById('phoneFrame');
        this.phoneScreen = document.getElementById('phoneScreen');
        this.orientationText = document.getElementById('orientationText');
        this.canvasSize = document.getElementById('canvasSize');
        this.currentColor = document.getElementById('currentColor');
        this.timeDisplay = document.getElementById('timeDisplay');
        
        // 状态
        this.isDrawing = false;
        this.currentColorValue = '#000000';
        this.isLandscape = true;
        this.startTime = Date.now();
        this.lastX = 0;
        this.lastY = 0;
        
        // 颜色名称映射
        this.colorNames = {
            '#000000': '黑色',
            '#ff6b6b': '红色',
            '#4ecdc4': '青色',
            '#ffe66d': '黄色',
            '#95e1d3': '绿色',
            '#f38181': '粉色'
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.startTimer();
        this.updateCanvasSize();
    }
    
    setupCanvas() {
        // 初始化画布尺寸
        this.resizeCanvas();
        // 清空画布
        this.clearCanvas();
    }
    
    resizeCanvas() {
        const screen = this.phoneScreen;
        const rect = screen.getBoundingClientRect();
        
        // 计算可用高度（减去控制栏）
        const controls = document.getElementById('canvasControls');
        const controlsHeight = controls ? controls.offsetHeight : 50;
        
        // 设置画布尺寸
        this.canvas.width = rect.width;
        this.canvas.height = rect.height - controlsHeight - 1;
        
        // 更新显示
        this.updateCanvasSize();
    }
    
    updateCanvasSize() {
        this.canvasSize.textContent = `${this.canvas.width} × ${this.canvas.height}`;
    }
    
    bindEvents() {
        // 翻转按钮
        document.getElementById('rotateBtn').addEventListener('click', () => this.toggleOrientation());
        
        // 清空按钮
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        
        // 颜色按钮
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectColor(btn));
        });
        
        // 鼠标/触摸事件
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
        
        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    toggleOrientation() {
        this.isLandscape = !this.isLandscape;
        this.phoneFrame.classList.toggle('landscape', this.isLandscape);
        this.phoneFrame.classList.toggle('portrait', !this.isLandscape);
        this.orientationText.textContent = this.isLandscape ? '横屏' : '竖屏';
        
        // 等待动画后重设画布
        setTimeout(() => {
            this.resizeCanvas();
        }, 350);
    }
    
    selectColor(btn) {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentColorValue = btn.dataset.color;
        this.currentColor.textContent = this.colorNames[this.currentColorValue] || '自定义';
    }
    
    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCanvasCoordinates(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
        
        // 绘制第一个点
        this.ctx.beginPath();
        this.ctx.arc(this.lastX, this.lastY, 1.5, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.currentColorValue;
        this.ctx.fill();
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const coords = this.getCanvasCoordinates(e);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.strokeStyle = this.currentColorValue;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        
        this.lastX = coords.x;
        this.lastY = coords.y;
    }
    
    stopDrawing() {
        this.isDrawing = false;
    }
    
    clearCanvas() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    startTimer() {
        setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            this.timeDisplay.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new CanvasApp();
});

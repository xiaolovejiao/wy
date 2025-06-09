document.addEventListener('DOMContentLoaded', function() {
    // 检查当前主题
    function checkTheme() {
        return document.body.classList.contains('theme-pink');
    }

    // 检查是否需要显示花朵动画
    function shouldShowFlowers() {
        return false; // 不再需要花朵动画
    }

    // 创建花朵动画容器
    const container = document.createElement('div');
    container.className = 'flower-animation';
    document.body.appendChild(container);
    
    // 如果初始不是粉金色主题，隐藏容器
    if (!checkTheme()) {
        container.style.display = 'none';
    }

    // 花朵emoji数组
    const flowers = ['🌸', '🌺', '🌹', '🌷', '💮', '🌻', '🌼', '🏵️'];
    
    // 额外装饰元素
    const decorations = ['✨', '🍃', '🌿', '🍀', '💫', '💕', '💝', '💖', '🦋', '🌟'];
    
    // 颜色数组（用于文字阴影效果）
    const colors = [
        'rgba(255, 215, 0, 0.6)', // 金色
        'rgba(255, 182, 193, 0.7)', // 粉色
        'rgba(255, 105, 180, 0.6)', // 热粉色
        'rgba(50, 205, 50, 0.6)',  // 绿色
        'rgba(255, 69, 0, 0.6)'    // 红色
    ];

    // 创建金色光束
    function createGoldenBeam() {
        const beam = document.createElement('div');
        beam.className = 'golden-beam';
        
        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // 随机角度
        const angle = Math.random() * 360;
        
        // 随机大小
        const width = 100 + Math.random() * 200;
        const height = 1 + Math.random() * 2;
        
        // 随机动画延迟
        const delay = Math.random() * 3;
        
        // 随机动画持续时间
        const duration = 4 + Math.random() * 6;
        
        // 设置样式
        beam.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(90deg, 
                rgba(255, 215, 0, 0) 0%, 
                rgba(255, 215, 0, 0.7) 50%, 
                rgba(255, 215, 0, 0) 100%);
            transform: rotate(${angle}deg);
            opacity: 0;
            animation: beamFade ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
            z-index: 1;
            pointer-events: none;
        `;
        
        // 添加到容器
        container.appendChild(beam);
    }

    // 创建生长花朵
    function createFlower() {
        const flower = document.createElement('div');
        flower.className = 'flower';
        
        // 随机选择花朵和颜色
        const randomFlower = flowers[Math.floor(Math.random() * flowers.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // 随机大小
        const scale = 0.5 + Math.random() * 1.5;
        
        // 随机动画延迟
        const delay = Math.random() * 2;
        
        // 随机动画持续时间
        const duration = 6 + Math.random() * 4;
        
        // 设置样式
        flower.style.cssText = `
            left: ${x}%;
            top: ${y}%;
            font-size: ${scale}em;
            text-shadow: 0 0 10px ${randomColor};
            animation: flowerGrow ${duration}s ease-out forwards,
                      flowerSway ${2 + Math.random() * 2}s ease-in-out infinite,
                      goldenSparkle ${1 + Math.random()}s ease-in-out infinite;
            animation-delay: ${delay}s;
            z-index: ${Math.floor(Math.random() * 10)};
        `;
        
        flower.textContent = randomFlower;
        
        // 添加到容器
        container.appendChild(flower);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (flower.parentNode === container) {
                container.removeChild(flower);
            }
        }, (duration + delay) * 1000);
    }
    
    // 创建掉落花朵
    function createFallingFlower() {
        const flower = document.createElement('div');
        flower.className = 'falling-flower';
        
        // 随机选择花朵或装饰元素
        const isDecoration = Math.random() > 0.6;
        const elements = isDecoration ? decorations : flowers;
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        // 随机选择颜色
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // 随机起始位置（只在X轴上随机）
        const x = Math.random() * 100;
        
        // 随机大小
        const scale = 0.3 + Math.random() * 1.2;
        
        // 随机动画延迟
        const delay = Math.random() * 3;
        
        // 随机动画持续时间
        const duration = 5 + Math.random() * 10;
        
        // 随机水平漂移量
        const drift = -50 + Math.random() * 100; // -50px 到 +50px
        
        // 设置样式
        flower.style.cssText = `
            left: ${x}%;
            top: -5%;
            font-size: ${scale}em;
            text-shadow: 0 0 10px ${randomColor};
            animation: flowerFall ${duration}s linear forwards,
                      flowerFloat ${3 + Math.random() * 2}s ease-in-out infinite,
                      goldenSparkle ${1 + Math.random()}s ease-in-out infinite;
            animation-delay: ${delay}s;
            z-index: ${Math.floor(Math.random() * 5)};
        `;
        
        flower.textContent = randomElement;
        
        // 添加到容器
        container.appendChild(flower);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (flower.parentNode === container) {
                container.removeChild(flower);
            }
        }, (duration + delay) * 1000);
    }

    // 创建粉色漂浮气泡
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'pink-bubble';
        
        // 随机大小
        const size = 10 + Math.random() * 40;
        
        // 随机位置
        const x = Math.random() * 100;
        const y = 100 + Math.random() * 20;
        
        // 随机动画持续时间
        const duration = 10 + Math.random() * 15;
        
        // 随机透明度
        const opacity = 0.1 + Math.random() * 0.3;
        
        // 设置样式
        bubble.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            left: ${x}%;
            bottom: -${y}px;
            background: radial-gradient(circle at 30% 30%, 
                rgba(255, 182, 193, ${opacity + 0.1}), 
                rgba(255, 105, 180, ${opacity}));
            box-shadow: 0 0 10px rgba(255, 182, 193, 0.5), 
                        inset 0 0 10px rgba(255, 255, 255, 0.8);
            animation: bubbleRise ${duration}s linear forwards;
            z-index: 1;
            pointer-events: none;
        `;
        
        // 添加到容器
        container.appendChild(bubble);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (bubble.parentNode === container) {
                container.removeChild(bubble);
            }
        }, duration * 1000);
    }

    // 添加动画样式
    if (!document.querySelector('#pink-theme-animations')) {
        const style = document.createElement('style');
        style.id = 'pink-theme-animations';
        style.textContent = `
            @keyframes bubbleRise {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-${window.innerHeight * 1.2}px) translateX(${-50 + Math.random() * 100}px);
                    opacity: 0;
                }
            }
            
            @keyframes beamFade {
                0%, 100% {
                    opacity: 0;
                }
                50% {
                    opacity: 0.3;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 如果是粉金色主题，初始化花朵
    if (checkTheme()) {
        // 初始化生长花朵
        for (let i = 0; i < 30; i++) {
            createFlower();
        }
        
        // 初始化掉落花朵
        for (let i = 0; i < 15; i++) {
            createFallingFlower();
        }
        
        // 初始化金色光束
        for (let i = 0; i < 10; i++) {
            createGoldenBeam();
        }
        
        // 持续创建新的生长花朵
        setInterval(() => {
            if (checkTheme() && container.querySelectorAll('.flower').length < 40) {
                createFlower();
            }
        }, 800);
        
        // 持续创建新的掉落花朵
        setInterval(() => {
            if (checkTheme() && container.querySelectorAll('.falling-flower').length < 25) {
                createFallingFlower();
            }
        }, 600);
        
        // 持续创建新的金色光束
        setInterval(() => {
            if (checkTheme() && container.querySelectorAll('.golden-beam').length < 15) {
                createGoldenBeam();
            }
        }, 2000);
        
        // 持续创建粉色气泡
        setInterval(() => {
            if (checkTheme() && container.querySelectorAll('.pink-bubble').length < 20) {
                createBubble();
            }
        }, 1000);
    }

    // 监听主题变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const isPinkTheme = checkTheme();
                container.style.display = isPinkTheme ? 'block' : 'none';
                
                // 如果切换到粉金色主题，初始化一些花朵
                if (isPinkTheme && container.children.length < 10) {
                    for (let i = 0; i < 30; i++) {
                        createFlower();
                    }
                    for (let i = 0; i < 15; i++) {
                        createFallingFlower();
                    }
                    for (let i = 0; i < 10; i++) {
                        createGoldenBeam();
                    }
                    for (let i = 0; i < 8; i++) {
                        createBubble();
                    }
                }
            }
        });
    });

    observer.observe(document.body, {
        attributes: true
    });
}); 
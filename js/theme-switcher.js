// 主题切换器
document.addEventListener('DOMContentLoaded', function() {
    console.log('主题切换器脚本已加载');
    
    // 获取DOM元素
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIconsContainer = document.querySelector('.theme-icons');
    const themeIcons = document.querySelectorAll('.theme-icon');
    
    // 从本地存储获取当前主题，如果没有则默认为starry
    const currentTheme = localStorage.getItem('theme') || 'starry';
    document.body.className = 'theme-' + currentTheme;
    
    // 设置初始鼠标位置变量
    document.documentElement.style.setProperty('--mouse-x', '50%');
    document.documentElement.style.setProperty('--mouse-y', '50%');
    
    // 使用requestAnimationFrame优化鼠标移动事件
    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // 计算鼠标位置的百分比
                const x = (mouseX / window.innerWidth) * 100 + '%';
                const y = (mouseY / window.innerHeight) * 100 + '%';
                
                // 设置CSS变量
                document.documentElement.style.setProperty('--mouse-x', x);
                document.documentElement.style.setProperty('--mouse-y', y);
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    // 设置当前主题的图标为激活状态
    themeIcons.forEach(icon => {
        if (icon.getAttribute('data-theme') === currentTheme) {
            icon.classList.add('active');
        }
    });
    
    // 初始化增强主题效果
    if (typeof enhanceThemeEffects === 'function') {
        enhanceThemeEffects();
        
        // 如果当前是非主流主题，立即应用黑金配色
        if (currentTheme === 'cool') {
            setTimeout(() => {
                if (typeof enhanceCoolTheme === 'function') {
                    enhanceCoolTheme();
                }
            }, 100);
        }
    }
    
    // 点击主题切换按钮显示/隐藏主题选项
    if (themeToggleBtn) {
        themeToggleBtn.onclick = function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            
            // 如果菜单已显示，先移除动画类再隐藏
            if (themeIconsContainer.classList.contains('show')) {
                themeIconsContainer.classList.remove('show');
            } else {
                // 否则显示菜单
                themeIconsContainer.classList.add('show');
            }
        };
    }
    
    // 点击页面其他区域隐藏主题选项
    document.onclick = function() {
        if (themeIconsContainer && themeIconsContainer.classList.contains('show')) {
            themeIconsContainer.classList.remove('show');
        }
    };
    
    // 阻止点击主题选项时触发页面点击事件
    if (themeIconsContainer) {
        themeIconsContainer.onclick = function(e) {
            e.stopPropagation();
        };
    }
    
    // 点击主题图标切换主题
    themeIcons.forEach(icon => {
        icon.onclick = function() {
            const theme = this.getAttribute('data-theme');
            
            // 切换主题
            document.body.className = 'theme-' + theme;
            localStorage.setItem('theme', theme);
            
            // 更新激活状态
            themeIcons.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 隐藏主题选项
            themeIconsContainer.classList.remove('show');
            
            // 应用增强主题效果
            if (typeof enhanceThemeEffects === 'function') {
                enhanceThemeEffects();
                
                // 如果切换到非主流主题，确保立即应用黑金配色
                if (theme === 'cool') {
                    setTimeout(() => {
                        if (typeof enhanceCoolTheme === 'function') {
                            enhanceCoolTheme();
                        }
                    }, 100);
                }
            }
        };
    });
}); 
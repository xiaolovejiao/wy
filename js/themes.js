// 主题管理
document.addEventListener('DOMContentLoaded', () => {
    console.log("主题管理脚本已加载");
    
    // 获取主题切换按钮和主题图标
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcons = document.querySelector('.theme-icons');
    const themeIconBtns = document.querySelectorAll('.theme-icon');
    
    console.log("主题切换按钮:", themeToggleBtn);
    console.log("主题图标容器:", themeIcons);
    console.log("主题图标按钮数量:", themeIconBtns.length);
    
    // 获取保存的主题
    const savedTheme = localStorage.getItem('theme') || 'starry';
    
    // 设置初始主题
    document.body.className = `theme-${savedTheme}`;
    console.log("初始主题设置为:", savedTheme);
    
    // 设置当前主题图标为激活状态
    themeIconBtns.forEach(icon => {
        if (icon.dataset.theme === savedTheme) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
    
    // 主题切换按钮点击事件
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            console.log("主题切换按钮被点击");
            e.stopPropagation();
            themeIcons.classList.toggle('show');
            console.log("主题图标菜单显示状态:", themeIcons.classList.contains('show'));
        });
    } else {
        console.error("未找到主题切换按钮");
    }
    
    // 点击其他区域关闭主题选择器
    document.addEventListener('click', () => {
        if (themeIcons && themeIcons.classList.contains('show')) {
            themeIcons.classList.remove('show');
            console.log("点击其他区域，关闭主题菜单");
        }
    });
    
    // 防止点击主题图标时关闭菜单
    if (themeIcons) {
        themeIcons.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("点击主题图标容器，阻止事件冒泡");
        });
    } else {
        console.error("未找到主题图标容器");
    }
    
    // 主题切换事件
    themeIconBtns.forEach(icon => {
        icon.addEventListener('click', () => {
            const theme = icon.dataset.theme;
            console.log("选择主题:", theme);
            changeTheme(theme);
            
            // 更新激活状态
            themeIconBtns.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
            
            // 关闭主题选择器
            if (themeIcons) {
                themeIcons.classList.remove('show');
            }
        });
    });
    
    // 主题切换函数
    function changeTheme(themeName) {
        // 移除所有主题类
        document.body.classList.remove('theme-starry', 'theme-cool');
        
        // 添加新主题类
        document.body.classList.add(`theme-${themeName}`);
        
        // 保存到本地存储
        localStorage.setItem('theme', themeName);
        
        // 触发主题变更事件
        const event = new CustomEvent('themeChanged', { 
            detail: { theme: themeName } 
        });
        document.dispatchEvent(event);
        
        // 更新页面元素样式
        updatePageForTheme(themeName);
    }
    
    // 更新页面元素样式
    function updatePageForTheme(themeName) {
        // 更新动态背景
        const dynamicBackground = document.querySelector('.dynamic-background');
        if (dynamicBackground) {
            dynamicBackground.dataset.theme = themeName;
        }
        
        // 更新鼠标光晕效果
        const mouseGlow = document.querySelector('.mouse-glow');
        if (mouseGlow) {
            mouseGlow.dataset.theme = themeName;
        }
        
        // 如果有动画效果管理器实例，调用其更新方法
        if (window.animationEffects) {
            window.animationEffects.updateForTheme(themeName);
        }
        
        console.log(`主题已切换为: ${themeName}`);
    }
}); 
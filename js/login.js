// 登录功能
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const closeBtn = document.querySelector('.close-btn');
    const modalBtn = document.querySelector('.modal-btn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcons = document.querySelector('.theme-icons');
    const themeIconBtns = document.querySelectorAll('.theme-icon');
    
    // 初始化主题
    initTheme();
    
    // 初始化主题图标
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'starry';
        document.body.className = `theme-${savedTheme}`;
        
        // 设置当前主题图标为激活状态
        themeIconBtns.forEach(icon => {
            if (icon.dataset.theme === savedTheme) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });
    }
    
    // 主题切换按钮点击事件
    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeIcons.classList.toggle('show');
    });
    
    // 点击其他区域关闭主题选择器
    document.addEventListener('click', () => {
        themeIcons.classList.remove('show');
    });
    
    // 防止点击主题图标时关闭菜单
    themeIcons.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // 主题切换事件
    themeIconBtns.forEach(icon => {
        icon.addEventListener('click', () => {
            const theme = icon.dataset.theme;
            changeTheme(theme);
            
            // 更新激活状态
            themeIconBtns.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
            
            // 关闭主题选择器
            themeIcons.classList.remove('show');
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
    }
    
    // 登录表单提交
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // 检查用户名和密码是否为空
            if (!username) {
                showErrorModal('请输入用户名！');
                return;
            }
            
            if (!password) {
                showErrorModal('请输入密码！');
                return;
            }
            
            // 验证用户名和密码
            if (validateLogin(username, password)) {
                // 保存登录状态
                saveLoginState(username);
                
                // 跳转到首页
                window.location.href = 'home.html';
            } else {
                // 显示错误弹窗
                showErrorModal('用户名或密码错误！请重新输入。');
            }
        });
    }
    
    // 显示错误弹窗
    function showErrorModal(message, type = 'error') {
        const modalTitle = document.getElementById('modalTitle');
        const modalIcon = document.getElementById('modalIcon');
        const modalIconSymbol = document.getElementById('modalIconSymbol');
        const modalBtn = document.getElementById('modalBtn');
        
        errorMessage.textContent = message;
        
        // 根据错误类型设置不同的样式
        if (message.includes('用户名') && !message.includes('错误')) {
            // 用户名为空
            modalTitle.textContent = '提示';
            modalIcon.className = 'modal-icon warning-icon';
            modalIconSymbol.textContent = '!';
            modalIconSymbol.className = 'icon-error';
            modalBtn.style.background = 'linear-gradient(135deg, rgba(255, 180, 50, 0.8), rgba(255, 150, 30, 0.9))';
            modalBtn.style.boxShadow = '0 4px 10px rgba(255, 150, 30, 0.3)';
        } else if (message.includes('密码') && !message.includes('错误')) {
            // 密码为空
            modalTitle.textContent = '提示';
            modalIcon.className = 'modal-icon warning-icon';
            modalIconSymbol.textContent = '!';
            modalIconSymbol.className = 'icon-error';
            modalBtn.style.background = 'linear-gradient(135deg, rgba(255, 180, 50, 0.8), rgba(255, 150, 30, 0.9))';
            modalBtn.style.boxShadow = '0 4px 10px rgba(255, 150, 30, 0.3)';
        } else {
            // 用户名或密码错误
            modalTitle.textContent = '登录失败';
            modalIcon.className = 'modal-icon error-icon';
            modalIconSymbol.textContent = '!';
            modalIconSymbol.className = 'icon-error';
            modalBtn.style.background = 'linear-gradient(135deg, rgba(255, 107, 139, 0.8), rgba(255, 80, 120, 0.9))';
            modalBtn.style.boxShadow = '0 4px 10px rgba(255, 80, 120, 0.3)';
        }
        
        errorModal.classList.add('show');
    }
    
    // 关闭弹窗
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            errorModal.classList.remove('show');
        });
    }
    
    if (modalBtn) {
        modalBtn.addEventListener('click', () => {
            errorModal.classList.remove('show');
        });
    }
    
    // 点击弹窗外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === errorModal) {
            errorModal.classList.remove('show');
        }
    });
    
    // 验证登录信息
    function validateLogin(username, password) {
        // 从本地存储获取密码
        const malePassword = localStorage.getItem('malePassword') || '123456';
        const femalePassword = localStorage.getItem('femalePassword') || '123456';
        
        // 预设用户
        const validUsers = {
            '罗枭': malePassword,
            '赖姣姣': femalePassword
        };
        
        return validUsers[username] === password;
    }
    
    // 保存登录状态到本地存储
    function saveLoginState(username) {
        localStorage.setItem('currentUser', username);
        
        // 设置用户类型和默认头像
        if (username === '罗枭') {
            localStorage.setItem('userAvatar', 'images/male-avatar.png');
            localStorage.setItem('userGender', 'male');
            localStorage.setItem('userType', 'male');
            localStorage.setItem('userName', '罗枭');
        } else if (username === '赖姣姣') {
            localStorage.setItem('userAvatar', 'images/female-avatar.png');
            localStorage.setItem('userGender', 'female');
            localStorage.setItem('userType', 'female');
            localStorage.setItem('userName', '赖姣姣');
        }
        
        console.log(`用户 ${username} 登录成功，类型设置为: ${localStorage.getItem('userType')}`);
    }
    
    // 检查是否已登录
    function checkLoginState() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            // 已登录，跳转到首页
            window.location.href = 'home.html';
        }
    }
    
    // 页面加载时检查登录状态
    checkLoginState();
}); 
// 首页功能
document.addEventListener('DOMContentLoaded', () => {
    // 隐藏加载动画
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 500);
        }, 800);
    }
    
    // 检查登录状态
    checkLoginState();
    
    // 显示用户信息
    displayUserInfo();
    
    // 显示今日甜蜜语录
    displayDailyQuote();
    
    // 显示纪念日倒计时
    displayCountdown();
    
    // 初始化相册功能
    initAlbums();
    
    // 初始化时光轴功能
    initTimeline();
    
    // 初始化退出登录功能
    initLogout();
    
    // 计算在一起的天数
    calculateDaysTogether();
    
    // 随机甜蜜语录
    setRandomQuote();
    
    // 设置纪念日倒计时
    setAnniversaryCountdown();
    
    // 心情按钮点击事件
    setupMoodButtons();
    
    // 初始化爱情宣言功能
    initLoveDeclarations();
    
    // 增强主题特效
    enhanceThemeEffects();
    
    // 初始化头像点击事件
    initAvatarClickEvents();
    
    // 确保在所有DOM元素加载完成后再初始化头像点击事件
    setTimeout(() => {
        initAvatarClickEvents();
        console.log('Avatar click events initialized'); // 调试信息
    }, 100);
    
    // 初始化图片查看器
    initImageViewer();
    
    // 初始化情侣心情选择器
    initCoupleMoodSelector();
    
    // 初始化留言板功能
    initMessages();
    
    // 设置当前用户信息
    setupCurrentUser();
    
    // 检查登录状态
    function checkLoginState() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            // 未登录，跳转到登录页
            window.location.href = 'index.html';
        }
    }
    
    // 初始化退出登录功能
    function initLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                // 清除登录状态
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userAvatar');
                localStorage.removeItem('userGender');
                
                // 跳转到登录页
                window.location.href = 'index.html';
            });
        }
    }
    
    // 显示用户信息
    function displayUserInfo() {
        const currentUser = localStorage.getItem('currentUser');
        const userGender = localStorage.getItem('userGender');
        
        console.log('当前登录用户:', currentUser, '性别:', userGender);
        
        // 如果未登录，重定向到登录页面
        if (!currentUser) {
            console.warn('用户未登录，将跳转到登录页面');
            window.location.href = 'login.html';
            return;
        }
        
        // 更新导航栏用户信息
        const userInfoElement = document.querySelector('.user-info');
        if (userInfoElement) {
            userInfoElement.textContent = `欢迎，${currentUser}`;
        }
        
        // 读取头像
        const maleAvatar = document.getElementById('maleAvatar');
        const femaleAvatar = document.getElementById('femaleAvatar');
        
        // 设置男生头像
        if (maleAvatar) {
            const savedMaleAvatar = localStorage.getItem('maleAvatar');
            if (savedMaleAvatar) {
                maleAvatar.src = savedMaleAvatar;
            }
        }
        
        // 设置女生头像
        if (femaleAvatar) {
            const savedFemaleAvatar = localStorage.getItem('femaleAvatar');
            if (savedFemaleAvatar) {
                femaleAvatar.src = savedFemaleAvatar;
            }
        }
        
        // 获取爱情宣言元素
        const maleDeclarationEl = document.getElementById('male-declaration');
        const femaleDeclarationEl = document.getElementById('female-declaration');
        
        // 设置男生爱情宣言
        if (maleDeclarationEl) {
            const maleDeclaration = localStorage.getItem('maleDeclaration') || '你是我生命中最美丽的意外，遇见你是我最大的幸运。';
            maleDeclarationEl.querySelector('p').textContent = maleDeclaration;
        }
        
        // 设置女生爱情宣言
        if (femaleDeclarationEl) {
            const femaleDeclaration = localStorage.getItem('femaleDeclaration') || '有你的日子都是晴天，我愿意陪你走过所有的风风雨雨。';
            femaleDeclarationEl.querySelector('p').textContent = femaleDeclaration;
        }
        
        // 更新生日和年龄信息
        const maleBirthdayElement = document.querySelector('.avatar-card:first-child .user-birthday');
        const femaleBirthdayElement = document.querySelector('.avatar-card:last-child .user-birthday');
        
        // 获取生日信息
        const maleBirthday = localStorage.getItem('maleBirthday') || '1995-05-15';
        const femaleBirthday = localStorage.getItem('femaleBirthday') || '1997-08-23';
        
        // 计算年龄
        const currentYear = new Date().getFullYear();
        const maleAge = currentYear - new Date(maleBirthday).getFullYear();
        const femaleAge = currentYear - new Date(femaleBirthday).getFullYear();
        
        // 格式化生日显示
        const formatBirthday = (dateStr) => {
            const date = new Date(dateStr);
            return `${date.getMonth() + 1}月${date.getDate()}日`;
        };
        
        // 设置男生生日和年龄
        if (maleBirthdayElement) {
            maleBirthdayElement.innerHTML = `
                <span>${formatBirthday(maleBirthday)}</span>
                <span class="divider">|</span>
                <span>${maleAge}岁</span>
            `;
        }
        
        // 设置女生生日和年龄
        if (femaleBirthdayElement) {
            femaleBirthdayElement.innerHTML = `
                <span>${formatBirthday(femaleBirthday)}</span>
                <span class="divider">|</span>
                <span>${femaleAge}岁</span>
            `;
        }
    }
    
    // 初始化头像点击事件
    function initAvatarClickEvents() {
        const maleAvatar = document.querySelector('.avatar-card:first-child .avatar-img');
        const femaleAvatar = document.querySelector('.avatar-card:last-child .avatar-img');
        
        // 获取当前用户信息
        const currentUser = localStorage.getItem('userName');
        const userType = localStorage.getItem('userType');
        
        console.log('Male avatar element:', maleAvatar); // 调试信息
        console.log('Female avatar element:', femaleAvatar); // 调试信息
        console.log('Current user:', currentUser, 'Type:', userType); // 调试信息
        
        if (maleAvatar) {
            maleAvatar.style.cursor = 'pointer'; // 添加鼠标手型
            maleAvatar.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Male avatar clicked'); // 调试信息
                
                // 判断是否是当前用户
                const isSelf = userType === 'male';
                
                // 跳转到个人资料页，并传递参数
                window.location.href = `profile.html?user=male&editable=${isSelf}`;
            });
        }
        
        if (femaleAvatar) {
            femaleAvatar.style.cursor = 'pointer'; // 添加鼠标手型
            femaleAvatar.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Female avatar clicked'); // 调试信息
                
                // 判断是否是当前用户
                const isSelf = userType === 'female';
                
                // 跳转到个人资料页，并传递参数
                window.location.href = `profile.html?user=female&editable=${isSelf}`;
            });
        }
    }
    
    // 显示今日甜蜜语录
    function displayDailyQuote() {
        const quotes = [
            "每一天都因为有你而变得特别美好",
            "你是我生命中最美丽的意外",
            "爱你不是两三天，而是一辈子",
            "我的世界因为有了你而变得完整",
            "和你在一起的时光都很耀眼",
            "你的笑容是我最大的幸福",
            "我愿用我的一生去爱你",
            "你是我最想要的礼物",
            "有你的日子都是晴天",
            "我爱你，不止三千遍",
            "你是我最美的风景",
            "每天醒来看到你是我最大的幸福",
            "我们的爱情就像红酒，越久越醇香",
            "你的出现让我的生活有了意义",
            "我要牵着你的手，走到时间的尽头",
            "你是我心中永远的春天",
            "因为有你，平凡的日子也变得美好",
            "你的眼睛里有我想要的未来",
            "遇见你是我最美丽的意外",
            "我愿意陪你走过所有的风风雨雨",
            "你是我最想要的那颗星星",
            "我爱你，胜过爱我自己",
            "你是我生命中最重要的人",
            "有你的地方，才是我的家",
            "你是我心中最柔软的地方",
            "我想和你一起慢慢变老",
            "你的笑容是我最大的幸福",
            "我爱你，不管是昨天、今天还是明天",
            "你是我生命中最美的风景",
            "和你在一起的每一天都是幸福的",
            "你是我最珍贵的宝贝"
        ];
        
        // 根据日期选择语录
        const today = new Date();
        const dayOfMonth = today.getDate(); // 1-31
        
        // 确保索引在数组范围内
        const quoteIndex = (dayOfMonth - 1) % quotes.length;
        
        const quoteElement = document.getElementById('dailyQuote');
        if (quoteElement) {
            quoteElement.textContent = quotes[quoteIndex];
        }
    }
    
    // 显示纪念日倒计时
    function displayCountdown() {
        // 此功能已移至 countdown.js
        console.log('倒计时功能已移至 countdown.js');
        
        // 避免与新倒计时功能冲突
        return;
        
        /* 原始代码已注释
        // 从本地存储获取纪念日，如果没有则使用默认日期
        let anniversaryDate = localStorage.getItem('anniversaryDate');
        if (!anniversaryDate) {
            // 默认使用2022年1月1日作为示例纪念日
            anniversaryDate = '2022-01-01';
            localStorage.setItem('anniversaryDate', anniversaryDate);
        }
        
        // 计算倒计时
        function updateCountdown() {
            const now = new Date();
            const anniversary = new Date(anniversaryDate);
            
            // 计算今年的纪念日
            const thisYearAnniversary = new Date(
                now.getFullYear(),
                anniversary.getMonth(),
                anniversary.getDate()
            );
            
            // 如果今年的纪念日已经过了，计算明年的纪念日
            if (now > thisYearAnniversary) {
                thisYearAnniversary.setFullYear(now.getFullYear() + 1);
            }
            
            // 计算剩余天数
            const diffTime = thisYearAnniversary - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // 更新显示
            const countdownDaysElement = document.getElementById('countdownDays');
            const countdownEventElement = document.getElementById('countdownEvent');
            
            if (countdownDaysElement) {
                countdownDaysElement.textContent = diffDays;
            }
            
            if (countdownEventElement) {
                countdownEventElement.textContent = "我们的" + (now.getFullYear() - anniversary.getFullYear() + 1) + "周年纪念日";
            }
        }
        
        // 初始更新
        updateCountdown();
        
        // 每天更新一次
        setInterval(updateCountdown, 24 * 60 * 60 * 1000);
        */
    }
    
    // 心情按钮点击事件
    function setupMoodButtons() {
        const moodSelector = document.getElementById('moodSelector');
        const maleMoodDisplay = document.getElementById('maleMoodDisplay');
        const femaleMoodDisplay = document.getElementById('femaleMoodDisplay');
        const selectMaleMood = document.getElementById('selectMaleMood');
        const selectFemaleMood = document.getElementById('selectFemaleMood');
        
        // 获取当前登录用户信息
        const currentUser = localStorage.getItem('userName');
        const userType = localStorage.getItem('userType');
        
        // 禁用非当前用户的按钮和显示区域
        if (userType === 'male') {
            selectFemaleMood.style.display = 'none';
            femaleMoodDisplay.style.cursor = 'default';
            maleMoodDisplay.style.cursor = 'pointer';
        } else {
            selectMaleMood.style.display = 'none';
            maleMoodDisplay.style.cursor = 'default';
            femaleMoodDisplay.style.cursor = 'pointer';
        }

        function showMoodSelector(person) {
            if (person === 'male' && userType !== 'male') return;
            if (person === 'female' && userType !== 'female') return;
            
            moodSelector.style.display = 'flex';
            moodSelector.dataset.target = person;
            
            // 滚动到顶部
            moodSelector.scrollTop = 0;
            
            // 确保选择器在视口内
            setTimeout(() => {
                const rect = moodSelector.getBoundingClientRect();
                if (rect.bottom > window.innerHeight) {
                    window.scrollBy({
                        top: rect.bottom - window.innerHeight + 20,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }

        function hideMoodSelector() {
            moodSelector.style.display = 'none';
            moodSelector.dataset.target = '';
        }

        function updateMoodDisplay(person, emoji, text) {
            const display = person === 'male' ? maleMoodDisplay : femaleMoodDisplay;
            const selectBtn = person === 'male' ? selectMaleMood : selectFemaleMood;
            
            display.innerHTML = `
                <span class="mood-emoji" style="font-size: 2.5em;">${emoji}</span>
                <span class="mood-text">${text}</span>
            `;
            display.classList.add('has-mood');
            display.title = text; // 添加工具提示
            
            // 隐藏选择按钮
            selectBtn.style.display = 'none';
            
            // 保存心情到本地存储
            localStorage.setItem(`${person}Mood`, JSON.stringify({ emoji, text }));
        }

        // 点击心情显示区域重新选择
        maleMoodDisplay.addEventListener('click', () => {
            if (userType === 'male') {
                showMoodSelector('male');
            }
        });

        femaleMoodDisplay.addEventListener('click', () => {
            if (userType === 'female') {
                showMoodSelector('female');
            }
        });

        // 点击心情按钮时的处理
        const moodButtons = moodSelector.querySelectorAll('.mood-btn');
        moodButtons.forEach(btn => {
            // 设置按钮样式
            btn.style.fontSize = '1.8em';
            btn.style.padding = '8px';
            btn.style.transition = 'transform 0.2s ease';
            
            // 添加鼠标悬停效果
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.2)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
            
            btn.addEventListener('click', () => {
                const person = moodSelector.dataset.target;
                const emoji = btn.innerHTML;
                const text = btn.dataset.text;
                updateMoodDisplay(person, emoji, text);
                hideMoodSelector();
            });
        });

        // 点击其他地方关闭心情选择器
        document.addEventListener('click', (e) => {
            if (!moodSelector.contains(e.target) && 
                !maleMoodDisplay.contains(e.target) &&
                !femaleMoodDisplay.contains(e.target)) {
                hideMoodSelector();
            }
        });

        // 加载保存的心情
        function loadSavedMood() {
            ['male', 'female'].forEach(person => {
                const savedMood = localStorage.getItem(`${person}Mood`);
                if (savedMood) {
                    const { emoji, text } = JSON.parse(savedMood);
                    updateMoodDisplay(person, emoji, text);
                }
            });
        }

        // 加载保存的心情
        loadSavedMood();
    }
    
    // 获取心情文本
    function getMoodText(mood) {
        switch(mood) {
            case 'happy': return '开心 😊';
            case 'love': return '恋爱 😍';
            case 'miss': return '想念 🥺';
            case 'sad': return '难过 😢';
            case 'angry': return '生气 😡';
            case 'fun': return '搞笑 😂';
            case 'kiss': return '亲亲 😘';
            case 'cool': return '酷酷 😎';
            case 'tired': return '疲惫 😴';
            case 'excited': return '兴奋 🤩';
            case 'thinking': return '思考 🤔';
            case 'shock': return '惊讶 😮';
            default: return '未知';
        }
    }
    
    // 初始化爱情宣言功能
    function initLoveDeclarations() {
        // 从本地存储加载宣言
        const maleDeclaration = localStorage.getItem('maleDeclaration') || '你是我生命中最美丽的意外，遇见你是我最大的幸运。';
        const femaleDeclaration = localStorage.getItem('femaleDeclaration') || '有你的日子都是晴天，我愿意陪你走过所有的风风雨雨。';
        
        // 显示宣言
        const maleDeclarationEl = document.getElementById('male-declaration');
        const femaleDeclarationEl = document.getElementById('female-declaration');
        
        if (maleDeclarationEl) {
            maleDeclarationEl.querySelector('p').textContent = maleDeclaration;
        }
        
        if (femaleDeclarationEl) {
            femaleDeclarationEl.querySelector('p').textContent = femaleDeclaration;
        }
    }
    
    // 编辑爱情宣言
    window.editDeclaration = function(gender) {
        const declarationEl = document.getElementById(`${gender}-declaration`);
        const currentText = declarationEl.querySelector('p').textContent;
        
        // 创建编辑界面
        const editHtml = `
            <textarea class="declaration-input" placeholder="写下你的爱情宣言...">${currentText}</textarea>
            <div class="declaration-actions">
                <button class="cancel-btn" onclick="cancelEdit('${gender}')">取消</button>
                <button class="save-btn" onclick="saveDeclaration('${gender}')">保存</button>
            </div>
        `;
        
        // 替换原内容
        declarationEl.innerHTML = editHtml;
        
        // 聚焦输入框
        declarationEl.querySelector('textarea').focus();
    };
    
    // 取消编辑
    window.cancelEdit = function(gender) {
        const declarationEl = document.getElementById(`${gender}-declaration`);
        const savedText = localStorage.getItem(`${gender}Declaration`) || 
                          (gender === 'male' ? '你是我生命中最美丽的意外，遇见你是我最大的幸运。' : 
                                              '有你的日子都是晴天，我愿意陪你走过所有的风风雨雨。');
        
        // 恢复原内容
        declarationEl.innerHTML = `
            <p>${savedText}</p>
            <button class="edit-btn" onclick="editDeclaration('${gender}')"><i>✎</i></button>
        `;
    };
    
    // 保存爱情宣言
    window.saveDeclaration = function(gender) {
        const declarationEl = document.getElementById(`${gender}-declaration`);
        const newText = declarationEl.querySelector('textarea').value.trim();
        
        if (newText) {
            // 保存到本地存储
            localStorage.setItem(`${gender}Declaration`, newText);
            
            // 更新显示
            declarationEl.innerHTML = `
                <p>${newText}</p>
                <button class="edit-btn" onclick="editDeclaration('${gender}')"><i>✎</i></button>
            `;
        } else {
            // 如果为空，取消编辑
            window.cancelEdit(gender);
        }
    };
    
    // 增强主题特效
    function enhanceThemeEffects() {
        // 监听主题变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    const currentTheme = document.body.className.replace('theme-', '');
                    applyThemeEffects(currentTheme);
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true
        });
        
        // 应用初始主题效果
        const initialTheme = document.body.className.replace('theme-', '');
        applyThemeEffects(initialTheme);
    }
    
    // 应用主题特效
    function applyThemeEffects(theme) {
        // 移除之前的主题特效
        document.querySelectorAll('.theme-effect').forEach(el => el.remove());
        
        // 根据主题添加特效
        switch (theme) {
            case 'cool':
                enhanceCoolTheme();
                break;
            case 'pink':
                enhancePinkTheme();
                break;
            case 'starry':
                // 星空主题在animations.js中已经处理
                break;
        }
    }
    
    // 增强非主流酷炫主题
    function enhanceCoolTheme() {
        // 添加霓虹描边效果到卡片
        document.querySelectorAll('.avatar-card, .dashboard-card, .zone-card, .timeline-event').forEach(card => {
            card.style.boxShadow = '0 0 15px rgba(138, 43, 226, 0.5), inset 0 0 5px rgba(138, 43, 226, 0.3)';
            card.style.border = '1px solid rgba(138, 43, 226, 0.4)';
            
            // 添加脉冲动画
            const pulseEffect = document.createElement('div');
            pulseEffect.className = 'theme-effect cool-pulse';
            pulseEffect.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: inherit;
                box-shadow: 0 0 15px rgba(138, 43, 226, 0.7);
                opacity: 0;
                animation: coolPulse 3s infinite;
                pointer-events: none;
                z-index: -1;
            `;
            
            // 确保卡片有相对定位
            if (getComputedStyle(card).position === 'static') {
                card.style.position = 'relative';
            }
            
            card.appendChild(pulseEffect);
        });
        
        // 添加动画样式
        if (!document.getElementById('cool-theme-style')) {
            const style = document.createElement('style');
            style.id = 'cool-theme-style';
            style.textContent = `
                @keyframes coolPulse {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 0.5; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 增强粉金色主题
    function enhancePinkTheme() {
        // 添加金色边框和阴影效果到卡片
        document.querySelectorAll('.avatar-card, .dashboard-card, .zone-card, .timeline-event').forEach(card => {
            card.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.2), inset 0 0 5px rgba(255, 215, 0, 0.1)';
            card.style.border = '1px solid rgba(255, 215, 0, 0.3)';
            
            // 添加金色光晕效果
            const goldenGlow = document.createElement('div');
            goldenGlow.className = 'theme-effect golden-glow';
            goldenGlow.style.cssText = `
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border-radius: inherit;
                background: linear-gradient(45deg, 
                    rgba(255, 215, 0, 0.1), 
                    rgba(255, 215, 0, 0.2) 25%, 
                    rgba(255, 215, 0, 0.1) 50%, 
                    rgba(255, 215, 0, 0.2) 75%, 
                    rgba(255, 215, 0, 0.1));
                opacity: 0.5;
                z-index: -1;
                pointer-events: none;
                animation: goldenShimmer 3s infinite linear;
                background-size: 200% 200%;
            `;
            
            // 确保卡片有相对定位
            if (getComputedStyle(card).position === 'static') {
                card.style.position = 'relative';
            }
            
            card.appendChild(goldenGlow);
        });
        
        // 添加动画样式
        if (!document.getElementById('pink-theme-style')) {
            const style = document.createElement('style');
            style.id = 'pink-theme-style';
            style.textContent = `
                @keyframes goldenShimmer {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 200% 200%; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 初始化相册功能
    function initAlbums() {
        const albumsContainer = document.getElementById('albumsContainer');
        if (!albumsContainer) return;
        
        // 相册排序方式
        let sortOrder = 'newest'; // newest, oldest, name
        
        // 获取操作按钮
        const createAlbumTopBtn = document.querySelector('.albums-action-btn[title="创建相册"]');
        const refreshBtn = document.getElementById('refreshAlbums');
        const sortBtn = document.getElementById('sortAlbums');
        
        // 获取创建相册弹窗元素
        const albumModal = document.getElementById('createAlbumModal');
        const closeAlbumModal = document.getElementById('closeAlbumModal');
        const albumNameInput = document.getElementById('albumName');
        const albumDescInput = document.getElementById('albumDescription');
        const coverUploadArea = document.getElementById('coverGroup');
        const coverUploadInput = document.getElementById('coverUpload');
        const coverPreview = document.getElementById('coverPreview');
        const coverPreviewContainer = document.getElementById('coverPreviewContainer');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const changeCoverBtn = document.getElementById('changeCoverBtn');
        const createAlbumBtn = document.querySelector('.modal-footer .btn-primary');
        const cancelAlbumBtn = document.getElementById('cancelAlbumBtn');
        
        // 存储封面图片的数据URL
        let coverImageData = null;
        
        // 添加创建相册按钮事件（标题栏的+按钮）
        if (createAlbumTopBtn) {
            createAlbumTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                albumModal.classList.add('show');
            });
        }
        
        // 关闭弹窗事件
        closeAlbumModal.addEventListener('click', closeModal);
        cancelAlbumBtn.addEventListener('click', closeModal);
        
        // 点击弹窗外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === albumModal) {
                closeModal();
            }
        });
        
        // 点击上传区域触发文件选择
        if (uploadPlaceholder) {
            uploadPlaceholder.addEventListener('click', () => {
                coverUploadInput.click();
            });
        }
        
        // 点击更换按钮触发文件选择
        if (changeCoverBtn) {
            changeCoverBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                coverUploadInput.click();
            });
        }
        
        // 处理封面图片上传
        if (coverUploadInput) {
            coverUploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            // 保存图片数据
                            coverImageData = event.target.result;
                            // 显示预览
                            coverPreview.src = coverImageData;
                            coverPreviewContainer.style.display = 'block';
                            uploadPlaceholder.style.display = 'none';
                        };
                        reader.readAsDataURL(file);
                    } else {
                        alert('请选择图片文件！');
                        coverUploadInput.value = '';
                    }
                }
            });
        }
        
        // 创建相册按钮事件
        if (createAlbumBtn) {
            createAlbumBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const albumName = albumNameInput.value.trim();
                const albumDesc = albumDescInput.value.trim();
                
                if (!albumName) {
                    showCustomAlert('error', '提示', '请输入相册名称！');
                    return;
                }
                
                // 使用封面图片或默认图片
                const coverImage = coverImageData || 'images/default-album.jpg';
                
                // 创建相册
                createNewAlbum(albumName, albumDesc, coverImage);
                
                // 关闭弹窗
                closeModal();
            });
        }
        
        // 关闭弹窗函数
        function closeModal() {
            albumModal.classList.remove('show');
            // 重置表单
            albumNameInput.value = '';
            albumDescInput.value = '';
            coverPreview.src = '';
            coverPreviewContainer.style.display = 'none';
            uploadPlaceholder.style.display = 'flex';
            coverImageData = null;
            coverUploadInput.value = '';
        }
        
        // 创建新相册
        function createNewAlbum(albumName, albumDesc, coverImage) {
            try {
                // 获取已有相册
                let albums = JSON.parse(localStorage.getItem('albums') || '[]');
                
                // 检查是否存在同名相册
                if (albums.some(album => album.name === albumName)) {
                    showCustomAlert('error', '提示', '已存在同名相册，请使用其他名称！');
                    return;
                }
                
                // 创建新相册对象
                const newAlbum = {
                    id: Date.now(),
                    name: albumName,
                    description: albumDesc || '',
                    cover: coverImage,
                    photos: [],
                    createTime: new Date().toISOString(),
                    creator: localStorage.getItem('currentUser') || '未知用户'
                };
                
                // 添加到相册列表
                albums.push(newAlbum);
                
                // 保存到本地存储
                localStorage.setItem('albums', JSON.stringify(albums));
                
                // 重新加载相册
                loadAlbums();
                
                // 提示创建成功
                showCustomAlert('success', '成功', '相册创建成功！');
            } catch (error) {
                console.error('创建相册时出错：', error);
                showCustomAlert('error', '错误', '创建相册失败，请重试！');
            }
        }
        
        // 添加刷新按钮事件
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.style.animation = 'spin 1s linear';
                loadAlbums();
                setTimeout(() => {
                    refreshBtn.style.animation = '';
                }, 1000);
            });
        }
        
        // 添加排序按钮事件
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                // 切换排序方式
                if (sortOrder === 'newest') {
                    sortOrder = 'oldest';
                    sortBtn.textContent = '↑';
                    sortBtn.title = '从旧到新排序';
                } else if (sortOrder === 'oldest') {
                    sortOrder = 'name';
                    sortBtn.textContent = 'A↓';
                    sortBtn.title = '按名称排序';
                } else {
                    sortOrder = 'newest';
                    sortBtn.textContent = '↕️';
                    sortBtn.title = '从新到旧排序';
                }
                loadAlbums();
            });
        }
        
        // 添加一个旋转动画样式
        if (!document.getElementById('spin-animation')) {
            const style = document.createElement('style');
            style.id = 'spin-animation';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // 加载已有相册
        loadAlbums();
        
        // 加载相册函数
        function loadAlbums() {
            try {
                // 清空容器
                albumsContainer.innerHTML = '';
                
                // 获取相册数据
                const albums = JSON.parse(localStorage.getItem('albums') || '[]');
                
                // 根据当前排序方式对相册进行排序
                let sortedAlbums = [...albums];
                
                if (sortOrder === 'newest') {
                    sortedAlbums.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
                } else if (sortOrder === 'oldest') {
                    sortedAlbums.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));
                } else if (sortOrder === 'name') {
                    sortedAlbums.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
                }
                
                // 添加相册
                sortedAlbums.forEach(album => {
                    const albumElement = document.createElement('div');
                    albumElement.className = 'album-item';
                    albumElement.innerHTML = `
                        <div class="album-cover">
                            <img src="${album.cover}" alt="${album.name}" onerror="this.src='images/default-album.jpg'">
                        </div>
                        <div class="album-info">
                            <h3>${album.name}</h3>
                            <p>${album.description ? album.description : '无描述'}</p>
                            <small>${album.photos ? album.photos.length : 0} 张照片 · ${formatDate(album.createTime)}</small>
                        </div>
                    `;
                    
                    // 点击查看相册
                    albumElement.addEventListener('click', () => {
                        navigateToAlbum(album.id);
                    });
                    
                    albumsContainer.appendChild(albumElement);
                });
                
                // 如果没有相册，显示提示
                if (albums.length === 0) {
                    const emptyTip = document.createElement('div');
                    emptyTip.className = 'empty-tip';
                    emptyTip.style.cssText = `
                        grid-column: span 2;
                        text-align: center;
                        padding: 30px 20px;
                        color: rgba(255, 255, 255, 0.5);
                        font-style: italic;
                    `;
                    emptyTip.innerHTML = '还没有相册，点击"+"按钮创建一个吧！';
                    albumsContainer.appendChild(emptyTip);
                }
            } catch (error) {
                console.error('加载相册时出错：', error);
                albumsContainer.innerHTML = '<p style="text-align: center; color: red;">加载相册失败，请刷新页面重试</p>';
            }
        }
        
        // 格式化日期
        function formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = now - date;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
                return '今天';
            } else if (diffDays === 1) {
                return '昨天';
            } else if (diffDays < 7) {
                return `${diffDays}天前`;
            } else {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            }
        }
        
        // 跳转到相册详情页
        function navigateToAlbum(albumId) {
            try {
                // 将当前相册ID保存到本地存储
                localStorage.setItem('currentAlbumId', albumId);
                
                // 获取当前用户类型
                const currentUser = localStorage.getItem('currentUser');
                const userType = currentUser === '赖姣姣' ? 'female' : 'male';
                
                // 跳转到相册详情页，添加user参数
                window.location.href = `album.html?id=${albumId}&user=${userType}`;
            } catch (error) {
                console.error('跳转到相册详情页时出错：', error);
                showCustomAlert('error', '错误', '打开相册失败，请重试！');
            }
        }
    }
    
    // 初始化时光轴功能
    function initTimeline() {
        const addTimelineEventBtn = document.getElementById('addTimelineEvent');
        const timelineContainer = document.getElementById('timelineContainer');
        const refreshBtn = document.getElementById('refreshTimeline');
        const sortBtn = document.getElementById('sortTimeline');
        
        // 删除确认弹窗元素
        const confirmDeleteModal = document.getElementById('confirmDeleteModal');
        const closeConfirmDeleteModal = document.getElementById('closeConfirmDeleteModal');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        let timelineEventToDelete = null;
        
        // 时光轴排序方式
        let sortOrder = 'newest'; // newest, oldest, title
        
        // 时光记忆弹窗元素
        const timelineModal = document.getElementById('createTimelineModal');
        const closeTimelineModal = document.getElementById('closeTimelineModal');
        const titleInput = document.getElementById('timelineTitle');
        const contentInput = document.getElementById('timelineContent');
        const uploadImageBtn = document.getElementById('uploadImageBtn');
        const uploadImageArea = document.getElementById('uploadImageArea');
        const timelineImagePlaceholder = document.getElementById('timelineImagePlaceholder');
        const timelineImagePreview = document.getElementById('timelineImagePreview');
        const previewImg = document.getElementById('previewImg');
        const changeImageBtn = document.getElementById('changeImageBtn');
        const removeImageBtn = document.getElementById('removeImageBtn');
        const timelineImageUpload = document.getElementById('timelineImageUpload');
        const cancelTimelineBtn = document.getElementById('cancelTimelineBtn');
        const createTimelineBtn = document.getElementById('createTimelineBtn');
        
        // 存储图片数据
        let selectedImageData = null;
        let selectedImageSource = 'none'; // none, upload
        
        // 添加时光记忆按钮点击事件
        if (addTimelineEventBtn) {
            addTimelineEventBtn.addEventListener('click', () => {
                // 重置表单
                resetTimelineForm();
                
                // 显示弹窗
                timelineModal.classList.add('show');
            });
        }
        
        // 关闭弹窗事件
        if (closeTimelineModal) {
            closeTimelineModal.addEventListener('click', () => {
                timelineModal.classList.remove('show');
            });
        }
        
        // 点击弹窗外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === timelineModal) {
                timelineModal.classList.remove('show');
            }
        });
        
        // 取消按钮点击事件
        if (cancelTimelineBtn) {
            cancelTimelineBtn.addEventListener('click', () => {
                timelineModal.classList.remove('show');
            });
        }
        
        // 上传图片按钮点击事件
        if (uploadImageBtn) {
            uploadImageBtn.addEventListener('click', () => {
                timelineImageUpload.click();
            });
        }
        
        // 点击上传区域触发文件选择
        if (timelineImagePlaceholder) {
            timelineImagePlaceholder.addEventListener('click', () => {
                timelineImageUpload.click();
            });
        }
        
        // 点击移除按钮移除已选图片
        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectedImageData = null;
                selectedImageSource = 'none';
                previewImg.src = '';
                timelineImagePreview.style.display = 'none';
                timelineImagePlaceholder.style.display = 'flex';
            });
        }
        
        // 处理图片上传
        if (timelineImageUpload) {
            timelineImageUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            // 保存图片数据
                            selectedImageData = event.target.result;
                            selectedImageSource = 'upload';
                            
                            // 显示预览
                            previewImg.src = selectedImageData;
                            timelineImagePreview.style.display = 'block';
                            timelineImagePlaceholder.style.display = 'none';
                            
                            // 压缩图片
                            compressImage(event.target.result, 1200, 0.7).then(compressedImage => {
                                selectedImageData = compressedImage;
                            }).catch(error => {
                                console.error('图片压缩失败：', error);
                            });
                        };
                        reader.readAsDataURL(file);
                    } else {
                        showCustomAlert('error', '提示', '请选择图片文件！');
                        timelineImageUpload.value = '';
                    }
                }
            });
        }
        
        // 图片压缩函数
        function compressImage(base64, maxWidth, quality) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = base64;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // 如果图片宽度超过最大宽度，按比例缩小
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 转换为base64
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                };
                img.onerror = reject;
            });
        }
        
        // 保存时光记忆按钮点击事件
        if (createTimelineBtn) {
            createTimelineBtn.addEventListener('click', () => {
                const title = titleInput.value.trim();
                const content = contentInput.value.trim();
                
                if (!title) {
                    showCustomAlert('error', '提示', '请输入记忆标题！');
                    return;
                }
                
                if (!content) {
                    showCustomAlert('error', '提示', '请输入记忆内容！');
                    return;
                }
                
                // 创建并保存时光记忆
                saveTimelineEvent(title, content, selectedImageData, selectedImageSource);
                
                // 关闭弹窗
                timelineModal.classList.remove('show');
            });
        }
        
        // 重置表单
        function resetTimelineForm() {
            titleInput.value = '';
            contentInput.value = '';
            // 设置默认日期为今天
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('timelineDate').value = today;
            timelineImagePlaceholder.style.display = 'flex';
            timelineImagePreview.style.display = 'none';
            previewImg.src = '';
            timelineImageUpload.value = '';
            selectedImageData = null;
            selectedImageSource = 'none';
        }
        
        // 添加刷新按钮事件
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.style.animation = 'spin 1s linear';
                loadTimelineEvents();
                setTimeout(() => {
                    refreshBtn.style.animation = '';
                }, 1000);
            });
        }
        
        // 添加排序按钮事件
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                // 切换排序方式
                if (sortOrder === 'newest') {
                    sortOrder = 'oldest';
                    sortBtn.textContent = '↑';
                    sortBtn.title = '从旧到新排序';
                } else if (sortOrder === 'oldest') {
                    sortOrder = 'title';
                    sortBtn.textContent = 'A↓';
                    sortBtn.title = '按标题排序';
                } else {
                    sortOrder = 'newest';
                    sortBtn.textContent = '↕️';
                    sortBtn.title = '从新到旧排序';
                }
                loadTimelineEvents();
            });
        }
        
        // 初始化删除确认弹窗
        if (closeConfirmDeleteModal) {
            closeConfirmDeleteModal.addEventListener('click', () => {
                confirmDeleteModal.classList.remove('show');
            });
        }
        
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => {
                confirmDeleteModal.classList.remove('show');
            });
        }
        
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => {
                if (timelineEventToDelete) {
                    deleteTimelineEvent(timelineEventToDelete);
                    confirmDeleteModal.classList.remove('show');
                }
            });
        }
        
        // 点击弹窗外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === confirmDeleteModal) {
                confirmDeleteModal.classList.remove('show');
            }
        });
        
        // 删除时光记忆
        function deleteTimelineEvent(eventId) {
            try {
                // 获取已有事件
                let events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
                
                // 找到要删除的事件索引
                const eventIndex = events.findIndex(event => event.id == eventId);
                
                if (eventIndex !== -1) {
                    // 从数组中删除
                    events.splice(eventIndex, 1);
                    
                    // 保存到本地存储
                    localStorage.setItem('timelineEvents', JSON.stringify(events));
                    
                    // 重新加载事件
                    loadTimelineEvents();
                    
                    // 提示删除成功
                    showCustomAlert('success', '成功', '时光记忆已删除');
                }
            } catch (error) {
                console.error('删除时光记忆时出错：', error);
                showCustomAlert('error', '错误', '删除时光记忆失败，请重试！');
            }
        }
        
        // 显示删除确认弹窗
        function showDeleteConfirmation(eventId) {
            timelineEventToDelete = eventId;
            confirmDeleteModal.classList.add('show');
        }
        
        // 保存时光记忆
        function saveTimelineEvent(title, content, imageData, imageSource) {
            try {
                // 获取已有事件
                let events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
                
                // 获取选择的日期
                const selectedDate = document.getElementById('timelineDate').value;
                
                // 创建新事件对象
                const newEvent = {
                    id: Date.now(),
                    title: title,
                    content: content,
                    date: selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString(),
                    createdBy: localStorage.getItem('currentUser'),
                    hasImage: !!imageData,
                    imageData: imageData,
                    imageSource: imageSource
                };
                
                // 添加到事件列表
                events.push(newEvent);
                
                // 保存到本地存储
                localStorage.setItem('timelineEvents', JSON.stringify(events));
                
                // 重新加载事件
                loadTimelineEvents();
                
                // 提示创建成功
                showCustomAlert('success', '成功', '时光记忆添加成功！');
            } catch (error) {
                console.error('添加时光记忆时出错：', error);
                showCustomAlert('error', '错误', '添加时光记忆失败，请重试！');
            }
        }
        
        // 加载时光轴事件
        function loadTimelineEvents() {
            if (!timelineContainer) return;
            
            // 初始化图片查看器
            const { openImageViewer } = initImageViewer();
            
            // 清空容器
            timelineContainer.innerHTML = '';
            
            // 获取事件数据
            const events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
            
            // 根据当前排序方式对事件进行排序
            let sortedEvents = [...events];
            
            if (sortOrder === 'newest') {
                sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (sortOrder === 'oldest') {
                sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else if (sortOrder === 'title') {
                sortedEvents.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
            }
            
            // 添加事件
            sortedEvents.forEach(event => {
                const eventDate = new Date(event.date);
                const formattedDate = `${eventDate.getFullYear()}年${eventDate.getMonth() + 1}月${eventDate.getDate()}日`;
                
                const eventElement = document.createElement('div');
                eventElement.className = 'timeline-event';
                eventElement.dataset.id = event.id;
                eventElement.style.height = 'auto'; // 确保高度自适应
                eventElement.style.overflow = 'visible'; // 允许内容溢出
                
                // 添加控制按钮
                const controlsHTML = `
                    <div class="timeline-controls">
                        <button class="timeline-control-btn delete-btn" title="删除" data-id="${event.id}">
                            <i>🗑️</i>
                        </button>
                    </div>
                `;
                
                let contentHTML = `
                    ${controlsHTML}
                    <div class="timeline-date">${formattedDate}</div>
                    <div class="timeline-content">
                        <h3>${event.title}</h3>
                        <p>${event.content}</p>
                `;
                
                // 如果有图片，添加图片显示
                if (event.hasImage && event.imageData) {
                    contentHTML += `<img src="${event.imageData}" alt="记忆图片" class="timeline-event-image" loading="lazy">`;
                }
                
                contentHTML += `
                        <div class="timeline-author">by ${event.createdBy}</div>
                    </div>
                `;
                
                eventElement.innerHTML = contentHTML;
                
                // 为图片添加点击事件
                const image = eventElement.querySelector('.timeline-event-image');
                if (image) {
                    image.addEventListener('click', () => {
                        openImageViewer(image.src);
                    });
                }
                
                // 为删除按钮添加点击事件
                const deleteBtn = eventElement.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const eventId = deleteBtn.getAttribute('data-id');
                        showDeleteConfirmation(eventId);
                    });
                }
                
                timelineContainer.appendChild(eventElement);
            });
            
            // 如果没有事件，显示提示
            if (events.length === 0) {
                const emptyTip = document.createElement('div');
                emptyTip.className = 'empty-tip';
                emptyTip.style.cssText = `
                    text-align: center;
                    padding: 30px 20px;
                    color: rgba(255, 255, 255, 0.5);
                    font-style: italic;
                `;
                emptyTip.innerHTML = '还没有时光记忆，点击"+"按钮添加一个吧！';
                timelineContainer.appendChild(emptyTip);
            }
        }
        
        // 加载已有时光轴事件
        loadTimelineEvents();
    }
    
    // 计算在一起的天数
    function calculateDaysTogether() {
        // 从本地存储获取在一起的日期，如果没有则使用默认值
        const savedStartDate = localStorage.getItem('togetherStartDate');
        const startDate = savedStartDate ? new Date(savedStartDate) : new Date(2023, 0, 1); // 默认2023年1月1日
        
        // 从本地存储获取自定义标签文本，如果没有则使用默认值
        const savedLabel = localStorage.getItem('togetherLabel') || '在一起';
        
        const today = new Date();
        const timeDiff = today.getTime() - startDate.getTime();
        const daysTogether = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        const togetherDaysElement = document.getElementById('togetherDays');
        const togetherLabelElement = document.getElementById('togetherLabel');
        const togetherDaysCountElement = document.getElementById('togetherDaysCount');
        
        if (togetherLabelElement && togetherDaysCountElement) {
            togetherLabelElement.textContent = savedLabel;
            togetherDaysCountElement.textContent = daysTogether;
        }
        
        // 让整个"在一起"区域可点击
        if (togetherDaysElement) {
            togetherDaysElement.style.cursor = 'pointer';
            togetherDaysElement.addEventListener('click', showTogetherEditModal);
        }
        
        // 优化爱心动画
        const heartIcon = document.querySelector('.heart-icon');
        if (heartIcon) {
            // 移除旧的动画样式
            heartIcon.style.animation = '';
            
            // 添加新的动画样式
            setTimeout(() => {
                heartIcon.style.animation = 'heartPulse 1.2s infinite, heartFloat 4s ease-in-out infinite alternate';
                
                // 添加CSS动画定义，如果不存在
                if (!document.getElementById('heart-animations')) {
                    const style = document.createElement('style');
                    style.id = 'heart-animations';
                    style.textContent = `
                        @keyframes heartPulse {
                            0% { transform: scale(1); }
                            50% { transform: scale(1.15); }
                            100% { transform: scale(1); }
                        }
                        
                        @keyframes heartFloat {
                            0% { transform: translateY(0); }
                            50% { transform: translateY(-10px); }
                            100% { transform: translateY(0); }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }, 100);
        }
    }
    
    // 显示编辑"在一起"的弹窗
    function showTogetherEditModal() {
        // 创建弹窗HTML
        const modalHTML = `
            <div class="modal" id="editTogetherModal">
                <div class="modal-content glass-effect">
                    <span class="close-btn" id="closeTogetherModal">&times;</span>
                    <div class="modal-header">
                        <h3>自定义纪念日</h3>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="togetherLabelInput">标签文本</label>
                            <input type="text" id="togetherLabelInput" placeholder="例如：在一起、相识、相恋..." value="${localStorage.getItem('togetherLabel') || '在一起'}">
                        </div>
                        <div class="form-group">
                            <label for="togetherDateInput">起始日期</label>
                            <input type="date" id="togetherDateInput" value="${formatDateForInput(localStorage.getItem('togetherStartDate') || '2023-01-01')}">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="cancelTogetherBtn" class="btn-cancel">取消</button>
                        <button id="saveTogetherBtn" class="btn-primary">保存</button>
                    </div>
                </div>
            </div>
        `;
        
        // 将弹窗添加到页面
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // 获取弹窗元素
        const modal = document.getElementById('editTogetherModal');
        const closeBtn = document.getElementById('closeTogetherModal');
        const cancelBtn = document.getElementById('cancelTogetherBtn');
        const saveBtn = document.getElementById('saveTogetherBtn');
        
        // 显示弹窗
        modal.classList.add('show');
        
        // 关闭弹窗的事件处理
        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        
        // 保存设置
        function saveSettings() {
            const labelInput = document.getElementById('togetherLabelInput');
            const dateInput = document.getElementById('togetherDateInput');
            
            if (labelInput && dateInput) {
                const label = labelInput.value.trim() || '在一起';
                const date = dateInput.value;
                
                localStorage.setItem('togetherLabel', label);
                localStorage.setItem('togetherStartDate', date);
                
                // 更新显示
                calculateDaysTogether();
                
                closeModal();
            }
        }
        
        // 绑定事件
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        saveBtn.addEventListener('click', saveSettings);
        
        // 点击弹窗外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // 格式化日期为input[type="date"]可用的格式 (YYYY-MM-DD)
    function formatDateForInput(dateString) {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return '2023-01-01'; // 默认日期
            }
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        } catch (e) {
            console.error('日期格式化错误:', e);
            return '2023-01-01'; // 默认日期
        }
    }
    
    // 随机甜蜜语录
    function setRandomQuote() {
        const quotes = [
            "每一天都因为有你而变得特别美好",
            "你是我最美的相遇，最甜的牵挂",
            "我爱你，不是因为你是谁，而是因为我在你身边的时候，我是谁",
            "我们的故事还很长，请你不要轻易说再见",
            "你的样子，是我见过最美的风景",
            "你的笑容是我这辈子见过最美的景色",
            "我希望有一天，你能对我说，我爱上你的每一个缺点",
            "我们的爱情，就像流星雨，璀璨而永恒",
            "我想牵着你的手，走过每一个春夏秋冬",
            "有你在的每一天，都是我最珍贵的回忆"
        ];
        
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quoteElement = document.getElementById('dailyQuote');
        if (quoteElement) {
            quoteElement.textContent = quotes[randomIndex];
        }
    }
    
    // 设置纪念日倒计时
    function setAnniversaryCountdown() {
        // 此功能已移至 countdown.js
        console.log('倒计时功能已移至 countdown.js');
        
        // 避免与新倒计时功能冲突
        return;
        
        /* 原始代码已注释
        // 示例：假设纪念日是每年的1月1日
        const today = new Date();
        let nextAnniversary = new Date(today.getFullYear(), 0, 1); // 今年的1月1日
        
        // 如果今年的纪念日已经过了，就计算到明年的纪念日
        if (today > nextAnniversary) {
            nextAnniversary = new Date(today.getFullYear() + 1, 0, 1);
        }
        
        const timeDiff = nextAnniversary.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        const countdownDaysElement = document.getElementById('countdownDays');
        const countdownEventElement = document.getElementById('countdownEvent');
        
        if (countdownDaysElement && countdownEventElement) {
            countdownDaysElement.textContent = daysLeft;
            countdownEventElement.textContent = `距离我们的${today.getFullYear() + (today > nextAnniversary ? 1 : 0)}周年纪念日`;
        }
        */
    }
    
    // 显示自定义提示弹窗
    function showCustomAlert(type, title, message, callback) {
        console.log('显示弹窗:', type, title, message);
        
        // 获取弹窗元素
        const alertModal = document.getElementById('alertModal');
        const alertIcon = document.getElementById('alertIcon');
        const alertTitle = document.getElementById('alertTitle');
        const alertMessage = document.getElementById('alertMessage');
        const alertConfirmBtn = document.getElementById('alertConfirmBtn');
        const closeAlertModal = document.getElementById('closeAlertModal');
        
        if (!alertModal) {
            console.error('未找到弹窗元素 #alertModal');
            return;
        }
        
        // 设置图标
        switch (type) {
            case 'success':
                alertIcon.textContent = '✅';
                break;
            case 'error':
                alertIcon.textContent = '❌';
                break;
            case 'warning':
                alertIcon.textContent = '⚠️';
                break;
            case 'info':
                alertIcon.textContent = 'ℹ️';
                break;
            default:
                alertIcon.textContent = '✅';
        }
        
        // 设置标题和消息
        alertTitle.textContent = title;
        alertMessage.textContent = message;
        
        // 关闭按钮事件
        closeAlertModal.onclick = function() {
            alertModal.classList.remove('show');
        };
        
        // 设置确认按钮点击事件
        alertConfirmBtn.onclick = function() {
            alertModal.classList.remove('show');
            if (callback && typeof callback === 'function') {
                callback();
            }
        };
        
        // 显示弹窗
        alertModal.classList.add('show');
        
        // 点击弹窗外部关闭
        alertModal.onclick = function(e) {
            if (e.target === alertModal) {
                alertModal.classList.remove('show');
            }
        };
        
        console.log('弹窗已显示');
    }
    
    // 初始化图片查看器
    function initImageViewer() {
        const imageViewer = document.getElementById('imageViewer');
        const viewerImage = document.getElementById('viewerImage');
        const closeViewer = document.querySelector('.close-viewer');
        const zoomIn = document.getElementById('zoomIn');
        const zoomOut = document.getElementById('zoomOut');
        const resetZoom = document.getElementById('resetZoom');
        
        let currentScale = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;
        
        // 打开图片查看器
        function openImageViewer(imageSrc) {
            viewerImage.src = imageSrc;
            imageViewer.classList.add('show');
            resetImageTransform();
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }
        
        // 关闭图片查看器
        function closeImageViewer() {
            imageViewer.classList.remove('show');
            document.body.style.overflow = '';
            resetImageTransform();
        }
        
        // 重置图片变换
        function resetImageTransform() {
            currentScale = 1;
            translateX = 0;
            translateY = 0;
            updateImageTransform();
        }
        
        // 更新图片变换
        function updateImageTransform() {
            viewerImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        }
        
        // 缩放控制
        zoomIn.addEventListener('click', () => {
            currentScale = Math.min(currentScale * 1.2, 5);
            updateImageTransform();
        });
        
        zoomOut.addEventListener('click', () => {
            currentScale = Math.max(currentScale / 1.2, 0.5);
            updateImageTransform();
        });
        
        resetZoom.addEventListener('click', resetImageTransform);
        
        // 拖动功能
        viewerImage.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            viewerImage.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform();
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            viewerImage.style.cursor = 'move';
        });
        
        // 鼠标滚轮缩放
        imageViewer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY;
            if (delta < 0) {
                currentScale = Math.min(currentScale * 1.1, 5);
            } else {
                currentScale = Math.max(currentScale / 1.1, 0.5);
            }
            updateImageTransform();
        });
        
        // 关闭按钮和点击背景关闭
        closeViewer.addEventListener('click', closeImageViewer);
        imageViewer.addEventListener('click', (e) => {
            if (e.target === imageViewer) {
                closeImageViewer();
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeImageViewer();
            }
        });
        
        return { openImageViewer, closeImageViewer };
    }

    // 在页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        checkLoginState();
        initLogout();
        displayUserInfo();
        initAvatarClickEvents();
        displayDailyQuote();
        displayCountdown();
        setupMoodButtons();
        initLoveDeclarations();
        enhanceThemeEffects();
        initAlbums();
        initTimeline();
        calculateDaysTogether();
        initImageViewer();
        initMessages();
        
        console.log("所有功能已初始化完成");
    });

    // 发送消息
    function sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const content = messageInput.value.trim();
        
        if (!content) {
            showCustomAlert('warning', '提示', '请输入留言内容', null);
            return;
        }

        const message = {
            id: Date.now() + Math.floor(Math.random() * 1000), // 唯一ID
            sender: localStorage.getItem('userName'),
            gender: localStorage.getItem('userGender'),
            content: content,
            timestamp: new Date().toISOString(),
            quotedMessage: window.currentQuotedMessage || null
        };

        try {
            // 保存消息
            saveMessage(message);
            
            // 添加到UI
            addMessageToUI(message);
            
            // 清空输入框
            messageInput.value = '';
            adjustTextareaHeight(messageInput);
            
            // 清除引用
            clearQuotedMessage();
            
            // 滚动到最新消息
            const messagesContainer = document.getElementById('messagesContainer');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('发送消息出错:', error);
            showCustomAlert('error', '错误', '发送消息失败，请重试', null);
        }
    }

    // 初始化消息功能
    function initMessages() {
        console.log("初始化留言板功能");
        
        try {
            // 初始化引用消息变量
            window.currentQuotedMessage = null;
            
            // 加载已有消息
            loadMessages();
            
            // 设置文本框自适应高度
            const messageInput = document.getElementById('messageInput');
            if (!messageInput) {
                console.error("找不到消息输入框元素 #messageInput");
                return;
            }
            
            // 创建引用区域
            const quoteArea = document.createElement('div');
            quoteArea.id = 'quoteArea';
            quoteArea.className = 'quote-area';
            quoteArea.style.display = 'none';
            
            // 插入到消息控件之前
            const messageControls = document.querySelector('.message-controls');
            if (messageControls) {
                messageControls.insertBefore(quoteArea, messageControls.firstChild);
            }
            
            // 设置初始高度
            messageInput.style.height = '36px';
            messageInput.style.overflowY = 'hidden';
            
            // 添加输入事件监听器
            messageInput.addEventListener('input', function() {
                adjustTextareaHeight(this);
            });
            
            // 绑定发送按钮点击事件
            const sendButton = document.getElementById('sendMessage');
            if (!sendButton) {
                console.error("找不到发送按钮元素 #sendMessage");
                return;
            }
            
            console.log("找到发送按钮，正在绑定点击事件");
            sendButton.onclick = function() {
                console.log("发送按钮被点击");
                sendMessage();
            };
            
            // 绑定回车发送
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log("检测到回车键，触发发送");
                    sendMessage();
                }
            });
            
            console.log("留言板功能初始化完成");
        } catch (error) {
            console.error("初始化留言板功能出错:", error);
        }
    }
    
    // 调整文本框高度
    function adjustTextareaHeight(textarea) {
        // 重置高度
        textarea.style.height = '36px';
        // 设置新高度
        const newHeight = Math.min(textarea.scrollHeight, 150); // 最大高度150px
        textarea.style.height = newHeight + 'px';
    }

    // 保存消息到本地存储
    function saveMessage(message) {
        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    // 加载消息
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        const messagesContainer = document.getElementById('messagesContainer');
        const noMessagesPlaceholder = document.getElementById('noMessagesPlaceholder');
        
        if (messages.length === 0) {
            noMessagesPlaceholder.style.display = 'flex';
            return;
        }
        
        noMessagesPlaceholder.style.display = 'none';
        messages.forEach(message => addMessageToUI(message));
        
        // 滚动到最新消息
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 将消息添加到UI
    function addMessageToUI(message) {
        const messagesContainer = document.getElementById('messagesContainer');
        const noMessagesPlaceholder = document.getElementById('noMessagesPlaceholder');
        const currentUser = localStorage.getItem('userName');
        
        noMessagesPlaceholder.style.display = 'none';
        
        const messageElement = document.createElement('div');
        messageElement.className = `message-item ${message.gender}`;
        messageElement.dataset.id = message.id;
        messageElement.dataset.sender = message.sender;
        
        // 构建消息内容
        let messageContent = '';
        
        // 如果有引用的消息，显示引用内容
        if (message.quotedMessage) {
            messageContent += `
                <div class="quoted-message">
                    <div class="quoted-sender">${message.quotedMessage.sender}:</div>
                    <div class="quoted-content">${formatMessageContent(message.quotedMessage.content)}</div>
                </div>
            `;
        }
        
        // 添加消息内容
        messageContent += `<div class="message-content">${formatMessageContent(message.content)}</div>`;
        
        // 判断是否是当前用户的消息
        const isSelf = message.sender === currentUser;
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-sender ${message.gender}">${message.sender}</span>
                <span class="message-time">${formatMessageTime(message.timestamp)}</span>
                <div class="message-actions" style="display: none;">
                    ${isSelf ? 
                        '<button class="delete-message-btn" title="删除">🗑️</button>' : 
                        '<button class="quote-message-btn" title="引用">💬</button>'}
                </div>
            </div>
            ${messageContent}
        `;
        
        // 添加点击事件
        messageElement.addEventListener('click', function(e) {
            // 显示消息操作按钮
            const actionsElement = this.querySelector('.message-actions');
            if (actionsElement) {
                // 先隐藏所有其他消息的操作按钮
                document.querySelectorAll('.message-actions').forEach(el => {
                    if (el !== actionsElement) el.style.display = 'none';
                });
                
                // 显示当前消息的操作按钮
                actionsElement.style.display = 'block';
                
                // 添加删除按钮事件
                const deleteBtn = actionsElement.querySelector('.delete-message-btn');
                if (deleteBtn) {
                    deleteBtn.onclick = function(e) {
                        e.stopPropagation(); // 阻止冒泡
                        console.log('删除按钮被点击，消息ID:', message.id);
                        showDeleteConfirmation(message.id);
                    };
                }
                
                // 添加引用按钮事件
                const quoteBtn = actionsElement.querySelector('.quote-message-btn');
                if (quoteBtn) {
                    quoteBtn.onclick = function(e) {
                        e.stopPropagation(); // 阻止冒泡
                        console.log('引用按钮被点击，消息:', message);
                        quoteMessage(message);
                    };
                }
                
                // 点击其他地方隐藏操作按钮
                const hideActions = function(evt) {
                    if (!messageElement.contains(evt.target)) {
                        actionsElement.style.display = 'none';
                        document.removeEventListener('click', hideActions);
                    }
                };
                
                // 延迟添加事件监听，避免立即触发
                setTimeout(() => {
                    document.addEventListener('click', hideActions);
                }, 10);
            }
        });
        
        messagesContainer.appendChild(messageElement);
    }
    
    // 引用消息
    function quoteMessage(message) {
        // 保存被引用的消息
        window.currentQuotedMessage = {
            id: message.id,
            sender: message.sender,
            content: message.content
        };
        
        // 显示引用区域
        const quoteArea = document.getElementById('quoteArea');
        if (quoteArea) {
            quoteArea.style.display = 'block';
            quoteArea.innerHTML = `
                <div class="quote-content">
                    <span class="quote-sender">${message.sender}:</span>
                    <span class="quote-text">${message.content.length > 20 ? message.content.substring(0, 20) + '...' : message.content}</span>
                </div>
                <button id="clearQuoteBtn" class="clear-quote-btn">×</button>
            `;
            
            // 添加清除引用按钮事件
            const clearQuoteBtn = document.getElementById('clearQuoteBtn');
            if (clearQuoteBtn) {
                clearQuoteBtn.onclick = clearQuotedMessage;
            }
        }
        
        // 聚焦到输入框
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
        }
    }
    
    // 清除引用的消息
    function clearQuotedMessage() {
        window.currentQuotedMessage = null;
        
        const quoteArea = document.getElementById('quoteArea');
        if (quoteArea) {
            quoteArea.style.display = 'none';
            quoteArea.innerHTML = '';
        }
    }
    
    // 显示删除确认弹窗
    function showDeleteConfirmation(messageId) {
        console.log('显示删除确认弹窗，消息ID:', messageId);
        
        // 使用自定义弹窗
        showCustomAlert('warning', '确认删除', '确定要删除这条留言吗？', function() {
            console.log('用户确认删除，执行删除操作');
            deleteMessage(messageId);
        });
    }
    
    // 删除消息
    function deleteMessage(messageId) {
        try {
            // 从本地存储中获取消息
            let messages = JSON.parse(localStorage.getItem('messages') || '[]');
            
            // 找到要删除的消息索引
            const messageIndex = messages.findIndex(msg => msg.id == messageId);
            
            if (messageIndex !== -1) {
                // 检查是否是当前用户的消息
                const currentUser = localStorage.getItem('userName');
                if (messages[messageIndex].sender !== currentUser) {
                    showCustomAlert('error', '错误', '你只能删除自己的留言');
                    return;
                }
                
                // 从数组中删除
                messages.splice(messageIndex, 1);
                
                // 保存到本地存储
                localStorage.setItem('messages', JSON.stringify(messages));
                
                // 从UI中移除
                const messageElement = document.querySelector(`.message-item[data-id="${messageId}"]`);
                if (messageElement) {
                    messageElement.remove();
                }
                
                // 如果没有消息了，显示占位符
                if (messages.length === 0) {
                    const noMessagesPlaceholder = document.getElementById('noMessagesPlaceholder');
                    if (noMessagesPlaceholder) {
                        noMessagesPlaceholder.style.display = 'flex';
                    }
                }
                
                showCustomAlert('success', '成功', '留言已删除');
            }
        } catch (error) {
            console.error('删除留言时出错:', error);
            showCustomAlert('error', '错误', '删除留言失败，请重试');
        }
    }

    // 格式化消息时间
    function formatMessageTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // 今天，显示具体时间
            return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            // 昨天
            return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        } else {
            // 更早，显示完整日期
            return date.toLocaleDateString('zh-CN') + ' ' + 
                   date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
    }

    // 格式化消息内容（支持换行）
    function formatMessageContent(content) {
        return content.replace(/\n/g, '<br>');
    }

    // 确保页面加载完成后立即初始化留言板功能
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log("页面已加载，直接初始化留言板");
        setTimeout(function() {
            try {
                initMessages();
            } catch (error) {
                console.error("直接初始化留言板失败:", error);
            }
        }, 100);
    } else {
        console.log("等待页面加载完成后初始化留言板");
    }

    // 设置当前用户信息
    function setupCurrentUser() {
        // 从本地存储获取当前登录的用户类型
        const userType = localStorage.getItem('userType');
        console.log('Current user type set to:', userType);
    }
    
    // 查看用户资料函数
    window.viewProfile = function(userType) {
        // 从本地存储获取当前登录的用户名和类型
        const currentUser = localStorage.getItem('currentUser');
        
        // 根据当前用户名确定用户类型
        const currentUserType = currentUser === '赖姣姣' ? 'female' : 'male';
        
        // 如果查看的是当前用户类型，则设置为可编辑
        const isEditable = (userType === currentUserType);
        
        // 导航到个人资料页面
        window.location.href = `profile.html?user=${userType}&editable=${isEditable}`;
    };

    // 音乐播放器功能
    function initMusicPlayer() {
        const musicPlayerIcon = document.getElementById('musicPlayerIcon');
        const musicPlayerModal = document.getElementById('musicPlayerModal');
        const closePlayerBtn = document.getElementById('closePlayerBtn');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const musicTitle = document.getElementById('musicTitle');
        const currentTime = document.getElementById('currentTime');
        const totalTime = document.getElementById('totalTime');
        const progressBar = document.querySelector('.music-progress-bar');
        const progressContainer = document.querySelector('.music-progress');

        let audio = null;
        let isPlaying = false;
        let currentSongIndex = 0;

        // 示例歌曲列表
        const songs = [
            {
                title: "我们的爱",
                url: "music/our-love.mp3"
            },
            {
                title: "浪漫时光",
                url: "music/romantic-time.mp3"
            },
            {
                title: "甜蜜回忆",
                url: "music/sweet-memory.mp3"
            }
        ];

        function initAudio() {
            if (!audio) {
                audio = new Audio();
                audio.addEventListener('timeupdate', updateProgress);
                audio.addEventListener('ended', () => playNext());
                audio.addEventListener('loadedmetadata', () => {
                    totalTime.textContent = formatTime(audio.duration);
                });
            }
        }

        function togglePlayer() {
            musicPlayerModal.classList.toggle('show');
        }

        function togglePlayPause() {
            if (!audio || !audio.src) {
                loadSong(currentSongIndex);
            }
            
            if (isPlaying) {
                audio.pause();
                playPauseBtn.textContent = '▶';
            } else {
                audio.play();
                playPauseBtn.textContent = '⏸';
            }
            isPlaying = !isPlaying;
        }

        function loadSong(index) {
            initAudio();
            currentSongIndex = index;
            const song = songs[index];
            audio.src = song.url;
            musicTitle.textContent = song.title;
            if (isPlaying) {
                audio.play();
            }
        }

        function playNext() {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            loadSong(currentSongIndex);
            if (isPlaying) {
                audio.play();
            }
        }

        function playPrev() {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            loadSong(currentSongIndex);
            if (isPlaying) {
                audio.play();
            }
        }

        function updateProgress() {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            currentTime.textContent = formatTime(audio.currentTime);
        }

        function setProgress(e) {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            audio.currentTime = (clickX / width) * duration;
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // 事件监听
        musicPlayerIcon.addEventListener('click', togglePlayer);
        closePlayerBtn.addEventListener('click', togglePlayer);
        playPauseBtn.addEventListener('click', togglePlayPause);
        prevBtn.addEventListener('click', playPrev);
        nextBtn.addEventListener('click', playNext);
        progressContainer.addEventListener('click', setProgress);

        // 添加音乐图标动画效果
        function updateIconAnimation() {
            const icon = musicPlayerIcon.querySelector('i');
            if (isPlaying) {
                icon.style.animation = 'musicNote 1s infinite';
            } else {
                icon.style.animation = 'none';
            }
        }

        // 监听主题变化
        document.addEventListener('themeChanged', (e) => {
            const theme = e.detail.theme;
            if (theme === 'cool') {
                progressBar.style.background = 'linear-gradient(90deg, #ffd700, #ff6b8b)';
            } else if (theme === 'starry') {
                progressBar.style.background = 'linear-gradient(90deg, #4d9aff, #ff6b8b)';
            }
        });
    }

    // 在页面加载完成后初始化音乐播放器
    document.addEventListener('DOMContentLoaded', () => {
        // ... existing code ...
        initMusicPlayer();
    });
}); 
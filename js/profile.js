document.addEventListener('DOMContentLoaded', () => {
    // 从URL获取参数
    const urlParams = new URLSearchParams(window.location.search);
    let userType = urlParams.get('user'); // 'male' 或 'female' 或 'current'
    const isEditable = urlParams.get('editable') === 'true'; // 是否可编辑
    
    // 如果是current用户类型，则获取当前登录的用户类型
    if (userType === 'current') {
        const currentUser = localStorage.getItem('currentUser');
        userType = currentUser === '赖姣姣' ? 'female' : 'male';
        console.log('Current user resolved to:', userType);
    }
    
    // 判断是否为当前登录用户
    const currentUser = localStorage.getItem('currentUser');
    const isCurrentUser = (userType === 'male' && currentUser === '罗枭') || 
                          (userType === 'female' && currentUser === '赖姣姣');
    
    console.log('Profile page loaded with parameters:', { userType, isEditable, isCurrentUser });
    
    // 修改返回按钮的图标
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.innerHTML = '⬅️';
    }
    
    // 初始化个人资料信息
    setupProfileData(userType);
    
    // 设置页面是否可编辑
    setupEditableState(isEditable);
    
    // 初始化头像更换功能
    initAvatarChange();
    
    // 初始化相册功能
    initAlbums(isCurrentUser);

    // 初始化心愿墙功能
    initWishWall(userType, isCurrentUser);
    
    // 增强主题特效
    enhanceThemeEffects();

    // 重新组织头部按钮
    reorganizeHeaderButtons(isCurrentUser);
    
    // 根据用户类型设置个人资料信息
    function setupProfileData(userType) {
        const profileElements = {
            name: document.getElementById('profileName'),
            avatar: document.getElementById('profileAvatar'),
            birthday: document.getElementById('birthday'),
            lunarBirthday: document.getElementById('lunarBirthday'),
            zodiac: document.getElementById('zodiac'),
            chineseZodiac: document.getElementById('chineseZodiac'),
            loveDeclaration: document.getElementById('loveDeclaration'),
            motto: document.getElementById('profileMotto')
        };
        
        const userData = userType === 'male' ? {
            name: '罗枭',
            defaultAvatar: 'images/male-avatar.png',
            storageKey: 'maleAvatar',
            profile: JSON.parse(localStorage.getItem('maleProfile') || '{}'),
            defaults: {
                birthday: '1995-05-15',
                lunarBirthday: '四月初六',
                zodiac: '双子座',
                chineseZodiac: '猪',
                declaration: '你是我生命中最美丽的意外，遇见你是我最大的幸运。',
                motto: '快乐来自于努力与勤奋'
            }
        } : {
            name: '赖姣姣',
            defaultAvatar: 'images/female-avatar.png',
            storageKey: 'femaleAvatar',
            profile: JSON.parse(localStorage.getItem('femaleProfile') || '{}'),
            defaults: {
                birthday: '1997-08-23',
                lunarBirthday: '七月二十一',
                zodiac: '处女座',
                chineseZodiac: '牛',
                declaration: '有你的日子都是晴天，我愿意陪你走过所有的风风雨雨。',
                motto: '快乐来自于努力与勤奋'
            }
        };
        
        // 设置基本信息 - 用户名不可编辑
        profileElements.name.textContent = userData.name;
        profileElements.name.classList.remove('editable');
        profileElements.name.removeAttribute('title');
        
        // 设置头像
        const savedAvatar = localStorage.getItem(userData.storageKey);
        if (savedAvatar) {
            profileElements.avatar.src = savedAvatar;
        } else {
            profileElements.avatar.src = userData.defaultAvatar;
            // 保存默认头像到本地存储
            fetch(userData.defaultAvatar)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        localStorage.setItem(userData.storageKey, reader.result);
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(error => console.error('加载默认头像失败:', error));
        }
        
        // 设置其他信息
        profileElements.birthday.textContent = userData.profile.birthday || userData.defaults.birthday;
        profileElements.lunarBirthday.textContent = userData.profile.lunarBirthday || userData.defaults.lunarBirthday;
        profileElements.zodiac.textContent = userData.profile.zodiac || userData.defaults.zodiac;
        profileElements.chineseZodiac.textContent = userData.profile.chineseZodiac || userData.defaults.chineseZodiac;
        profileElements.loveDeclaration.textContent = userData.profile.declaration || userData.defaults.declaration;
        
        // 设置个性签名
        if (profileElements.motto) {
            profileElements.motto.textContent = userData.profile.motto || userData.defaults.motto;
            if (isEditable) {
                profileElements.motto.classList.add('editable');
                profileElements.motto.title = '点击编辑个性签名';
                profileElements.motto.style.cursor = 'pointer';
            }
        }
        
        // 添加编辑事件监听
        if (isEditable) {
            setupEditableFields(userType);
        }
    }
    
    // 设置可编辑字段
    function setupEditableFields(userType) {
        const editableElements = document.querySelectorAll('.editable');
        
        editableElements.forEach(element => {
            element.addEventListener('click', function() {
                // 移除正在编辑的标记，允许重复编辑
                this.removeAttribute('editing');
                
                // 特殊处理个性签名
                if (this.id === 'profileMotto') {
                    const currentValue = this.textContent;
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = currentValue;
                    input.className = 'edit-input';
                    input.style.width = '100%';
                    input.style.fontSize = '12px';
                    input.maxLength = 30; // 限制长度
                    
                    // 保存原始内容
                    const originalContent = this.innerHTML;
                    
                    // 替换为输入框
                    this.innerHTML = '';
                    this.appendChild(input);
                    this.setAttribute('editing', 'true');
                    input.focus();
                    
                    // 处理完成编辑
                    const finishEdit = () => {
                        const newValue = input.value.trim();
                        if (newValue) {
                            this.textContent = newValue;
                            saveProfileData('profileMotto', newValue, userType);
                        } else {
                            this.innerHTML = originalContent;
                        }
                        this.removeAttribute('editing');
                    };
                    
                    // 添加事件监听器
                    input.addEventListener('blur', finishEdit);
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            finishEdit();
                        }
                    });
                    return;
                }
                
                // 特殊处理爱情宣言
                if (this.id === 'loveDeclaration') {
                    editLoveDeclaration(this, userType);
                    return;
                }
                
                const currentValue = this.textContent;
                const inputType = this.id === 'birthday' ? 'date' : 'text';
                
                // 创建输入框
                const input = document.createElement(inputType === 'text' ? 'input' : 'input');
                input.type = inputType;
                input.value = currentValue;
                input.className = 'edit-input';
                
                // 如果是星座，使用选择框
                if (this.id === 'zodiac') {
                    input.innerHTML = `
                        <option value="白羊座">白羊座</option>
                        <option value="金牛座">金牛座</option>
                        <option value="双子座">双子座</option>
                        <option value="巨蟹座">巨蟹座</option>
                        <option value="狮子座">狮子座</option>
                        <option value="处女座">处女座</option>
                        <option value="天秤座">天秤座</option>
                        <option value="天蝎座">天蝎座</option>
                        <option value="射手座">射手座</option>
                        <option value="摩羯座">摩羯座</option>
                        <option value="水瓶座">水瓶座</option>
                        <option value="双鱼座">双鱼座</option>
                    `;
                }
                
                // 如果是生肖，使用选择框
                if (this.id === 'chineseZodiac') {
                    input.innerHTML = `
                        <option value="鼠">鼠</option>
                        <option value="牛">牛</option>
                        <option value="虎">虎</option>
                        <option value="兔">兔</option>
                        <option value="龙">龙</option>
                        <option value="蛇">蛇</option>
                        <option value="马">马</option>
                        <option value="羊">羊</option>
                        <option value="猴">猴</option>
                        <option value="鸡">鸡</option>
                        <option value="狗">狗</option>
                        <option value="猪">猪</option>
                    `;
                }
                
                // 保存原始内容
                const originalContent = this.innerHTML;
                
                // 替换为输入框
                this.innerHTML = '';
                this.appendChild(input);
                this.setAttribute('editing', 'true');
                input.focus();
                
                // 处理完成编辑
                const finishEdit = () => {
                    const newValue = input.value.trim();
                    if (newValue) {
                        this.textContent = newValue;
                        saveProfileData(this.id, newValue, userType);
                    } else {
                        this.innerHTML = originalContent;
                    }
                    this.removeAttribute('editing');
                };
                
                // 添加事件监听器
                input.addEventListener('blur', finishEdit);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        finishEdit();
                    }
                });
            });
        });
    }
    
    // 编辑个性签名
    function editLoveDeclaration(element, userType) {
        const currentText = element.textContent;
        
        // 创建编辑界面
        const container = document.createElement('div');
        container.className = 'declaration-edit-container';
        container.style.width = '100%';
        
        const textarea = document.createElement('textarea');
        textarea.className = 'declaration-input';
        textarea.placeholder = '写下你的个性签名...';
        textarea.value = currentText;
        textarea.style.width = '100%';
        textarea.style.minHeight = '60px';
        textarea.style.marginBottom = '10px';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'declaration-actions';
        actionsDiv.style.display = 'flex';
        actionsDiv.style.justifyContent = 'flex-end';
        actionsDiv.style.gap = '10px';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = '取消';
        cancelBtn.style.padding = '5px 10px';
        cancelBtn.style.borderRadius = '4px';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = '保存';
        saveBtn.style.padding = '5px 10px';
        saveBtn.style.borderRadius = '4px';
        
        actionsDiv.appendChild(cancelBtn);
        actionsDiv.appendChild(saveBtn);
        
        container.appendChild(textarea);
        container.appendChild(actionsDiv);
        
        // 保存原始内容
        const originalContent = element.innerHTML;
        
        // 替换为编辑界面
        element.innerHTML = '';
        element.appendChild(container);
        element.setAttribute('editing', 'true');
        textarea.focus();
        
        // 取消编辑
        cancelBtn.addEventListener('click', () => {
            element.innerHTML = originalContent;
            element.removeAttribute('editing');
        });
        
        // 保存编辑
        saveBtn.addEventListener('click', () => {
            const newText = textarea.value.trim();
            if (newText) {
                element.textContent = newText;
                saveProfileData('loveDeclaration', newText, userType);
            } else {
                element.innerHTML = originalContent;
            }
            element.removeAttribute('editing');
        });
        
        // 按ESC取消
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                cancelBtn.click();
            }
        });
        
        // 按Ctrl+Enter保存
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                saveBtn.click();
            }
        });
    }
    
    // 保存个人资料数据
    function saveProfileData(field, value, userType) {
        const profileKey = userType === 'male' ? 'maleProfile' : 'femaleProfile';
        let profile = JSON.parse(localStorage.getItem(profileKey) || '{}');
        
        // 更新相应的字段
        if (field === 'loveDeclaration') {
            profile.declaration = value;
        } else if (field === 'profileMotto') {
            profile.motto = value;
        } else {
            profile[field] = value;
        }
        
        // 保存更新后的配置
        localStorage.setItem(profileKey, JSON.stringify(profile));
        
        // 显示保存成功提示
        showCustomAlert('success', '成功', '修改已保存');
    }
    
    // 设置页面是否可编辑
    function setupEditableState(isEditable) {
        const editableElements = document.querySelectorAll('.editable');
        const profileAvatar = document.getElementById('profileAvatar');
        
        if (!isEditable) {
            editableElements.forEach(element => {
                element.classList.remove('editable');
                element.removeAttribute('title');
            });
            
            profileAvatar.style.cursor = 'default';
            
            // 添加提示信息
            const profileCard = document.querySelector('.profile-card');
            if (profileCard) {
                const noticeEl = document.createElement('p');
                noticeEl.className = 'not-editable-notice';
                noticeEl.textContent = '您正在查看对方的个人资料，无法进行编辑。';
                noticeEl.style.textAlign = 'center';
                noticeEl.style.marginTop = '20px';
                noticeEl.style.color = 'rgba(255, 255, 255, 0.7)';
                profileCard.appendChild(noticeEl);
            }
        }
    }
    
    // 初始化头像更换功能
    function initAvatarChange() {
        const avatarInput = document.getElementById('avatarInput');
        const profileAvatar = document.getElementById('profileAvatar');
        
        if (avatarInput && profileAvatar) {
            // 点击头像时触发文件选择
            profileAvatar.addEventListener('click', () => {
                if (!document.querySelector('.readonly')) { // 检查是否为只读模式
                    avatarInput.click();
                }
            });
            
            avatarInput.addEventListener('change', (event) => {
                if (event.target.files && event.target.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        profileAvatar.src = e.target.result;
                        
                        // 保存头像到本地存储
                        const urlParams = new URLSearchParams(window.location.search);
                        const userType = urlParams.get('user');
                        
                        // 获取当前登录用户
                        const currentUser = localStorage.getItem('currentUser');
                        
                        if (userType === 'male') {
                            localStorage.setItem('maleAvatar', e.target.result);
                            
                            // 如果当前登录用户是男性，同时更新userAvatar
                            if (currentUser === '罗枭') {
                                localStorage.setItem('userAvatar', e.target.result);
                                console.log('已更新当前用户头像 (男)');
                            }
                        } else if (userType === 'female') {
                            localStorage.setItem('femaleAvatar', e.target.result);
                            
                            // 如果当前登录用户是女性，同时更新userAvatar
                            if (currentUser === '赖姣姣') {
                                localStorage.setItem('userAvatar', e.target.result);
                                console.log('已更新当前用户头像 (女)');
                            }
                        }
                        
                        // 显示成功提示
                        showCustomAlert('success', '成功', '头像更新成功！');
                    };
                    
                    reader.readAsDataURL(event.target.files[0]);
                }
            });
        }
    }
    
    // 初始化相册功能
    function initAlbums(isCurrentUser) {
        const createAlbumBtn = document.getElementById('createAlbum');
        const addAlbumBtn = document.querySelector('.add-album');
        const albumsContainer = document.getElementById('albumsContainer');
        
        // 获取当前用户类型
        const urlParams = new URLSearchParams(window.location.search);
        let userType = urlParams.get('user'); // 'male' 或 'female' 或 'current'
        
        // 如果是current用户类型，则获取当前登录的用户类型
        if (userType === 'current') {
            const currentUser = localStorage.getItem('currentUser');
            userType = currentUser === '赖姣姣' ? 'female' : 'male';
        }
        
        // 个人相册的存储键
        const storageKey = userType === 'male' ? 'malePersonalAlbums' : 'femalePersonalAlbums';
        
        // 隐藏创建相册按钮，如果不是当前用户
        if (!isCurrentUser) {
            if (createAlbumBtn) createAlbumBtn.style.display = 'none';
            if (addAlbumBtn) addAlbumBtn.style.display = 'none';
        }
        
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
        const createAlbumModalBtn = document.querySelector('.modal-footer .btn-primary');
        const cancelAlbumBtn = document.getElementById('cancelAlbumBtn');
        
        // 存储封面图片的数据URL
        let coverImageData = null;
        
        // 添加创建相册按钮事件
        if (createAlbumBtn) {
            createAlbumBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                albumModal.classList.add('show');
            });
        }
        
        if (addAlbumBtn) {
            addAlbumBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                albumModal.classList.add('show');
            });
        }
        
        // 关闭弹窗事件
        closeAlbumModal.addEventListener('click', closeModal);
        
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
                        showCustomAlert('error', '提示', '请选择图片文件！');
                        coverUploadInput.value = '';
                    }
                }
            });
        }
        
        // 创建相册按钮事件
        if (createAlbumModalBtn) {
            createAlbumModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const albumName = albumNameInput.value.trim();
                const albumDesc = albumDescInput.value.trim();
                
                // 验证相册名称
                if (!albumName) {
                    showCustomAlert('error', '提示', '请输入相册名称！');
                    return;
                }
                
                // 验证封面图片
                if (!coverImageData) {
                    showCustomAlert('error', '提示', '请上传相册封面！');
                    return;
                }
                
                // 使用封面图片
                const coverImage = coverImageData;
                
                // 创建相册
                createNewAlbum(albumName, albumDesc, coverImage);
                
                // 关闭弹窗
                albumModal.classList.remove('show');
                
                // 重置表单
                albumNameInput.value = '';
                albumDescInput.value = '';
                coverPreview.src = '';
                coverPreviewContainer.style.display = 'none';
                uploadPlaceholder.style.display = 'flex';
                coverImageData = null;
                coverUploadInput.value = '';
            });
        }
        
        // 从本地存储加载相册
        loadAlbums();
        
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
                let albums = JSON.parse(localStorage.getItem(storageKey) || '[]');
                
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
                localStorage.setItem(storageKey, JSON.stringify(albums));
                
                // 重新加载相册
                loadAlbums();
                
                // 提示创建成功
                showCustomAlert('success', '成功', '相册创建成功！');
            } catch (error) {
                console.error('创建相册时出错：', error);
                showCustomAlert('error', '错误', '创建相册失败，请重试！');
            }
        }
        
        // 加载相册列表
        function loadAlbums() {
            const albums = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            // 清空现有相册
            while (albumsContainer.children.length > 1) {
                albumsContainer.removeChild(albumsContainer.lastChild);
            }
            
            // 添加相册到界面
            albums.forEach(album => addAlbumToUI(album));
        }
        
        // 添加相册到界面
        function addAlbumToUI(album) {
            const albumElement = document.createElement('div');
            albumElement.className = 'album-item';
            albumElement.innerHTML = `
                <div class="album-cover">
                    <img src="${album.cover}" alt="${album.name}">
                </div>
                <div class="album-info">
                    <h3>${album.name}</h3>
                    <p>${album.photos.length} 张照片</p>
                </div>
            `;
            
            // 添加点击事件
            albumElement.addEventListener('click', () => {
                window.location.href = `album.html?id=${album.id}&user=${userType}`;
            });
            
            // 插入到添加按钮之后
            const addAlbumBtn = document.querySelector('.add-album');
            if (addAlbumBtn) {
                addAlbumBtn.parentNode.insertBefore(albumElement, addAlbumBtn.nextSibling);
            } else {
                albumsContainer.appendChild(albumElement);
            }
        }
    }

    // 初始化心愿墙功能
    function initWishWall(userType, isCurrentUser) {
        const newWishInput = document.getElementById('newWish');
        const addWishBtn = document.getElementById('addWish');
        const wishList = document.getElementById('wishList');
        
        // 确保心愿墙卡片有圆角边框样式
        const wishWallCard = document.querySelector('.wish-wall-card');
        if (wishWallCard) {
            wishWallCard.style.borderRadius = '20px';
            
            // 确保心愿墙内部结构正确
            if (!wishWallCard.querySelector('.wish-list')) {
                const wishListContainer = document.createElement('div');
                wishListContainer.className = 'wish-list';
                
                // 移动现有元素到新容器中
                const wishInputContainer = wishWallCard.querySelector('.wish-input-container');
                const wishesContainer = wishWallCard.querySelector('.wishes-container');
                
                if (wishInputContainer) {
                    wishWallCard.removeChild(wishInputContainer);
                    wishListContainer.appendChild(wishInputContainer);
                }
                
                if (wishesContainer) {
                    wishWallCard.removeChild(wishesContainer);
                    wishListContainer.appendChild(wishesContainer);
                } else {
                    // 如果没有wishes-container，创建一个
                    const newWishesContainer = document.createElement('div');
                    newWishesContainer.className = 'wishes-container';
                    newWishesContainer.appendChild(wishList);
                    wishListContainer.appendChild(newWishesContainer);
                }
                
                wishWallCard.appendChild(wishListContainer);
            }
        }
        
        // 更改心愿墙标题
        const wishWallTitle = document.querySelector('.wish-wall-card h2');
        if (wishWallTitle) {
            wishWallTitle.textContent = '我的心愿墙';
        }
        
        // 隐藏发布心愿的输入框，如果不是当前用户
        if (!isCurrentUser) {
            const wishInputContainer = document.querySelector('.wish-input-container');
            if (wishInputContainer) wishInputContainer.style.display = 'none';
        }
        
        // 从本地存储加载心愿
        loadWishes();
        
        // 添加心愿
        addWishBtn.addEventListener('click', () => {
            const wishContent = newWishInput.value.trim();
            if (wishContent) {
                addWish(wishContent);
                newWishInput.value = '';
            }
        });
        
        // 回车发布心愿
        newWishInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addWishBtn.click();
            }
        });
        
        // 添加心愿
        function addWish(content) {
            const wish = {
                id: Date.now(),
                content,
                date: new Date().toISOString(),
                userType
            };
            
            // 获取对应用户类型的心愿列表
            const storageKey = userType === 'male' ? 'maleWishes' : 'femaleWishes';
            const wishes = JSON.parse(localStorage.getItem(storageKey) || '[]');
            wishes.unshift(wish);
            localStorage.setItem(storageKey, JSON.stringify(wishes));
            
            // 添加到界面
            addWishToUI(wish);
            
            // 显示成功提示
            showCustomAlert('success', '成功', '心愿已发布');
        }
        
        // 加载心愿列表
        function loadWishes() {
            // 清空现有心愿列表
            wishList.innerHTML = '';
            
            // 获取对应用户类型的心愿列表
            const storageKey = userType === 'male' ? 'maleWishes' : 'femaleWishes';
            const wishes = JSON.parse(localStorage.getItem(storageKey) || '[]');
            wishes.forEach(wish => addWishToUI(wish));
            
            // 如果没有心愿，显示提示信息
            if (wishes.length === 0) {
                const emptyTip = document.createElement('div');
                emptyTip.className = 'empty-tip';
                emptyTip.style.cssText = `
                    text-align: center;
                    padding: 20px;
                    color: rgba(255, 255, 255, 0.5);
                    font-style: italic;
                `;
                emptyTip.textContent = '还没有发布过心愿...';
                wishList.appendChild(emptyTip);
            }
        }
        
        // 添加心愿到界面
        function addWishToUI(wish) {
            const wishElement = document.createElement('div');
            wishElement.className = 'wish-item';
            wishElement.style.borderRadius = '10px';
            
            const date = new Date(wish.date);
            const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            
            wishElement.innerHTML = `
                <div class="wish-date">${formattedDate}</div>
                <div class="wish-content">${wish.content}</div>
                ${isCurrentUser ? '<button class="delete-wish-btn" title="删除">🗑️</button>' : ''}
            `;
            
            // 添加删除按钮事件
            if (isCurrentUser) {
                const deleteBtn = wishElement.querySelector('.delete-wish-btn');
                deleteBtn.addEventListener('click', () => deleteWish(wish.id));
            }
            
            // 将新的心愿添加到列表开头
            const wishList = document.getElementById('wishList');
            wishList.insertBefore(wishElement, wishList.firstChild);
        }
        
        // 删除心愿
        function deleteWish(id) {
            // 创建弹窗元素
            const modalId = `delete-wish-modal-${Date.now()}`;
            const modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'modal';
            modal.style.display = 'flex';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            modal.style.zIndex = '1000';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            
            modal.innerHTML = `
                <div class="modal-content" style="background: rgba(35, 35, 45, 0.9); border-radius: 12px; padding: 0; width: 90%; max-width: 350px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); position: relative;">
                    <div class="modal-header" style="padding: 15px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        <h3 style="margin: 0; font-size: 18px; color: white;">删除确认</h3>
                        <span class="close-btn" style="position: absolute; right: 15px; top: 12px; font-size: 24px; cursor: pointer; color: rgba(255, 255, 255, 0.7);">&times;</span>
                    </div>
                    <div class="modal-body" style="padding: 20px; text-align: center;">
                        <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">确定要删除这条心愿吗？</p>
                    </div>
                    <div class="modal-footer" style="padding: 15px 20px; display: flex; justify-content: flex-end; gap: 10px;">
                        <button class="btn-cancel" style="background: rgba(255, 255, 255, 0.1); color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer;">取消</button>
                        <button class="btn-confirm" style="background: rgba(220, 53, 69, 0.8); color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer;">确定</button>
                    </div>
                </div>
            `;
            
            // 添加到body
            document.body.appendChild(modal);
            
            // 获取元素
            const closeBtn = modal.querySelector('.close-btn');
            const cancelBtn = modal.querySelector('.btn-cancel');
            const confirmBtn = modal.querySelector('.btn-confirm');
            
            // 关闭弹窗函数
            const closeModal = () => {
                document.body.removeChild(modal);
            };
            
            // 绑定事件
            closeBtn.onclick = closeModal;
            cancelBtn.onclick = closeModal;
            
            // 确认删除
            confirmBtn.onclick = () => {
                const storageKey = userType === 'male' ? 'maleWishes' : 'femaleWishes';
                let wishes = JSON.parse(localStorage.getItem(storageKey) || '[]');
                
                // 从存储中移除
                wishes = wishes.filter(wish => wish.id !== id);
                localStorage.setItem(storageKey, JSON.stringify(wishes));
                
                // 重新加载列表
                loadWishes();
                
                // 显示成功提示
                alert('心愿已删除');
                
                // 关闭弹窗
                closeModal();
            };
            
            // 点击弹窗外部关闭
            modal.onclick = (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            };
        }
    }

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
        document.querySelectorAll('.profile-card, .wish-wall-card, .albums-card, .wish-item, .album-item').forEach(card => {
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
        document.querySelectorAll('.profile-card, .wish-wall-card, .albums-card, .wish-item, .album-item').forEach(card => {
            card.style.boxShadow = '0 5px 15px rgba(255, 192, 203, 0.3), inset 0 0 5px rgba(255, 192, 203, 0.2)';
            card.style.border = '1px solid rgba(255, 192, 203, 0.4)';
            
            // 添加粉色光晕效果
            const pinkGlow = document.createElement('div');
            pinkGlow.className = 'theme-effect pink-glow';
            pinkGlow.style.cssText = `
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border-radius: inherit;
                background: linear-gradient(45deg, 
                    rgba(255, 192, 203, 0.1), 
                    rgba(255, 182, 193, 0.2) 25%, 
                    rgba(255, 192, 203, 0.1) 50%, 
                    rgba(255, 182, 193, 0.2) 75%, 
                    rgba(255, 192, 203, 0.1));
                opacity: 0.5;
                z-index: -1;
                pointer-events: none;
                animation: pinkShimmer 3s infinite linear;
                background-size: 200% 200%;
            `;
            
            // 确保卡片有相对定位
            if (getComputedStyle(card).position === 'static') {
                card.style.position = 'relative';
            }
            
            card.appendChild(pinkGlow);
        });

        // 添加装饰性爱心
        const decorativeHearts = document.createElement('div');
        decorativeHearts.className = 'decorative-hearts';
        document.body.appendChild(decorativeHearts);

        // 创建多个爱心
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '❤️';
            heart.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 20 + 10}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${Math.random() * 0.5 + 0.3};
                animation: floatHeart ${Math.random() * 10 + 5}s infinite linear;
                animation-delay: -${Math.random() * 10}s;
                z-index: -1;
            `;
            decorativeHearts.appendChild(heart);
        }

        // 添加心电图动画
        const heartbeatContainer = document.createElement('div');
        heartbeatContainer.className = 'heartbeat-animation';
        heartbeatContainer.innerHTML = `
            <svg class="heartbeat-svg" viewBox="0 0 400 100">
                <path class="heartbeat-line" d="M0,50 L100,50 L120,20 L140,80 L160,20 L180,80 L200,50 L400,50" />
            </svg>
        `;
        
        // 将心电图添加到合适的位置（例如profile-card底部）
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            profileCard.appendChild(heartbeatContainer);
        }
        
        // 添加动画样式
        if (!document.getElementById('pink-theme-style')) {
            const style = document.createElement('style');
            style.id = 'pink-theme-style';
            style.textContent = `
                @keyframes pinkShimmer {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 200% 200%; }
                }
                
                @keyframes heartPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }

                @keyframes floatHeart {
                    0% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                    }
                    100% {
                        transform: translateY(0) rotate(360deg);
                    }
                }

                .heartbeat-animation {
                    margin-top: 30px;
                    width: 100%;
                    height: 50px;
                    overflow: hidden;
                }

                .heartbeat-svg {
                    width: 100%;
                    height: 100%;
                }

                .heartbeat-line {
                    fill: none;
                    stroke: #ff69b4;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: dash 3s linear infinite;
                }

                @keyframes dash {
                    from {
                        stroke-dashoffset: 1000;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }

                .decorative-hearts {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    pointer-events: none;
                    z-index: -1;
                }

                .floating-heart {
                    position: fixed;
                    color: pink;
                    filter: drop-shadow(0 0 5px rgba(255, 192, 203, 0.5));
                }
            `;
            document.head.appendChild(style);
        }
        
        // 添加心形动画
        const footerHeart = document.querySelector('.main-footer .animated-heart');
        if (footerHeart) {
            footerHeart.style.animation = 'heartPulse 0.8s infinite';
        }

        // 清理函数
        return () => {
            document.querySelectorAll('.decorative-hearts').forEach(el => el.remove());
            document.querySelectorAll('.heartbeat-animation').forEach(el => el.remove());
            document.querySelectorAll('.theme-effect').forEach(el => el.remove());
            const style = document.getElementById('pink-theme-style');
            if (style) style.remove();
        };
    }

    // 重新组织头部按钮
    function reorganizeHeaderButtons(isCurrentUser) {
        const header = document.querySelector('.main-header');
        
        // 创建右侧容器
        const rightContainer = document.createElement('div');
        rightContainer.className = 'header-right';
        
        // 移动主题切换按钮到右侧
        const themeSwitcher = document.querySelector('.theme-switcher');
        if (themeSwitcher) {
            header.removeChild(themeSwitcher);
            rightContainer.appendChild(themeSwitcher);
        }
        
        // 如果是当前用户，添加设置按钮
        if (isCurrentUser) {
            const settingsButton = document.createElement('button');
            settingsButton.className = 'settings-button';
            settingsButton.innerHTML = '⚙️';
            settingsButton.title = '修改密码';
            settingsButton.addEventListener('click', () => {
                window.location.href = 'change-password.html';
            });
            rightContainer.appendChild(settingsButton);
        }
        
        // 移动返回按钮到右侧
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            header.removeChild(backButton);
            rightContainer.appendChild(backButton);
        }
        
        // 添加右侧容器到header
        header.appendChild(rightContainer);
    }
}); 
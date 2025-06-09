document.addEventListener('DOMContentLoaded', () => {
    // 获取URL参数中的相册ID和用户类型
    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('id');
    const userType = urlParams.get('user');
    
    // 处理返回按钮点击事件
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            // 如果有上一页历史记录，则返回上一页
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // 如果没有历史记录，则返回到首页
                window.location.href = 'home.html';
            }
        });
    }
    
    // 如果没有相册ID或用户类型，返回首页
    if (!albumId || !userType) {
        window.location.href = 'home.html';
        return;
    }

    // 判断是否为当前登录用户的相册
    const currentUser = localStorage.getItem('currentUser');
    const isCurrentUser = (userType === 'male' && currentUser === '罗枭') || 
                          (userType === 'female' && currentUser === '赖姣姣');

    // 确定存储键
    const storageKey = userType === 'male' ? 'malePersonalAlbums' : 'femalePersonalAlbums';
    
    // 初始化元素引用
    const albumTitle = document.getElementById('albumTitle');
    const albumStats = document.getElementById('albumStats');
    const albumCoverThumb = document.getElementById('albumCoverThumb');
    const photosGrid = document.getElementById('photosGrid');
    const editAlbumBtn = document.getElementById('editAlbumBtn');
    
    // 批量管理按钮
    const batchManageBtn = document.getElementById('batchManageBtn');
    const exitManageBtn = document.getElementById('exitManageBtn');
    
    // 如果不是当前用户，隐藏编辑和管理按钮
    if (!isCurrentUser) {
        if (editAlbumBtn) editAlbumBtn.style.display = 'none';
        if (batchManageBtn) batchManageBtn.style.display = 'none';
    }
    
    // 是否处于批量管理模式
    let isManageMode = false;
    
    // 模态框元素
    const addPhotoModal = document.getElementById('addPhotoModal');
    const closeAddPhotoModal = document.getElementById('closeAddPhotoModal');
    const cancelAddPhoto = document.getElementById('cancelAddPhoto');
    const submitAddPhoto = document.getElementById('submitAddPhoto');
    const photoPreview = document.getElementById('photoPreview');
    const photoInput = document.getElementById('photoInput');
    
    const viewPhotoModal = document.getElementById('viewPhotoModal');
    const closeViewPhotoModal = document.getElementById('closeViewPhotoModal');
    const viewPhotoImg = document.getElementById('viewPhotoImg');
    const viewPhotoTitle = document.getElementById('viewPhotoTitle');
    const viewPhotoDate = document.getElementById('viewPhotoDate');
    const viewPhotoDescription = document.getElementById('viewPhotoDescription');
    const editPhotoBtn = document.getElementById('editPhotoBtn');
    const deletePhotoBtn = document.getElementById('deletePhotoBtn');
    
    // 编辑相册模态框元素
    const editAlbumModal = document.getElementById('editAlbumModal');
    const closeEditAlbumModal = document.getElementById('closeEditAlbumModal');
    const cancelEditAlbum = document.getElementById('cancelEditAlbum');
    const renameAlbumBtn = document.getElementById('renameAlbumBtn');
    const changeCoverBtn = document.getElementById('changeCoverBtn');
    const editDescriptionBtn = document.getElementById('editDescriptionBtn');
    const deleteAlbumBtn = document.getElementById('deleteAlbumBtn');
    
    // 重命名相册模态框元素
    const renameAlbumModal = document.getElementById('renameAlbumModal');
    const closeRenameModal = document.getElementById('closeRenameModal');
    const newAlbumNameInput = document.getElementById('newAlbumName');
    const cancelRename = document.getElementById('cancelRename');
    const confirmRename = document.getElementById('confirmRename');
    
    // 更换封面模态框元素
    const changeCoverModal = document.getElementById('changeCoverModal');
    const closeChangeCoverModal = document.getElementById('closeChangeCoverModal');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const coverPreviewContainer = document.getElementById('coverPreviewContainer');
    const coverPreviewImg = document.getElementById('coverPreviewImg');
    const newCoverInput = document.getElementById('newCoverInput');
    const changeCoverBtnInner = document.getElementById('changeCoverBtnInner');
    const coverSelectionGrid = document.getElementById('coverSelectionGrid');
    const cancelChangeCover = document.getElementById('cancelChangeCover');
    const confirmChangeCover = document.getElementById('confirmChangeCover');
    
    // 编辑描述模态框元素
    const editDescriptionModal = document.getElementById('editDescriptionModal');
    const closeDescriptionModal = document.getElementById('closeDescriptionModal');
    const albumDescriptionInput = document.getElementById('albumDescription');
    const cancelDescription = document.getElementById('cancelDescription');
    const confirmDescription = document.getElementById('confirmDescription');
    
    // 删除相册确认模态框元素
    const deleteAlbumModal = document.getElementById('deleteAlbumModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');
    
    // 提示弹窗元素
    const alertModal = document.getElementById('alertModal');
    const closeAlertModal = document.getElementById('closeAlertModal');
    const alertIcon = document.getElementById('alertIcon');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const alertConfirmBtn = document.getElementById('alertConfirmBtn');
    
    // 当前相册数据
    let currentAlbum = null;
    let selectedPhotoData = null;
    let selectedPhotoIndex = -1;
    
    // 新封面数据
    let newCoverImageData = null;
    let selectedCoverPhotoId = null;
    
    // 加载相册数据
    loadAlbumData();
    
    // 初始化事件监听
    initEvents();
    
    // 增强主题特效
    enhanceThemeEffects();
    
    // 加载相册数据
    function loadAlbumData() {
        try {
            // 从localStorage获取所有相册（尝试从两个可能的存储位置获取）
            const commonAlbums = JSON.parse(localStorage.getItem('albums') || '[]');
            const userAlbums = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            // 首先在公共相册中查找
            let album = commonAlbums.find(album => album.id.toString() === albumId);
            
            // 如果在公共相册中没找到，则在用户相册中查找
            if (!album) {
                album = userAlbums.find(album => album.id.toString() === albumId);
            }
            
            // 如果还是没找到，显示错误
            if (!album) {
                showAlert('error', '错误', '相册不存在！', function() {
                    window.location.href = 'home.html';
                });
                return;
            }
            
            // 保存找到的相册
            currentAlbum = album;
            
            // 更新页面标题
            document.title = `${currentAlbum.name} - 甜蜜空间`;
            
            // 更新相册信息
            updateAlbumInfo();
            
            // 渲染照片
            renderPhotos();
        } catch (error) {
            console.error('加载相册数据时出错：', error);
            showAlert('error', '错误', '加载相册失败，请重试！', function() {
                window.location.href = 'home.html';
            });
        }
    }
    
    // 更新相册信息
    function updateAlbumInfo() {
        albumTitle.textContent = currentAlbum.name;
        albumStats.textContent = `${currentAlbum.photos ? currentAlbum.photos.length : 0} 张照片`;
        
        // 设置封面缩略图
        if (currentAlbum.cover) {
            albumCoverThumb.src = currentAlbum.cover;
            albumCoverThumb.onerror = () => {
                albumCoverThumb.src = 'images/default-album.jpg';
            };
        } else {
            albumCoverThumb.src = 'images/default-album.jpg';
        }
    }
    
    // 渲染照片
    function renderPhotos() {
        if (!photosGrid) return;
        
        // 清空照片网格
        photosGrid.innerHTML = '';
        
        // 添加照片卡片
        if (currentAlbum.photos && currentAlbum.photos.length > 0) {
            // 按照日期降序排序照片
            const sortedPhotos = [...currentAlbum.photos].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            
            sortedPhotos.forEach((photo, index) => {
                const photoCard = document.createElement('div');
                photoCard.className = 'photo-card';
                if (isManageMode) {
                    photoCard.classList.add('manage-mode');
                }
                
                photoCard.innerHTML = `
                    <img src="${photo.src}" alt="${photo.title || '未命名照片'}" onerror="this.src='images/photo-placeholder.jpg'">
                    <div class="photo-info">
                        <h3>${photo.title || '未命名照片'}</h3>
                        <p>${formatDate(photo.date)}</p>
                    </div>
                    ${isCurrentUser ? '<div class="delete-badge" data-index="${index}">×</div>' : ''}
                `;
                
                // 点击照片详情
                photoCard.querySelector('img').addEventListener('click', (e) => {
                    if (!isManageMode) {
                        openPhotoDetails(photo, index);
                    }
                    e.stopPropagation();
                });
                
                // 删除徽章点击事件
                if (isCurrentUser) {
                    const deleteBadge = photoCard.querySelector('.delete-badge');
                    if (deleteBadge) {
                        deleteBadge.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (isManageMode) {
                                deletePhotoFromAlbum(index);
                                showAlert('success', '成功', '照片已删除！');
                                renderPhotos();
                            }
                        });
                    }
                }
                
                photosGrid.appendChild(photoCard);
            });
            
            // 添加"添加照片"卡片，仅对当前用户显示
            if (isCurrentUser) {
                const addPhotoCard = document.createElement('div');
                addPhotoCard.className = 'add-photo-card';
                addPhotoCard.innerHTML = `
                    <i>➕</i>
                    <p>添加照片</p>
                `;
                
                addPhotoCard.addEventListener('click', openAddPhotoModal);
                photosGrid.appendChild(addPhotoCard);
            }
        } else {
            // 如果没有照片，显示添加照片的提示
            const emptyCard = document.createElement('div');
            emptyCard.className = 'empty-album';
            
            if (isCurrentUser) {
                emptyCard.innerHTML = `
                    <i>📷</i>
                    <p>这个相册还没有照片</p>
                    <button id="addFirstPhotoBtn" class="btn-add-first">添加第一张照片</button>
                `;
                
                photosGrid.appendChild(emptyCard);
                
                // 添加第一张照片按钮事件
                const addFirstPhotoBtn = document.getElementById('addFirstPhotoBtn');
                if (addFirstPhotoBtn) {
                    addFirstPhotoBtn.addEventListener('click', openAddPhotoModal);
                }
            } else {
                emptyCard.innerHTML = `
                    <i>📷</i>
                    <p>这个相册还没有照片</p>
                `;
                
                photosGrid.appendChild(emptyCard);
            }
        }
    }
    
    // 初始化事件监听
    function initEvents() {
        // 编辑相册按钮点击事件
        if (editAlbumBtn) {
            editAlbumBtn.addEventListener('click', () => {
                editAlbumModal.classList.add('show');
            });
        }
        
        // 关闭编辑相册模态框
        if (closeEditAlbumModal) {
            closeEditAlbumModal.addEventListener('click', () => {
                editAlbumModal.classList.remove('show');
            });
        }
        
        // 取消编辑相册
        if (cancelEditAlbum) {
            cancelEditAlbum.addEventListener('click', () => {
                editAlbumModal.classList.remove('show');
            });
        }
        
        // 重命名相册按钮事件
        if (renameAlbumBtn) {
            renameAlbumBtn.addEventListener('click', openRenameModal);
        }
        
        // 更换封面按钮事件
        if (changeCoverBtn) {
            changeCoverBtn.addEventListener('click', openChangeCoverModal);
        }
        
        // 编辑描述按钮事件
        if (editDescriptionBtn) {
            editDescriptionBtn.addEventListener('click', openEditDescriptionModal);
        }
        
        // 删除相册按钮事件
        if (deleteAlbumBtn) {
            deleteAlbumBtn.addEventListener('click', openDeleteAlbumModal);
        }
        
        // 关闭重命名模态框
        if (closeRenameModal) {
            closeRenameModal.addEventListener('click', () => {
                renameAlbumModal.classList.remove('show');
            });
        }
        
        // 取消重命名
        if (cancelRename) {
            cancelRename.addEventListener('click', () => {
                renameAlbumModal.classList.remove('show');
            });
        }
        
        // 确认重命名
        if (confirmRename) {
            confirmRename.addEventListener('click', confirmRenameAlbum);
        }
        
        // 关闭更换封面模态框
        if (closeChangeCoverModal) {
            closeChangeCoverModal.addEventListener('click', () => {
                changeCoverModal.classList.remove('show');
                resetCoverSelection();
            });
        }
        
        // 点击上传区域触发文件选择
        if (uploadPlaceholder) {
            uploadPlaceholder.addEventListener('click', () => {
                newCoverInput.click();
            });
        }
        
        // 更换按钮点击事件
        if (changeCoverBtnInner) {
            changeCoverBtnInner.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                newCoverInput.click();
            });
        }
        
        // 封面图片上传变化事件
        if (newCoverInput) {
            newCoverInput.addEventListener('change', handleCoverInputChange);
        }
        
        // 取消更换封面
        if (cancelChangeCover) {
            cancelChangeCover.addEventListener('click', () => {
                changeCoverModal.classList.remove('show');
                resetCoverSelection();
            });
        }
        
        // 确认更换封面
        if (confirmChangeCover) {
            confirmChangeCover.addEventListener('click', confirmChangeCoverFunction);
        }
        
        // 关闭编辑描述模态框
        if (closeDescriptionModal) {
            closeDescriptionModal.addEventListener('click', () => {
                editDescriptionModal.classList.remove('show');
            });
        }
        
        // 取消编辑描述
        if (cancelDescription) {
            cancelDescription.addEventListener('click', () => {
                editDescriptionModal.classList.remove('show');
            });
        }
        
        // 确认编辑描述
        if (confirmDescription) {
            confirmDescription.addEventListener('click', confirmEditDescription);
        }
        
        // 关闭删除相册模态框
        if (closeDeleteModal) {
            closeDeleteModal.addEventListener('click', () => {
                deleteAlbumModal.classList.remove('show');
            });
        }
        
        // 取消删除相册
        if (cancelDelete) {
            cancelDelete.addEventListener('click', () => {
                deleteAlbumModal.classList.remove('show');
            });
        }
        
        // 确认删除相册
        if (confirmDelete) {
            confirmDelete.addEventListener('click', confirmDeleteAlbum);
        }
        
        // 关闭添加照片模态框
        if (closeAddPhotoModal) {
            closeAddPhotoModal.addEventListener('click', closeModal);
        }
        
        // 提交添加照片
        if (submitAddPhoto) {
            submitAddPhoto.addEventListener('click', submitPhoto);
        }
        
        // 照片预览点击事件
        if (photoPreview) {
            photoPreview.addEventListener('click', () => {
                photoInput.click();
            });
        }
        
        // 照片输入变化事件
        if (photoInput) {
            photoInput.addEventListener('change', handlePhotoInputChange);
        }
        
        // 关闭查看照片模态框
        if (closeViewPhotoModal) {
            closeViewPhotoModal.addEventListener('click', () => {
                viewPhotoModal.classList.remove('show');
            });
        }
        
        // 编辑照片按钮点击事件
        if (editPhotoBtn) {
            editPhotoBtn.addEventListener('click', editPhoto);
        }
        
        // 删除照片按钮点击事件
        if (deletePhotoBtn) {
            deletePhotoBtn.addEventListener('click', deletePhoto);
        }
        
        // 提示弹窗关闭按钮
        if (closeAlertModal) {
            closeAlertModal.addEventListener('click', () => {
                alertModal.classList.remove('show');
            });
        }
        
        // 提示弹窗确认按钮
        if (alertConfirmBtn) {
            alertConfirmBtn.addEventListener('click', () => {
                alertModal.classList.remove('show');
            });
        }
        
        // 批量管理按钮点击事件
        if (batchManageBtn) {
            batchManageBtn.addEventListener('click', enterManageMode);
        }
        
        // 退出管理按钮点击事件
        if (exitManageBtn) {
            exitManageBtn.addEventListener('click', exitManageMode);
        }
        
        // 初始化照片查看器
        initPhotoViewer();
    }
    
    // 打开添加照片模态框
    function openAddPhotoModal() {
        // 重置表单
        document.getElementById('photoTitle').value = '';
        document.getElementById('photoDescription').value = '';
        document.getElementById('photoDate').value = new Date().toISOString().split('T')[0];
        
        // 清除预览
        photoPreview.style.backgroundImage = '';
        photoPreview.classList.remove('has-image');
        if (photoPreview.querySelector('.upload-icon')) {
            photoPreview.querySelector('.upload-icon').style.display = 'block';
        }
        if (photoPreview.querySelector('span')) {
            photoPreview.querySelector('span').style.display = 'block';
        }
        
        // 显示模态框
        addPhotoModal.classList.add('show');
    }
    
    // 关闭模态框
    function closeModal() {
        addPhotoModal.classList.remove('show');
    }
    
    // 处理照片输入变化
    function handlePhotoInputChange(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                photoPreview.style.backgroundImage = `url(${e.target.result})`;
                photoPreview.classList.add('has-image');
                if (photoPreview.querySelector('.upload-icon')) {
                    photoPreview.querySelector('.upload-icon').style.display = 'none';
                }
                if (photoPreview.querySelector('span')) {
                    photoPreview.querySelector('span').style.display = 'none';
                }
            };
            
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    
    // 提交照片
    function submitPhoto() {
        const title = document.getElementById('photoTitle').value.trim();
        const description = document.getElementById('photoDescription').value.trim();
        const date = document.getElementById('photoDate').value;
        
        if (!photoPreview.classList.contains('has-image')) {
            showAlert('error', '提示', '请选择照片');
            return;
        }
        
        // 获取照片数据
        const photoData = {
            id: Date.now(),
            title: title || '未命名照片', // 如果标题为空，使用默认名称
            description: description,
            date: date || new Date().toISOString().split('T')[0],
            src: photoPreview.style.backgroundImage.slice(5, -2) // 提取url()中的内容
        };
        
        // 添加到相册
        addPhotoToAlbum(photoData);
        
        // 关闭模态框
        closeModal();
    }
    
    // 添加照片到相册
    function addPhotoToAlbum(photoData) {
        try {
            // 确定相册存储位置
            let storageLocation = '';
            let albums = [];
            
            // 先检查公共相册
            const commonAlbums = JSON.parse(localStorage.getItem('albums') || '[]');
            const commonAlbumIndex = commonAlbums.findIndex(album => album.id.toString() === albumId);
            
            if (commonAlbumIndex !== -1) {
                // 相册在公共相册中
                storageLocation = 'albums';
                albums = commonAlbums;
            } else {
                // 相册在用户相册中
                storageLocation = storageKey;
                albums = JSON.parse(localStorage.getItem(storageKey) || '[]');
            }
            
            // 查找当前相册
            const albumIndex = albums.findIndex(album => album.id.toString() === albumId);
            
            if (albumIndex === -1) {
                showAlert('error', '错误', '相册不存在！');
                return;
            }
            
            // 初始化photos数组（如果不存在）
            if (!albums[albumIndex].photos) {
                albums[albumIndex].photos = [];
            }
            
            // 添加照片
            albums[albumIndex].photos.push(photoData);
            
            // 如果是第一张照片，将其设为封面
            if (albums[albumIndex].photos.length === 1) {
                albums[albumIndex].cover = photoData.src;
            }
            
            // 保存回localStorage
            localStorage.setItem(storageLocation, JSON.stringify(albums));
            
            // 更新当前相册数据
            currentAlbum = albums[albumIndex];
            
            // 更新界面
            updateAlbumInfo();
            renderPhotos();
            
            // 显示成功消息
            showAlert('success', '成功', '照片添加成功！');
        } catch (error) {
            console.error('添加照片时出错：', error);
            showAlert('error', '错误', '添加照片失败，请重试！');
        }
    }
    
    // 打开照片详情
    function openPhotoDetails(photo, index) {
        if (!viewPhotoModal || !viewPhotoImg || !viewPhotoTitle || !viewPhotoDate || !viewPhotoDescription) return;
        
        // 保存当前选中的照片索引
        selectedPhotoIndex = index;
        
        // 设置照片信息
        viewPhotoImg.src = photo.src;
        viewPhotoImg.alt = photo.title || '未命名照片';
        viewPhotoTitle.textContent = photo.title || '未命名照片';
        viewPhotoDate.textContent = formatDate(photo.date);
        viewPhotoDescription.textContent = photo.description || '无描述';
        
        // 重置图片变换
        viewPhotoImg.style.transform = 'translate(0, 0) scale(1)';
        
        // 显示模态框
        viewPhotoModal.classList.add('show');
    }
    
    // 编辑照片
    function editPhoto() {
        if (!selectedPhotoData) return;
        
        const newTitle = prompt('请输入新的标题(可选):', selectedPhotoData.title || '');
        if (newTitle === null) return; // 用户取消
        
        const newDescription = prompt('请输入新的描述(可选):', selectedPhotoData.description || '');
        if (newDescription === null) return; // 用户取消
        
        // 更新照片数据
        selectedPhotoData.title = newTitle.trim();
        selectedPhotoData.description = newDescription.trim();
        
        // 更新localStorage
        updatePhotoInAlbum(selectedPhotoData, selectedPhotoIndex);
        
        // 更新当前显示
        viewPhotoTitle.textContent = selectedPhotoData.title || '未命名照片';
        viewPhotoDescription.textContent = selectedPhotoData.description || '暂无描述';
        
        // 刷新照片列表
        renderPhotos();
        
        // 显示成功消息
        showAlert('success', '成功', '照片信息已更新！');
    }
    
    // 删除照片
    function deletePhoto() {
        if (!selectedPhotoData || selectedPhotoIndex === -1) return;
        
        if (!confirm('确定要删除这张照片吗？此操作不可恢复。')) {
            return;
        }
        
        // 从相册中删除照片
        deletePhotoFromAlbum(selectedPhotoIndex);
        
        // 关闭模态框
        viewPhotoModal.classList.remove('show');
        
        // 刷新照片列表
        renderPhotos();
        
        // 显示成功消息
        showAlert('success', '成功', '照片已删除！');
    }
    
    // 更新相册中的照片
    function updatePhotoInAlbum(photoData, index) {
        // 从localStorage获取所有相册
        const albums = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // 查找当前相册
        const albumIndex = albums.findIndex(album => album.id.toString() === albumId);
        
        if (albumIndex === -1 || !albums[albumIndex].photos) {
            return;
        }
        
        // 更新照片
        albums[albumIndex].photos[index] = photoData;
        
        // 保存回localStorage
        localStorage.setItem(storageKey, JSON.stringify(albums));
        
        // 更新当前相册数据
        currentAlbum = albums[albumIndex];
    }
    
    // 从相册中删除照片
    function deletePhotoFromAlbum(index) {
        // 从localStorage获取所有相册
        const albums = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // 查找当前相册
        const albumIndex = albums.findIndex(album => album.id.toString() === albumId);
        
        if (albumIndex === -1 || !albums[albumIndex].photos) {
            return;
        }
        
        // 获取要删除的照片
        const photoToDelete = albums[albumIndex].photos[index];
        
        // 删除照片
        albums[albumIndex].photos.splice(index, 1);
        
        // 如果删除的是封面照片且还有其他照片，更新封面
        if (photoToDelete && photoToDelete.src === albums[albumIndex].cover && albums[albumIndex].photos.length > 0) {
            albums[albumIndex].cover = albums[albumIndex].photos[0].src;
        } else if (albums[albumIndex].photos.length === 0) {
            // 如果没有照片了，恢复默认封面
            albums[albumIndex].cover = 'images/default-album.jpg';
        }
        
        // 保存回localStorage
        localStorage.setItem(storageKey, JSON.stringify(albums));
        
        // 更新当前相册数据
        currentAlbum = albums[albumIndex];
        
        // 更新相册信息
        updateAlbumInfo();
    }
    
    // 打开重命名相册模态框
    function openRenameModal() {
        // 隐藏编辑相册模态框
        editAlbumModal.classList.remove('show');
        
        // 设置当前相册名称
        newAlbumNameInput.value = currentAlbum.name;
        
        // 显示重命名模态框
        renameAlbumModal.classList.add('show');
    }
    
    // 确认重命名相册
    function confirmRenameAlbum() {
        const newName = newAlbumNameInput.value.trim();
        
        if (!newName) {
            showAlert('error', '提示', '请输入相册名称！');
            return;
        }
        
        // 从localStorage获取所有相册
        const albums = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // 查找当前相册
        const albumIndex = albums.findIndex(album => album.id.toString() === albumId);
        
        if (albumIndex === -1) {
            showAlert('error', '错误', '相册不存在！');
            return;
        }
        
        // 检查是否有同名相册（排除当前相册）
        const hasSameNameAlbum = albums.some((album, index) => 
            index !== albumIndex && album.name === newName
        );
        
        if (hasSameNameAlbum) {
            showAlert('error', '提示', '已存在同名相册，请使用其他名称！');
            return;
        }
        
        // 更新相册名称
        albums[albumIndex].name = newName;
        
        // 保存回localStorage
        localStorage.setItem(storageKey, JSON.stringify(albums));
        
        // 更新当前相册数据
        currentAlbum = albums[albumIndex];
        
        // 更新页面标题
        document.title = `${currentAlbum.name} - 甜蜜空间`;
        
        // 更新相册信息
        updateAlbumInfo();
        
        // 关闭模态框
        renameAlbumModal.classList.remove('show');
        
        // 显示成功消息
        showAlert('success', '成功', '相册重命名成功！');
    }
    
    // 打开更换封面模态框
    function openChangeCoverModal() {
        // 隐藏编辑相册模态框
        editAlbumModal.classList.remove('show');
        
        // 重置封面选择状态
        resetCoverSelection();
        
        // 加载相册照片
        loadCoverSelectionGrid();
        
        // 显示更换封面模态框
        changeCoverModal.classList.add('show');
    }
    
    // 加载封面选择网格
    function loadCoverSelectionGrid() {
        if (!coverSelectionGrid) return;
        
        // 清空网格
        coverSelectionGrid.innerHTML = '';
        
        // 如果没有照片，显示提示
        if (!currentAlbum.photos || currentAlbum.photos.length === 0) {
            const emptyTip = document.createElement('div');
            emptyTip.className = 'empty-tip';
            emptyTip.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 15px;
                color: rgba(255, 255, 255, 0.5);
                font-style: italic;
            `;
            emptyTip.textContent = '相册中没有照片，请先添加照片';
            coverSelectionGrid.appendChild(emptyTip);
            return;
        }
        
        // 添加照片选项
        currentAlbum.photos.forEach(photo => {
            const coverOption = document.createElement('div');
            coverOption.className = 'cover-option';
            coverOption.dataset.id = photo.id;
            
            // 如果是当前封面，添加选中状态
            if (photo.src === currentAlbum.cover) {
                coverOption.classList.add('selected');
                selectedCoverPhotoId = photo.id;
            }
            
            coverOption.innerHTML = `<img src="${photo.src}" alt="${photo.title}">`;
            
            // 点击选择封面
            coverOption.addEventListener('click', () => {
                // 移除所有选中状态
                document.querySelectorAll('.cover-option').forEach(option => {
                    option.classList.remove('selected');
                });
                
                // 添加选中状态
                coverOption.classList.add('selected');
                
                // 记录选中的照片ID
                selectedCoverPhotoId = photo.id;
                
                // 清除上传的封面图片
                newCoverImageData = null;
                
                // 重置上传区域
                uploadPlaceholder.style.display = 'flex';
                coverPreviewContainer.style.display = 'none';
            });
            
            coverSelectionGrid.appendChild(coverOption);
        });
    }
    
    // 处理封面图片上传变化
    function handleCoverInputChange(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // 保存图片数据
                newCoverImageData = e.target.result;
                
                // 显示预览
                coverPreviewImg.src = newCoverImageData;
                coverPreviewContainer.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                
                // 清除选中的照片
                document.querySelectorAll('.cover-option').forEach(option => {
                    option.classList.remove('selected');
                });
                selectedCoverPhotoId = null;
            };
            
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    
    // 重置封面选择状态
    function resetCoverSelection() {
        newCoverImageData = null;
        selectedCoverPhotoId = null;
        
        if (uploadPlaceholder && coverPreviewContainer) {
            uploadPlaceholder.style.display = 'flex';
            coverPreviewContainer.style.display = 'none';
        }
        
        if (newCoverInput) {
            newCoverInput.value = '';
        }
    }
    
    // 确认更换封面
    function confirmChangeCoverFunction() {
        // 检查是否有选择封面
        if (!newCoverImageData && !selectedCoverPhotoId) {
            showAlert('error', '提示', '请选择一张照片作为封面或上传新的封面图片！');
            return;
        }
        
        // 从localStorage获取所有相册
        const albums = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // 查找当前相册
        const albumIndex = albums.findIndex(album => album.id.toString() === albumId);
        
        if (albumIndex === -1) {
            showAlert('error', '错误', '相册不存在！');
            return;
        }
        
        // 更新封面
        if (newCoverImageData) {
            // 使用上传的图片作为封面
            albums[albumIndex].cover = newCoverImageData;
        } else if (selectedCoverPhotoId) {
            // 使用选中的照片作为封面
            const selectedPhoto = currentAlbum.photos.find(photo => photo.id.toString() === selectedCoverPhotoId.toString());
            if (selectedPhoto) {
                albums[albumIndex].cover = selectedPhoto.src;
            }
        }
        
        // 保存回localStorage
        localStorage.setItem(storageKey, JSON.stringify(albums));
        
        // 更新当前相册数据
        currentAlbum = albums[albumIndex];
        
        // 关闭模态框
        changeCoverModal.classList.remove('show');
        
        // 重置封面选择状态
        resetCoverSelection();
        
        // 显示成功消息
        showAlert('success', '成功', '相册封面更换成功！');
    }
    
    // 打开编辑描述模态框
    function openEditDescriptionModal() {
        // 隐藏编辑相册模态框
        editAlbumModal.classList.remove('show');
        
        // 设置当前描述
        albumDescriptionInput.value = currentAlbum.description || '';
        
        // 显示编辑描述模态框
        editDescriptionModal.classList.add('show');
    }
    
    // 确认编辑描述
    function confirmEditDescription() {
        const newDescription = albumDescriptionInput.value.trim();
        
        // 从localStorage获取所有相册
        const albums = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // 查找当前相册
        const albumIndex = albums.findIndex(album => album.id.toString() === albumId);
        
        if (albumIndex === -1) {
            showAlert('error', '错误', '相册不存在！');
            return;
        }
        
        // 更新描述
        albums[albumIndex].description = newDescription;
        
        // 保存回localStorage
        localStorage.setItem(storageKey, JSON.stringify(albums));
        
        // 更新当前相册数据
        currentAlbum = albums[albumIndex];
        
        // 关闭模态框
        editDescriptionModal.classList.remove('show');
        
        // 显示成功消息
        showAlert('success', '成功', '相册描述修改成功！');
    }
    
    // 打开删除相册确认模态框
    function openDeleteAlbumModal() {
        // 隐藏编辑相册模态框
        editAlbumModal.classList.remove('show');
        
        // 显示删除确认模态框
        deleteAlbumModal.classList.add('show');
    }
    
    // 确认删除相册
    function confirmDeleteAlbum() {
        try {
            // 确定相册存储位置
            let storageLocation = '';
            let albums = [];
            
            // 先检查公共相册
            const commonAlbums = JSON.parse(localStorage.getItem('albums') || '[]');
            const commonAlbumIndex = commonAlbums.findIndex(album => album.id.toString() === albumId);
            
            if (commonAlbumIndex !== -1) {
                // 相册在公共相册中
                storageLocation = 'albums';
                albums = commonAlbums;
                albumIndex = commonAlbumIndex;
            } else {
                // 相册在用户相册中
                storageLocation = storageKey;
                albums = JSON.parse(localStorage.getItem(storageKey) || '[]');
                albumIndex = albums.findIndex(album => album.id.toString() === albumId);
            }
            
            // 如果没找到相册
            if (albumIndex === -1) {
                showAlert('error', '错误', '相册不存在！');
                return;
            }
            
            // 删除相册
            albums.splice(albumIndex, 1);
            
            // 保存回localStorage
            localStorage.setItem(storageLocation, JSON.stringify(albums));
            
            // 关闭模态框
            deleteAlbumModal.classList.remove('show');
            
            // 显示成功消息并跳转
            showAlert('success', '成功', '相册已删除！', function() {
                window.location.href = 'home.html';
            });
        } catch (error) {
            console.error('删除相册时出错：', error);
            showAlert('error', '错误', '删除相册失败，请重试！');
        }
    }
    
    // 格式化日期为中文格式
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
    
    // 显示提示弹窗
    function showAlert(type, title, message, callback) {
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
        
        // 设置确认按钮点击事件
        if (callback && typeof callback === 'function') {
            alertConfirmBtn.onclick = function() {
                alertModal.classList.remove('show');
                callback();
            };
        } else {
            alertConfirmBtn.onclick = function() {
                alertModal.classList.remove('show');
            };
        }
        
        // 显示弹窗
        alertModal.classList.add('show');
    }
    
    // 进入批量管理模式
    function enterManageMode() {
        isManageMode = true;
        batchManageBtn.style.display = 'none';
        exitManageBtn.style.display = 'flex';
        
        // 更新照片卡片，添加晃动效果和删除按钮
        const photoCards = document.querySelectorAll('.photo-card');
        photoCards.forEach(card => {
            card.classList.add('manage-mode');
        });
        
        // 隐藏添加照片卡片
        const addPhotoCard = document.querySelector('.add-photo-card');
        if (addPhotoCard) {
            addPhotoCard.style.display = 'none';
        }
    }
    
    // 退出批量管理模式
    function exitManageMode() {
        isManageMode = false;
        batchManageBtn.style.display = 'flex';
        exitManageBtn.style.display = 'none';
        
        // 移除照片卡片的晃动效果和删除按钮
        const photoCards = document.querySelectorAll('.photo-card');
        photoCards.forEach(card => {
            card.classList.remove('manage-mode');
        });
        
        // 显示添加照片卡片
        const addPhotoCard = document.querySelector('.add-photo-card');
        if (addPhotoCard) {
            addPhotoCard.style.display = 'flex';
        }
    }
    
    // 初始化照片查看器
    function initPhotoViewer() {
        // 获取元素
        const viewerImg = document.getElementById('viewPhotoImg');
        const prevBtn = document.getElementById('prevPhotoBtn');
        const nextBtn = document.getElementById('nextPhotoBtn');
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const resetZoomBtn = document.getElementById('resetZoomBtn');
        const boundaryToast = document.getElementById('boundaryToast');
        const toastMessage = document.getElementById('toastMessage');
        
        // 图片查看状态
        let currentScale = 1;
        let translateX = 0;
        let translateY = 0;
        let isDragging = false;
        let startX, startY;
        
        // 重置图片变换
        function resetImageTransform() {
            currentScale = 1;
            translateX = 0;
            translateY = 0;
            updateImageTransform();
        }
        
        // 更新图片变换
        function updateImageTransform() {
            viewerImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        }
        
        // 放大按钮事件
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                currentScale = Math.min(currentScale * 1.2, 5);
                updateImageTransform();
            });
        }
        
        // 缩小按钮事件
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                currentScale = Math.max(currentScale / 1.2, 0.5);
                updateImageTransform();
            });
        }
        
        // 重置按钮事件
        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', resetImageTransform);
        }
        
        // 拖动功能
        if (viewerImg) {
            viewerImg.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                viewerImg.style.cursor = 'grabbing';
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateImageTransform();
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
                if (viewerImg) {
                    viewerImg.style.cursor = 'move';
                }
            });
            
            // 鼠标滚轮缩放
            viewerImg.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY;
                if (delta < 0) {
                    currentScale = Math.min(currentScale * 1.1, 5);
                } else {
                    currentScale = Math.max(currentScale / 1.1, 0.5);
                }
                updateImageTransform();
            });
        }
        
        // 上一张按钮事件
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const sortedPhotos = [...currentAlbum.photos].sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });
                
                if (selectedPhotoIndex > 0) {
                    selectedPhotoIndex--;
                    openPhotoDetails(sortedPhotos[selectedPhotoIndex], selectedPhotoIndex);
                    resetImageTransform();
                } else {
                    // 已经是第一张照片，显示提示
                    showToast('已经是第一张照片了');
                }
            });
        }
        
        // 下一张按钮事件
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const sortedPhotos = [...currentAlbum.photos].sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });
                
                if (selectedPhotoIndex < sortedPhotos.length - 1) {
                    selectedPhotoIndex++;
                    openPhotoDetails(sortedPhotos[selectedPhotoIndex], selectedPhotoIndex);
                    resetImageTransform();
                } else {
                    // 已经是最后一张照片，显示提示
                    showToast('已经是最后一张照片了');
                }
            });
        }
        
        // 键盘方向键支持
        document.addEventListener('keydown', (e) => {
            if (!viewPhotoModal.classList.contains('show')) return;
            
            if (e.key === 'ArrowLeft') {
                // 左方向键 - 上一张
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                // 右方向键 - 下一张
                nextBtn.click();
            } else if (e.key === 'Escape') {
                // ESC键 - 关闭查看器
                closeViewPhotoModal.click();
            } else if (e.key === '+' || e.key === '=') {
                // + 键放大
                zoomInBtn.click();
            } else if (e.key === '-') {
                // - 键缩小
                zoomOutBtn.click();
            } else if (e.key === '0') {
                // 0 键重置
                resetZoomBtn.click();
            }
        });
        
        // 显示提示函数
        function showToast(message) {
            if (!boundaryToast || !toastMessage) return;
            
            toastMessage.textContent = message;
            boundaryToast.classList.add('show');
            
            // 3秒后自动隐藏
            setTimeout(() => {
                boundaryToast.classList.remove('show');
            }, 3000);
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
        document.querySelectorAll('.album-header, .photos-container, .photo-card, .modal-content').forEach(card => {
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
        document.querySelectorAll('.album-header, .photos-container, .photo-card, .modal-content').forEach(card => {
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
                
                @keyframes heartPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // 添加心形动画
        const footerHeart = document.querySelector('.main-footer .animated-heart');
        if (footerHeart) {
            footerHeart.style.animation = 'heartPulse 0.8s infinite';
        }
    }
}); 
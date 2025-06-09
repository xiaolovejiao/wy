// 音乐播放器功能
class MusicPlayer {
    constructor() {
        // 确保只初始化一次
        if (window.musicPlayerInstance) {
            return window.musicPlayerInstance;
        }
        
        this.musicPlayerIcon = document.getElementById('musicPlayerIcon');
        this.musicPlayerModal = document.getElementById('musicPlayerModal');
        this.closePlayerBtn = document.getElementById('closePlayerBtn');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.musicTitle = document.getElementById('musicTitle');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        this.progressBar = document.querySelector('.music-progress-bar');
        this.progressContainer = document.querySelector('.music-progress');
        
        // 音量控制相关
        this.volumeBtn = document.getElementById('volumeBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeContainer = document.getElementById('volumeContainer');
        
        // 保存实例到全局
        window.musicPlayerInstance = this;
        
        // 播放模式相关
        this.playModeBtn = document.getElementById('playModeBtn');
        this.loopModeBtn = document.getElementById('loopModeBtn');
        this.playMode = 'random'; // 默认为随机播放
        this.loopMode = 'all'; // 默认为全部循环
        
        this.audio = null;
        this.isPlaying = false;
        this.currentSongIndex = 0;
        this.autoplayAttempted = false;
        
        // 音乐搜索相关
        this.searchInput = document.getElementById('musicSearchInput');
        this.musicListContainer = document.getElementById('musicListContainer');
        this.addMusicBtn = document.getElementById('addMusicBtn');
        this.musicFileInput = document.getElementById('musicFileInput');
        this.refreshMusicBtn = document.getElementById('refreshMusicBtn');
        
        // 音乐列表
        this.songs = [];
        this.filteredSongs = [];
        
        // 初始化播放器
        this.initAudio();
        this.loadSongsFromDefaultFolder();
        this.initializePlayer();
        
        // 尝试自动播放 - 使用用户交互事件
        this.setupAutoplay();
    }

    initializePlayer() {
        // 先移除之前可能存在的事件监听，避免重复绑定
        this.removeEventListeners();
        
        // 绑定事件监听
        if (this.musicPlayerIcon) {
            this.musicPlayerIcon.addEventListener('click', this.togglePlayer.bind(this));
        }
        
        if (this.closePlayerBtn) {
            this.closePlayerBtn.addEventListener('click', this.togglePlayer.bind(this));
        }
        
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', this.togglePlayPause.bind(this));
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', this.playPrev.bind(this));
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', this.playNext.bind(this));
        }
        
        // 音量控制事件
        if (this.volumeBtn) {
            this.volumeBtn.addEventListener('click', this.toggleVolumeControl.bind(this));
        }
        
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', this.changeVolume.bind(this));
            // 设置初始音量值
            this.volumeSlider.value = this.audio ? this.audio.volume * 100 : 80;
        }
        
        // 点击页面其他地方隐藏音量控制
        document.addEventListener('click', (e) => {
            if (this.volumeContainer && this.volumeContainer.classList.contains('show') &&
                !this.volumeContainer.contains(e.target) && e.target !== this.volumeBtn) {
                this.volumeContainer.classList.remove('show');
            }
        });
        
        if (this.progressContainer) {
            this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        }
        
        // 删除确认弹窗相关
        this.confirmDeleteModal = document.getElementById('confirmDeleteMusicModal');
        this.cancelDeleteBtn = document.getElementById('cancelDeleteMusicBtn');
        this.confirmDeleteBtn = document.getElementById('confirmDeleteMusicBtn');
        
        if (this.cancelDeleteBtn) {
            this.cancelDeleteBtn.addEventListener('click', this.hideDeleteConfirmModal.bind(this));
        }
        
        if (this.confirmDeleteBtn) {
            this.confirmDeleteBtn.addEventListener('click', this.confirmDelete.bind(this));
        }
        
        // 点击弹窗外部可关闭弹窗
        if (this.confirmDeleteModal) {
            this.confirmDeleteModal.addEventListener('click', (e) => {
                if (e.target === this.confirmDeleteModal) {
                    this.hideDeleteConfirmModal();
                }
            });
        }
        
        // 播放模式切换
        if (this.playModeBtn) {
            this.playModeBtn.addEventListener('click', this.togglePlayMode.bind(this));
            this.updatePlayModeDisplay();
        }
        
        // 循环模式切换
        if (this.loopModeBtn) {
            this.loopModeBtn.addEventListener('click', this.toggleLoopMode.bind(this));
            this.updateLoopModeDisplay();
        }
        
        // 搜索功能
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.searchMusic.bind(this));
        }
        
        // 添加音乐功能
        if (this.addMusicBtn && this.musicFileInput) {
            this.addMusicBtn.addEventListener('click', () => this.musicFileInput.click());
            this.musicFileInput.addEventListener('change', (e) => this.handleMusicUpload(e));
        }
        
        // 刷新音乐列表功能
        if (this.refreshMusicBtn) {
            this.refreshMusicBtn.addEventListener('click', this.refreshMusicList.bind(this));
        }

        // 监听主题变化
        document.addEventListener('themeChanged', (e) => this.handleThemeChange(e));

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // 渲染音乐列表
        this.renderMusicList();
        
        // 更新歌曲总数显示
        this.updateSongCount();
        
        console.log('音乐播放器事件已初始化');
    }

    // 添加一个方法移除事件监听器，避免重复绑定
    removeEventListeners() {
        // 由于我们使用了匿名函数，无法直接移除特定监听器
        // 这里主要是记录逻辑，实际上不会执行移除操作
        console.log('准备重新绑定音乐播放器事件');
    }

    initAudio() {
        if (!this.audio) {
            this.audio = new Audio();
            
            // 增加音量渐入效果
            this.audio.volume = 0.8; // 初始音量
            
            // 加载保存的音量设置
            this.loadVolumeSettings();
            
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            this.audio.addEventListener('ended', () => this.handleSongEnd());
            this.audio.addEventListener('loadedmetadata', () => {
                this.totalTime.textContent = this.formatTime(this.audio.duration);
            });
            this.audio.addEventListener('error', (e) => {
                console.error('音频加载错误:', e);
                this.showNotification('音频加载失败，将播放下一首');
                setTimeout(() => {
                    this.playNext();
                }, 1000);
            });
            
            // 添加autoplay失败的处理
            this.audio.addEventListener('play', () => {
                this.isPlaying = true;
                this.playPauseBtn.textContent = '⏸';
                this.updateIconAnimation();
                this.updatePlayButtonsState();
            });
            
            // 监听音频播放状态
            this.audio.addEventListener('playing', () => {
                console.log('音频开始播放');
                this.isPlaying = true;
                this.updatePlayButtonsState();
                
                // 音量渐入
                if (this.audio.volume < 0.8) {
                    this.fadeInVolume();
                }
            });
        }
    }

    togglePlayer() {
        console.log('切换音乐播放器显示状态', this.musicPlayerModal);
        if (this.musicPlayerModal) {
            this.musicPlayerModal.classList.toggle('show');
        }
    }

    togglePlayPause() {
        if (this.songs.length === 0) {
            this.showNotification('播放列表为空，请添加音乐');
            return;
        }
        
        if (!this.audio || !this.audio.src) {
            this.loadSong(this.currentSongIndex);
        }
        
        if (this.isPlaying) {
            this.audio.pause();
            this.playPauseBtn.textContent = '▶';
        } else {
            this.audio.play().catch(error => {
                console.error('播放失败:', error);
                this.showNotification('播放失败，请重试');
            });
            this.playPauseBtn.textContent = '⏸';
        }
        this.isPlaying = !this.isPlaying;
        this.updateIconAnimation();
        this.updatePlayButtonsState();
        this.savePlaybackState();
    }

    loadSong(index) {
        if (this.songs.length === 0) return;
        
        this.currentSongIndex = index;
        const song = this.songs[index];
        
        try {
            this.audio.src = song.url;
            this.musicTitle.textContent = song.title;
            
            // 高亮当前播放的歌曲
            this.highlightCurrentSong();
            
            if (this.isPlaying) {
                this.audio.play().catch(error => {
                    console.error('播放失败:', error);
                    this.showNotification('播放失败，请重试');
                });
            }
            
            this.savePlaybackState();
        } catch (error) {
            console.error('加载歌曲失败:', error);
            this.showNotification('加载歌曲失败');
        }
    }

    playNext() {
        if (this.songs.length === 0) return;
        
        let nextIndex;
        
        switch (this.playMode) {
            case 'random':
                // 随机播放
                nextIndex = Math.floor(Math.random() * this.songs.length);
                // 避免连续播放同一首歌
                if (this.songs.length > 1) {
                    while (nextIndex === this.currentSongIndex) {
                        nextIndex = Math.floor(Math.random() * this.songs.length);
                    }
                }
                break;
            case 'single':
                // 单曲循环，重新播放当前歌曲
                nextIndex = this.currentSongIndex;
                break;
            case 'sequence':
            case 'loop':
            default:
                // 顺序播放或循环播放，播放下一首
                nextIndex = (this.currentSongIndex + 1) % this.songs.length;
                break;
        }
        
        this.loadSong(nextIndex);
    }

    playPrev() {
        if (this.songs.length === 0) return;
        
        let prevIndex;
        
        switch (this.playMode) {
            case 'random':
                // 随机播放
                prevIndex = Math.floor(Math.random() * this.songs.length);
                // 避免连续播放同一首歌
                if (this.songs.length > 1) {
                    while (prevIndex === this.currentSongIndex) {
                        prevIndex = Math.floor(Math.random() * this.songs.length);
                    }
                }
                break;
            case 'single':
                // 单曲循环，重新播放当前歌曲
                prevIndex = this.currentSongIndex;
                break;
            case 'sequence':
            case 'loop':
            default:
                // 顺序播放或循环播放，播放上一首
                prevIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
                break;
        }
        
        this.loadSong(prevIndex);
    }

    handleSongEnd() {
        if (this.loopMode === 'single') {
            // 单曲循环，重新播放当前歌曲
            this.audio.currentTime = 0;
            this.audio.play().catch(error => {
                console.error('播放失败:', error);
            });
        } else if (this.loopMode === 'none' && this.currentSongIndex === this.songs.length - 1) {
            // 不循环且是最后一首，停止播放
            this.isPlaying = false;
            this.playPauseBtn.textContent = '▶';
            this.updateIconAnimation();
            this.updatePlayButtonsState();
        } else {
            // 全部循环或者还没到最后一首，播放下一首
            this.playNext();
        }
    }

    togglePlayMode() {
        // 切换播放模式: 顺序播放 -> 随机播放 -> 顺序播放
        this.playMode = this.playMode === 'sequence' ? 'random' : 'sequence';
        
        this.updatePlayModeDisplay();
        this.savePlaybackState();
        
        // 显示提示
        const modeTexts = {
            'sequence': '顺序播放',
            'random': '随机播放'
        };
        this.showNotification(`已切换为${modeTexts[this.playMode]}`);
    }

    toggleLoopMode() {
        // 切换循环模式: 不循环 -> 单曲循环 -> 全部循环 -> 不循环
        switch (this.loopMode) {
            case 'none':
                this.loopMode = 'single';
                break;
            case 'single':
                this.loopMode = 'all';
                break;
            case 'all':
            default:
                this.loopMode = 'none';
                break;
        }
        
        this.updateLoopModeDisplay();
        this.savePlaybackState();
        
        // 显示提示
        const modeTexts = {
            'none': '不循环',
            'single': '单曲循环',
            'all': '全部循环'
        };
        this.showNotification(`已切换为${modeTexts[this.loopMode]}`);
    }

    updatePlayModeDisplay() {
        if (!this.playModeBtn) return;
        
        // 更新播放模式按钮显示
        switch (this.playMode) {
            case 'random':
                this.playModeBtn.textContent = '🔀';
                this.playModeBtn.title = '随机播放';
                break;
            case 'sequence':
            default:
                this.playModeBtn.textContent = '↕️';
                this.playModeBtn.title = '顺序播放';
                break;
        }
    }

    updateLoopModeDisplay() {
        if (!this.loopModeBtn) return;
        
        // 更新循环模式按钮显示
        switch (this.loopMode) {
            case 'single':
                this.loopModeBtn.textContent = '🔂';
                this.loopModeBtn.title = '单曲循环';
                break;
            case 'all':
                this.loopModeBtn.textContent = '🔁';
                this.loopModeBtn.title = '全部循环';
                break;
            case 'none':
            default:
                this.loopModeBtn.textContent = '➡️';
                this.loopModeBtn.title = '不循环';
                break;
        }
    }

    updateProgress() {
        if (!this.audio || !this.audio.duration) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentTime.textContent = this.formatTime(this.audio.currentTime);
    }

    setProgress(e) {
        if (!this.audio || !this.audio.duration) return;
        
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateIconAnimation() {
        const icon = this.musicPlayerIcon.querySelector('i');
        if (this.isPlaying) {
            icon.style.animation = 'musicNote 1s infinite';
        } else {
            icon.style.animation = 'none';
        }
    }

    handleThemeChange(e) {
        const theme = e.detail.theme;
        if (theme === 'cool') {
            this.progressBar.style.background = 'linear-gradient(90deg, #ffd700, #ff6b8b)';
        } else if (theme === 'starry') {
            this.progressBar.style.background = 'linear-gradient(90deg, #4d9aff, #ff6b8b)';
        }
    }

    savePlaybackState() {
        const state = {
            currentSongIndex: this.currentSongIndex,
            isPlaying: this.isPlaying,
            currentTime: this.audio ? this.audio.currentTime : 0,
            playMode: this.playMode,
            loopMode: this.loopMode
        };
        localStorage.setItem('musicPlayerState', JSON.stringify(state));
    }

    loadPlaybackState() {
        const savedState = localStorage.getItem('musicPlayerState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                
                // 加载播放模式
                if (state.playMode) {
                    this.playMode = state.playMode;
                    this.updatePlayModeDisplay();
                }
                
                // 加载循环模式
                if (state.loopMode) {
                    this.loopMode = state.loopMode;
                    this.updateLoopModeDisplay();
                }
                
                // 只有当歌曲列表不为空时才恢复播放状态
                if (this.songs.length > 0) {
                    // 确保索引在有效范围内
                    this.currentSongIndex = Math.min(state.currentSongIndex, this.songs.length - 1);
                    
                    if (state.isPlaying) {
                        this.loadSong(this.currentSongIndex);
                        if (this.audio) {
                            this.audio.currentTime = state.currentTime || 0;
                            // 尝试自动播放
                            this.togglePlayPause();
                        }
                    }
                }
            } catch (error) {
                console.error('加载播放状态失败:', error);
            }
        }
    }

    // 音乐列表管理功能
    loadSongsFromStorage() {
        try {
            // 每次都直接从默认音乐文件夹加载最新列表
            this.loadSongsFromDefaultFolder();
            console.log('成功从默认文件夹加载音乐列表');
        } catch (error) {
            console.error('加载音乐列表失败:', error);
            this.songs = [];
            this.filteredSongs = [];
        }
    }

    saveSongsToStorage() {
        try {
            localStorage.setItem('musicList', JSON.stringify(this.songs));
            console.log('音乐列表已保存到本地存储');
        } catch (error) {
            console.error('保存音乐列表失败:', error);
        }
    }

    renderMusicList() {
        if (!this.musicListContainer) return;
        
        this.musicListContainer.innerHTML = '';
        
        if (this.filteredSongs.length === 0) {
            const emptyTip = document.createElement('div');
            emptyTip.className = 'empty-music-tip';
            emptyTip.textContent = this.searchInput && this.searchInput.value 
                ? '没有找到匹配的音乐' 
                : '播放列表为空';
            this.musicListContainer.appendChild(emptyTip);
            return;
        }
        
        this.filteredSongs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'music-item';
            const isCurrentSong = this.songs.indexOf(song) === this.currentSongIndex;
            if (isCurrentSong && this.isPlaying) {
                songItem.classList.add('playing');
            }
            
            // 添加来源标识
            const sourceIcon = song.isLocalUpload ? 
                '<span class="music-source local" title="本地上传">💻</span>' : 
                '<span class="music-source cloud" title="云端音乐">☁️</span>';
            
            songItem.innerHTML = `
                <div class="music-item-info">
                    <div class="music-item-title">${song.title} ${sourceIcon}</div>
                    <div class="music-item-artist">${song.artist}</div>
                </div>
                <div class="music-item-actions">
                    <button class="music-action-btn play-btn" title="播放">${
                        isCurrentSong && this.isPlaying ? '⏸' : '▶'
                    }</button>
                    <button class="music-action-btn delete-btn" title="从列表中移除">🗑️</button>
                </div>
            `;
            
            // 播放按钮
            const playBtn = songItem.querySelector('.play-btn');
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const songIndex = this.songs.indexOf(song);
                if (this.currentSongIndex === songIndex && this.isPlaying) {
                    this.togglePlayPause();
                } else {
                    this.currentSongIndex = songIndex;
                    this.loadSong(this.currentSongIndex);
                    if (!this.isPlaying) {
                        this.togglePlayPause();
                    }
                }
            });
            
            // 删除按钮
            const deleteBtn = songItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showDeleteConfirmModal(song.id);
            });
            
            // 点击歌曲项播放
            songItem.addEventListener('click', () => {
                const songIndex = this.songs.indexOf(song);
                if (this.currentSongIndex !== songIndex) {
                    this.currentSongIndex = songIndex;
                    this.loadSong(this.currentSongIndex);
                    if (!this.isPlaying) {
                        this.togglePlayPause();
                    }
                }
            });
            
            this.musicListContainer.appendChild(songItem);
        });
    }

    highlightCurrentSong() {
        if (!this.musicListContainer) return;
        
        // 移除所有高亮
        const items = this.musicListContainer.querySelectorAll('.music-item');
        items.forEach(item => item.classList.remove('playing'));
        
        // 找到当前播放的歌曲并高亮
        const currentSongIndex = this.songs.indexOf(this.songs[this.currentSongIndex]);
        const filteredIndex = this.filteredSongs.indexOf(this.songs[this.currentSongIndex]);
        
        if (filteredIndex !== -1 && items[filteredIndex]) {
            items[filteredIndex].classList.add('playing');
            // 更新播放按钮
            const playBtn = items[filteredIndex].querySelector('.play-btn');
            if (playBtn) {
                playBtn.textContent = this.isPlaying ? '⏸' : '▶';
            }
        }
    }

    searchMusic() {
        if (!this.searchInput) return;
        
        const query = this.searchInput.value.toLowerCase();
        
        if (!query) {
            this.filteredSongs = [...this.songs];
        } else {
            this.filteredSongs = this.songs.filter(song => 
                song.title.toLowerCase().includes(query)
            );
        }
        
        this.renderMusicList();
    }

    handleMusicUpload(e) {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // 检查是否是音频文件
            if (!file.type.startsWith('audio/')) {
                this.showNotification(`${file.name} 不是音频文件`);
                continue;
            }
            
            // 使用URL.createObjectURL创建临时URL
            const url = URL.createObjectURL(file);
            
            // 提取文件名作为歌曲标题（移除扩展名）
            let title = file.name.replace(/\.[^/.]+$/, "");
            let artist = '本地上传';
            
            // 尝试分离艺术家和标题
            if (title.includes(' - ')) {
                const parts = title.split(' - ');
                artist = parts[0];
                title = parts[1];
            }
            
            // 创建新歌曲对象
            const newSong = {
                id: Date.now() + Math.floor(Math.random() * 1000),
                title: title,
                artist: artist,
                url: url,
                isLocalUpload: true // 标记为本地上传
            };
            
            // 添加到歌曲列表
            this.songs.push(newSong);
            
            // 显示提示
            this.showNotification(`已添加: ${title}`);
        }
        
        // 保存到本地存储
        this.saveSongsToStorage();
        
        // 更新过滤后的歌曲列表
        this.filteredSongs = [...this.songs];
        
        // 更新歌曲总数显示
        this.updateSongCount();
        
        // 重新渲染歌曲列表
        this.renderMusicList();
        
        // 重置文件输入
        this.musicFileInput.value = '';
    }

    // 显示删除确认弹窗
    showDeleteConfirmModal(songId) {
        this.songToDelete = songId;
        this.confirmDeleteModal.classList.add('show');
    }

    // 隐藏删除确认弹窗
    hideDeleteConfirmModal() {
        this.confirmDeleteModal.classList.remove('show');
        this.songToDelete = null;
    }

    // 确认删除
    confirmDelete() {
        if (this.songToDelete !== null) {
            this.performDelete(this.songToDelete);
            this.hideDeleteConfirmModal();
        }
    }

    // 执行删除操作
    performDelete(songId) {
        // 查找要删除的歌曲索引
        const songIndex = this.songs.findIndex(song => song.id === songId);
        if (songIndex === -1) return;
        
        const song = this.songs[songIndex];
        
        // 如果正在播放要删除的歌曲
        if (this.currentSongIndex === songIndex && this.isPlaying) {
            // 停止播放
            this.audio.pause();
            this.isPlaying = false;
            this.playPauseBtn.textContent = '▶';
            this.updateIconAnimation();
            
            // 如果还有其他歌曲，自动播放下一首
            if (this.songs.length > 1) {
                // 如果删除的是最后一首歌，播放第一首
                if (songIndex === this.songs.length - 1) {
                    this.currentSongIndex = 0;
                }
                // 删除歌曲
                this.songs.splice(songIndex, 1);
                // 加载并播放下一首
                this.loadSong(this.currentSongIndex);
                this.togglePlayPause();
            } else {
                // 如果删除后没有歌曲了
                this.songs.splice(songIndex, 1);
                this.currentSongIndex = 0;
                this.audio.src = '';
                this.musicTitle.textContent = '暂无播放';
            }
        } else {
            // 如果删除的歌曲在当前播放歌曲之前，调整当前索引
            if (this.currentSongIndex > songIndex) {
                this.currentSongIndex -= 1;
            }
            // 删除歌曲
            this.songs.splice(songIndex, 1);
        }
        
        // 保存到本地存储
        this.saveSongsToStorage();
        
        // 更新过滤后的歌曲列表
        if (this.searchInput && this.searchInput.value) {
            this.searchMusic();
        } else {
            this.filteredSongs = [...this.songs];
        }
        
        // 重新渲染歌曲列表
        this.renderMusicList();
        
        // 更新播放按钮状态
        this.updatePlayButtonsState();
        
        // 显示提示
        this.showNotification(`已删除: ${song.title}`);
    }

    updatePlayButtonsState() {
        // 更新所有播放按钮的状态
        const playButtons = document.querySelectorAll('.music-item .play-btn');
        playButtons.forEach((btn, index) => {
            const songIndex = this.songs.indexOf(this.filteredSongs[index]);
            if (songIndex === this.currentSongIndex && this.isPlaying) {
                btn.textContent = '⏸';
            } else {
                btn.textContent = '▶';
            }
        });
    }

    showNotification(message) {
        // 创建或获取通知元素
        let notification = document.getElementById('musicPlayerNotification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'musicPlayerNotification';
            notification.className = 'music-notification';
            document.body.appendChild(notification);
            
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .music-notification {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 20px;
                    font-size: 14px;
                    z-index: 9999;
                    transition: opacity 0.3s, transform 0.3s;
                    opacity: 0;
                    pointer-events: none;
                }
                
                .music-notification.show {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            `;
            document.head.appendChild(style);
        }
        
        // 设置消息
        notification.textContent = message;
        
        // 显示通知
        notification.classList.add('show');
        
        // 3秒后隐藏
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    clearMusicList() {
        // 清除本地存储中的音乐列表
        localStorage.removeItem('musicList');
        localStorage.removeItem('musicPlayerState');
        
        // 重置播放器状态
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
        }
        this.isPlaying = false;
        this.currentSongIndex = 0;
        this.songs = [];
        this.filteredSongs = [];
        
        // 更新界面
        if (this.musicTitle) {
            this.musicTitle.textContent = '暂无播放';
        }
        if (this.playPauseBtn) {
            this.playPauseBtn.textContent = '▶';
        }
        this.updateIconAnimation();
        this.renderMusicList();
    }

    // 修改页面可见性处理方法
    handleVisibilityChange() {
        // 完全移除页面可见性的处理，让音乐持续播放
    }
    
    // 刷新音乐列表（从默认文件夹重新加载）
    refreshMusicList() {
        // 添加旋转动画
        this.refreshMusicBtn.classList.add('spinning');
        
        // 保存当前播放状态
        const wasPlaying = this.isPlaying;
        const currentTime = this.audio ? this.audio.currentTime : 0;
        const currentSongUrl = this.songs[this.currentSongIndex] ? this.songs[this.currentSongIndex].url : null;
        
        // 重新加载音乐列表
        this.loadSongsFromDefaultFolder();
        
        // 如果之前在播放，尝试恢复播放
        if (wasPlaying && currentSongUrl) {
            // 查找相同URL的歌曲
            const songIndex = this.songs.findIndex(song => song.url === currentSongUrl);
            if (songIndex !== -1) {
                this.currentSongIndex = songIndex;
                this.loadSong(this.currentSongIndex);
                if (this.audio) {
                    this.audio.currentTime = currentTime;
                    if (wasPlaying) {
                        this.audio.play().catch(error => {
                            console.error('恢复播放失败:', error);
                        });
                    }
                }
            } else if (this.songs.length > 0) {
                // 如果找不到之前的歌曲，但有其他歌曲，从第一首开始播放
                this.currentSongIndex = 0;
                this.loadSong(0);
                if (wasPlaying) {
                    this.audio.play().catch(error => {
                        console.error('播放失败:', error);
                    });
                }
            }
        }
        
        // 更新UI
        this.renderMusicList();
        this.updatePlayButtonsState();
        this.savePlaybackState();
        
        // 显示提示
        this.showNotification('音乐列表已刷新');
        
        // 移除旋转动画
        setTimeout(() => {
            this.refreshMusicBtn.classList.remove('spinning');
        }, 800);
    }
    
    // 从默认文件夹加载音乐列表
    loadSongsFromDefaultFolder() {
        // 腾讯云存储基础URL
        const cosBaseUrl = 'https://wy-1320748943.cos.ap-guangzhou.myqcloud.com/music/';
        
        // 创建默认的音乐列表，基于文件夹扫描结果
        const musicFiles = [
            "24KGoldn、iann dior - Mood (Explicit).mp3",
            "Against The Current - Legends Never Die.mp3",
            "Avril Lavigne - Girlfriend (Radio Edit).mp3",
            "BEYOND - 光辉岁月.mp3",
            "BEYOND - 喜欢你.mp3",
            "BEYOND - 灰色轨迹.mp3",
            "CHIHIRO - Hyakunen no Koi.mp3",
            "CHIHIRO - やっぱり好き.mp3",
            "Emilia - Big Big World.mp3",
            "G.E.M. 邓紫棋 - 我的秘密.mp3",
            "Justin Timberlake、Carey Mulligan、Stark Sands - Five Hundred Miles.mp3",
            "JW - 漂浮女孩.mp3",
            "jyA-Me - ずっと隣りで… (永远在你身边…).mp3",
            "Taylor Swift - Love Story.mp3",
            "Whitney Houston - I Will Always Love You.mp3",
            "ももちひろこ - and I….mp3",
            "任贤齐 - 伤心太平洋.mp3",
            "任贤齐 - 心太软(1).mp3",
            "任贤齐 - 心太软.mp3",
            "任贤齐 - 我是一只小小鸟.mp3",
            "伍佰 & China Blue - 浪人情歌.mp3",
            "伍思凯 - 特别的爱给特别的你.mp3",
            "何婉盈 - 爱上你是我一生的错.mp3",
            "光良 - 童话.mp3",
            "关淑怡 - 难得有情人.mp3",
            "冷漠、云飞儿 - 这条街.mp3",
            "刘德华 - 假装.mp3",
            "刘若英 - 后来.mp3",
            "刘若英 - 很爱很爱你(1).mp3",
            "刘若英 - 很爱很爱你.mp3",
            "动力火车 - 忠孝东路走九遍.mp3",
            "古巨基 - 劲歌. 金曲2 (情歌王).mp3",
            "叶蒨文 - 情人知己.mp3",
            "叶蒨文 - 珍重.mp3",
            "叶蒨文 - 甜言蜜语.mp3",
            "叶蒨文 - 零时十分.mp3",
            "吕方 - 每段路.mp3",
            "吴婉芳 - 不想再见面.mp3",
            "周传雄 - 我的心太乱.mp3",
            "周华健 - 其实不想走.mp3",
            "周华健 - 孤枕难眠(1).mp3",
            "周华健 - 孤枕难眠.mp3",
            "周华健 - 有没有一首歌会让你想起我.mp3",
            "周华健 - 爱相随.mp3",
            "周华健 - 让我欢喜让我忧.mp3",
            "周华健 - 难念的经.mp3",
            "周启生 - 天长地久.mp3",
            "周影 - 情路茫茫.mp3",
            "周慧敏 - 最爱.mp3",
            "周蕙 - 约定.mp3",
            "塩ノ谷早耶香 - True Love.mp3",
            "姜育恒 - 再回首.mp3",
            "孙燕姿 - 遇见.mp3",
            "山野（李昊瀚） - 如果爱能早些说出来.mp3",
            "廖正军 - 是否我真的一无所有.mp3",
            "张信哲 - 太想爱你.mp3",
            "张信哲 - 过火.mp3",
            "张信哲、刘嘉玲 - 有一点动心.mp3",
            "张卫健 - 把酒狂歌.mp3",
            "张卫健 - 至情至圣.mp3",
            "张国荣 - 倩女幽魂.mp3",
            "张国荣 - 当年情.mp3",
            "张国荣 - 怪你过分美丽.mp3",
            "张国荣 - 这些年来.mp3",
            "张学友 - 祝福.mp3",
            "张学友 - 结束不是我要的结果.mp3",
            "张学友 - 遥远的她.mp3",
            "张学友、郑中基 - 左右为难.mp3",
            "张宇 - 一言难尽.mp3",
            "张宇 - 小小的太阳.mp3",
            "张宇 - 月亮惹的祸.mp3",
            "张宇 - 雨一直下.mp3",
            "张家辉 - 假的希望.mp3",
            "张德兰 - 情义两心坚.mp3",
            "张惠妹 - 听海.mp3",
            "张杰 - 逆战.mp3",
            "张芸京 - 偏爱.mp3",
            "张镐哲 - 再回到从前.mp3",
            "徐良、小凌 - 客官不可以.mp3",
            "新垣結衣 - つないだ手 (紧牵的手).mp3",
            "方丽盈 - 不要走.mp3",
            "李克勤 - 护花使者.mp3",
            "李克勤 - 月半小夜曲.mp3",
            "李克勤 - 红日.mp3",
            "李国祥 - 摘星的晚上.mp3",
            "李圣杰 - 痴心绝对.mp3",
            "李宗盛 - 鬼迷心窍.mp3",
            "李宗盛、林忆莲 - 当爱已成往事.mp3",
            "杜德伟 - 忘情号.mp3",
            "杨采妮 - 不会哭于你面前.mp3",
            "林姗姗 - 连锁反应.mp3",
            "林子祥 - 真的汉子.mp3",
            "林子祥 - 谁能明白我.mp3",
            "林子祥 - 长路漫漫伴你闯.mp3",
            "林宥嘉 - 你是我的眼.mp3",
            "林忆莲 - 伤痕.mp3",
            "梁朝伟 - 偷偷爱你.mp3",
            "梁静茹 - 勇气.mp3",
            "梁静茹 - 可惜不是你.mp3",
            "梁静茹 - 宁夏.mp3",
            "梁静茹 - 情歌.mp3",
            "梅艳芳 - 交出我的心.mp3",
            "梅艳芳 - 似是故人来.mp3",
            "梅艳芳 - 坏女孩.mp3",
            "梅艳芳 - 梦伴.mp3",
            "梅艳芳 - 赤的疑惑.mp3",
            "水木年华 - 在他乡.mp3",
            "汪明荃 - 万水千山总是情.mp3",
            "汪苏泷、BY2 - 有点甜.mp3",
            "瀧川ありさ - Always.mp3",
            "牛奶咖啡 - 越长大越孤单.mp3",
            "王杰 - 安妮.mp3",
            "王杰 - 封锁我一生.mp3",
            "王杰 - 是否我真的一无所有.mp3",
            "王菲 - 人间.mp3",
            "王菲 - 执迷不悔 (国语版).mp3",
            "童安格 - 明天你是否依然爱我.mp3",
            "罗大佑 - 恋曲1990.mp3",
            "胡彦斌 - 男人KTV.mp3",
            "胡杨林 - 香水有毒.mp3",
            "苏芮 - 凭着爱.mp3",
            "范玮琪、张韶涵 - 如果的事.mp3",
            "莫文蔚 - 他不爱我.mp3",
            "莫文蔚 - 忽然之间.mp3",
            "莫文蔚 - 盛夏的果实(1).mp3",
            "莫文蔚 - 盛夏的果实.mp3",
            "萧亚轩 - 最熟悉的陌生人.mp3",
            "蔡兴麟 - 为了你 为了我.mp3",
            "许嵩 - 断桥残雪.mp3",
            "许茹芸 - 独角戏.mp3",
            "谢安琪 - 囍帖街.mp3",
            "谭咏麟 - 一生中最爱.mp3",
            "谭咏麟 - 讲不出再见.mp3",
            "谭咏麟 - 难舍难分.mp3",
            "谷娅溦 - 哭墙.mp3",
            "赵传 - 我很丑，可是我很温柔.mp3",
            "赵传 - 我终于失去了你.mp3",
            "赵传 - 爱要怎么说出口.mp3",
            "邓丽欣 - 电灯胆.mp3",
            "邓瑞霞 - 友谊之光.mp3",
            "那英 - 征服.mp3",
            "邰正宵 - 九百九十九朵玫瑰.mp3",
            "邱绮玲 - 午夜时分.mp3",
            "郑中基 - 无赖.mp3",
            "郑中基 - 爱是最大权利.mp3",
            "郑伊健、陈小春 - 热血燃烧.mp3",
            "郑源 - 包容.mp3",
            "郑秀文 - 唉声叹气.mp3",
            "郑秀文 - 终身美丽.mp3",
            "郭燕 - 下半生 (粤语版).mp3",
            "金莎、林俊杰 - 被风吹过的夏天.mp3",
            "阿杜 - 他一定很爱你.mp3",
            "陈奕迅 - 好久不见.mp3",
            "陈奕迅、王菲 - 因为爱情.flac",
            "陈奕迅、王菲 - 因为爱情.mp3",
            "陈小春 - 算你狠.mp3",
            "陈慧娴 - 千千阕歌(1).mp3",
            "陈慧娴 - 千千阕歌.mp3",
            "陈慧琳 - 记事本.mp3",
            "陈慧琳、郑中基 - 都是你的错.mp3",
            "陈晓东 - 比我幸福.mp3",
            "陈淑桦 - 梦醒时分.mp3",
            "陈雅雯 - 黑街.mp3",
            "陶喆 - 爱，很简单.mp3",
            "青鸟飞鱼 - 此生不换.mp3",
            "饶天亮 - 做你的爱人.mp3",
            "马天宇 - 该死的温柔.mp3",
            "黄凯芹 - 伤感的恋人.mp3",
            "黄凯芹 - 晚秋.mp3",
            "黄品源 - 海浪.mp3",
            "黎姿 - 你是明日意义.mp3",
            "黎姿 - 因你真正活过.mp3",
            "黎姿 - 我只怨自己.mp3",
            "黎明 - 今夜你会不会来.mp3",
            "齐豫、周华健 - 神话情话.mp3"
        ];
        
        // 处理歌曲信息，创建歌曲对象
        const defaultSongs = musicFiles.map((file, index) => {
            // 从文件名中提取歌曲标题和艺术家
            let title = file.replace('.mp3', '').replace('.flac', '');
            let artist = '';
            
            // 尝试分离艺术家和标题
            if (title.includes(' - ')) {
                const parts = title.split(' - ');
                artist = parts[0];
                title = parts[1];
            }
            
            // 使用腾讯云存储URL
            // 对URL进行编码，处理特殊字符
            const encodedFileName = encodeURIComponent(file);
            
            return {
                id: index + 1,
                title: title,
                artist: artist,
                url: `${cosBaseUrl}${encodedFileName}`
            };
        });
        
        // 加载新的歌曲列表
        this.songs = defaultSongs;
        this.filteredSongs = [...this.songs];
        
        // 更新歌曲总数显示
        this.updateSongCount();
        
        // 保存到本地存储
        this.saveSongsToStorage();
        
        console.log(`已从腾讯云存储加载 ${this.songs.length} 首歌曲`);
    }
    
    // 更新歌曲总数显示
    updateSongCount() {
        const songCountElement = document.getElementById('songCount');
        if (songCountElement) {
            songCountElement.textContent = `共 ${this.songs.length} 首歌曲`;
        }
    }
    
    // 音量控制相关方法
    toggleVolumeControl() {
        if (this.volumeContainer) {
            this.volumeContainer.classList.toggle('show');
        }
    }
    
    changeVolume(e) {
        if (!this.audio) return;
        
        const volume = e.target.value / 100;
        this.audio.volume = volume;
        
        // 更新音量图标
        this.updateVolumeIcon(volume);
        
        // 保存音量设置
        localStorage.setItem('musicVolume', volume);
    }
    
    updateVolumeIcon(volume) {
        if (!this.volumeBtn) return;
        
        if (volume === 0) {
            this.volumeBtn.textContent = '🔇';
        } else if (volume < 0.5) {
            this.volumeBtn.textContent = '🔉';
        } else {
            this.volumeBtn.textContent = '🔊';
        }
    }
    
    // 加载音量设置
    loadVolumeSettings() {
        const savedVolume = localStorage.getItem('musicVolume');
        if (savedVolume !== null && this.audio) {
            const volume = parseFloat(savedVolume);
            this.audio.volume = volume;
            
            if (this.volumeSlider) {
                this.volumeSlider.value = volume * 100;
            }
            
            this.updateVolumeIcon(volume);
        }
    }
    
    // 音量渐入效果
    fadeInVolume() {
        let volume = this.audio.volume;
        const fadeInInterval = setInterval(() => {
            if (volume < 0.8) {
                volume += 0.05;
                this.audio.volume = volume;
            } else {
                clearInterval(fadeInInterval);
            }
        }, 100);
    }
    
    // 设置自动播放
    setupAutoplay() {
        // 创建静音的音频上下文，绕过浏览器自动播放限制
        this.createAudioContext();
        
        // 使用多种方法尝试自动播放
        const attemptAutoplay = () => {
            if (this.autoplayAttempted) return;
            this.autoplayAttempted = true;
            
            if (this.songs.length > 0) {
                // 随机选择一首歌曲
                this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
                this.loadSong(this.currentSongIndex);
                
                // 先静音再播放（绕过某些浏览器的限制）
                const originalVolume = this.audio.volume;
                this.audio.volume = 0;
                this.audio.muted = true;
                
                // 尝试播放
                this.forcePlay().then(() => {
                    console.log('自动播放成功');
                    // 逐渐恢复音量
                    setTimeout(() => {
                        this.audio.muted = false;
                        this.audio.volume = 0.1;
                        
                        // 淡入音量
                        let vol = 0.1;
                        const interval = setInterval(() => {
                            vol += 0.1;
                            if (vol >= originalVolume) {
                                vol = originalVolume;
                                clearInterval(interval);
                            }
                            this.audio.volume = vol;
                        }, 200);
                    }, 500);
                    
                    this.isPlaying = true;
                    this.playPauseBtn.textContent = '⏸';
                    this.updateIconAnimation();
                    this.updatePlayButtonsState();
                }).catch(error => {
                    console.error('自动播放失败，尝试备用方案:', error);
                    // 备用方案：创建新的音频元素
                    this.recreateAudioElement();
                });
            }
        };
        
        // 尝试多次播放，增加成功率
        setTimeout(attemptAutoplay, 500);
        setTimeout(attemptAutoplay, 1500);
        setTimeout(attemptAutoplay, 3000);
        
        // 同时监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && !this.isPlaying && this.songs.length > 0) {
                attemptAutoplay();
            }
        });
        
        // 备用方案：监听页面任何事件
        const startPlayOnce = () => {
            if (!this.isPlaying && this.songs.length > 0) {
                this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
                this.loadSong(this.currentSongIndex);
                this.audio.play().catch(e => console.log('事件触发播放失败:', e));
                this.isPlaying = true;
                this.playPauseBtn.textContent = '⏸';
                this.updateIconAnimation();
            }
        };
        
        // 使用一次性事件监听
        document.addEventListener('click', startPlayOnce, {once: true});
        document.addEventListener('touchstart', startPlayOnce, {once: true});
        document.addEventListener('keydown', startPlayOnce, {once: true});
    }

    // 创建音频上下文尝试解锁音频
    createAudioContext() {
        try {
            // 创建音频上下文
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const audioCtx = new AudioContext();
            
            // 创建一个空的音频源
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 0; // 静音
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            // 立即播放然后停止，触发音频上下文解锁
            oscillator.start(0);
            oscillator.stop(0.001);
            
            // 如果上下文被挂起，尝试恢复
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        } catch (e) {
            console.error('创建音频上下文失败:', e);
        }
    }
    
    // 强制播放
    forcePlay() {
        return new Promise((resolve, reject) => {
            // 创建播放Promise
            const playPromise = this.audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => resolve())
                    .catch(error => {
                        console.warn('常规播放失败，尝试其他方法');
                        
                        // 如果第一次尝试失败，使用"trick"方法
                        this.audio.play().then(() => resolve()).catch(err => reject(err));
                    });
            } else {
                // 对于不返回Promise的旧浏览器
                try {
                    this.audio.play();
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }
        });
    }
    
    // 重新创建音频元素
    recreateAudioElement() {
        // 保存当前状态
        const currentSrc = this.audio.src;
        const currentTime = this.audio.currentTime;
        const wasPlaying = this.isPlaying;
        
        // 移除旧的事件监听
        this.audio.pause();
        
        // 创建新的音频元素
        this.audio = new Audio();
        this.audio.volume = 0.3;
        
        // 重新添加事件监听
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('loadedmetadata', () => {
            this.totalTime.textContent = this.formatTime(this.audio.duration);
        });
        this.audio.addEventListener('error', (e) => {
            console.error('音频加载错误:', e);
            this.showNotification('音频加载失败，将播放下一首');
            setTimeout(() => this.playNext(), 1000);
        });
        
        // 重新加载并播放
        this.audio.src = currentSrc;
        this.audio.load();
        
        setTimeout(() => {
            this.audio.currentTime = currentTime;
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.playPauseBtn.textContent = '⏸';
                this.updateIconAnimation();
                this.updatePlayButtonsState();
            }).catch(error => {
                console.error('重新创建音频元素后播放失败:', error);
            });
        }, 100);
    }
}

// 修改初始化逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 确保musicPlayer存在或创建新实例
    if (!window.musicPlayer) {
        console.log('创建新的音乐播放器实例');
        window.musicPlayer = new MusicPlayer();
        
        // 添加页面卸载前的保存状态逻辑
        window.addEventListener('beforeunload', () => {
            if (window.musicPlayer) {
                window.musicPlayer.savePlaybackState();
            }
        });
    } else {
        console.log('使用现有的音乐播放器实例');
        // 重新绑定DOM元素
        const player = window.musicPlayer;
        player.musicPlayerIcon = document.getElementById('musicPlayerIcon');
        player.musicPlayerModal = document.getElementById('musicPlayerModal');
        player.closePlayerBtn = document.getElementById('closePlayerBtn');
        player.playPauseBtn = document.getElementById('playPauseBtn');
        player.prevBtn = document.getElementById('prevBtn');
        player.nextBtn = document.getElementById('nextBtn');
        player.musicTitle = document.getElementById('musicTitle');
        player.currentTime = document.getElementById('currentTime');
        player.totalTime = document.getElementById('totalTime');
        player.progressBar = document.querySelector('.music-progress-bar');
        player.progressContainer = document.querySelector('.music-progress');
        player.searchInput = document.getElementById('musicSearchInput');
        player.musicListContainer = document.getElementById('musicListContainer');
        player.addMusicBtn = document.getElementById('addMusicBtn');
        player.musicFileInput = document.getElementById('musicFileInput');
        player.refreshMusicBtn = document.getElementById('refreshMusicBtn');
        player.playModeBtn = document.getElementById('playModeBtn');
        player.loopModeBtn = document.getElementById('loopModeBtn');
        
        // 每次页面加载时刷新音乐列表以获取最新歌曲
        player.loadSongsFromDefaultFolder();
        
        // 重新初始化播放器界面和事件
        player.initializePlayer();
        
        // 更新界面状态
        if (player.isPlaying) {
            player.updatePlayButtonsState();
            player.updateIconAnimation();
        }
    }
}); 
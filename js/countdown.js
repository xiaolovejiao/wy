// 倒计时数据结构
let countdownData = {
    title: '纪念日倒计时',
    targetDate: '2025-01-01',
    description: '距离我们的2025周年纪念日'
};

// 显示提示弹窗
function showAlert(type, title, message, callback) {
    const alertModal = document.getElementById('alertModal');
    const alertIcon = document.getElementById('alertIcon');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const alertConfirmBtn = document.getElementById('alertConfirmBtn');
    
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

// 从 localStorage 加载倒计时数据
function loadCountdownData() {
    const saved = localStorage.getItem('countdownData');
    if (saved) {
        countdownData = JSON.parse(saved);
    }
    updateCountdownDisplay();
}

// 保存倒计时数据到 localStorage
function saveCountdownData() {
    localStorage.setItem('countdownData', JSON.stringify(countdownData));
}

// 更新倒计时显示
function updateCountdownDisplay() {
    const titleElement = document.getElementById('countdownTitle');
    const daysElement = document.getElementById('countdownDays');
    const descriptionElement = document.getElementById('countdownDescription');
    
    if (titleElement) titleElement.textContent = countdownData.title;
    if (descriptionElement) descriptionElement.textContent = countdownData.description;
    
    // 计算并显示倒计时
    updateCountdown();
}

// 计算并更新倒计时数值
function updateCountdown() {
    const now = new Date().getTime();
    const target = new Date(countdownData.targetDate).getTime();
    const timeLeft = target - now;
    
    const daysElement = document.getElementById('countdownDays');
    const countdownTimeElement = document.getElementById('countdownTime');
    
    if (timeLeft > 0) {
        // 计算天、时、分、秒
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // 更新天数显示
        daysElement.textContent = days;
        
        // 显示时分秒，为数字和单位添加不同的样式
        countdownTimeElement.style.display = 'block';
        countdownTimeElement.innerHTML = `<span>${hours}</span> <span class="unit">时</span> <span>${minutes}</span> <span class="unit">分</span> <span>${seconds}</span> <span class="unit">秒</span>`;
    } else {
        daysElement.textContent = '0';
        countdownTimeElement.style.display = 'block';
        countdownTimeElement.textContent = '已到达';
    }
}

// 打开编辑弹窗
function openEditCountdown() {
    const modal = document.getElementById('editCountdownModal');
    const titleInput = document.getElementById('countdownTitleInput');
    const dateInput = document.getElementById('countdownDateInput');
    const descriptionInput = document.getElementById('countdownDescriptionInput');
    
    titleInput.value = countdownData.title;
    dateInput.value = countdownData.targetDate;
    descriptionInput.value = countdownData.description;
    
    modal.classList.add('show');
}

// 保存倒计时设置
function saveCountdownSettings() {
    const titleInput = document.getElementById('countdownTitleInput');
    const dateInput = document.getElementById('countdownDateInput');
    const descriptionInput = document.getElementById('countdownDescriptionInput');
    
    countdownData.title = titleInput.value.trim();
    countdownData.targetDate = dateInput.value;
    countdownData.description = descriptionInput.value.trim();
    
    saveCountdownData();
    updateCountdownDisplay();
    
    // 关闭弹窗
    const modal = document.getElementById('editCountdownModal');
    modal.classList.remove('show');
    
    // 显示成功提示
    showAlert('success', '成功', '倒计时设置已更新！');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 加载保存的数据
    loadCountdownData();
    
    // 设置定时器，每秒更新倒计时
    setInterval(updateCountdown, 1000);
    
    // 添加点击编辑事件
    const countdownCard = document.querySelector('.countdown-card');
    if (countdownCard) {
        // 使用更明确的点击区域，防止与其他事件冲突
        countdownCard.addEventListener('click', function(event) {
            // 确保点击事件不是从子元素传播上来的
            if (event.target === this || this.contains(event.target)) {
                openEditCountdown();
            }
        });
        
        // 添加提示样式，让用户知道可以点击
        countdownCard.style.cursor = 'pointer';
        
        // 添加一个编辑图标，使交互更明确
        const editIcon = document.createElement('span');
        editIcon.innerHTML = '✎';
        editIcon.style.position = 'absolute';
        editIcon.style.top = '10px';
        editIcon.style.right = '10px';
        editIcon.style.fontSize = '16px';
        editIcon.style.opacity = '0.7';
        editIcon.style.cursor = 'pointer';
        
        // 确保卡片有相对定位，以便图标可以绝对定位
        countdownCard.style.position = 'relative';
        countdownCard.appendChild(editIcon);
        
        // 编辑图标点击事件
        editIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止事件冒泡
            openEditCountdown();
        });
    }
    
    // 添加保存按钮事件
    const saveCountdownBtn = document.getElementById('saveCountdownBtn');
    if (saveCountdownBtn) {
        saveCountdownBtn.addEventListener('click', saveCountdownSettings);
    }
    
    // 添加取消按钮事件
    const cancelCountdownBtn = document.getElementById('cancelCountdownBtn');
    if (cancelCountdownBtn) {
        cancelCountdownBtn.addEventListener('click', () => {
            document.getElementById('editCountdownModal').classList.remove('show');
        });
    }
    
    // 添加关闭按钮事件
    const closeCountdownModal = document.getElementById('closeCountdownModal');
    if (closeCountdownModal) {
        closeCountdownModal.addEventListener('click', () => {
            document.getElementById('editCountdownModal').classList.remove('show');
        });
    }
}); 
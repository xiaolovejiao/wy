/**
 * 留言板功能
 * 独立的留言板功能模块，确保能正确加载和运行
 */

// 在页面加载完成后初始化留言板功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('留言板模块加载中...');
    initMessageBoard();
});

// 初始化留言板
function initMessageBoard() {
    console.log('初始化留言板...');
    
    // 获取DOM元素
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const messagesContainer = document.getElementById('messagesContainer');
    const noMessagesPlaceholder = document.getElementById('noMessagesPlaceholder');
    
    // 检查元素是否存在
    if (!messageInput || !sendButton || !messagesContainer || !noMessagesPlaceholder) {
        console.error('留言板所需DOM元素未找到');
        return;
    }
    
    console.log('留言板DOM元素已找到');
    
    // 获取当前登录用户信息
    const currentUser = localStorage.getItem('currentUser');
    const userGender = localStorage.getItem('userGender') || 'male';
    
    console.log('当前登录用户:', currentUser, '性别:', userGender);
    
    // 如果未登录，重定向到登录页面
    if (!currentUser) {
        console.warn('用户未登录，将跳转到登录页面');
        // 添加一个延迟，确保日志能够显示
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
        return;
    }
    
    // 初始化引用消息变量
    window.currentQuotedMessage = null;
    
    // 创建引用区域
    const quoteArea = document.createElement('div');
    quoteArea.id = 'quoteArea';
    quoteArea.className = 'quote-area';
    quoteArea.style.cssText = `
        background: rgba(0, 0, 0, 0.2);
        border-left: 3px solid rgba(255, 255, 255, 0.3);
        margin-bottom: 8px;
        padding: 8px 10px;
        border-radius: 4px;
        display: none;
        justify-content: space-between;
        align-items: center;
    `;
    
    // 插入到消息控件之前
    const messageControls = document.querySelector('.message-controls');
    if (messageControls) {
        messageControls.insertBefore(quoteArea, messageControls.firstChild);
    }
    
    // 设置文本框自适应高度
    messageInput.style.height = '36px';
    messageInput.style.overflowY = 'hidden';
    
    // 添加输入事件监听器
    messageInput.addEventListener('input', function() {
        adjustTextareaHeight(this);
    });
    
    // 绑定发送按钮点击事件
    sendButton.onclick = function() {
        console.log('发送按钮被点击');
        sendMessage();
    };
    
    // 绑定回车发送
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            console.log('检测到回车键，触发发送');
            sendMessage();
        }
    });
    
    // 加载已有消息
    loadMessages();
    
    console.log('留言板初始化完成');
    
    // 发送消息
    function sendMessage() {
        const content = messageInput.value.trim();
        
        if (!content) {
            showCustomAlert('warning', '提示', '请输入留言内容');
            return;
        }
        
        // 使用当前登录用户信息
        const message = {
            id: Date.now() + Math.floor(Math.random() * 1000), // 唯一ID
            sender: currentUser,
            gender: userGender,
            content: content,
            timestamp: new Date().toISOString(),
            isSelf: true,
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
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            console.log('消息已发送');
        } catch (error) {
            console.error('发送消息出错:', error);
            showCustomAlert('error', '错误', '发送消息失败，请重试');
        }
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
        
        if (messages.length === 0) {
            noMessagesPlaceholder.style.display = 'flex';
            return;
        }
        
        noMessagesPlaceholder.style.display = 'none';
        
        // 为了演示效果，添加一些示例消息
        if (messages.length < 2) {
            const otherUser = currentUser === '罗枭' ? '赖姣姣' : '罗枭';
            const otherGender = userGender === 'male' ? 'female' : 'male';
            
            const demoMessages = [
                {
                    id: Date.now() - 3600000,
                    sender: otherUser,
                    gender: otherGender,
                    content: '亲爱的，今天过得怎么样？',
                    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1小时前
                    isSelf: false
                },
                {
                    id: Date.now() - 3000000,
                    sender: currentUser,
                    gender: userGender,
                    content: '挺好的，就是有点想你了！',
                    timestamp: new Date(Date.now() - 3000000).toISOString(), // 50分钟前
                    isSelf: true
                },
                {
                    id: Date.now() - 2400000,
                    sender: otherUser,
                    gender: otherGender,
                    content: '我也想你呢！晚上一起吃饭吧？',
                    timestamp: new Date(Date.now() - 2400000).toISOString(), // 40分钟前
                    isSelf: false
                }
            ];
            
            demoMessages.forEach(message => {
                saveMessage(message);
                messages.push(message);
            });
        }
        
        // 清空容器，避免重复添加
        messagesContainer.innerHTML = '';
        if (messages.length === 0) {
            noMessagesPlaceholder.style.display = 'flex';
            return;
        } else {
            noMessagesPlaceholder.style.display = 'none';
        }
        
        // 处理消息，确定是否是当前用户发送的
        messages.forEach(message => {
            // 根据发送者是否是当前用户来设置isSelf
            message.isSelf = message.sender === currentUser;
            addMessageToUI(message);
        });
        
        // 滚动到最新消息
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // 将消息添加到UI
    function addMessageToUI(message) {
        noMessagesPlaceholder.style.display = 'none';
        
        const messageElement = document.createElement('div');
        
        // 根据是否为当前用户设置不同的类名
        messageElement.className = `message-item ${message.isSelf ? 'self' : 'other'} ${message.gender}`;
        messageElement.dataset.id = message.id;
        messageElement.dataset.sender = message.sender;
        
        // 获取头像路径 - 从localStorage获取最新的头像
        let maleAvatarSrc, femaleAvatarSrc;
        
        // 尝试从localStorage获取头像
        const savedMaleAvatar = localStorage.getItem('maleAvatar');
        const savedFemaleAvatar = localStorage.getItem('femaleAvatar');
        
        // 如果localStorage中有头像，则使用，否则使用默认头像或DOM中的头像
        if (savedMaleAvatar) {
            maleAvatarSrc = savedMaleAvatar;
        } else if (document.getElementById('maleAvatar')) {
            maleAvatarSrc = document.getElementById('maleAvatar').src;
        } else {
            maleAvatarSrc = 'images/male-avatar.png';
        }
        
        if (savedFemaleAvatar) {
            femaleAvatarSrc = savedFemaleAvatar;
        } else if (document.getElementById('femaleAvatar')) {
            femaleAvatarSrc = document.getElementById('femaleAvatar').src;
        } else {
            femaleAvatarSrc = 'images/female-avatar.png';
        }
        
        const avatarSrc = message.gender === 'male' ? maleAvatarSrc : femaleAvatarSrc;
        
        // 构建消息内容
        let messageContent = '';
        
        // 如果有引用的消息，显示引用内容
        if (message.quotedMessage) {
            messageContent += `
                <div class="quoted-message" style="background: rgba(0, 0, 0, 0.15); border-left: 3px solid rgba(255, 255, 255, 0.3); padding: 8px 10px; margin-bottom: 8px; border-radius: 4px; font-size: 0.9em;">
                    <div class="quoted-sender" style="font-weight: bold; margin-bottom: 3px; opacity: 0.9;">${message.quotedMessage.sender}:</div>
                    <div class="quoted-content" style="opacity: 0.8;">${formatMessageContent(message.quotedMessage.content)}</div>
                </div>
            `;
        }
        
        // 添加消息内容
        messageContent += `<div class="message-content">${formatMessageContent(message.content)}</div>`;
        
        // 根据是否为当前用户构建不同的HTML结构
        if (message.isSelf) {
            messageElement.innerHTML = `
                <div class="message-content-wrapper">
                    <div class="message-info">
                        <span class="message-time">${formatMessageTime(message.timestamp)}</span>
                        <div class="message-actions" style="display: none;">
                            <button class="delete-message-btn" title="删除" style="background: none; border: none; font-size: 16px; padding: 3px 6px; cursor: pointer; opacity: 0.7;">🗑️</button>
                        </div>
                    </div>
                    <div class="message-bubble">
                        ${messageContent}
                    </div>
                </div>
                <div class="message-avatar">
                    <img src="${avatarSrc}" alt="${message.sender}" class="avatar-img">
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="message-avatar">
                    <img src="${avatarSrc}" alt="${message.sender}" class="avatar-img">
                </div>
                <div class="message-content-wrapper">
                    <div class="message-info">
                        <span class="message-sender ${message.gender}">${message.sender}</span>
                        <span class="message-time">${formatMessageTime(message.timestamp)}</span>
                        <div class="message-actions" style="display: none;">
                            <button class="quote-message-btn" title="引用" style="background: none; border: none; font-size: 16px; padding: 3px 6px; cursor: pointer; opacity: 0.7;">💬</button>
                        </div>
                    </div>
                    <div class="message-bubble">
                        ${messageContent}
                    </div>
                </div>
            `;
        }
        
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
                actionsElement.style.display = actionsElement.style.display === 'block' ? 'none' : 'block';
                
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
            quoteArea.style.display = 'flex';
            quoteArea.innerHTML = `
                <div class="quote-content" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span class="quote-sender" style="font-weight: bold; margin-right: 5px;">${message.sender}:</span>
                    <span class="quote-text">${message.content.length > 20 ? message.content.substring(0, 20) + '...' : message.content}</span>
                </div>
                <button id="clearQuoteBtn" class="clear-quote-btn" style="background: none; border: none; font-size: 16px; padding: 0 5px; cursor: pointer; opacity: 0.7;">×</button>
            `;
            
            // 添加清除引用按钮事件
            const clearQuoteBtn = document.getElementById('clearQuoteBtn');
            if (clearQuoteBtn) {
                clearQuoteBtn.onclick = clearQuotedMessage;
            }
        }
        
        // 聚焦到输入框
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
        
        // 创建确认弹窗
        const confirmDialog = document.createElement('div');
        confirmDialog.className = 'modal';
        confirmDialog.id = 'deleteConfirmModal';
        confirmDialog.style.cssText = `
            display: flex;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            justify-content: center;
            align-items: center;
        `;
        
        confirmDialog.innerHTML = `
            <div class="modal-content" style="background-color: rgba(30, 30, 40, 0.85); margin: auto; padding: 20px; border-radius: 12px; max-width: 350px; width: 90%; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); position: relative; animation: modalFadeIn 0.3s ease;">
                <span class="close-btn" style="position: absolute; right: 15px; top: 10px; font-size: 24px; color: rgba(255, 255, 255, 0.7); cursor: pointer;">&times;</span>
                <div class="modal-body text-center" style="text-align: center; margin-bottom: 20px;">
                    <div class="alert-icon warning" style="font-size: 40px; margin-bottom: 10px; color: #ffc107;">⚠️</div>
                    <h3>确认删除</h3>
                    <p>确定要删除这条留言吗？<br>此操作无法撤销。</p>
                </div>
                <div class="modal-footer justify-center" style="display: flex; justify-content: center; gap: 10px;">
                    <button class="btn-cancel" style="background: rgba(150, 150, 150, 0.3); color: white; padding: 8px 15px; border-radius: 4px; cursor: pointer; border: none; font-size: 14px; transition: all 0.2s ease;">取消</button>
                    <button class="btn-danger" style="background: rgba(220, 53, 69, 0.8); color: white; padding: 8px 15px; border-radius: 4px; cursor: pointer; border: none; font-size: 14px; transition: all 0.2s ease;">确认删除</button>
                </div>
            </div>
        `;
        
        // 添加到body
        document.body.appendChild(confirmDialog);
        
        // 添加事件处理
        const closeBtn = confirmDialog.querySelector('.close-btn');
        const cancelBtn = confirmDialog.querySelector('.btn-cancel');
        const confirmBtn = confirmDialog.querySelector('.btn-danger');
        
        const closeModal = () => {
            document.body.removeChild(confirmDialog);
        };
        
        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;
        
        confirmBtn.onclick = () => {
            deleteMessage(messageId);
            closeModal();
        };
        
        // 点击外部关闭
        confirmDialog.onclick = (e) => {
            if (e.target === confirmDialog) {
                closeModal();
            }
        };
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
                if (messages[messageIndex].sender !== currentUser) {
                    showCustomAlert('error', '错误', '你只能删除自己的留言');
                    return;
                }
                
                // 从数组中删除
                messages.splice(messageIndex, 1);
                
                // 保存到本地存储
                localStorage.setItem('messages', JSON.stringify(messages));
                
                // 重新加载消息列表
                loadMessages();
                
                showCustomAlert('success', '成功', '留言已删除');
            }
        } catch (error) {
            console.error('删除留言时出错:', error);
            showCustomAlert('error', '错误', '删除留言失败，请重试');
        }
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

// 格式化消息时间
function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    
    // 获取日期和时间部分
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // 始终显示完整的年月日时间
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 格式化消息内容（支持换行）
function formatMessageContent(content) {
    return content.replace(/\n/g, '<br>');
}

// 显示提示信息
function showCustomAlert(type, title, message) {
    console.log('显示提示:', type, title, message);
    
    // 检查是否已有弹窗元素
    let alertModal = document.getElementById('customAlertModal');
    
    // 如果没有，创建一个
    if (!alertModal) {
        alertModal = document.createElement('div');
        alertModal.id = 'customAlertModal';
        alertModal.className = 'modal';
        alertModal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            overflow: auto;
            justify-content: center;
            align-items: center;
        `;
        
        alertModal.innerHTML = `
            <div class="modal-content" style="background-color: rgba(30, 30, 40, 0.85); margin: auto; padding: 15px; border-radius: 12px; max-width: 350px; width: 90%; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); position: relative;">
                <span class="close-btn" id="closeCustomAlertModal" style="position: absolute; right: 15px; top: 10px; font-size: 24px; color: rgba(255, 255, 255, 0.7); cursor: pointer;">&times;</span>
                <div class="modal-body text-center" style="text-align: center; margin-bottom: 20px;">
                    <div class="alert-icon">
                        <i id="customAlertIcon">✅</i>
                    </div>
                    <h3 id="customAlertTitle">操作成功</h3>
                    <p id="customAlertMessage">操作已完成</p>
                </div>
                <div class="modal-footer justify-center" style="display: flex; justify-content: center; gap: 10px;">
                    <button class="btn-primary" id="customAlertConfirmBtn" style="background: rgba(100, 149, 237, 0.8); color: white; padding: 8px 15px; border-radius: 4px; cursor: pointer; border: none; font-size: 14px; transition: all 0.2s ease;">确定</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(alertModal);
    }
    
    // 获取元素
    const alertIcon = document.getElementById('customAlertIcon');
    const alertTitle = document.getElementById('customAlertTitle');
    const alertMessage = document.getElementById('customAlertMessage');
    const confirmBtn = document.getElementById('customAlertConfirmBtn');
    const closeBtn = document.getElementById('closeCustomAlertModal');
    
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
        default:
            alertIcon.textContent = 'ℹ️';
    }
    
    // 设置标题和消息
    alertTitle.textContent = title;
    alertMessage.textContent = message;
    
    // 显示弹窗
    alertModal.style.display = 'flex';
    
    // 绑定事件
    const hideModal = () => {
        alertModal.style.display = 'none';
        confirmBtn.removeEventListener('click', hideModal);
        closeBtn.removeEventListener('click', hideModal);
    };
    
    confirmBtn.addEventListener('click', hideModal);
    closeBtn.addEventListener('click', hideModal);
    
    // 点击外部关闭
    alertModal.onclick = (e) => {
        if (e.target === alertModal) {
            hideModal();
        }
    };
} 
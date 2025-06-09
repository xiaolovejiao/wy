document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const usernameInput = document.getElementById('username');
    const step1Container = document.getElementById('step1Container');
    const step2Container = document.getElementById('step2Container');
    const step3Container = document.getElementById('step3Container');
    const stepDescription = document.getElementById('stepDescription');
    
    // 步骤指示器
    const step1Indicator = document.getElementById('step1');
    const step2Indicator = document.getElementById('step2');
    const step3Indicator = document.getElementById('step3');
    
    // 按钮
    const nextStep1Btn = document.getElementById('nextStep1Btn');
    const prevStep2Btn = document.getElementById('prevStep2Btn');
    const nextStep2Btn = document.getElementById('nextStep2Btn');
    const prevStep3Btn = document.getElementById('prevStep3Btn');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    
    // 表单
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    // 当前用户类型
    let currentUserType = '';
    
    // 步骤1：用户名验证
    nextStep1Btn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        
        if (!username) {
            showAlert('请输入用户名', 'warning');
            return;
        }
        
        // 验证用户名是否存在
        const userType = validateUsername(username);
        if (!userType) {
            showAlert('用户不存在，请检查用户名', 'error');
            return;
        }
        
        // 保存当前用户类型
        currentUserType = userType;
        
        // 加载安全问题
        loadSecurityQuestions(userType);
        
        // 切换到步骤2
        goToStep(2);
    });
    
    // 步骤2：安全问题验证
    prevStep2Btn.addEventListener('click', () => {
        goToStep(1);
    });
    
    nextStep2Btn.addEventListener('click', () => {
        // 验证安全问题答案
        if (validateSecurityAnswers(currentUserType)) {
            // 初始化密码可见性切换
            initPasswordToggle();
            
            // 初始化实时密码验证
            initPasswordValidation();
            
            // 切换到步骤3
            goToStep(3);
        }
    });
    
    // 步骤3：设置新密码
    prevStep3Btn.addEventListener('click', () => {
        goToStep(2);
    });
    
    // 重置密码表单提交事件
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 验证新密码
        if (validateNewPassword()) {
            // 更新密码
            updatePassword(currentUserType);
        }
    });
    
    // 切换到指定步骤
    function goToStep(step) {
        // 更新步骤指示器
        step1Indicator.classList.toggle('active', step === 1);
        step2Indicator.classList.toggle('active', step === 2);
        step3Indicator.classList.toggle('active', step === 3);
        
        // 更新步骤描述
        if (step === 1) {
            stepDescription.textContent = '第1步：输入您的用户名';
            step1Container.classList.remove('hidden');
            step2Container.classList.add('hidden');
            step3Container.classList.add('hidden');
        } else if (step === 2) {
            stepDescription.textContent = '第2步：回答安全问题';
            step1Container.classList.add('hidden');
            step2Container.classList.remove('hidden');
            step3Container.classList.add('hidden');
        } else if (step === 3) {
            stepDescription.textContent = '第3步：设置新密码';
            step1Container.classList.add('hidden');
            step2Container.classList.add('hidden');
            step3Container.classList.remove('hidden');
        }
    }
});

// 验证用户名是否存在
function validateUsername(username) {
    // 预设用户
    const validUsers = {
        '罗枭': 'male',
        '赖姣姣': 'female'
    };
    
    return validUsers[username] || null;
}

// 加载安全问题
function loadSecurityQuestions(userType) {
    const securityQuestions = {
        male: [
            "你的妻子/媳妇叫什么名字？",
            "你的妻子/媳妇家在哪儿？"
        ],
        female: [
            "你的丈夫/老公叫什么名字？",
            "你的丈夫/老公家在哪儿？"
        ]
    };
    
    // 设置问题标签
    document.getElementById('question1Label').textContent = securityQuestions[userType][0];
    document.getElementById('question2Label').textContent = securityQuestions[userType][1];
}

// 验证安全问题答案
function validateSecurityAnswers(userType) {
    const question1Answer = document.getElementById('question1').value.trim();
    const question2Answer = document.getElementById('question2').value.trim();
    
    // 预设的安全问题答案
    const securityAnswers = {
        male: {
            answer1: "赖姣姣",
            answer2: "冷家厂"
        },
        female: {
            answer1: "罗枭",
            answer2: "铁厂"
        }
    };
    
    // 验证答案是否正确（两个问题都必须答对）
    if (question1Answer !== securityAnswers[userType].answer1 || 
        question2Answer !== securityAnswers[userType].answer2) {
        showAlert('安全问题回答错误，请重试！', 'error');
        return false;
    }
    
    return true;
}

// 初始化密码可见性切换
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            
            // 切换密码可见性
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🔓'; // 显示密码图标
                this.setAttribute('aria-label', '隐藏密码');
            } else {
                input.type = 'password';
                this.textContent = '🔒'; // 隐藏密码图标
                this.setAttribute('aria-label', '显示密码');
            }
        });
    });
}

// 初始化实时密码验证
function initPasswordValidation() {
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordMatchHint = document.querySelector('.password-match-hint');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    
    // 密码强度验证
    newPassword.addEventListener('input', function() {
        // 验证两次密码是否一致
        validatePasswordMatch();
    });
    
    // 确认密码验证
    confirmPassword.addEventListener('input', validatePasswordMatch);
    
    // 验证两次密码是否一致
    function validatePasswordMatch() {
        const password = newPassword.value;
        const confirm = confirmPassword.value;
        
        if (confirm.length === 0) {
            passwordMatchHint.textContent = '';
            passwordMatchHint.className = 'password-match-hint';
            resetPasswordBtn.disabled = true;
        } else if (password === confirm) {
            passwordMatchHint.textContent = '✓ 两次密码一致';
            passwordMatchHint.className = 'password-match-hint match';
            resetPasswordBtn.disabled = password.length < 6;
        } else {
            passwordMatchHint.textContent = '✗ 两次密码不一致';
            passwordMatchHint.className = 'password-match-hint not-match';
            resetPasswordBtn.disabled = true;
        }
    }
}

// 验证新密码
function validateNewPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword.length < 6) {
        showAlert('密码长度至少为6个字符！', 'error');
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('两次输入的密码不一致！', 'error');
        return false;
    }
    
    return true;
}

// 更新密码
function updatePassword(userType) {
    const newPassword = document.getElementById('newPassword').value;
    
    // 更新本地存储中的密码
    if (userType === 'male') {
        localStorage.setItem('malePassword', newPassword);
    } else {
        localStorage.setItem('femalePassword', newPassword);
    }
    
    showAlert('密码修改成功！', 'success');
    
    // 延迟跳转回登录页面
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// 显示提示弹窗
function showAlert(message, type = 'error') {
    const alertModal = document.getElementById('alertModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const modalIconSymbol = document.getElementById('modalIconSymbol');
    const modalBtn = document.getElementById('modalBtn');
    
    modalMessage.textContent = message;
    
    if (type === 'success') {
        modalTitle.textContent = '成功';
        modalIcon.className = 'modal-icon success-icon';
        modalIconSymbol.textContent = '✓';
        modalBtn.style.background = 'linear-gradient(135deg, rgba(80, 200, 120, 0.8), rgba(50, 180, 100, 0.9))';
        modalBtn.style.boxShadow = '0 4px 10px rgba(50, 180, 100, 0.3)';
    } else if (type === 'warning') {
        modalTitle.textContent = '提示';
        modalIcon.className = 'modal-icon warning-icon';
        modalIconSymbol.textContent = '!';
        modalBtn.style.background = 'linear-gradient(135deg, rgba(255, 180, 50, 0.8), rgba(255, 150, 30, 0.9))';
        modalBtn.style.boxShadow = '0 4px 10px rgba(255, 150, 30, 0.3)';
    } else {
        modalTitle.textContent = '错误';
        modalIcon.className = 'modal-icon error-icon';
        modalIconSymbol.textContent = '!';
        modalBtn.style.background = 'linear-gradient(135deg, rgba(255, 107, 139, 0.8), rgba(255, 80, 120, 0.9))';
        modalBtn.style.boxShadow = '0 4px 10px rgba(255, 80, 120, 0.3)';
    }
    
    // 显示弹窗
    alertModal.classList.add('show');
    
    // 关闭弹窗
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        alertModal.classList.remove('show');
    });
    
    modalBtn.addEventListener('click', () => {
        alertModal.classList.remove('show');
    });
    
    // 点击弹窗外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === alertModal) {
            alertModal.classList.remove('show');
        }
    });
} 
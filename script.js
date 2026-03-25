// 全局变量
let currentKana = null;
let filteredKanaList = [...kanaData];
let trainingMode = 'forward'; // forward=正向, reverse=逆向
let reverseKanaType = 'hiragana';

// DOM元素
const displayContent = document.getElementById('displayContent');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const feedback = document.getElementById('feedback');
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const closeBtn = document.getElementById('closeBtn');
const applyBtn = document.getElementById('applyBtn');
const reverseKanaTypeGroup = document.getElementById('reverseKanaType');

// 初始化
window.onload = () => {
    initEventListeners();
    nextKana();
};

// 绑定事件
function initEventListeners() {
    // 按钮
    submitBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', (e) => e.key === 'Enter' && checkAnswer());
    
    // 设置弹窗
    settingsBtn.addEventListener('click', () => settingsModal.classList.add('show'));
    closeBtn.addEventListener('click', () => settingsModal.classList.remove('show'));
    
    // 训练模式切换
    document.querySelectorAll('input[name="trainingMode"]').forEach(radio => {
        radio.addEventListener('change', toggleReverseType);
    });
    
    // 应用设置
    applyBtn.addEventListener('click', applySettings);

    // 移动端优化：输入框聚焦，页面不遮挡
    answerInput.addEventListener('focus', () => {
        setTimeout(() => {
            answerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    });
}

// 切换逆向模式选项显示
function toggleReverseType() {
    const isReverse = document.querySelector('input[name="trainingMode"][value="reverse"]').checked;
    reverseKanaTypeGroup.style.display = isReverse ? 'block' : 'none';
}

// 应用设置
function applySettings() {
    // 获取设置
    const kanaType = document.querySelector('input[name="kanaType"]:checked').value;
    trainingMode = document.querySelector('input[name="trainingMode"]:checked').value;
    reverseKanaType = document.querySelector('input[name="reverseType"]:checked').value;

    // 过滤假名列表
    filteredKanaList = kanaData.filter(item => {
        if(trainingMode === 'reverse') {
            return item.form === (reverseKanaType === 'hiragana' ? '平假名' : '片假名');
        }
        return item.form === (kanaType === 'hiragana' ? '平假名' : '片假名');
    });

    settingsModal.classList.remove('show');
    nextKana();
}

// 下一个假名
function nextKana() {
    if (filteredKanaList.length === 0) return;
    currentKana = filteredKanaList[Math.floor(Math.random() * filteredKanaList.length)];
    
    // 显示内容
    if (trainingMode === 'forward') {
        displayContent.textContent = currentKana.kana;
        answerInput.placeholder = "输入罗马字";
    } else {
        displayContent.textContent = currentKana.romaji;
        answerInput.placeholder = "输入假名（使用日语键盘）";
    }
    
    answerInput.value = '';
    feedback.textContent = '';
    answerInput.focus();
}

// 验证答案
function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    if (!currentKana || userAnswer === '') return;

    let isCorrect = false;
    let correctAnswer = '';

    if (trainingMode === 'forward') {
        // 正向：看假名输罗马字
        isCorrect = userAnswer.toLowerCase() === currentKana.romaji.toLowerCase();
        correctAnswer = currentKana.romaji;
    } else {
        // 逆向：看罗马字输假名（严格匹配用户选择的类型）
        const targetKana = reverseKanaType === 'hiragana' ? currentKana.kana : currentKana.katakana;
        isCorrect = userAnswer === targetKana;
        correctAnswer = targetKana;
    }

    // 反馈
    if (isCorrect) {
        feedback.textContent = '正确！';
        feedback.className = 'feedback correct';
        setTimeout(nextKana, 1000);
    } else {
        feedback.textContent = `错误，正确答案：${correctAnswer}`;
        feedback.className = 'feedback incorrect';
    }
    answerInput.value = '';
}

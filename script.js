const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 简单的回复逻辑（后续你可以改成调用AI API）
const botResponses = [
    "收到你的消息啦！我是一个可优化的AI对话Demo~",
    "杨泓，这个项目支持调整参数和迁移部署哦。",
    "你可以在这里输入任何内容，后续我会接入真实AI接口。",
    "这是一个演示页面，主要展示前端交互和你的名字显示。"
];

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `<div class="text">${text}</div>`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getRandomResponse() {
    return botResponses[Math.floor(Math.random() * botResponses.length)];
}

sendBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = '';

    // 模拟AI回复延迟
    setTimeout(() => {
        addMessage(getRandomResponse());
    }, 800);
});

// 回车发送
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

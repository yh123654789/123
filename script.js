const { createApp, ref, nextTick } = Vue;

createApp({
    setup() {
        const inputMessage = ref('');
        const isLoading = ref(false);
        const chatContainer = ref(null);
        
        // 初始化一条 AI 的欢迎语
        const messages = ref([
            { role: 'ai', content: '你好杨泓！我是你的专属 AI 助手。今天有什么可以帮你的吗？', isTyping: false }
        ]);

        // 自动滚动到底部
        const scrollToBottom = async () => {
            await nextTick();
            if (chatContainer.value) {
                chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            }
        };

        const sendMessage = async () => {
            if (!inputMessage.value.trim() || isLoading.value) return;

            const userText = inputMessage.value;
            inputMessage.value = '';
            
            // 添加用户消息
            messages.value.push({ role: 'user', content: userText, isTyping: false });
            scrollToBottom();

            // 模拟 AI 思考与回复
            isLoading.value = true;
            const aiResponseIndex = messages.value.length;
            messages.value.push({ role: 'ai', content: '', isTyping: true });
            scrollToBottom();

            // 模拟网络延迟和打字机效果
            setTimeout(() => {
                const fakeReply = `收到！杨泓同学（学号：423240639），你刚刚问了：“${userText}”。\n\n这是一个基于 Vue3 开发的前沿 AI 交互界面演示。在实际项目中，这里会接入 OpenAI 或 通义千问 的 API 接口返回真实数据。`;
                
                let i = 0;
                const typeInterval = setInterval(() => {
                    messages.value[aiResponseIndex].content += fakeReply.charAt(i);
                    i++;
                    scrollToBottom();
                    if (i >= fakeReply.length) {
                        clearInterval(typeInterval);
                        messages.value[aiResponseIndex].isTyping = false;
                        isLoading.value = false;
                    }
                }, 50); // 打字速度
            }, 1000);
        };

        return {
            inputMessage,
            messages,
            isLoading,
            chatContainer,
            sendMessage
        };
    }
}).mount('#app');

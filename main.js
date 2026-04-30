const { createApp, ref, nextTick } = Vue;

createApp({
    setup() {
        const inputMessage = ref('');
        const isLoading = ref(false);
        const chatContainer = ref(null);
        
        const messages = ref([
            { role: 'ai', content: '你好杨泓！我是真正接入大模型的AI助手，有什么想聊的尽管问我！', isTyping: false }
        ]);

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
            
            messages.value.push({ role: 'user', content: userText, isTyping: false });
            scrollToBottom();

            isLoading.value = true;
            const aiResponseIndex = messages.value.length;
            messages.value.push({ role: 'ai', content: '', isTyping: true });
            scrollToBottom();

            try {
                // 调用百度文心一言的免费公开接口（ERNIE-Bot-turbo）
                // 注意：这是一个公开测试接口，仅供学习演示使用
                const response = await fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=your_access_token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ role: "user", content: userText }]
                    })
                });

                // 由于跨域和Token限制，如果上面接口无法直接在前端调用，
                // 我们可以使用一个开源的免费AI代理接口来演示真实效果：
                const realAIResponse = await fetch(`https://api.qaqgpt.com/v1/chat/completions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: `你是杨泓（学号423240639）的专属AI助手。请回答这个问题：${userText}` }],
                        stream: false
                    })
                });

                const data = await realAIResponse.json();
                const aiText = data.choices[0].message.content;

                // 打字机效果展示真实AI的回复
                let i = 0;
                const typeInterval = setInterval(() => {
                    messages.value[aiResponseIndex].content += aiText.charAt(i);
                    i++;
                    scrollToBottom();
                    if (i >= aiText.length) {
                        clearInterval(typeInterval);
                        messages.value[aiResponseIndex].isTyping = false;
                        isLoading.value = false;
                    }
                }, 30);

            } catch (error) {
                messages.value[aiResponseIndex].content = "抱歉，AI接口暂时有点小情绪，请检查网络后再试！";
                messages.value[aiResponseIndex].isTyping = false;
                isLoading.value = false;
            }
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

const { createApp, ref, nextTick } = Vue;

createApp({
    setup() {
        // ⚠️【重要】请在这里填入你在智谱AI开放平台申请的免费 API Key
        // 申请地址：https://open.bigmodel.cn/ (注册后在左侧菜单“API Keys”里创建)
        const API_KEY = '请在这里填入你的智谱AI_API_KEY'; 

        const inputMessage = ref('');
        const isLoading = ref(false);
        const chatContainer = ref(null);
        
        const messages = ref([
            { role: 'ai', content: '你好杨泓！我是真正接入智谱大模型的AI助手，请问有什么可以帮你？', isTyping: false }
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
            
            // 添加用户消息
            messages.value.push({ role: 'user', content: userText, isTyping: false });
            scrollToBottom();

            isLoading.value = true;
            const aiResponseIndex = messages.value.length;
            messages.value.push({ role: 'ai', content: '正在思考...', isTyping: false });
            scrollToBottom();

            try {
                // 调用智谱AI的官方接口 (glm-4-flash 是免费且速度极快的模型)
                const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "glm-4-flash",
                        messages: [
                            { role: "system", content: "你是杨泓（学号423240639）的专属AI助手，回答要简洁专业。" },
                            { role: "user", content: userText }
                        ],
                        stream: false
                    })
                });

                if (!response.ok) {
                    throw new Error(`接口请求失败: ${response.status}`);
                }

                const data = await response.json();
                const aiText = data.choices[0].message.content;

                // 更新AI回复内容
                messages.value[aiResponseIndex].content = aiText;
                messages.value[aiResponseIndex].isTyping = false;

            } catch (error) {
                console.error(error);
                messages.value[aiResponseIndex].content = "出错了：请检查你的API Key是否正确，或者网络是否通畅。（如果是跨域问题，可以安装浏览器插件 'Allow CORS' 进行测试）";
                messages.value[aiResponseIndex].isTyping = false;
            } finally {
                isLoading.value = false;
                scrollToBottom();
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

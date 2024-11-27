<template>
    <div>
      <form @submit.prevent="sendPrompt">
        <textarea v-model="prompt" placeholder="Enter your prompt"></textarea>
        <button type="submit">Send</button>
      </form>
      <div v-if="response">Response: {{ response }}</div>
    </div>
  </template>
        
  <script>
  export default {
    data() {
      return {
        prompt: "",
        response: null,
      };
    },
    methods: {
      async sendPrompt() {
        try {
        const res = await fetch("/.netlify/functions/chatgpt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: this.prompt }),
        });
  
        if (!res.ok) {
            const error = await res.json();
            console.error("Error:", error);
            alert(error.error || "Something went wrong");
            return;
        }

        const data = await res.json();
        this.response = data.reply;
        } catch (error) {
          console.error("Error:", error);
        }
      },
    },
  };
</script>
  
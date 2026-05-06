<script setup>
import { ref } from 'vue'

const longUrl = ref('')
const shortUrl = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const shortenUrl = async () => {
  errorMessage.value = ''
  shortUrl.value = ''
  isLoading.value = true

  try {
    // Calling your specific C# backend port
    const response = await fetch('https://localhost:7010/api/url/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: longUrl.value })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.title || 'Failed to shorten URL. Make sure it is a valid link.')
    }

    shortUrl.value = data.shortUrl
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="container">
    <div class="card">
      <h1>URL Shortener</h1>
      <p>Paste your long link below to make it short and sweet.</p>

      <form @submit.prevent="shortenUrl">
        <input 
          v-model="longUrl" 
          type="url" 
          placeholder="https://example.com/very/long/path" 
          required 
        />
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Shortening...' : 'Shorten URL' }}
        </button>
      </form>

      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>

      <div v-if="shortUrl" class="success">
        <p>Your shortened URL is ready!</p>
        <a :href="shortUrl" target="_blank">{{ shortUrl }}</a>
      </div>
    </div>
  </main>
</template>

<style>
body {
  background-color: #f4f4f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  text-align: center;
}

h1 { margin-top: 0; color: #333; }
p { color: #666; margin-bottom: 20px; }

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) { background-color: #0056b3; }
button:disabled { background-color: #ccc; cursor: not-allowed; }

.error {
  margin-top: 15px;
  color: #d9534f;
  background: #fdf7f7;
  padding: 10px;
  border-radius: 6px;
}

.success {
  margin-top: 20px;
  padding: 15px;
  background: #e8f5e9;
  border-radius: 6px;
  border: 1px solid #c8e6c9;
}

.success a {
  font-size: 18px;
  font-weight: bold;
  color: #2e7d32;
  text-decoration: none;
}
</style>





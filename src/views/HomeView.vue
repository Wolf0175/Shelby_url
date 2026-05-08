<script setup>
import { ref, onMounted } from 'vue'

const longUrl = ref('')
const shortUrl = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const isLoggedIn = ref(false)

// Check if user is logged in when the page loads
onMounted(() => {
  const token = localStorage.getItem('jwt_token')
  if (token) {
    isLoggedIn.value = true
  }
})

// Logout function
const logout = () => {
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('username')
  isLoggedIn.value = false
  shortUrl.value = ''
  longUrl.value = ''
}

const shortenUrl = async () => {
  errorMessage.value = ''
  shortUrl.value = ''
  isLoading.value = true

  try {
    const token = localStorage.getItem('jwt_token')
    const headers = { 'Content-Type': 'application/json' }
    
    // Attach token if user is logged in
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // --- UPDATED RENDER URL BELOW ---
    const response = await fetch('https://shelby-url-backend2.onrender.com/api/url/shorten', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ url: longUrl.value })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.title || 'Failed to shorten URL.')

    shortUrl.value = data.shortUrl
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="card">
    <div class="header-action">
      <h1>URL Shortener</h1>
      <button v-if="isLoggedIn" @click="logout" class="logout-btn">Logout</button>
    </div>
    
    <p>Paste your long link below to make it short and sweet.</p>

    <form @submit.prevent="shortenUrl">
      <input v-model="longUrl" type="url" placeholder="https://example.com/very/long/path" required />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Shortening...' : 'Shorten URL' }}
      </button>
    </form>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-if="shortUrl" class="success">
      <p>Your shortened URL is ready!</p>
      <a :href="shortUrl" target="_blank">{{ shortUrl }}</a>
    </div>

    <div v-if="!isLoggedIn" class="login-prompt">
      Want to track your links? 
      <router-link to="/login" class="login-link">Login here</router-link>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles remain exactly the same */
.header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.header-action h1 { margin-bottom: 0; margin-top: 0; }
.logout-btn { background-color: #dc3545; width: auto; padding: 8px 15px; font-size: 14px; }
.logout-btn:hover:not(:disabled) { background-color: #c82333; }
.login-prompt { margin-top: 25px; font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 15px; }
.login-link { color: #007bff; text-decoration: none; font-weight: bold; }
.login-link:hover { text-decoration: underline; }
</style>
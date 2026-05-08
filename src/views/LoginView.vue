<script setup>
import { ref } from 'vue'
import router from '../router'
import { userService } from '../services/api' // Import service

const isRegistering = ref(false)
const username = ref('')
const password = ref('')
const email = ref('')
const authMessage = ref('')
const isLoading = ref(false)

const handleAuth = async () => {
  authMessage.value = ''
  isLoading.value = true
  const endpoint = isRegistering.value ? 'register' : 'login'
  
  try {
    // Gọi service để xử lý
    const data = await userService.authenticate(endpoint, {
      username: username.value,
      password: password.value,
      email: email.value
    })

    if (!isRegistering.value) {
      // Đăng nhập thành công: Lưu token và chuyển trang
      localStorage.setItem('jwt_token', data.token)
      localStorage.setItem('username', username.value)
      router.push('/') 
    } else {
      // Đăng ký thành công: Chuyển sang form đăng nhập
      authMessage.value = 'Registration successful! Please login.'
      isRegistering.value = false
    }
  } catch (error) {
    authMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="card">
    <h1>{{ isRegistering ? 'Create Account' : 'Login' }}</h1>
    <p>Please authenticate to use the system.</p>

    <form @submit.prevent="handleAuth">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-if="isRegistering" v-model="email" type="email" placeholder="Email Address" required />
      <input v-model="password" type="password" placeholder="Password" required />
      
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Processing...' : (isRegistering ? 'Register' : 'Login') }}
      </button>
    </form>
    
    <div v-if="authMessage" class="auth-msg" :class="{'error-msg': authMessage.toLowerCase().includes('fail') || authMessage.toLowerCase().includes('server')}">
      {{ authMessage }}
    </div>
    
    <p class="toggle-text">
      {{ isRegistering ? 'Already have an account?' : 'Need an account?' }}
      <a href="#" @click.prevent="isRegistering = !isRegistering; authMessage = ''">
        {{ isRegistering ? 'Login here' : 'Create one' }}
      </a>
    </p>

    <div class="back-nav">
      <router-link to="/" class="back-link">← Back to Shortener</router-link>
    </div>
  </div>
</template>

<style scoped>
/* CSS giữ nguyên như cũ */
.auth-msg { margin-top: 15px; color: #2e7d32; font-weight: bold; background: #e8f5e9; padding: 10px; border-radius: 6px; }
.error-msg { color: #d9534f; background: #fdf7f7; }
.toggle-text { margin-top: 20px; font-size: 14px; color: #666; }
.toggle-text a { color: #007bff; text-decoration: none; font-weight: bold; }
.back-nav { margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px; }
.back-link { color: #888; text-decoration: none; font-size: 14px; }
</style>
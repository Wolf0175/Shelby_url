<script setup>
import { ref } from 'vue'
import router from '../router' // Using the Vue 2 router instance directly

// --- State Variables ---
const isRegistering = ref(false)
const username = ref('')
const password = ref('')
const email = ref('')
const authMessage = ref('')
const isLoading = ref(false)

// --- Authentication Logic ---
const handleAuth = async () => {
  authMessage.value = ''
  isLoading.value = true
  
  // Determine if we are hitting the login or register endpoint
  const endpoint = isRegistering.value ? 'register' : 'login'
  
  try {
    const response = await fetch(`https://localhost:7010/api/user/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: username.value, 
        password: password.value,
        email: email.value 
      })
    })

    // Safely handle both JSON and plain-text responses from the C# API
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    // Check for bad requests (400, 404, etc.)
    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed. Please check your credentials.')
    }

    // Handle Success
    if (!isRegistering.value) {
      // 1. If Login Success: Save the token and username to local storage
      localStorage.setItem('jwt_token', data.token)
      localStorage.setItem('username', username.value)
      
      // 2. Redirect back to the URL Shortener (Home) page
      router.push('/') 
    } else {
      // 3. If Registration Success: Show a message and switch to the login form
      authMessage.value = 'Registration successful! You can now log in.'
      isRegistering.value = false
    }
  } catch (error) {
    // Display the error message on the screen
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
      <input 
        v-model="username" 
        type="text" 
        placeholder="Username" 
        required 
      />
      
      <input 
        v-if="isRegistering" 
        v-model="email" 
        type="email" 
        placeholder="Email Address" 
        required 
      />
      
      <input 
        v-model="password" 
        type="password" 
        placeholder="Password" 
        required 
      />
      
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Processing...' : (isRegistering ? 'Register' : 'Login') }}
      </button>
    </form>
    
    <div 
      v-if="authMessage" 
      class="auth-msg" 
      :class="{'error-msg': authMessage.toLowerCase().includes('fail') || authMessage.toLowerCase().includes('wrong') || authMessage.toLowerCase().includes('found') || authMessage.toLowerCase().includes('check')}"
    >
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
/* Scoped styles ensure these only affect the Login page */
.auth-msg { 
  margin-top: 15px; 
  color: #2e7d32; /* Green for success */
  font-weight: bold; 
  background: #e8f5e9;
  padding: 10px;
  border-radius: 6px;
}

.error-msg { 
  color: #d9534f; /* Red for errors */
  background: #fdf7f7;
}

.toggle-text { 
  margin-top: 20px; 
  font-size: 14px; 
  color: #666;
}

.toggle-text a { 
  color: #007bff; 
  text-decoration: none; 
  font-weight: bold; 
}

.toggle-text a:hover { 
  text-decoration: underline; 
}

.back-nav {
  margin-top: 25px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.back-link {
  color: #888;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #333;
}
</style>
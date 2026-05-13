<script setup>
import { ref, onMounted } from 'vue'
import { urlService } from '../services/api'
import router from '../router'

const links = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const currentUsername = ref('')

onMounted(async () => {
  const token = localStorage.getItem('jwt_token')
  currentUsername.value = localStorage.getItem('username')

  if (!token) {
    router.push('/login') 
    return
  }

  try {
    links.value = await urlService.getMyLinks()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="dashboard-container">
    <div class="header">
      <h1>{{ currentUsername }}'s Dashboard</h1>
      <router-link to="/" class="btn-primary">← Back to Shortener</router-link>
    </div>

    <div v-if="isLoading" class="loading">Loading your links...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    
    <div v-else class="card">
      <div v-if="links.length === 0" class="empty-state">
        <p>You haven't shortened any URLs yet.</p>
      </div>
      
      <table v-else class="links-table">
        <thead>
          <tr>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>Created</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="link in links" :key="link.id">
            <td class="truncate" :title="link.originalUrl">
              <a :href="link.originalUrl" target="_blank">{{ link.originalUrl }}</a>
            </td>
            <td>
              <a :href="link.shortUrl" target="_blank" class="short-link">{{ link.shortUrl }}</a>
            </td>
            <td>{{ formatDate(link.createdAt) }}</td>
            <td :class="{'expired': new Date(link.expiredDate) < new Date()}">
              {{ formatDate(link.expiredDate) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 900px; 
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  color: #333;
  margin: 0;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
}

.btn-primary:hover { background-color: #0056b3; }

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.links-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.links-table th, .links-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.links-table th { background-color: #f8f9fa; font-weight: 600; color: #555;}

.truncate {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate a { color: #666; text-decoration: none; }
.truncate a:hover { text-decoration: underline; }
.short-link { color: #28a745; font-weight: bold; text-decoration: none; }
.short-link:hover { text-decoration: underline; }
.expired { color: #dc3545; font-weight: bold; }
.empty-state { padding: 40px; text-align: center; color: #888; }
.loading { text-align: center; color: #666; font-size: 18px; margin-top: 50px;}
</style>
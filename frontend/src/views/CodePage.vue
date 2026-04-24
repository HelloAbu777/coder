<template>
  <div class="code-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div>
            <h1 class="page-title">
              <i class="bi bi-cloud-arrow-up-fill me-2"></i>
              Kod saqlash
            </h1>
            <p class="page-subtitle">Kompyuterdan fayllaringizni yuklang va bulutda saqlang</p>
          </div>
          <div class="header-stats">
            <div class="stat-item">
              <i class="bi bi-folder2 me-2"></i>
              <span>{{ projects.length }} loyiha</span>
            </div>
            <div class="stat-item" v-if="activeProject">
              <i class="bi bi-file-earmark-code me-2"></i>
              <span>{{ activeProject.files.length }} fayl</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-4">
      <div class="row g-4">
        <!-- Sidebar -->
        <div class="col-lg-3">
          <div class="sidebar-card">
            <div class="sidebar-header">
              <h6 class="mb-0">Loyihalar</h6>
              <button class="btn-icon" @click="showCreateModal = true" title="Yangi loyiha">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
            
            <div class="projects-list">
              <div v-if="projects.length === 0" class="empty-state">
                <i class="bi bi-folder-x"></i>
                <p>Loyiha yo'q</p>
                <button class="btn-create-first" @click="showCreateModal = true">
                  <i class="bi bi-plus-circle me-1"></i>Birinchi loyihani yarating
                </button>
              </div>
              
              <div v-for="p in projects" :key="p._id" 
                class="project-card" 
                :class="{ active: activeProject?._id === p._id }" 
                @click="selectProject(p)">
                <div class="project-icon">
                  <i class="bi bi-folder-fill"></i>
                </div>
                <div class="project-info">
                  <div class="project-name">{{ p.name }}</div>
                  <div class="project-meta">
                    <span class="file-count">{{ p.files?.length || 0 }} fayl</span>
                  </div>
                </div>
                <button class="btn-delete" @click.stop="deleteProject(p._id)" title="O'chirish">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Area -->
        <div class="col-lg-9">
          <!-- Empty State -->
          <div v-if="!activeProject" class="empty-workspace">
            <div class="empty-icon">
              <i class="bi bi-code-square"></i>
            </div>
            <h3>Loyiha tanlang</h3>
            <p>Chap tarafdan loyiha tanlang yoki yangi loyiha yarating</p>
            <button class="btn-primary-large" @click="showCreateModal = true">
              <i class="bi bi-plus-circle me-2"></i>Yangi loyiha yaratish
            </button>
          </div>
          
          <!-- Project Workspace -->
          <div v-else class="workspace-card">
            <div class="workspace-header">
              <div class="workspace-title">
                <i class="bi bi-folder-fill me-2" style="color: #818cf8;"></i>
                <h5 class="mb-0">{{ activeProject.name }}</h5>
              </div>
              <button class="btn-upload" @click="$refs.fileInput.click()">
                <i class="bi bi-cloud-upload me-2"></i>Fayl yuklash
              </button>
              <input ref="fileInput" type="file" multiple style="display:none" @change="handleFileUpload" 
                accept=".html,.css,.js,.py,.txt,.json" />
            </div>

            <!-- Upload Progress -->
            <div v-if="uploading" class="upload-progress">
              <div class="progress-spinner"></div>
              <span>Yuklanmoqda...</span>
            </div>

            <!-- Drop Zone -->
            <div v-if="activeProject.files.length === 0 && !uploading" 
              class="drop-zone"
              @drop.prevent="handleDrop"
              @dragover.prevent
              @dragenter.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              :class="{ 'dragging': isDragging }">
              <div class="drop-zone-content">
                <div class="drop-icon">
                  <i class="bi bi-cloud-arrow-up"></i>
                </div>
                <h4>Fayllarni bu yerga sudrab tashlang</h4>
                <p class="drop-text">yoki yuqoridagi tugmani bosing</p>
                <div class="supported-formats">
                  <span class="format-badge">HTML</span>
                  <span class="format-badge">CSS</span>
                  <span class="format-badge">JavaScript</span>
                  <span class="format-badge">Python</span>
                  <span class="format-badge">JSON</span>
                </div>
                <p class="size-limit">Maksimal hajm: 1MB</p>
              </div>
            </div>

            <!-- Files Grid -->
            <div v-if="activeProject.files.length > 0" class="files-grid">
              <div v-for="f in activeProject.files" :key="f.name" class="file-card">
                <div class="file-icon-wrapper">
                  <i :class="getFileIcon(f.name)" class="file-icon"></i>
                </div>
                <div class="file-details">
                  <div class="file-name" :title="f.name">{{ f.name }}</div>
                  <div class="file-size">{{ formatSize(f.size) }}</div>
                </div>
                <div class="file-actions">
                  <button class="btn-action btn-download" @click="downloadFile(f)" title="Yuklab olish">
                    <i class="bi bi-download"></i>
                  </button>
                  <button class="btn-action btn-delete-file" @click="deleteFile(f.name)" title="O'chirish">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <transition name="modal">
      <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
        <div class="modal-card">
          <div class="modal-header">
            <h5>Yangi loyiha yaratish</h5>
            <button class="btn-close-modal" @click="showCreateModal = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <label class="form-label">Loyiha nomi</label>
            <input v-model="newProjectName" 
              type="text" 
              class="form-input" 
              placeholder="Masalan: Mening veb-saytim" 
              @keyup.enter="createProject"
              autofocus />
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="showCreateModal = false">Bekor qilish</button>
            <button class="btn-primary" @click="createProject" :disabled="!newProjectName.trim()">
              <i class="bi bi-check-lg me-1"></i>Yaratish
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../utils/axios.js';

export default {
  name: 'CodePage',
  setup() {
    const projects = ref([]);
    const activeProject = ref(null);
    const showCreateModal = ref(false);
    const newProjectName = ref('');
    const uploading = ref(false);
    const isDragging = ref(false);

    const loadProjects = async () => {
      try {
        const { data } = await api.get('/code');
        projects.value = data;
      } catch (err) {
        console.error(err);
      }
    };

    const selectProject = async (p) => {
      try {
        const { data } = await api.get(`/code/${p._id}`);
        activeProject.value = data;
      } catch (err) {
        console.error(err);
      }
    };

    const createProject = async () => {
      if (!newProjectName.value.trim()) return;
      try {
        const { data } = await api.post('/code', { name: newProjectName.value });
        projects.value.unshift(data);
        newProjectName.value = '';
        showCreateModal.value = false;
        selectProject(data);
      } catch (err) {
        alert(err.response?.data?.message || 'Xato');
      }
    };

    const deleteProject = async (id) => {
      if (!confirm('O\'chirasizmi?')) return;
      try {
        await api.delete(`/code/${id}`);
        projects.value = projects.value.filter(p => p._id !== id);
        if (activeProject.value?._id === id) activeProject.value = null;
      } catch (err) {
        alert('Xato');
      }
    };

    const uploadFiles = async (files) => {
      if (!activeProject.value) return;
      uploading.value = true;

      for (const file of files) {
        if (file.size > 1024 * 1024) {
          alert(`${file.name} hajmi 1MB dan katta`);
          continue;
        }

        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!['html', 'css', 'js', 'py', 'txt', 'json'].includes(ext)) {
          alert(`${file.name} qo'llab-quvvatlanmaydi`);
          continue;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const langMap = { js: 'javascript', html: 'html', css: 'css', py: 'python', txt: 'javascript', json: 'javascript' };

            await api.put(`/code/${activeProject.value._id}/file`, {
              fileName: file.name,
              language: langMap[ext] || 'javascript',
              content: e.target.result
            });

            // Reload project
            const { data } = await api.get(`/code/${activeProject.value._id}`);
            activeProject.value = data;
          } catch (err) {
            alert(`${file.name} yuklanmadi`);
          }
        };
        reader.readAsText(file);
      }

      uploading.value = false;
    };

    const handleFileUpload = async (event) => {
      const files = Array.from(event.target.files);
      await uploadFiles(files);
      event.target.value = ''; // Reset input
    };

    const handleDrop = async (event) => {
      isDragging.value = false;
      const files = Array.from(event.dataTransfer.files);
      await uploadFiles(files);
    };

    const downloadFile = (file) => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    };

    const deleteFile = async (fileName) => {
      if (!confirm('Faylni o\'chirasizmi?')) return;
      try {
        const { data } = await api.delete(`/code/${activeProject.value._id}/file/${encodeURIComponent(fileName)}`);
        activeProject.value = data;
      } catch (err) {
        alert('Xato');
      }
    };

    const getFileIcon = (name) => {
      const ext = name.split('.').pop()?.toLowerCase();
      const icons = {
        html: 'bi bi-filetype-html',
        css: 'bi bi-filetype-css',
        js: 'bi bi-filetype-js',
        py: 'bi bi-filetype-py',
        txt: 'bi bi-file-earmark-text',
        json: 'bi bi-filetype-json'
      };
      return icons[ext] || 'bi bi-file-earmark-code';
    };

    const formatSize = (bytes) => {
      if (!bytes) return '0 B';
      if (bytes < 1000) return `${bytes} B`;
      return `${(bytes / 1000).toFixed(1)} KB`;
    };

    onMounted(loadProjects);

    return {
      projects, activeProject, showCreateModal, newProjectName, uploading, isDragging,
      selectProject, createProject, deleteProject,
      handleFileUpload, handleDrop, downloadFile, deleteFile,
      getFileIcon, formatSize
    };
  }
};
</script>

<style scoped>
.code-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
}

/* Header */
.page-header {
  background: rgba(129, 140, 248, 0.05);
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
}

.page-title i {
  color: #818cf8;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  background: rgba(129, 140, 248, 0.1);
  border-radius: 8px;
}

.stat-item i {
  color: #818cf8;
}

/* Sidebar */
.sidebar-card {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
}

.sidebar-header h6 {
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: rgba(129, 140, 248, 0.25);
  transform: scale(1.05);
}

.projects-list {
  padding: 0.75rem;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.projects-list::-webkit-scrollbar {
  width: 6px;
}

.projects-list::-webkit-scrollbar-track {
  background: rgba(129, 140, 248, 0.05);
  border-radius: 3px;
}

.projects-list::-webkit-scrollbar-thumb {
  background: rgba(129, 140, 248, 0.2);
  border-radius: 3px;
}

.projects-list::-webkit-scrollbar-thumb:hover {
  background: rgba(129, 140, 248, 0.3);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.4);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.empty-state p {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.btn-create-first {
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
  border: 1px dashed rgba(129, 140, 248, 0.3);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-create-first:hover {
  background: rgba(129, 140, 248, 0.25);
  border-color: rgba(129, 140, 248, 0.5);
}

.project-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  position: relative;
}

.project-card:hover {
  background: rgba(129, 140, 248, 0.08);
  border-color: rgba(129, 140, 248, 0.2);
}

.project-card.active {
  background: rgba(129, 140, 248, 0.15);
  border-color: rgba(129, 140, 248, 0.3);
}

.project-card.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: #818cf8;
  border-radius: 0 3px 3px 0;
}

.project-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(129, 140, 248, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.project-icon i {
  color: #818cf8;
  font-size: 1.1rem;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-name {
  color: #fff;
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.file-count {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
}

.btn-delete {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0;
}

.project-card:hover .btn-delete {
  opacity: 1;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

/* Workspace */
.empty-workspace {
  background: rgba(30, 30, 46, 0.6);
  backdrop-filter: blur(10px);
  border: 2px dashed rgba(129, 140, 248, 0.2);
  border-radius: 20px;
  padding: 5rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  background: rgba(129, 140, 248, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon i {
  font-size: 4rem;
  color: #818cf8;
}

.empty-workspace h3 {
  color: #fff;
  margin-bottom: 0.75rem;
  font-size: 1.75rem;
}

.empty-workspace p {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2rem;
  font-size: 1rem;
}

.btn-primary-large {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(129, 140, 248, 0.3);
}

.btn-primary-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(129, 140, 248, 0.4);
}

.workspace-card {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
  background: rgba(129, 140, 248, 0.03);
}

.workspace-title {
  display: flex;
  align-items: center;
}

.workspace-title h5 {
  color: #fff;
  font-weight: 600;
}

.btn-upload {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.btn-upload:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(129, 140, 248, 0.4);
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(129, 140, 248, 0.1);
  border-bottom: 1px solid rgba(129, 140, 248, 0.2);
  color: #818cf8;
  font-weight: 500;
}

.progress-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(129, 140, 248, 0.2);
  border-top-color: #818cf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Drop Zone */
.drop-zone {
  margin: 2rem;
  padding: 4rem 2rem;
  border: 2px dashed rgba(129, 140, 248, 0.3);
  border-radius: 16px;
  transition: all 0.3s;
  background: rgba(129, 140, 248, 0.02);
}

.drop-zone.dragging {
  border-color: #818cf8;
  background: rgba(129, 140, 248, 0.1);
  transform: scale(1.02);
}

.drop-zone-content {
  text-align: center;
}

.drop-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: rgba(129, 140, 248, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-icon i {
  font-size: 3rem;
  color: #818cf8;
}

.drop-zone h4 {
  color: #fff;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.drop-text {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1.5rem;
}

.supported-formats {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.format-badge {
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.size-limit {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
  margin: 0;
}

/* Files Grid */
.files-grid {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.file-card {
  background: rgba(129, 140, 248, 0.05);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;
}

.file-card:hover {
  background: rgba(129, 140, 248, 0.1);
  border-color: rgba(129, 140, 248, 0.2);
  transform: translateY(-2px);
}

.file-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgba(129, 140, 248, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-icon {
  font-size: 1.75rem;
  color: #818cf8;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  color: #fff;
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.file-size {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.file-card:hover .file-actions {
  opacity: 1;
}

.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-download {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.btn-download:hover {
  background: rgba(34, 197, 94, 0.25);
  transform: scale(1.05);
}

.btn-delete-file {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.btn-delete-file:hover {
  background: rgba(239, 68, 68, 0.25);
  transform: scale(1.05);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-card {
  background: #1e1e2e;
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
}

.modal-header h5 {
  color: #fff;
  font-weight: 600;
  margin: 0;
}

.btn-close-modal {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close-modal:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.modal-body {
  padding: 1.5rem;
}

.form-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(129, 140, 248, 0.05);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #818cf8;
  background: rgba(129, 140, 248, 0.1);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(129, 140, 248, 0.1);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-primary {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(129, 140, 248, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Animation */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 991px) {
  .files-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .header-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .files-grid {
    grid-template-columns: 1fr;
  }
  
  .workspace-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .btn-upload {
    width: 100%;
    justify-content: center;
  }
}
</style>

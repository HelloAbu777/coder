<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <h2 class="section-title mb-0">Kod saqlash</h2>
      <button class="btn btn-primary btn-sm" @click="showCreate = true">
        <i class="bi bi-plus-circle me-2"></i>Yangi loyiha
      </button>
    </div>

    <!-- Yangi loyiha modali -->
    <div v-if="showCreate" class="card-dark p-4 mb-4" style="max-width:400px">
      <h6 class="fw-semibold mb-3" style="color:var(--text-light)">Yangi loyiha</h6>
      <input v-model="newProjectName" type="text" class="form-control mb-3" placeholder="Loyiha nomi" />
      <div class="d-flex gap-2">
        <button class="btn btn-primary btn-sm" @click="createProject">Yaratish</button>
        <button class="btn btn-outline-secondary btn-sm" @click="showCreate = false">Bekor</button>
      </div>
    </div>

    <div class="row g-4">
      <!-- Loyihalar ro'yxati -->
      <div class="col-md-3">
        <div class="card-dark p-3">
          <p class="small fw-semibold mb-3" style="color:var(--text-muted)">Loyihalar ({{ projects.length }}/20)</p>
          <div v-if="projects.length === 0" class="text-center py-3" style="color:var(--text-muted)">
            <i class="bi bi-folder d-block fs-2 mb-2"></i>
            <span class="small">Loyiha yo'q</span>
          </div>
          <div v-for="p in projects" :key="p._id"
            class="project-item" :class="{ active: activeProject?._id === p._id }"
            @click="selectProject(p)">
            <i class="bi bi-folder2-open me-2" style="color:var(--primary)"></i>
            <span class="flex-grow-1 small text-truncate">{{ p.name }}</span>
            <button class="del-btn" @click.stop="deleteProject(p._id)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Editor -->
      <div class="col-md-9">
        <div v-if="!activeProject" class="card-dark d-flex align-items-center justify-content-center" style="height:450px">
          <div class="text-center" style="color:var(--text-muted)">
            <i class="bi bi-code-slash fs-1 d-block mb-3"></i>
            <p>Chapdan loyiha tanlang</p>
          </div>
        </div>
        <div v-else class="card-dark p-0 overflow-hidden">
          <!-- Fayl tablari -->
          <div class="d-flex align-items-center gap-1 p-2" style="background:var(--bg-dark);border-bottom:1px solid var(--border)">
            <button v-for="f in activeProject.files" :key="f.name"
              class="file-tab" :class="{ active: activeFile?.name === f.name }"
              @click="activeFile = f">
              {{ f.name }}
            </button>
            <button class="file-tab add-file" @click="addFile">
              <i class="bi bi-plus"></i>
            </button>
          </div>

          <!-- Kod area -->
          <div v-if="activeFile">
            <textarea
              v-model="activeFile.content"
              class="code-editor"
              spellcheck="false"
              placeholder="// Kod yozing..."
              @input="unsaved = true"
            ></textarea>
            <div class="d-flex justify-content-between align-items-center px-3 py-2" style="background:var(--bg-dark);border-top:1px solid var(--border)">
              <span class="small" style="color:var(--text-muted)">
                {{ activeFile.language }} •
                {{ (activeFile.content?.length || 0).toLocaleString() }} belgi
              </span>
              <button class="btn btn-primary btn-sm" :disabled="saving || !unsaved" @click="saveFile">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-floppy me-1"></i>
                {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
              </button>
            </div>
          </div>
          <div v-else class="text-center py-5" style="color:var(--text-muted)">
            <i class="bi bi-file-plus fs-2 d-block mb-2"></i>
            <span class="small">Fayl qo'shing</span>
          </div>
        </div>
      </div>
    </div>
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
    const activeFile = ref(null);
    const showCreate = ref(false);
    const newProjectName = ref('');
    const saving = ref(false);
    const unsaved = ref(false);

    const loadProjects = async () => {
      try {
        const { data } = await api.get('/code');
        projects.value = data;
      } catch (_) {}
    };

    const selectProject = async (p) => {
      try {
        const { data } = await api.get(`/code/${p._id}`);
        activeProject.value = data;
        activeFile.value = data.files[0] || null;
        unsaved.value = false;
      } catch (_) {}
    };

    const createProject = async () => {
      if (!newProjectName.value.trim()) return;
      try {
        const { data } = await api.post('/code', { name: newProjectName.value });
        projects.value.unshift(data);
        newProjectName.value = '';
        showCreate.value = false;
        selectProject(data);
      } catch (_) {}
    };

    const deleteProject = async (id) => {
      if (!confirm("Loyihani o'chirasizmi?")) return;
      try {
        await api.delete(`/code/${id}`);
        projects.value = projects.value.filter((p) => p._id !== id);
        if (activeProject.value?._id === id) { activeProject.value = null; activeFile.value = null; }
      } catch (_) {}
    };

    const addFile = () => {
      const name = prompt('Fayl nomi (masalan: index.js)');
      if (!name) return;
      const ext = name.split('.').pop();
      const langMap = { js: 'javascript', html: 'html', css: 'css', py: 'python' };
      const newFile = { name, language: langMap[ext] || 'javascript', content: '' };
      activeProject.value.files.push(newFile);
      activeFile.value = newFile;
    };

    const saveFile = async () => {
      if (!activeProject.value || !activeFile.value) return;
      saving.value = true;
      try {
        const { data } = await api.put(`/code/${activeProject.value._id}/file`, {
          fileName: activeFile.value.name,
          language: activeFile.value.language,
          content: activeFile.value.content
        });
        activeProject.value = data;
        unsaved.value = false;
      } catch (_) {} finally {
        saving.value = false;
      }
    };

    onMounted(loadProjects);

    return { projects, activeProject, activeFile, showCreate, newProjectName, saving, unsaved, createProject, deleteProject, addFile, saveFile, selectProject };
  }
};
</script>

<style scoped>
.project-item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 0.7rem; border-radius: 8px;
  cursor: pointer; transition: background 0.15s;
  color: var(--text-muted); font-size: 0.88rem;
  margin-bottom: 0.25rem;
}
.project-item:hover { background: rgba(79,70,229,0.08); color: var(--text-light); }
.project-item.active { background: rgba(79,70,229,0.15); color: #818cf8; }
.del-btn { background: none; border: none; color: transparent; cursor: pointer; font-size: 0.75rem; padding: 0; }
.project-item:hover .del-btn { color: #ef4444; }

.file-tab {
  padding: 4px 12px; font-size: 0.82rem; border: none;
  background: transparent; color: var(--text-muted);
  border-radius: 6px; cursor: pointer; transition: all 0.15s;
}
.file-tab:hover { background: rgba(79,70,229,0.1); color: var(--text-light); }
.file-tab.active { background: rgba(79,70,229,0.2); color: #818cf8; }
.file-tab.add-file { color: var(--primary); }

.code-editor {
  width: 100%; min-height: 380px;
  background: #0a0a14; border: none; outline: none;
  color: #a5b4fc; font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9rem; padding: 1rem 1.2rem;
  resize: none; line-height: 1.7;
}
</style>

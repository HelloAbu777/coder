<template>
  <div class="container-fluid py-4">
    <div class="row g-4">
      <!-- Proyektlar panel -->
      <div class="col-lg-3">
        <div class="card-dark p-3" style="height:calc(100vh - 120px);overflow-y:auto">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fw-semibold small" style="color:var(--text-light)">Loyihalar ({{ projects.length }}/20)</span>
            <button class="btn btn-sm btn-primary" @click="showNewProject = true">
              <i class="bi bi-plus"></i>
            </button>
          </div>

          <!-- Yangi loyiha -->
          <div v-if="showNewProject" class="mb-3">
            <input v-model="newProjectName" class="form-control form-control-sm mb-2" placeholder="Loyiha nomi" />
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-primary flex-grow-1" @click="createProject">Yaratish</button>
              <button class="btn btn-sm btn-outline-secondary" @click="showNewProject = false; newProjectName = ''">Bekor</button>
            </div>
          </div>

          <div
            v-for="p in projects" :key="p._id"
            class="d-flex align-items-center justify-content-between px-3 py-2 rounded mb-2"
            :style="activeProject?._id === p._id ? 'background:rgba(79,70,229,0.15)' : 'background:var(--bg-card2)'"
            style="cursor:pointer"
            @click="selectProject(p)">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-folder" style="color:var(--warning)"></i>
              <span class="small text-truncate" style="color:var(--text-light);max-width:120px">{{ p.name }}</span>
            </div>
            <button class="btn btn-sm p-0" style="color:var(--danger);opacity:0.6" @click.stop="deleteProject(p._id)">
              <i class="bi bi-trash small"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Editor -->
      <div class="col-lg-9">
        <div v-if="!activeProject" class="card-dark d-flex align-items-center justify-content-center" style="height:calc(100vh - 120px)">
          <div class="text-center" style="color:var(--text-muted)">
            <i class="bi bi-code-slash fs-1 d-block mb-3"></i>
            <p>Loyiha tanlang yoki yangi yarating</p>
          </div>
        </div>

        <div v-else class="card-dark" style="height:calc(100vh - 120px);overflow:hidden;display:flex;flex-direction:column">
          <!-- Fayllar -->
          <div class="d-flex align-items-center gap-2 px-3 py-2 flex-wrap" style="border-bottom:1px solid var(--border)">
            <span class="small fw-semibold me-2" style="color:var(--text-muted)">{{ activeProject.name }}</span>
            <button
              v-for="f in activeProject.files" :key="f.name"
              class="btn btn-sm px-3 py-1"
              :class="activeFile?.name === f.name ? 'btn-primary' : 'btn-outline-secondary'"
              style="font-size:0.75rem"
              @click="activeFile = f">
              {{ f.name }}
            </button>
            <button class="btn btn-sm btn-outline-secondary px-2 py-1" style="font-size:0.75rem" @click="showNewFile = true">
              <i class="bi bi-plus"></i> Fayl
            </button>
          </div>

          <!-- Yangi fayl -->
          <div v-if="showNewFile" class="px-3 py-2 d-flex gap-2" style="border-bottom:1px solid var(--border)">
            <input v-model="newFileName" class="form-control form-control-sm" placeholder="fayl.js" style="max-width:180px" />
            <select v-model="newFileLang" class="form-select form-select-sm" style="max-width:130px">
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="nodejs">Node.js</option>
            </select>
            <button class="btn btn-sm btn-primary" @click="addFile">Qo'shish</button>
            <button class="btn btn-sm btn-outline-secondary" @click="showNewFile = false">Bekor</button>
          </div>

          <!-- Kod textarea -->
          <div class="flex-grow-1 position-relative">
            <textarea
              v-if="activeFile"
              v-model="activeFile.content"
              class="w-100 h-100 p-3"
              style="background:var(--bg-dark);color:#e2e8f0;border:none;resize:none;font-family:'Courier New',monospace;font-size:14px;line-height:1.6;outline:none"
              spellcheck="false"
            ></textarea>
            <div v-else class="d-flex align-items-center justify-content-center h-100" style="color:var(--text-muted)">
              Fayl tanlang
            </div>
          </div>

          <!-- Saqlash -->
          <div class="px-3 py-2 d-flex justify-content-between align-items-center" style="border-top:1px solid var(--border)">
            <span class="small" style="color:var(--text-muted)">
              {{ activeFile ? `${activeFile.language} — ${Math.round((activeFile.content?.length || 0) / 1024 * 10) / 10}KB / 1MB` : '' }}
            </span>
            <button class="btn btn-sm btn-primary" :disabled="!activeFile || saving" @click="saveFile">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-floppy me-1"></i>Saqlash
            </button>
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
    const saving = ref(false);
    const showNewProject = ref(false);
    const showNewFile = ref(false);
    const newProjectName = ref('');
    const newFileName = ref('');
    const newFileLang = ref('javascript');

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
      } catch (_) {}
    };

    const createProject = async () => {
      if (!newProjectName.value.trim()) return;
      try {
        const { data } = await api.post('/code', { name: newProjectName.value });
        projects.value.unshift(data);
        activeProject.value = data;
        activeFile.value = null;
        newProjectName.value = '';
        showNewProject.value = false;
      } catch (_) {}
    };

    const deleteProject = async (id) => {
      try {
        await api.delete(`/code/${id}`);
        projects.value = projects.value.filter((p) => p._id !== id);
        if (activeProject.value?._id === id) { activeProject.value = null; activeFile.value = null; }
      } catch (_) {}
    };

    const addFile = () => {
      if (!newFileName.value.trim() || !activeProject.value) return;
      const file = { name: newFileName.value, language: newFileLang.value, content: '', size: 0 };
      activeProject.value.files.push(file);
      activeFile.value = file;
      newFileName.value = '';
      showNewFile.value = false;
    };

    const saveFile = async () => {
      if (!activeFile.value || !activeProject.value) return;
      saving.value = true;
      try {
        const { data } = await api.put(`/code/${activeProject.value._id}/file`, {
          fileName: activeFile.value.name,
          language: activeFile.value.language,
          content: activeFile.value.content
        });
        activeProject.value = data;
        activeFile.value = data.files.find((f) => f.name === activeFile.value.name);
      } catch (_) {} finally {
        saving.value = false;
      }
    };

    onMounted(loadProjects);

    return { projects, activeProject, activeFile, saving, showNewProject, showNewFile, newProjectName, newFileName, newFileLang, loadProjects, selectProject, createProject, deleteProject, addFile, saveFile };
  }
};
</script>

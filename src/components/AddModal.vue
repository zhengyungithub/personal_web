<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden transform transition-all scale-100">
      <div class="bg-zen-green-500 px-6 py-4 flex justify-between items-center">
        <h3 class="text-white text-lg font-semibold">{{ title }}</h3>
        <button @click="$emit('close')" class="text-white hover:text-zen-green-100 transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      
      <div class="p-6 max-h-[80vh] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-for="(field, key) in fields" :key="key" class="space-y-1">
            <label :for="key" class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
            
            <textarea 
              v-if="field.type === 'textarea'" 
              :id="key" 
              v-model="formData[key]" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-green-500 focus:border-transparent transition-all outline-none resize-none"
              required
            ></textarea>
            
            <input 
              v-else-if="field.type === 'file'" 
              type="file" 
              :id="key" 
              @change="handleFileUpload(key, $event)"
              accept="image/*"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-green-500 focus:border-transparent transition-all outline-none"
            >
            
            <input 
              v-else 
              :type="field.type || 'text'" 
              :id="key" 
              v-model="formData[key]" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-green-500 focus:border-transparent transition-all outline-none"
              required
            >
          </div>
          
          <div class="pt-4 flex justify-end space-x-3">
            <button type="button" @click="$emit('close')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              取消
            </button>
            <button type="submit" class="px-6 py-2 bg-zen-green-500 hover:bg-zen-green-600 text-white rounded-lg shadow-md transition-colors transform hover:scale-105 active:scale-95">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  title: String,
  schema: Object, // { key: { label: 'Name', type: 'text' } }
  initialData: Object
});

const emit = defineEmits(['close', 'save']);

const formData = reactive({});

// Reset form when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Initialize form data based on schema and initialData
    for (const key in props.schema) {
      formData[key] = props.initialData ? (props.initialData[key] || '') : '';
    }
  }
});

const fields = props.schema;

const handleFileUpload = (key, event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData[key] = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = () => {
  emit('save', { ...formData });
  emit('close');
};
</script>

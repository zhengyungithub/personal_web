<template>
  <div class="min-h-screen bg-zen-green-50 text-gray-800 font-sans selection:bg-zen-green-200 selection:text-zen-green-900">
    <!-- Navbar -->
    <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-zen-green-100 transition-all duration-300">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="text-2xl font-bold text-zen-green-700 tracking-tight flex items-center gap-2">
          <i class="fas fa-leaf text-zen-green-500"></i>
          <span>{{ data.profile.name }}</span>
        </div>
        <ul class="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <li v-for="link in navLinks" :key="link.href">
            <a :href="link.href" class="hover:text-zen-green-600 transition-colors py-2 border-b-2 border-transparent hover:border-zen-green-400">{{ link.text }}</a>
          </li>
        </ul>
        <button class="md:hidden text-gray-600 hover:text-zen-green-600">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="relative pt-32 pb-20 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-zen-green-50 to-white -z-10"></div>
      <div class="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6 animate-fade-in-up">
          <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            <span class="block">你好，我是 <span class="text-zen-green-600">{{ data.profile.name }}</span></span>
            <span class="text-2xl md:text-3xl text-zen-green-200 font-bold tracking-widest uppercase block mt-2 w-full text-center">ZHENGYUN</span>
          </h1>
          <p class="text-lg text-gray-600 leading-relaxed max-w-lg">
            {{ data.profile.bio.split('。')[0] }}。
          </p>
          <div class="flex gap-4 pt-4">
            <a href="#projects" class="px-8 py-3 bg-zen-green-600 hover:bg-zen-green-700 text-white font-medium rounded-full shadow-lg shadow-zen-green-200 transition-all transform hover:-translate-y-1">
              查看作品
            </a>
            <a href="#contact" class="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-full border border-gray-200 shadow-sm transition-all transform hover:-translate-y-1">
              联系我
            </a>
          </div>
        </div>
        <div class="relative flex justify-center md:justify-end animate-fade-in">
          <div class="relative w-72 h-72 md:w-96 md:h-96">
            <div class="absolute inset-0 bg-zen-green-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <!-- Carousel Container -->
            <div class="relative w-full h-full overflow-hidden rounded-[2rem] shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition-all duration-500">
              <transition-group name="fade">
                <img 
                  v-for="(img, index) in avatarList" 
                  :key="img"
                  v-show="currentAvatarIndex === index"
                  :src="img" 
                  alt="Profile" 
                  class="absolute inset-0 w-full h-full object-cover"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  decoding="async"
                  :fetchpriority="index === 0 ? 'high' : 'auto'"
                />
              </transition-group>
            </div>
            <!-- Indicators -->
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              <div 
                v-for="(_, index) in avatarList" 
                :key="index"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="currentAvatarIndex === index ? 'bg-zen-green-500 w-4' : 'bg-zen-green-200'"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white relative group">
      <div class="container mx-auto px-6">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">关于我</h2>
            <div class="h-1 w-20 bg-zen-green-500 mt-2 rounded-full"></div>
          </div>
          <button v-if="isEditMode" @click="openAddModal('about')" class="w-10 h-10 rounded-full bg-zen-green-100 text-zen-green-600 hover:bg-zen-green-600 hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:opacity-100 opacity-0 transform translate-y-2 group-hover:translate-y-0" title="添加经历">
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-8">
            <div class="prose prose-lg text-gray-600">
              <!-- 个人简介已移除 -->
            </div>
            <!-- Education -->
            <div class="bg-zen-green-50 rounded-2xl p-8 border border-zen-green-100 relative group/card hover:shadow-lg transition-all duration-300">
              <button v-if="isEditMode" @click="openAddModal('education')" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-zen-green-500 hover:bg-zen-green-500 hover:text-white flex items-center justify-center transition-all shadow-sm opacity-0 group-hover/card:opacity-100" title="添加教育经历">
                <i class="fas fa-plus text-xs"></i>
              </button>
              <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="fas fa-graduation-cap text-zen-green-500"></i> 教育背景
                <button @click="openTranscriptPreview" class="ml-auto px-3 py-1 text-sm rounded-full bg-zen-green-100 text-zen-green-700 hover:bg-zen-green-600 hover:text-white transition-all">
                  查看成绩单
                </button>
              </h3>
              <div v-for="edu in data.education" :key="edu.id" class="mb-6 last:mb-0 border-l-2 border-zen-green-200 pl-4 ml-1 relative">
                <div class="absolute -left-[21px] top-1 w-3 h-3 bg-zen-green-500 rounded-full ring-4 ring-white"></div>
                <div class="flex justify-between items-start flex-wrap gap-2 mb-1">
                  <h4 class="font-semibold text-lg text-gray-800">{{ edu.school }}</h4>
                  <span class="text-sm text-zen-green-600 font-medium bg-white px-2 py-0.5 rounded-full shadow-sm">{{ edu.period }}</span>
                </div>
                <p class="text-gray-600 mb-2">{{ edu.degree }} · {{ edu.major }}</p>
                <p class="text-sm text-gray-500 whitespace-pre-line">{{ edu.details }}</p>
              </div>
            </div>
          </div>
          <div class="space-y-6">
            <!-- Work Experience (Short) -->
            <div class="bg-white rounded-2xl p-8 border border-zen-green-100 shadow-sm relative group/work hover:shadow-md transition-all min-h-[280px]">
              <button v-if="isEditMode" @click="openAddModal('work')" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-zen-green-50 text-zen-green-500 hover:bg-zen-green-500 hover:text-white flex items-center justify-center transition-all shadow-sm opacity-0 group-hover/work:opacity-100" title="添加工作经历">
                <i class="fas fa-plus text-xs"></i>
              </button>
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-briefcase text-zen-green-500"></i> 实习经历
              </h3>
              <div v-for="job in data.work" :key="job.id" class="mb-4 last:mb-0">
                <h4 class="font-semibold text-gray-800">{{ job.company }}</h4>
                <p class="text-sm text-zen-green-600 mb-1">{{ job.role }} | {{ job.period }}</p>
                <p class="text-sm text-gray-500">{{ job.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <div v-if="showTranscriptPreview" class="fixed inset-0 z-50 flex items-center justify-center" @click="closeTranscriptPreview">
      <div class="bg-white rounded-2xl shadow-2xl p-4 max-w-lg" @click.stop>
        <img :src="transcriptImage" alt="成绩单" class="max-w-full h-auto rounded-lg cursor-zoom-in" loading="lazy" decoding="async" @click.stop="openTranscriptZoom">
      </div>
    </div>
    
    <div v-if="showTranscriptZoom" class="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" @click="closeTranscriptZoom">
      <div class="bg-white rounded-2xl shadow-2xl p-4 max-w-[90vw] max-h-[90vh]" @click.stop>
        <div class="overflow-auto max-w-[85vw] max-h-[80vh] rounded-lg cursor-move" @mousemove="panTranscriptOnMove">
          <img :src="transcriptImage" alt="成绩单" class="max-w-none w-auto h-auto" loading="lazy" decoding="async">
        </div>
      </div>
    </div>

    <!-- Projects Section -->
    <section id="projects" class="py-20 bg-zen-green-50 relative">
      <div class="container mx-auto px-6">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">项目经历</h2>
            <div class="h-1 w-20 bg-zen-green-500 mt-2 rounded-full"></div>
          </div>
          <button v-if="isEditMode" @click="openAddModal('project')" class="px-4 py-2 bg-zen-green-600 hover:bg-zen-green-700 text-white rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            <i class="fas fa-plus"></i>
            <span class="text-sm font-medium">添加项目</span>
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div v-for="project in data.projects" :key="project.id" class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div class="h-48 bg-zen-green-100 relative overflow-hidden">
              <!-- Project image -->
              <img v-if="project.image" :src="project.image" :alt="project.title" class="w-full h-full object-cover" loading="lazy" decoding="async">
              <div v-else class="absolute inset-0 flex items-center justify-center text-zen-green-300">
                <i class="fas fa-laptop-code text-6xl opacity-50"></i>
              </div>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button @click="openProjectDetail(project)" class="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-zen-green-50">查看详情</button>
              </div>
            </div>
            <div class="p-8">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 group-hover:text-zen-green-600 transition-colors">{{ project.title }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ project.role }} | {{ project.period }}</p>
                </div>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4 whitespace-pre-line">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-zen-green-50 text-zen-green-700 text-xs font-medium rounded-full border border-zen-green-100">Vue 3</span>
                <span class="px-3 py-1 bg-zen-green-50 text-zen-green-700 text-xs font-medium rounded-full border border-zen-green-100">Tailwind</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="pt-16 pb-8 bg-white relative group">
      <div class="container mx-auto px-6">
        <div class="mb-10">
          <div class="flex justify-between items-end mb-6">
            <div>
              <h2 class="text-3xl font-bold text-gray-900">证书</h2>
              <div class="h-1 w-20 bg-zen-green-500 mt-2 rounded-full"></div>
            </div>
            <div v-if="isEditMode" class="flex gap-2">
              <button @click="openAddModal('certificate')" class="w-10 h-10 rounded-full bg-zen-green-100 text-zen-green-600 hover:bg-zen-green-600 hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:opacity-100 opacity-0 transform translate-y-2 group-hover:translate-y-0" title="添加证书">
                <i class="fas fa-plus"></i>
              </button>
              <button @click="toggleDeleteMode('certificate')" class="w-10 h-10 rounded-full bg-zen-green-100 text-zen-green-600 hover:bg-zen-green-600 hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:opacity-100 opacity-0 transform translate-y-2 group-hover:translate-y-0" title="删除证书">
                <i class="fas fa-minus"></i>
              </button>
            </div>
          </div>
          <div class="bg-zen-green-50 rounded-3xl p-8 border border-zen-green-100">
            <div class="flex flex-wrap gap-3">
              <div v-for="(cert, index) in data.certificates" :key="index" 
                   class="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:shadow-md hover:text-zen-green-600 transition-all cursor-default border border-gray-100 relative"
                   @mouseenter="showCertificateImage(cert, $event)"
                   @mouseleave="scheduleHideCertificateImage">
                {{ cert.name }}
                <div v-if="isEditMode" class="absolute top-0 right-0 flex gap-1 p-1">
                  <button v-if="deleteMode === 'certificate'" @click.stop="deleteItem('certificates', index)" 
                          class="w-5 h-5 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all text-xs"
                          title="删除证书">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button @click.stop="openEditModal('certificate', cert, index)" 
                          class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all text-xs"
                          title="编辑证书">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex justify-between items-end mb-6">
            <div>
              <h2 class="text-3xl font-bold text-gray-900">技能</h2>
              <div class="h-1 w-20 bg-zen-green-500 mt-2 rounded-full"></div>
            </div>
            <div v-if="isEditMode" class="flex gap-2">
              <button @click="openAddModal('skill')" class="w-10 h-10 rounded-full bg-zen-green-100 text-zen-green-600 hover:bg-zen-green-600 hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:opacity-100 opacity-0 transform translate-y-2 group-hover:translate-y-0" title="添加技能">
                <i class="fas fa-plus"></i>
              </button>
              <button @click="toggleDeleteMode('skill')" class="w-10 h-10 rounded-full bg-zen-green-100 text-zen-green-600 hover:bg-zen-green-600 hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:opacity-100 opacity-0 transform translate-y-2 group-hover:translate-y-0" title="删除技能">
                <i class="fas fa-minus"></i>
              </button>
            </div>
          </div>
          <div class="bg-zen-green-50 rounded-3xl p-8 border border-zen-green-100">
            <div class="flex flex-wrap gap-4">
              <div v-for="(skill, index) in normalizedSkills" :key="skill.id || skill.name || index" class="bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-1.5 hover:shadow-md transition-all relative w-fit max-w-full overflow-hidden" :class="isEditMode ? 'pr-14' : ''">
                <div class="text-gray-800 font-medium truncate">{{ skill.name }}</div>
                <div v-if="isEditMode" class="absolute top-2 right-2 flex gap-1">
                  <button v-if="deleteMode === 'skill'" @click="deleteItem('skills', index)" class="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all text-xs" title="删除技能">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button @click="openEditModal('skill', data.skills[index], index)" class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all text-xs" title="编辑技能">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="showCertificatePopup && currentCertificate" 
           class="fixed z-50 bg-white rounded-2xl shadow-2xl p-4 max-w-lg"
           :style="{ top: popupPosition.y + 'px', left: popupPosition.x + 'px' }"
           @mouseenter="cancelHideCertificateImage"
           @mouseleave="hideCertificateImage">
        <img v-if="currentCertificate.image" :src="currentCertificate.image" :alt="currentCertificate.name" class="max-w-full h-auto rounded-lg cursor-zoom-in" loading="lazy" decoding="async" @click.stop="openCertificateZoom(currentCertificate)">
        <div v-else class="text-gray-500 text-center py-8">暂无证书图片</div>
      </div>
      
      <div v-if="showCertificateZoom && zoomCertificate" class="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" @click="closeCertificateZoom">
        <div class="bg-white rounded-2xl shadow-2xl p-4 max-w-[90vw] max-h-[90vh]" @click.stop>
          <img :src="zoomCertificate.image" :alt="zoomCertificate.name" class="max-w-[85vw] max-h-[80vh] w-auto h-auto rounded-lg cursor-zoom-out" loading="eager" decoding="async" @click="closeCertificateZoom">
        </div>
      </div>
    </section>

    <!-- Interests Section -->
    <section id="interests" class="pt-6 pb-10 bg-white relative">
      <div class="container mx-auto px-6">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">兴趣特长</h2>
            <div class="h-1 w-20 bg-zen-green-500 mt-2 rounded-full"></div>
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-zen-green-50 rounded-2xl p-8 border border-zen-green-100 relative group/card hover:shadow-lg transition-all duration-300">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-camera text-zen-green-500"></i> 摄影
            </h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              熟练使用后期软件进行后期调色与构图优化，具备较强审美能力与细节把控力，可辅助产品截图美化、活动海报设计等宣传材料制作。
            </p>
            <button @click="openPhotoGallery" class="px-4 py-2 bg-zen-green-600 hover:bg-zen-green-700 text-white font-medium rounded-full shadow-lg shadow-zen-green-200 transition-all transform hover:-translate-y-1">
              查看作品集
            </button>
          </div>
          
          <div class="bg-zen-green-50 rounded-2xl p-8 border border-zen-green-100 relative group/card hover:shadow-lg transition-all duration-300">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-pen-fancy text-zen-green-500"></i> 随笔写作
            </h3>
            <p class="text-gray-600 leading-relaxed">
              善于用文字记录思考与观察，撰写技术随笔、复盘报告，注重逻辑性与表达深度。能助力需求业务文档、复盘报告撰写，提升文档质量。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="visitor" class="py-12 bg-zen-green-50 relative">
      <div class="container mx-auto px-6">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900">访客互动</h2>
          <div class="h-1 w-20 bg-zen-green-500 mt-2 rounded-full"></div>
        </div>

        <div class="max-w-5xl mx-auto">
          <div class="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i class="fas fa-comment-dots text-zen-green-500"></i>
                联系表单
              </h3>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <i class="fas fa-eye text-zen-green-500"></i>
                <span>浏览次数: {{ visitorCount }}</span>
              </div>
            </div>

            <form class="space-y-4" method="POST" :action="visitorFormEndpoint" @submit.prevent="submitVisitorForm">
              <input type="text" name="_gotcha" v-model="visitorHoneypot" class="hidden" tabindex="-1" autocomplete="off">

              <p class="text-gray-600 leading-relaxed">
                有合作/交流/机会欢迎留言，我会通过邮件回复。
              </p>

              <div class="grid sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1" for="visitorName">姓名</label>
                  <input id="visitorName" name="name" v-model.trim="visitorName" type="text" autocomplete="name" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zen-green-500 focus:border-transparent transition-all outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1" for="visitorEmail">邮箱</label>
                  <input id="visitorEmail" name="email" v-model.trim="visitorEmail" type="email" autocomplete="email" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zen-green-500 focus:border-transparent transition-all outline-none">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="visitorSubject">主题</label>
                <input id="visitorSubject" name="subject" v-model.trim="visitorSubject" type="text" autocomplete="off" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zen-green-500 focus:border-transparent transition-all outline-none">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="visitorMessage">留言内容</label>
                <textarea id="visitorMessage" name="message" v-model.trim="visitorMessage" rows="4" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zen-green-500 focus:border-transparent transition-all outline-none resize-none"></textarea>
              </div>

              <div class="flex items-center justify-between gap-4">
                <p class="text-xs text-gray-500">
                  提交即表示同意将表单内容用于邮件联系。
                </p>
                <button type="submit" :disabled="visitorSubmitting || !isVisitorFormConfigured" class="px-6 py-2 bg-zen-green-600 hover:bg-zen-green-700 disabled:bg-zen-green-300 disabled:cursor-not-allowed text-white rounded-full shadow-md transition-all">
                  {{ visitorSubmitting ? '发送中…' : '提交' }}
                </button>
              </div>

              <div v-if="!isVisitorFormConfigured" class="text-xs text-gray-500">
                未配置表单服务，暂时无法提交。请设置 VITE_FORMSPREE_ENDPOINT 后再试。
              </div>

              <div v-if="visitorStatus === 'success'" class="text-sm text-zen-green-700 bg-zen-green-50 border border-zen-green-100 rounded-lg px-3 py-2">
                已发送，我会尽快回复。
              </div>
              <div v-else-if="visitorStatus === 'error'" class="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {{ visitorErrorText || '发送失败，请稍后重试。' }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-14 bg-zen-green-900 text-white relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-zen-green-800 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div class="container mx-auto px-6 relative z-10 text-center">
        <h2 class="text-3xl font-bold mb-8">联系方式</h2>
        <div class="flex flex-col md:flex-row justify-center gap-8 md:gap-16 mb-12">
          <div class="flex flex-col items-center gap-3 group">
            <div class="w-12 h-12 rounded-full bg-zen-green-800 flex items-center justify-center text-zen-green-300 group-hover:bg-zen-green-700 group-hover:text-white transition-all">
              <i class="fas fa-envelope text-xl"></i>
            </div>
            <span class="text-zen-green-100 group-hover:text-white transition-colors">{{ data.profile.email }}</span>
          </div>
          <div class="flex flex-col items-center gap-3 group">
            <div class="w-12 h-12 rounded-full bg-zen-green-800 flex items-center justify-center text-zen-green-300 group-hover:bg-zen-green-700 group-hover:text-white transition-all">
              <i class="fas fa-phone text-xl"></i>
            </div>
            <span class="text-zen-green-100 group-hover:text-white transition-colors">{{ data.profile.phone }}</span>
          </div>
          <div class="flex flex-col items-center gap-3 group">
            <div class="w-12 h-12 rounded-full bg-zen-green-800 flex items-center justify-center text-zen-green-300 group-hover:bg-zen-green-700 group-hover:text-white transition-all">
              <i class="fas fa-map-marker-alt text-xl"></i>
            </div>
            <span class="text-zen-green-100 group-hover:text-white transition-colors">{{ data.profile.location }}</span>
          </div>
        </div>
        
        <p class="text-zen-green-400 text-sm">
          © {{ new Date().getFullYear() }} {{ data.profile.name }}. Updates ongoing, stay tuned.
        </p>
      </div>
    </section>

    <!-- Modal -->
    <AddModal
      v-if="isEditMode"
      :is-open="isModalOpen"
      :title="modalTitle"
      :schema="currentSchema"
      :initial-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  
    <!-- Project Detail Modal -->
    <div v-if="showProjectDetail" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="bg-zen-green-500 px-6 py-4 flex justify-between items-center">
          <h3 class="text-white text-lg font-semibold">{{ currentProject?.title }}</h3>
          <button @click="showProjectDetail = false" class="text-white hover:text-zen-green-100 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-500">{{ currentProject?.role }} | {{ currentProject?.period }}</p>
          </div>
          <div class="mb-6">
            <div v-if="currentProject?.image" class="overflow-hidden rounded-lg mb-4">
              <img :src="currentProject.image" :alt="currentProject.title" 
                   class="w-full h-64 object-cover transition-transform duration-300 cursor-zoom-in"
                   :class="projectZoomed ? 'scale-[1.6] cursor-zoom-out' : 'scale-100'"
                   loading="eager"
                   decoding="async"
                   @click="toggleProjectZoom">
            </div>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ currentProject?.description }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-zen-green-50 text-zen-green-700 text-xs font-medium rounded-full border border-zen-green-100">Vue 3</span>
            <span class="px-3 py-1 bg-zen-green-50 text-zen-green-700 text-xs font-medium rounded-full border border-zen-green-100">Tailwind</span>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Photo Gallery Modal -->
    <div v-if="showPhotoGallery" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div class="bg-zen-green-500 px-6 py-4 flex justify-between items-center">
          <h3 class="text-white text-lg font-semibold">摄影作品集</h3>
          <button @click="showPhotoGallery = false" class="text-white hover:text-zen-green-100 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="relative h-[60vh] flex items-center justify-center">
            <button @click="prevPhoto" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10">
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <img 
              :src="photos[currentPhotoIndex]" 
              :alt="`摄影作品 ${currentPhotoIndex + 1}`" 
              class="max-w-full max-h-full object-contain"
              loading="eager"
              decoding="async"
            >
            
            <button @click="nextPhoto" class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div class="mt-4 flex justify-center gap-2">
            <button 
              v-for="(photo, index) in photos" 
              :key="index" 
              @click="currentPhotoIndex = index"
              class="w-3 h-3 rounded-full transition-colors"
              :class="currentPhotoIndex === index ? 'bg-zen-green-500' : 'bg-gray-300 hover:bg-zen-green-300'"
            ></button>
          </div>
          <div class="mt-4 text-center text-gray-500">
            {{ currentPhotoIndex + 1 }} / {{ photos.length }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useResumeData } from './data';
import AddModal from './components/AddModal.vue';

const { data, addItem, updateItem, deleteItem } = useResumeData();

const normalizedSkills = computed(() => {
  const raw = Array.isArray(data.skills) ? data.skills : [];
  return raw.map((skill) => {
    if (typeof skill === 'string') return { name: skill, level: 80 };
    const name = typeof skill?.name === 'string' ? skill.name : '';
    const parsed = Number(skill?.level);
    const level = Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 80;
    return { ...skill, name, level };
  });
});

// 权限控制
const isEditMode = ref(false);

const visitorFormEndpoint = (import.meta.env.VITE_CONTACT_ENDPOINT || import.meta.env.VITE_FORMSPREE_ENDPOINT || '').trim();
const isVisitorFormConfigured = computed(() => {
  if (!visitorFormEndpoint) return false;
  if (visitorFormEndpoint.includes('yourFormId')) return false;
  return true;
});
const visitorName = ref('');
const visitorEmail = ref('');
const visitorSubject = ref('');
const visitorMessage = ref('');
const visitorHoneypot = ref('');
const visitorSubmitting = ref(false);
const visitorStatus = ref('');
const visitorErrorText = ref('');
const visitorPageOpenAt = Date.now();

// 浏览次数统计
const visitorCount = ref(0);

const updateVisitorCount = () => {
  const count = localStorage.getItem('visitor_count');
  const newCount = count ? parseInt(count) + 1 : 1;
  localStorage.setItem('visitor_count', newCount.toString());
  visitorCount.value = newCount;
};

const submitVisitorForm = async () => {
  if (visitorSubmitting.value) return;
  if (visitorHoneypot.value) return;

  visitorErrorText.value = '';

  if (!isVisitorFormConfigured.value) {
    visitorStatus.value = 'error';
    visitorErrorText.value = '未配置表单服务（VITE_FORMSPREE_ENDPOINT）。';
    return;
  }

  const now = Date.now();
  if (now - visitorPageOpenAt < 800) {
    visitorStatus.value = 'error';
    visitorErrorText.value = '发送过快，请稍等片刻再提交。';
    return;
  }

  const lastSubmitAt = Number(localStorage.getItem('visitor_form_last_submit_at') || 0);
  if (Number.isFinite(lastSubmitAt) && lastSubmitAt > 0 && now - lastSubmitAt < 20000) {
    visitorStatus.value = 'error';
    visitorErrorText.value = '提交过于频繁，请稍后再试。';
    return;
  }

  const name = visitorName.value.trim();
  const email = visitorEmail.value.trim();
  const subject = visitorSubject.value.trim();
  const message = visitorMessage.value.trim();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name) {
    visitorStatus.value = 'error';
    visitorErrorText.value = '请填写姓名。';
    return;
  }
  if (!emailOk) {
    visitorStatus.value = 'error';
    visitorErrorText.value = '请填写正确的邮箱。';
    return;
  }
  if (!subject) {
    visitorStatus.value = 'error';
    visitorErrorText.value = '请填写主题。';
    return;
  }
  if (!message) {
    visitorStatus.value = 'error';
    visitorErrorText.value = '请填写留言内容。';
    return;
  }
  if (message.length > 2000) {
    visitorStatus.value = 'error';
    visitorErrorText.value = '留言内容过长，请控制在 2000 字以内。';
    return;
  }

  visitorSubmitting.value = true;
  visitorStatus.value = '';

  try {
    const targetUrl = new URL(visitorFormEndpoint, window.location.origin);
    const isFormspree = /(^|\.)formspree\.io$/i.test(targetUrl.hostname);

    const res = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(isFormspree ? {} : { 'Content-Type': 'application/json' })
      },
      body: isFormspree
        ? (() => {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('_gotcha', visitorHoneypot.value);
            return formData;
          })()
        : JSON.stringify({ name, email, subject, message, _gotcha: visitorHoneypot.value })
    });

    if (!res.ok) {
      visitorStatus.value = 'error';
      visitorErrorText.value = '发送失败，请稍后重试。';
      return;
    }

    visitorStatus.value = 'success';
    visitorName.value = '';
    visitorEmail.value = '';
    visitorSubject.value = '';
    visitorMessage.value = '';
    visitorHoneypot.value = '';
    localStorage.setItem('visitor_form_last_submit_at', String(Date.now()));
  } catch (e) {
    visitorStatus.value = 'error';
    visitorErrorText.value = '发送失败，请检查网络后重试。';
  } finally {
    visitorSubmitting.value = false;
  }
};

const navLinks = [
  { text: '首页', href: '#home' },
  { text: '关于', href: '#about' },
  { text: '项目', href: '#projects' },
  { text: '技能', href: '#skills' },
  { text: '兴趣', href: '#interests' },
  { text: '联系', href: '#contact' },
];

const isModalOpen = ref(false);
const currentSection = ref('');
const editData = ref(null);
const deleteMode = ref(null);
const editIndex = ref(null);

// Project detail modal
const showProjectDetail = ref(false);
const currentProject = ref(null);

// Photo gallery modal
const showPhotoGallery = ref(false);
const photos = ref([
  // 这里可以添加摄影作品的图片路径
  "/摄影作品1.png",
  "/摄影作品2.png",
  "/摄影作品3.png",
  "/摄影作品4.png",
  "/摄影作品5.png"
]);
const currentPhotoIndex = ref(0);



// Carousel Logic
const currentAvatarIndex = ref(0);
const avatarList = computed(() => data.profile.avatarList || [data.profile.avatar]);
const currentAvatarSrc = computed(() => {
  const list = avatarList.value;
  const idx = currentAvatarIndex.value;
  if (!Array.isArray(list) || list.length === 0) return '';
  return list[idx] || list[0];
});
let timer = null;

const preloadImages = (urls) => {
  if (!Array.isArray(urls) || urls.length === 0) return Promise.resolve();
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        })
    )
  );
};

const startCarousel = () => {
  if (avatarList.value.length > 1) {
    timer = setInterval(() => {
      currentAvatarIndex.value = (currentAvatarIndex.value + 1) % avatarList.value.length;
    }, 3000);
  }
};

onMounted(async () => {
  await preloadImages(avatarList.value);
  startCarousel();
  updateVisitorCount();

  // 检查URL参数
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'edit') {
    isEditMode.value = true;
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// ... rest of the script

const schemas = {
  education: {
    school: { label: '学校名称', type: 'text' },
    degree: { label: '学位', type: 'text' },
    major: { label: '专业', type: 'text' },
    period: { label: '时间段', type: 'text' },
    details: { label: '详细描述', type: 'textarea' }
  },
  work: {
    company: { label: '公司名称', type: 'text' },
    role: { label: '职位', type: 'text' },
    period: { label: '时间段', type: 'text' },
    description: { label: '工作描述', type: 'textarea' }
  },
  project: {
    title: { label: '项目名称', type: 'text' },
    role: { label: '担任角色', type: 'text' },
    period: { label: '时间段', type: 'text' },
    description: { label: '项目描述', type: 'textarea' }
  },
  skill: {
    name: { label: '技能名称', type: 'text' },
    level: { label: '熟练度(0-100)', type: 'number' }
  },
  certificate: {
    name: { label: '证书名称', type: 'text' },
    image: { label: '证书图片', type: 'file' }
  },
  profile: {
    name: { label: '姓名', type: 'text' },
    title: { label: '职位/标语', type: 'text' },
    bio: { label: '简介', type: 'textarea' },
    email: { label: '邮箱', type: 'text' },
    phone: { label: '电话', type: 'text' },
    location: { label: '所在地', type: 'text' },
    avatar: { label: '头像路径', type: 'text' }
  }
};

const modalTitle = computed(() => {
  const titles = {
    education: '添加教育经历',
    work: '添加工作经历',
    project: '添加项目',
    skill: '添加技能',
    certificate: '添加证书',
    profile: '编辑个人信息'
  };
  return titles[currentSection.value] || '添加内容';
});

const currentSchema = computed(() => schemas[currentSection.value] || {});

const openAddModal = (section, initialData = null) => {
  currentSection.value = section;
  editData.value = initialData || (section === 'profile' ? data.profile : null);
  editIndex.value = null;
  isModalOpen.value = true;
};

const openEditModal = (section, item, index) => {
  currentSection.value = section;
  if (section === 'skill') {
    if (typeof item === 'string') {
      editData.value = { name: item, level: 80 };
    } else {
      editData.value = { name: item?.name || '', level: item?.level ?? 80 };
    }
  } else if (section === 'certificate') {
    editData.value = { ...item };
  }
  editIndex.value = index;
  isModalOpen.value = true;
};

const toggleDeleteMode = (section) => {
  if (deleteMode.value === section) {
    deleteMode.value = null;
  } else {
    deleteMode.value = section;
  }
};

const openProjectDetail = (project) => {
  currentProject.value = project;
  showProjectDetail.value = true;
};

const openPhotoGallery = () => {
  currentPhotoIndex.value = 0;
  showPhotoGallery.value = true;
};

const nextPhoto = () => {
  currentPhotoIndex.value = (currentPhotoIndex.value + 1) % photos.value.length;
};

const prevPhoto = () => {
  currentPhotoIndex.value = (currentPhotoIndex.value - 1 + photos.value.length) % photos.value.length;
};

const handleSave = (formData) => {
  if (currentSection.value === 'profile') {
    updateItem('profile', 0, formData);
  } else if (currentSection.value === 'skill') {
    const parsed = Number(formData.level);
    const level = Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 80;
    const skillData = { name: formData.name, level };
    if (editIndex.value !== null) {
      const updatedSkills = [...data.skills];
      updatedSkills[editIndex.value] = skillData;
      updateItem('skills', 0, updatedSkills);
    } else {
      addItem('skills', skillData);
    }
  } else if (currentSection.value === 'certificate') {
    if (editIndex.value !== null) {
      const updatedCert = {
        ...data.certificates[editIndex.value],
        name: formData.name,
        image: formData.image || ''
      };
      const updatedCerts = [...data.certificates];
      updatedCerts[editIndex.value] = updatedCert;
      updateItem('certificates', 0, updatedCerts);
    } else {
      const certData = {
        id: Date.now(),
        name: formData.name,
        image: formData.image || ''
      };
      addItem('certificates', certData);
    }
  } else if (currentSection.value === 'project') {
    addItem('projects', formData);
  } else if (currentSection.value === 'education') {
    addItem('education', formData);
  } else if (currentSection.value === 'work') {
    addItem('work', formData);
  }
};

const showCertificatePopup = ref(false);
const currentCertificate = ref(null);
const popupPosition = ref({ x: 0, y: 0 });
const showCertificateZoom = ref(false);
const zoomCertificate = ref(null);
let certificateHideTimer = null;

const showTranscriptPreview = ref(false);
const showTranscriptZoom = ref(false);
const transcriptImage = '/成绩单.png';

const showCertificateImage = (cert, event) => {
  if (certificateHideTimer) {
    clearTimeout(certificateHideTimer);
    certificateHideTimer = null;
  }
  currentCertificate.value = cert;
  showCertificatePopup.value = true;
  
  if (event) {
    popupPosition.value = {
      x: event.clientX + 20,
      y: event.clientY + 20
    };
  }
};

const scheduleHideCertificateImage = () => {
  if (certificateHideTimer) clearTimeout(certificateHideTimer);
  certificateHideTimer = setTimeout(() => {
    hideCertificateImage();
  }, 150);
};

const cancelHideCertificateImage = () => {
  if (certificateHideTimer) {
    clearTimeout(certificateHideTimer);
    certificateHideTimer = null;
  }
};

const hideCertificateImage = () => {
  if (certificateHideTimer) {
    clearTimeout(certificateHideTimer);
    certificateHideTimer = null;
  }
  showCertificatePopup.value = false;
  currentCertificate.value = null;
};

const openCertificateZoom = (cert) => {
  if (!cert || !cert.image) return;
  zoomCertificate.value = cert;
  showCertificateZoom.value = true;
};

const closeCertificateZoom = () => {
  showCertificateZoom.value = false;
  zoomCertificate.value = null;
};



const openTranscriptPreview = () => {
  showTranscriptPreview.value = true;
};

const closeTranscriptPreview = () => {
  showTranscriptPreview.value = false;
  showTranscriptZoom.value = false;
};

const openTranscriptZoom = () => {
  showTranscriptPreview.value = false;
  showTranscriptZoom.value = true;
};

const closeTranscriptZoom = () => {
  showTranscriptZoom.value = false;
};

const panTranscriptOnMove = (event) => {
  const el = event.currentTarget;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = rect.width ? (event.clientX - rect.left) / rect.width : 0;
  const y = rect.height ? (event.clientY - rect.top) / rect.height : 0;
  const maxLeft = el.scrollWidth - el.clientWidth;
  const maxTop = el.scrollHeight - el.clientHeight;
  if (maxLeft > 0) el.scrollLeft = maxLeft * Math.min(Math.max(x, 0), 1);
  if (maxTop > 0) el.scrollTop = maxTop * Math.min(Math.max(y, 0), 1);
};
</script>
<style>
html {
  scroll-behavior: smooth;
}
.font-sans {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Fade Animation for Carousel */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

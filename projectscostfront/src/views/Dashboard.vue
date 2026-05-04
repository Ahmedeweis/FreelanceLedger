<template>
  <div class="min-h-screen bg-slate-50 text-slate-600 p-6 md:p-10 font-sans relative">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Freelance Ledger</h1>
          <p class="text-slate-500 mt-1">Track your income, pending balances, and monthly history.</p>
        </div>
        <div class="flex gap-3">
          <button @click="isRangeModalOpen = true"
            class="px-4 py-2 bg-white hover:bg-slate-50 transition rounded-lg font-medium shadow-sm border border-slate-200 text-slate-700 flex items-center gap-2"
            title="Calculate earnings for a specific range">
            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Calculator
          </button>
          <button @click="openAddProject"
            class="px-4 py-2 bg-white hover:bg-slate-50 transition rounded-lg font-medium shadow-sm border border-slate-200 text-slate-700 flex items-center gap-2">
            + Project
          </button>
          <button @click="openAddIncome"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg font-medium shadow-sm shadow-indigo-500/20 text-white flex items-center gap-2">
            + Income
          </button>
          <button @click="fetchData"
            class="p-2 bg-white hover:bg-slate-50 transition rounded-lg text-slate-500 border border-slate-200 shadow-sm"
            title="Refresh">
            <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
              </path>
            </svg>
          </button>
        </div>
      </header>
      <div v-if="error" class="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl shadow-sm">
        {{ error }}
      </div>
      <template v-else-if="!loading && summary">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <p class="text-sm font-medium text-slate-500 mb-1">Total Earned (Ever)</p>
            <p class="text-3xl font-bold text-slate-900">{{ formatCurrency(summary.total_earned) }}</p>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <!-- Card Header - clickable to toggle dropdown -->
            <button @click="showPendingDropdown = !showPendingDropdown"
              class="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 transition">
              <div>
                <p class="text-sm font-medium text-slate-500 mb-1">Total Pending</p>
                <p class="text-3xl font-bold text-rose-600">{{ formatCurrency(summary.pending.total_pending) }}</p>
              </div>
              <svg class="w-5 h-5 text-slate-400 transition-transform duration-200"
                :class="showPendingDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <!-- Dropdown List -->
            <div v-show="showPendingDropdown" class="border-t border-slate-100 bg-slate-50 px-4 py-3 space-y-2">
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pending Breakdown</p>
              <div v-if="summary.pending.projects.length === 0 && summary.pending.standalone.length === 0"
                class="text-slate-400 text-sm italic py-1">
                No pending payments.
              </div>
              <div v-for="p in summary.pending.projects" :key="p.id"
                class="flex justify-between items-center bg-white px-3 py-2.5 rounded-xl border border-slate-200/60 shadow-sm">
                <span class="text-sm text-slate-600 font-medium truncate pr-2">{{ p.name }}</span>
                <span class="text-sm font-black text-rose-500 shrink-0">{{ formatCurrency(p.amount) }}</span>
              </div>
              <div v-for="s in summary.pending.standalone" :key="s.id"
                class="flex justify-between items-center bg-white px-3 py-2.5 rounded-xl border border-indigo-100/80 border-l-4 border-l-indigo-500 shadow-sm">
                <span class="text-sm text-slate-600 font-medium truncate pr-2" title="Standalone Income">Standalone: {{
                  s.description }}</span>
                <span class="text-sm font-black text-rose-500 shrink-0">{{ formatCurrency(s.amount) }}</span>
              </div>
            </div>
          </div>
          <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-50"></div>
            <div class="relative z-10">
              <p class="text-sm font-medium text-indigo-600 mb-1">This Month's Income</p>
              <p class="text-3xl font-bold text-slate-900">{{ formatCurrency(summary.this_month_income) }}</p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <!-- Projects List -->
          <div class="lg:col-span-1 space-y-4">
            <!-- Header + Sort Controls -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 class="text-xl font-bold text-slate-900">Active Projects</h2>
              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-for="opt in sortOptions" :key="opt.key"
                  @click="setSort(opt.key)"
                  style="background-color:#4F39F6; color: white;"
                  :class="sortBy === opt.key
                    ? 'ring-2 ring-indigo-500/50 shadow-sm font-bold'
                    : 'opacity-90 hover:opacity-100'"
                  class="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs rounded-lg transition-all duration-150 flex items-center gap-1 border border-slate-200">
                  {{ opt.label }}
                  <span v-if="sortBy === opt.key" class="text-[10px] font-bold">
                    {{ sortDir === 'asc' ? '↑' : '↓' }}
                  </span>
                </button>
              </div>
            </div>
            <div v-for="project in sortedProjects" :key="project.id"
              class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-2">
                <div class="min-w-0 flex-1">
                  <h3 class="font-bold text-slate-900 truncate">{{ project.name }}</h3>
                  <p v-if="project.start_date" class="text-[10px] text-slate-500 mt-0.5">{{
                    formatDate(project.start_date) }}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span :class="statusColor(project.status)" class="text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider">
                    {{ project.status.replace('_', ' ') }}
                  </span>
                  <button @click="openEditProject(project)" class="text-slate-400 hover:text-indigo-600 transition"
                    title="Edit Project">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                      </path>
                    </svg>
                  </button>
                  <button @click="promptDeleteProject(project.id)" class="text-slate-400 hover:text-rose-600 transition"
                    title="Delete Project">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                      </path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex justify-between text-xs text-slate-500 mb-1">
                <span>Paid: <span class="font-medium text-slate-700">{{ formatCurrency(project.total_paid)
                    }}</span></span>
                <span>Total: <span class="font-medium text-slate-700">{{ formatCurrency(project.total_price)
                    }}</span></span>
              </div>
              <!-- Progress Bar -->
              <div class="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden border border-slate-200">
                <div class="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                  :style="{ width: progressPercentage(project.total_paid, project.total_price) + '%' }"></div>
              </div>
              <div class="text-xs font-medium"
                :class="project.remaining_balance > 0 ? 'text-amber-600' : 'text-emerald-600'">
                <span v-if="project.remaining_balance > 0">Pending: {{ formatCurrency(project.remaining_balance) }}</span>
                <span v-else>Fully Paid</span>
              </div>
            </div>
            <div v-if="projects.length === 0"
              class="text-slate-400 text-sm italic bg-slate-100 p-4 rounded-xl border border-slate-200 text-center">No
              active projects.</div>
          </div>
          <!-- Monthly Timeline -->
          <div class="lg:col-span-2 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Monthly Timeline
              </h2>
              <button @click="downloadTimelinePdf"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition text-white text-sm font-medium rounded-lg shadow-sm w-full sm:w-auto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>
            <div
              class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-px before:bg-slate-200">
              <div v-for="month in timeline" :key="month.month_key" class="relative flex items-start gap-4 group">
                <!-- Timeline Icon -->
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white shadow-sm z-10 mt-1">
                  <div class="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-100"></div>
                </div>
                <!-- Card -->
                <div
                  class="flex-1 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <h3 class="font-bold text-lg text-slate-900">{{ month.month_name }}</h3>
                    <span
                      class="bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-lg border border-emerald-700 shadow-md ring-1 ring-emerald-500/50">
                      {{ formatCurrency(month.total_received) }}
                    </span>
                  </div>
                  <div class="space-y-3">
                    <div v-if="month.entries.length === 0" class="text-slate-400 text-sm italic py-2">
                      No activity this month.
                    </div>
                    <div v-for="entry in month.entries" :key="entry.id"
                      class="p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                      :class="entry.is_received ? 'bg-slate-50 border border-slate-100' : 'bg-rose-50 border border-rose-100'">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-slate-900 truncate flex items-center gap-2">
                          <span v-if="!entry.is_received" class="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-200 shrink-0"
                            title="Pending"></span>
                          <span v-else class="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 shrink-0"
                            title="Received"></span>
                          <span class="truncate">{{ entry.description || 'Income Entry' }}</span>
                        </p>
                        <div class="flex flex-wrap items-center gap-2 mt-1.5">
                          <span class="text-xs text-slate-400 font-medium shrink-0">{{ formatDate(entry.date) }}</span>
                          <span v-if="entry.project"
                            class="bg-indigo-600 text-white border-indigo-700 text-[10px] px-2 py-0.5 rounded-md border font-black uppercase tracking-wide truncate max-w-[120px] sm:max-w-none shadow-md">
                            {{ entry.project.name }}
                          </span>
                          <span v-else
                            class="text-[10px] px-2 py-0.5 rounded-md border border-indigo-600 text-white bg-indigo-600 font-bold uppercase tracking-wide shadow-md">
                            Standalone
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-200/50 pt-2 sm:pt-0">
                        <div class="font-black text-sm shrink-0 tracking-tight" :class="entry.is_received ? 'text-emerald-500' : 'text-rose-500'">
                          {{ formatCurrency(entry.amount) }}
                        </div>
                        <div class="flex items-center gap-1 border-l border-slate-200 pl-3 shrink-0">
                          <button @click="openEditIncome(entry)"
                            class="text-slate-400 hover:text-indigo-600 transition p-1" title="Edit Income">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                              </path>
                            </svg>
                          </button>
                          <button @click="promptDeleteIncome(entry.id)"
                            class="text-slate-400 hover:text-rose-600 transition p-1" title="Delete Income">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16">
                              </path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    <!-- Date Range Calculator Modal -->
    <div v-if="isRangeModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div
        class="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 relative border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div class="flex items-center gap-2">
            <div class="p-2 bg-indigo-100 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900">Earnings Calculator</h3>
          </div>
          <button @click="isRangeModalOpen = false"
            class="p-2 text-slate-400 hover:text-slate-700 transition rounded-full hover:bg-slate-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">From</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input v-model="rangeStart" type="date"
                  class="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">To</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input v-model="rangeEnd" type="date"
                  class="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition">
              </div>
            </div>
          </div>
          <div v-if="rangeStats" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                <p class="text-sm font-medium text-slate-500 mb-1">Total Earned</p>
                <p class="text-3xl font-black text-indigo-600">{{ formatCurrency(rangeStats.total) }}</p>
                <p class="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">During {{ rangeStats.monthsCount }} months</p>
              </div>
              <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
                <p class="text-sm font-medium text-indigo-600 mb-1">Monthly Average</p>
                <p class="text-3xl font-black text-indigo-700">{{ formatCurrency(rangeStats.averageMonthly) }}</p>
                <p class="text-[10px] text-indigo-400 mt-1 uppercase tracking-tighter">Per month</p>
              </div>
            </div>
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Involved Projects</h4>
              <div v-if="rangeStats.projects.length === 0" class="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p class="text-slate-400 text-sm">No income entries found for this range.</p>
              </div>
              <div v-else class="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                <div v-for="p in rangeStats.projects" :key="p.name"
                  class="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                      </svg>
                    </div>
                    <span class="font-bold text-slate-800">{{ p.name }}</span>
                  </div>
                  <span class="font-black text-emerald-600">{{ formatCurrency(p.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p class="text-slate-400 text-sm">Select a date range to calculate your earnings.</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Modals -->
    <!-- Add Project Modal -->
    <div v-if="isProjectModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div
        class="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 relative border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="text-lg font-bold text-slate-900">{{ editingProjectId ? 'Edit Project' : 'Add New Project' }}</h3>
          <button @click="isProjectModalOpen = false"
            class="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-[#1a1a1a] transition-colors bg-white/10 rounded-full"><svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path  d="M18 6 6 18"></path>
              <path  d="m6 6 12 12"></path>
            </svg></button>
        </div>
        <form @submit.prevent="submitProject" class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
            <input v-model="projectForm.name" required type="text"
              class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Total Price *</label>
            <input v-model="projectForm.total_price" required type="number" step="0.01"
              class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input v-model="projectForm.start_date" type="date"
                class="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select v-model="projectForm.status"
              class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition">
              <option value="new">New</option>
              <option value="pending">Pending</option>
              <option value="at_risk">At Risk</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="isProjectModalOpen = false"
              class="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium transition">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50
             text-white rounded-lg font-medium shadow-sm">
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Add Income Modal -->
    <div v-if="isIncomeModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div
        class="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 relative border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="text-lg font-bold text-slate-900">{{ editingIncomeId ? 'Edit Income Entry' : 'Add Income Entry' }}
          </h3>
          <button @click="isIncomeModalOpen = false"
            class="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-[#1a1a1a] transition-colors bg-white/10 rounded-full"><svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path  d="M18 6 6 18"></path>
              <path  d="m6 6 12 12"></path>
            </svg></button>
        </div>
        <form @submit.prevent="submitIncome" class="p-5 space-y-4">
          <div class="relative">
            <label class="block text-sm font-medium text-slate-700 mb-1">Project (Optional)</label>
            <button type="button" @click="isProjectDropdownOpen = !isProjectDropdownOpen"
              class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-left text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition flex justify-between items-center">
              <span :class="!incomeForm.project_id ? 'text-slate-400 font-medium' : 'text-slate-900 font-medium'">{{ selectedProjectName }}</span>
              <svg class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="isProjectDropdownOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-if="isProjectDropdownOpen" class="absolute z-[60] mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div class="max-h-60 overflow-y-auto custom-scrollbar p-1">
                <div @click="selectProject(null)"
                  class="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition flex items-center justify-between"
                  :class="!incomeForm.project_id ? 'bg-indigo-50 font-bold text-indigo-700' : ''">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-slate-300"></div>
                    <span>Standalone Income</span>
                  </div>
                  <svg v-if="!incomeForm.project_id" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="my-1 border-t border-slate-100"></div>
                <div v-for="p in projects" :key="p.id" @click="selectProject(p.id)"
                  class="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition flex items-center justify-between"
                  :class="incomeForm.project_id === p.id ? 'bg-indigo-50 font-bold text-indigo-700' : ''">
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="w-2 h-2 rounded-full bg-indigo-400 shrink-0"></div>
                    <span class="truncate">{{ p.name }}</span>
                  </div>
                  <svg v-if="incomeForm.project_id === p.id" class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-slate-400 sm:text-sm">$</span>
              </div>
              <input v-model="incomeForm.amount" required type="number" step="0.01"
                class="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                placeholder="0.00">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input v-model="incomeForm.date" type="date"
                class="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input v-model="incomeForm.description" type="text" placeholder="e.g. First Payment"
              class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition">
          </div>
          <div class="flex items-center gap-2 pt-2">
            <input v-model="incomeForm.is_received" type="checkbox" id="is_received"
              class="w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500 focus:ring-2">
            <label for="is_received" class="text-sm font-medium text-slate-700">Payment Received?</label>
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="isIncomeModalOpen = false"
              class="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium transition">Cancel</button>
            <button type="submit" :disabled="isSubmitting"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-50 text-white rounded-lg font-medium shadow-sm">
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { getLedger, getProjects, createProject, createIncome, updateProject, deleteProject, updateIncome, deleteIncome } from '../services/api';
import jsPDF from 'jspdf';
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2';
const toast = useToast();
const loading = ref(true);
const error = ref(null);
const summary = ref(null);
const timeline = ref([]);
const projects = ref([]);
// Modal States
const isProjectModalOpen = ref(false);
const isIncomeModalOpen = ref(false);
const isRangeModalOpen = ref(false);
const isSubmitting = ref(false);
const editingProjectId = ref(null);
const editingIncomeId = ref(null);
// UI State
const showPendingDropdown = ref(false);
const isProjectDropdownOpen = ref(false);
const selectedProjectName = computed(() => {
  if (!incomeForm.value.project_id) return '-- Standalone Income --';
  const p = projects.value.find(proj => proj.id === incomeForm.value.project_id);
  return p ? p.name : '-- Standalone Income --';
});
const selectProject = (id) => {
  incomeForm.value.project_id = id;
  isProjectDropdownOpen.value = false;
};
// Date Range Search State
const rangeStart = ref('');
const rangeEnd = ref('');
const rangeStats = computed(() => {
  if (!rangeStart.value || !rangeEnd.value) return null;
  const start = new Date(rangeStart.value);
  const end = new Date(rangeEnd.value);
  end.setHours(23, 59, 59, 999);
  let total = 0;
  const involvedProjects = new Map();
  timeline.value.forEach(month => {
    month.entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate >= start && entryDate <= end && entry.is_received) {
        total += parseFloat(entry.amount);
        if (entry.project) {
          if (!involvedProjects.has(entry.project.id)) {
            involvedProjects.set(entry.project.id, {
              name: entry.project.name,
              amount: 0
            });
          }
          involvedProjects.get(entry.project.id).amount += parseFloat(entry.amount);
        } else {
          if (!involvedProjects.has('standalone')) {
            involvedProjects.set('standalone', {
              name: 'Standalone Income',
              amount: 0
            });
          }
          involvedProjects.get('standalone').amount += parseFloat(entry.amount);
        }
      }
    });
  });
  return {
    total,
    projects: Array.from(involvedProjects.values()).sort((a, b) => b.amount - a.amount),
    monthsCount: (() => {
      const start = new Date(rangeStart.value);
      const end = new Date(rangeEnd.value);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
      return months > 0 ? months : 1;
    })(),
    averageMonthly: (() => {
      const start = new Date(rangeStart.value);
      const end = new Date(rangeEnd.value);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
      const count = months > 0 ? months : 1;
      return total / count;
    })()
  };
});
// Sort State
const sortBy = ref('date');
const sortDir = ref('desc');
const sortOptions = [
  { key: 'date',   label: 'Date'   },
  { key: 'name',   label: 'Name'   },
  { key: 'amount', label: 'Amount' },
];
const setSort = (key) => {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortDir.value = key === 'name' ? 'asc' : 'desc';
  }
};
const sortedProjects = computed(() => {
  return [...projects.value].sort((a, b) => {
    let valA, valB;
    if (sortBy.value === 'date') {
      valA = a.start_date ? new Date(a.start_date).getTime() : 0;
      valB = b.start_date ? new Date(b.start_date).getTime() : 0;
    } else if (sortBy.value === 'name') {
      valA = a.name?.toLowerCase() ?? '';
      valB = b.name?.toLowerCase() ?? '';
      return sortDir.value === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      valA = parseFloat(a.total_price) || 0;
      valB = parseFloat(b.total_price) || 0;
    }
    return sortDir.value === 'asc' ? valA - valB : valB - valA;
  });
});
// Forms
const projectForm = ref({ name: '', total_price: '', start_date: '', status: 'new' });
const incomeForm = ref({ project_id: null, amount: '', date: '', description: '', is_received: true });
const openAddProject = () => {
  editingProjectId.value = null;
  projectForm.value = { name: '', total_price: '', start_date: '', status: 'new' };
  isProjectModalOpen.value = true;
};
const openEditProject = (project) => {
  editingProjectId.value = project.id;
  projectForm.value = {
    name: project.name,
    total_price: project.total_price,
    start_date: project.start_date ? project.start_date.split('T')[0] : '',
    status: project.status
  };
  isProjectModalOpen.value = true;
};
const openAddIncome = () => {
  editingIncomeId.value = null;
  incomeForm.value = { project_id: null, amount: '', date: '', description: '', is_received: true };
  isProjectDropdownOpen.value = false;
  isIncomeModalOpen.value = true;
};
const openEditIncome = (entry) => {
  editingIncomeId.value = entry.id;
  incomeForm.value = {
    project_id: entry.project ? entry.project.id : null,
    amount: entry.amount,
    date: entry.date ? entry.date.split('T')[0] : '',
    description: entry.description,
    is_received: entry.is_received
  };
  isProjectDropdownOpen.value = false;
  isIncomeModalOpen.value = true;
};
const promptDeleteProject = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4F39F6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });
  if (result.isConfirmed) {
    try {
      await deleteProject(id);
      await fetchData();
      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error("Error deleting project.");
    }
  }
};
const promptDeleteIncome = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4F39F6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });
  if (result.isConfirmed) {
    try {
      await deleteIncome(id);
      await fetchData();
      toast.success("Income entry deleted successfully");
    } catch (err) {
      toast.error("Error deleting income entry.");
    }
  }
};
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [ledgerData, projectsData] = await Promise.all([getLedger(), getProjects()]);
    summary.value = ledgerData.summary;
    timeline.value = ledgerData.timeline;
    projects.value = projectsData;
  } catch (err) {
    error.value = "Failed to load data. Please make sure the backend is running.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
const submitProject = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      ...projectForm.value,
      start_date: projectForm.value.start_date || undefined
    };
    if (editingProjectId.value) {
      await updateProject(editingProjectId.value, payload);
      toast.success("Project updated successfully");
    } else {
      await createProject(payload);
      toast.success("Project created successfully");
    }
    isProjectModalOpen.value = false;
    await fetchData();
  } catch (err) {
    toast.error("Error saving project.");
  } finally {
    isSubmitting.value = false;
  }
};
const submitIncome = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      ...incomeForm.value,
      date: incomeForm.value.date || undefined
    };
    if (editingIncomeId.value) {
      await updateIncome(editingIncomeId.value, payload);
      toast.success("Income entry updated successfully");
    } else {
      await createIncome(payload);
      toast.success("Income entry added successfully");
    }
    isIncomeModalOpen.value = false;
    await fetchData();
  } catch (err) {
    toast.error("Error saving income entry.");
  } finally {
    isSubmitting.value = false;
  }
};
const downloadTimelinePdf = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  // ── Title ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // slate-900
  doc.text('Freelance Ledger', pageWidth / 2, 20, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Monthly Income Timeline', pageWidth / 2, 28, { align: 'center' });
  // ── Table Header ───────────────────────────────────────
  const colMonth = 20;
  const colIncome = 120;
  let y = 42;
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.roundedRect(colMonth - 4, y - 6, pageWidth - 32, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Month', colMonth, y);
  doc.text('Total Income', colIncome, y);
  y += 10;
  // ── Rows ───────────────────────────────────────────────
  const months = timeline.value;
  let grandTotal = 0;
  months.forEach((month, index) => {
    // Zebra stripe
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(colMonth - 4, y - 5, pageWidth - 32, 9, 'F');
    }
    const received = parseFloat(month.total_received) || 0;
    grandTotal += received;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text(month.month_name, colMonth, y);
    // Color income: green if > 0, gray if 0
    if (received > 0) {
      doc.setTextColor(5, 150, 105); // emerald-600
    } else {
      doc.setTextColor(148, 163, 184); // slate-400
    }
    doc.text(received > 0 ? `$${received.toLocaleString()}` : '$0', colIncome, y);
    // Divider line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.2);
    doc.line(colMonth - 4, y + 4, colMonth + pageWidth - 32, y + 4);
    y += 9;
    // Page break if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });
  // ── Grand Total Footer ─────────────────────────────────
  y += 3;
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.roundedRect(colMonth - 4, y - 5, pageWidth - 32, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text('Grand Total', colMonth, y);
  doc.text(`$${grandTotal.toLocaleString()}`, colIncome, y);
  // ── Footer note ────────────────────────────────────────
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on ${today}`, pageWidth / 2, 290, { align: 'center' });
  doc.save('freelance-timeline.pdf');
};
onMounted(() => {
  fetchData();
});
const progressPercentage = (paid, total) => {
  if (!total || total == 0) return 0;
  const p = (parseFloat(paid) / parseFloat(total)) * 100;
  return p > 100 ? 100 : p;
};
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const statusColor = (status) => {
  switch (status) {
    case 'new':
      return 'bg-blue-600 text-white border-blue-700 shadow-[0_2px_10px_-3px_rgba(37,99,235,0.4)]';
    case 'completed':
      return 'bg-emerald-600 text-white border-emerald-700 shadow-[0_2px_10px_-3px_rgba(5,150,105,0.4)]';
    case 'pending':
      return 'bg-amber-500 text-white border-amber-600 shadow-[0_2px_10px_-3px_rgba(217,119,6,0.4)]';
    case 'at_risk':
      return 'bg-rose-600 text-white border-rose-700 shadow-[0_2px_10px_-3px_rgba(225,29,72,0.4)]';
    case 'canceled':
      return 'bg-slate-500 text-white border-slate-600 shadow-[0_2px_10px_-3px_rgba(71,85,105,0.3)]';
    default:
      return 'bg-slate-500 text-white border-slate-600';
  }
};
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

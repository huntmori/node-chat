const { createApp } = Vue;

createApp({
  data() {
    return {
      pageTitle: 'Node Chat Server',
      subtitle: 'TypeScript + Vue.js + MariaDB',
      counter: 0,
      stats: {
        status: 'online',
        users: 0,
        messages: 0,
        uptime: 0
      },
      loading: false,
      lastUpdate: new Date().toLocaleTimeString('ko-KR')
    };
  },
  methods: {
    incrementCounter() {
      this.counter++;
    },
    decrementCounter() {
      this.counter--;
    },
    resetCounter() {
      this.counter = 0;
    },
    async refreshStats() {
      this.loading = true;
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        this.stats = data;
        this.lastUpdate = new Date().toLocaleTimeString('ko-KR');
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        alert('통계를 불러오는데 실패했습니다.');
      } finally {
        this.loading = false;
      }
    },
    formatUptime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours}h ${minutes}m ${secs}s`;
    }
  },
  mounted() {
    // 초기 통계 로드
    this.refreshStats();
    
    // 10초마다 자동 새로고침
    setInterval(() => {
      this.refreshStats();
    }, 10000);
  }
}).mount('#app');

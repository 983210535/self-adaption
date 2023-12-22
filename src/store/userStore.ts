import { defineStore } from "pinia";
import { ref } from "vue";

// export const useUserStore = defineStore('userStore', {
//   state: () => {
//     return {
//       name: '丁真',
//       remark: '保持良好心情'
//     }
//   }
// })
interface Userinfo {
  nikeName: string;
}

export const useUserStore = defineStore('userStore', () => {
  const userinfo = ref<Userinfo>();

  const setUserinfo = (data: Userinfo) => {
    userinfo.value = data;
  };

  return {
    userinfo,
    setUserinfo
  }
}, {
  persist: { // 持久化存储的方式
    enabled: true,
    strategies: [
      {
        //key的名称
        // key: 'my_user',
        //更改默认存储，我更改为localStorage
        storage: localStorage,
        // 可以选择哪些进入local存储，这样就不用全部都进去存储了
        // paths 默认是全部进去存储  ['想让哪个存储写哪个的可以']
        // paths: ['list']
      }
    ]
  }
})
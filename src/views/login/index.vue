<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
// import { useUserStore } from "@/store/modules/user"
import { User, Lock, Key, Picture, Loading } from "@element-plus/icons-vue"
// import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import { type FormInstance, FormRules } from "element-plus"
import { login } from "@/api/login";
import { ElMessage } from "element-plus"
import { useRouterStore, type Nav } from "@/store/routerStore";
import { getMenu } from "@/api/login";

const routerStore = useRouterStore();
routerStore.logout();

// import { getLoginCodeApi } from "@/api/login"
// import { type ILoginRequestData } from "@/api/login/types/login"
interface loginParams {
  j_username: string;
  j_password: string;
  type: string;
  code: string;
}

const router = useRouter()
const loginFormRef = ref<FormInstance | null>(null)

/** 登录按钮 Loading */
const loading = ref(false)
/** 验证码图片 URL */
const codeUrl = ref("")
/** 登录表单数据 */
const loginForm: loginParams = reactive({
  j_username: "chutian",
  j_password: "123456",
  type: "TEACHER",
  code: ''
})
/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  j_username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  j_password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
  ],
  // code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
}
/** 登录逻辑 */
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const res = await login(loginForm);
        console.log(res);
        
        if (res.code == 0) {
          if (routerStore.nav.length == 0) {
            const res = await getMenu();
            const res2 = arrFilter(res.data);
            routerStore.setNav(res2);
          }
          ElMessage.success('登陆成功');
          router.push({ path: "/" });
          localStorage.setItem('token', "Bearer " + res.data);
        }
      } catch (error) {
        
      }
      loading.value = false;
    } else {
      return false
    }
  })
};
const arrFilter = (arr: Nav[]) => {
  return arr.filter(item => {
    if (item.isEnabled != 1) {
      return false;
    }
    if (item.children && item.children.length > 0) {
      item.children = arrFilter(item.children);
    }
    return true;
  });
};
/** 创建验证码 */
const createCode = () => {
  // 先清空验证码的输入
  loginForm.code = ""
  // 获取验证码
  codeUrl.value = 'http://dummyimage.com/100x40/dcdfe6/000000.png&text=V3Admin';
}

/** 初始化验证码 */
createCode()
</script>

<template>
  <div class="login-container">
    <!-- <div>继续教育平台</div> -->
    <!-- <ThemeSwitch class="theme-switch" /> -->
    <div class="login-card">
      <div class="title">
        <img src="@/assets/images/123.jpg" />
      </div>
      <div class="content">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="j_username">
            <el-input
              v-model.trim="loginForm.j_username"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="j_password">
            <el-input
              v-model.trim="loginForm.j_password"
              placeholder="密码"
              type="j_password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-j_password
            />
          </el-form-item>
          <!-- <el-form-item prop="code">
            <el-input
              v-model.trim="loginForm.code"
              placeholder="验证码"
              type="text"
              tabindex="3"
              :prefix-icon="Key"
              maxlength="7"
              size="large"
            >
              <template #append>
                <el-image :src="codeUrl" @click="createCode" draggable="false">
                  <template #placeholder>
                    <el-icon><Picture /></el-icon>
                  </template>
                  <template #error>
                    <el-icon><Loading /></el-icon>
                  </template>
                </el-image>
              </template>
            </el-input>
          </el-form-item> -->
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin"> 登 录 </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  background-image: url(@/assets/images/login-banner.jpg);
  background-size: 100% 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    // width: 480px;
    width: 34em;
    border-radius: 1.5em;
    box-shadow: 0 0 .8em #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 11em;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>

<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header class="header">
      <div class="left_header">
        <img
          src="https://ruoruochen-img-bed.oss-cn-beijing.aliyuncs.com/img/202112052120216.jpeg"
          alt
        />
        <span>博客后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          unique-opened
          background-color="#313743"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="'/' + item.path"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ item2.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [
        {
          id: 2,
          authName: '文章管理',
          path: 'articles',
          children: [
            {
              id: 21,
              authName: '文章列表',
              path: 'articles',
              children: [],
              order: null,
            },
            {
              id: 22,
              authName: '新增文章',
              path: 'articles/add',
              children: [],
              order: null,
            },
          ],
          order: 2,
        },
        {
          id: 3,
          authName: '用户管理',
          path: 'users',
          children: [
            {
              id: 31,
              authName: '用户列表',
              path: 'users',
              children: [],
              order: 1,
            },
          ],
          order: 3,
        },
      ],
      isCollapse: false,
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //点击按钮，切换菜单的展开和折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left_header {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      border-radius: 50%;
    }
    span {
      color: white;
      font-size: 18px;
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #313743;
  .iconfont {
    margin-right: 10px;
  }
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  color: white;
  font-size: 12px;
  padding: 3px 0;
  letter-spacing: 0.2em;
  background-color: #495065;
  text-align: center;
  cursor: pointer;
}
.toggle-button :hover {
  color: #409eff;
}
</style>

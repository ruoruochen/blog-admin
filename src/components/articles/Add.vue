<template>
  <div>
    <!-- 面包屑导航 -->
    <crumb v-bind:data="crumbData"></crumb>

    <div class="admin-edit-article">
      <ul class="form-list">
        <li class="container">
          <span class="label">标题：</span>
          <el-input
            v-model="requestParams.title"
            placeholder="请输入内容"
            class="title-input"
            name="title"
          ></el-input>
        </li>
        <li class="container">
          <span class="label">标签：</span>
          <el-checkbox-group
            v-model="requestParams.tagList"
            :min="0"
            :max="5"
            class="checkbox-group"
          >
            <el-checkbox-button
              v-for="tag in tagsList"
              :label="tag.name"
              :key="tag.name"
              class="checkbox-item"
              >{{ tag.name }}</el-checkbox-button
            >
          </el-checkbox-group>
        </li>
        <li class="container">
          <span class="label">分类：</span>
          <el-checkbox-group
            v-model="requestParams.categoryList"
            :min="0"
            :max="5"
            class="checkbox-group"
          >
            <el-checkbox-button
              v-for="cate in catesList"
              :label="cate.name"
              :key="cate.name"
              class="checkbox-item"
              >{{ cate.name }}
            </el-checkbox-button>
          </el-checkbox-group>
        </li>
      </ul>
      <mavon-editor
        v-model="requestParams.content"
        class="editor-style"
        :ishljs="true"
        :scrollStyle="true"
      />
      <el-button
        type="primary"
        :circle="true"
        size="large"
        icon="el-icon-plus"
        class="action-icon"
        @click="
          () => {
            this.articleId ? updateArticle() : addArticle();
          }
        "
      />
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Add",
  data() {
    return {
      crumbData: ["首页", "文章管理", "添加文章"],
      tagsList: [],
      catesList: [],
      requestParams: {
        content: "",
        title: "",
        tagList: [],
        categoryList: [],
      },
      articleId: null,
      authorId: null,
    };
  },
  created() {
    this.articleId = this.$route.params.articleId;
    let userInfo = null;
    try {
      userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
    } catch (e) {
      console.log(e);
    }
    this.authorId = userInfo.userId;
    // 判断当前页面
    if (this.articleId) {
      // 初始化
      this.crumbData[2] = "修改文章";
      this.getArticleInfo();
    } else {
      this.crumbData[2] = "添加文章";
    }
    this.getTagsList();
    this.getCatesList();
  },
  methods: {
    async getArticleInfo() {
      const { data } = await this.$http.get(`article/${this.articleId}`);
      this.requestParams.content = data.content;
      this.requestParams.title = data.title;
      this.requestParams.tagList = data.tag.map((tag) => tag.name);
      this.requestParams.categoryList = data.categories.map((c) => c.name);
    },
    async getTagsList() {
      const { data } = await this.$http.get("tag/list");
      this.tagsList = data;
    },
    async getCatesList() {
      const { data } = await this.$http.get("category/list");
      this.catesList = data;
    },
    selectTags(tag) {
      const index = this.requestParams.tagSelectList.findIndex(
        (item) => item.name === tag.name
      );
      if (index) {
        this.requestParams.tagSelectList.splice(index, 1);
      } else {
        this.requestParams.tagSelectList.push(tag.name);
      }
    },
    selectCates(cate) {
      const index = this.requestParams.cateSelectList.findIndex(
        (item) => item.name === cate.name
      );
      if (index) {
        this.requestParams.cateSelectList.splice(index, 1);
      } else {
        this.requestParams.cateSelectList.push(cate.name);
      }
    },
    getTagsEffect(tag) {
      return this.requestParams.tagSelectList.findIndex(
        (item) => item.name === tag.name
      )
        ? "dark"
        : "plain";
    },
    addArticle() {
      if (!this.requestParams.title) {
        return this.$message.warning("标题不能为空");
      }
      const authorId = this.authorId;
      const { res } = this.$http.post("article/add", {
        ...this.requestParams,
        authorId,
      });
      console.log(res);
      this.$message.success("添加文章成功");
    },
    updateArticle() {
      if (!this.requestParams.title) {
        return this.$message.warning("标题不能为空");
      }
      const authorId = this.authorId;
      const { res } = this.$http.put(`article/${this.authorId}`, {
        ...this.requestParams,
        authorId,
      });
      console.log(res);
      this.$message.success("修改文章成功");
    },
  },
};
</script>

<style lang="less">
.admin-edit-article {
  .form-list {
    list-style: none;
    padding: 0;
    li {
      margin-bottom: 12px;
    }
    .label {
      font-size: 16px;
      font-weight: 500;
      color: #555;
      margin-right: 7px;
    }
    .container {
      display: flex;
      align-items: center;
      .title-input {
        flex: 1;
        width: 100%;
      }
      .checkbox-group {
        flex: 1;
      }
      .checkbox-item {
        margin-right: 12px;
      }
    }
    .tag-item {
      margin-right: 12px;
    }
  }
  .editor-style {
    min-height: 700px;
    max-height: 700px;
  }

  .action-icon {
    position: fixed;
    right: 80px;
    bottom: 80px;
    z-index: 2000;
  }
}
</style>

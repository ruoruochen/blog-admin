import Vue from "vue";
import VueRouter from "vue-router";
const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ "../components/Login");
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ "../components/Home");
const Welcome = () =>
  import(/* webpackChunkName: "login_home_welcome" */ "../components/Welcome");

const User = () =>
  import(/* webpackChunkName: "user_rights_roles" */ "../components/user/User");
const Rights = () =>
  import(
    /* webpackChunkName: "user_rights_roles" */ "../components/power/Rights"
  );
const Roles = () =>
  import(
    /* webpackChunkName: "user_rights_roles" */ "../components/power/Roles"
  );

const Cate = () =>
  import(/* webpackChunkName: "cate_params" */ "../components/articles/Cate");
const Params = () =>
  import(/* webpackChunkName: "cate_params" */ "../components/articles/Params");

const articlesList = () =>
  import(
    /* webpackChunkName: "articleslist_addarticles" */ "../components/articles/List"
  );
const addArticles = () =>
  import(
    /* webpackChunkName: "articleslist_addarticles" */ "../components/articles/Add"
  );

const Order = () =>
  import(/* webpackChunkName: "order_report" */ "../components/order/Order");
const Report = () =>
  import(/* webpackChunkName: "order_report" */ "../components/report/Report");

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
    children: [
      { path: "", redirect: "/welcome" },
      { path: "/welcome", component: Welcome },
      { path: "/users", component: User },
      { path: "/rights", component: Rights },
      { path: "/roles", component: Roles },
      { path: "/categories", component: Cate },
      { path: "/params", component: Params },
      { path: "/articles", component: articlesList },
      { path: "/articles/add", component: addArticles },
      { path: "/articles/edit/:articleId", component: addArticles },
      { path: "/orders", component: Order },
      { path: "/reports", component: Report },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, form, next) => {
  // if (to.path === '/login') return next()
  // let token = ''
  // // 尝试拿5次token
  // token = await getSessionToken()
  // if (!token) return next('/login')
  // next()
  if (to.path === "/login") return next();
  let userInfo = null;
  try {
    userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
  } catch (e) {
    console.log(e);
  }
  const token = userInfo.token;
  if (!token) return next("/login");
  next();
});

async function getSessionToken() {
  return await new Promise((resolve, reject) => {
    let token = "",
      count = 0;
    const timer = setInterval(() => {
      if (token || count === 10) {
        clearInterval(timer);
        resolve(token);
      }
      count++;
      token = window.sessionStorage.getItem("token");
    }, 500);
  });
}
export default router;

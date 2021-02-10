import Vue from "vue";
import Router from "vue-router";

// Containers
const TheContainer = () => import("@/containers/TheContainer");

// Views
// const Welcome = () => import('@/views/pages/Welcome')
const ProductIndex = () => import("@/views/pages/product/Index");
const ProductDetails = () => import("@/views/pages/product/Details");
const QuestionIndex = () => import("@/views/pages/question/Index");
const QuestionDetails = () => import("@/views/pages/question/Details");
const ReviewIndex = () => import("@/views/pages/reviews/Index");
const ReviewDetails = () => import("@/views/pages/reviews/Details");
const OrderIndex = () => import("@/views/pages/order/Index");
const OrderDetails = () => import("@/views/pages/order/Details");
const FinanceIndex = () => import("@/views/pages/finance/Index");
const FinanceAccountStatement = () =>
  import("@/views/pages/finance/Details/AccountStatement");
const FinanceOrderOverview = () =>
  import("@/views/pages/finance/Details/OrderOverview");
const FinanceTransactionOverview = () =>
  import("@/views/pages/finance/Details/TransactionOverview");
const ProfileIndex = () => import("@/views/pages/profile/Index");

const ReturnIndex = () => import("@/views/pages/return/Index");
const ReturnDetails = () => import("@/views/pages/return/Details");
const ArticleIndex = () => import("@/views/pages/article/Index");
const ArticleDetails = () => import("@/views/pages/article/Details");

const CampaignIndex = () => import("@/views/pages/campaign/Index");
const CampaignInfo = () => import("@/views/pages/campaign/Info");
const CampaignProductList = () => import("@/views/pages/campaign/ProductList");
const CampaignDetails = () => import("@/views/pages/campaign/Details");
const Dashboard = () => import("@/views/pages/dashboard/Index");
const RevenueProduct = () => import("@/views/pages/dashboard/RevenueProduct");
const DashboardTable = () => import("@/views/pages/dashboard/TableList");
const FAQ = () => import("@/views/pages/faq/Index");
const BannerIndex = () => import("@/views/pages/settings/Index");
const BannerDetails = () => import("@/views/pages/settings/Details");
const BannerWyswygi = () => import("@/views/pages/settings/Wyswygi");
const ResendOrderIndex = () => import("@/views/pages/resendorder/Index");
const ResendOrderDetails = () => import("@/views/pages/resendorder/Details");

const ChatIndex = () => import("@/views/pages/chat/Index");
const Page404 = () => import("@/views/pages/Page404");
const Page500 = () => import("@/views/pages/Page500");
const Login = () => import("@/views/pages/Login");
const Register = () => import("@/views/pages/Register");
const ForgetPassword = () => import("@/views/pages/ForgetPassword");
const ResetPassword = () => import("@/views/pages/ResetPassword");
const TermAndCon = () => import("@/views/pages/TermAndCon");
const Privacy = () => import("@/views/pages/Privacy");

Vue.use(Router);

export default new Router({
  mode: "history",
  linkActiveClass: "active",
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { requiresIsLogin: true }
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    {
      path: "/forgetpassword",
      name: "Forget Password",
      component: ForgetPassword
    },
    {
      path: "/resetpassword/:token",
      name: "Reset Password",
      component: ResetPassword
    },
    {
      path: "/termandcondition",
      name: "Term and Conditions",
      component: TermAndCon
    },
    {
      path: "/privacypolicy",
      name: "Privacy Policy",
      component: Privacy
    },
    {
      path: "/",
      redirect: "/dashboard/productoverview",
      name: "Home",
      component: TheContainer,
      meta: { requiresAuth: true },
      children: [
        // {
        //   path: '/',
        //   name: 'Welcome',
        //   component: Welcome,
        //   meta: { requiresAuth: true },
        // },
        {
          path: "/dashboard/productoverview",
          name: "Dashboard",
          component: Dashboard,
          meta: { requiresAuth: true }
        },
        {
          path: "/dashboard/revenueproduct",
          name: "Revenue Product",
          component: RevenueProduct,
          meta: { requiresAuth: true }
        },
        {
          path: "/dashboard/performance",
          name: "Performance",
          component: DashboardTable,
          meta: { requiresAuth: true }
        },
        {
          path: "/dashboard/campaign",
          name: "Campaign",
          component: DashboardTable,
          meta: { requiresAuth: true }
        },
        {
          path: "/dashboard/productperformance",
          name: "Product Performance",
          component: DashboardTable,
          meta: { requiresAuth: true }
        },
        {
          path: "/product",
          name: "Product Overview",
          component: ProductIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/product/details/:id",
          name: "Product Details",
          component: ProductDetails,
          meta: { requiresAuth: true }
        },
        {
          path: "/question",
          name: "Question",
          component: QuestionIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/question/details/:id",
          name: "Question Details",
          component: QuestionDetails,
          meta: { requiresAuth: true }
        },
        {
          path: "/review",
          name: "Review List",
          component: ReviewIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/review/details/:id",
          name: "Review Details",
          component: ReviewDetails,
          meta: { requiresAuth: true }
        },
        {
          path: "/finance",
          name: "Finance",
          component: FinanceIndex,
          redirect: "/finance/account-statement",
          meta: { requiresAuth: true },
          children: [
            {
              path: "/finance/account-statement",
              name: "Account Statement",
              component: FinanceAccountStatement,
              meta: { requiresAuth: true }
            },
            {
              path: "/finance/order",
              name: "Order Overview",
              component: FinanceOrderOverview,
              meta: { requiresAuth: true }
            },
            {
              path: "/finance/transaction",
              name: "Transaction Overview",
              component: FinanceTransactionOverview,
              meta: { requiresAuth: true }
            }
          ]
        },
        {
          path: "/campaign",
          name: "Campaign",
          component: CampaignIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/campaign/info/:id",
          name: "Campaign Info",
          component: CampaignInfo,
          meta: { requiresAuth: true }
        },
        {
          path: "/campaign/details/:id",
          name: "Campaign Details",
          component: CampaignDetails,
          meta: { requiresAuth: true }
        },
        {
          path: "/campaign/details/productlist/:id",
          name: "Campaign Product List",
          component: CampaignProductList,
          meta: { requiresAuth: true }
        },
        {
          path: "/profile/:menu",
          name: "Profile",
          component: ProfileIndex,
          // redirect: "/profile/general",
          meta: { requiresAuth: true }
          // children: [{
          //         path: "/profile/general",
          //         name: "Profile General",
          //         component: ProfileGeneral,
          //         meta: { requiresAuth: true },
          //     },
          //     {
          //         path: "/profile/seller",
          //         name: "Seller Logo",
          //         component: ProfileSeller,
          //         meta: { requiresAuth: true },
          //     },
          //     {
          //         path: "/profile/shipping",
          //         name: "Shipping",
          //         component: ProfileShipping,
          //         meta: { requiresAuth: true },
          //     },
          //     {
          //         path: "/profile/invoice",
          //         name: "Invoice No.",
          //         component: ProfileInvoice,
          //         meta: { requiresAuth: true },
          //     },
          // ],
        },

        {
          path: "/order",
          name: "Order Overview",
          component: OrderIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/order/details/:id",
          name: "Order Details",
          component: OrderDetails,
          meta: { requiresAuth: true }
        },
        {
          path: "/resendorder",
          name: "Resend Order Overview",
          component: ResendOrderIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/resendorder/details/:id",
          name: "Resend Order Details",
          component: ResendOrderDetails,
          meta: { requiresAuth: true }
        },
        {
          path: "/return",
          name: "Return List",
          component: ReturnIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/return/details/:id",
          name: "Return Details",
          component: ReturnDetails,
          meta: { requiresAuth: true }
        },
        {
          path: "/article",
          name: "Article List",
          component: ArticleIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/article/details/:id",
          name: "Article Details",
          component: ArticleDetails,
          meta: { requiresAuth: true }
        },
        {
          path: "/chat",
          name: "Chat",
          component: ChatIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/faq",
          name: "FAQ List",
          component: FAQ,
          meta: { requiresAuth: true }
        },
         {
          path: "/faq",
          name: "FAQ List",
          component: FAQ,
          meta: { requiresAuth: true }
        },
        {
          path: "/banner",
          name: "Banner List",
          component: BannerIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/banner/details/:id",
          name: "Banner Details",
          component: BannerDetails,
          meta: { requiresAuth: true }
        },
        {
          path: "/bannerpromotion",
          name: "Banner Promotion List",
          component: BannerIndex,
          meta: { requiresAuth: true }
        },
        {
          path: "/bannerpromotion/details/:id",
          name: "Banner Promotion Details",
          component: BannerDetails,
          meta: { requiresAuth: true }
        },
        {
          path: "/aboutus",
          name: "About Us",
          component: BannerWyswygi,
          meta: { requiresAuth: true }
        },
        // {
        //   path: '/',
        //   redirect: '/',
        //   name: 'Theme',
        //   component: {
        //     render(c) { return c('router-view') }
        //   },
        //   children: [
        //     {
        //       path: '/',
        //       name: 'Home',
        //       component: Home
        //     },
        //   ]
        // },
        {
          path: "404",
          name: "Page404",
          component: Page404
        },
        {
          path: "500",
          name: "Page500",
          component: Page500
        }
      ]
    }
  ]
});

function configRoutes() {}

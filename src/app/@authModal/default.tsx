// https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#defaultjs
// 平行路由底下的 default.tsx 是當如果沒有攔截到路由時默認渲染的組件
export default function Default() {
  return null; // 當如果沒有攔截到路由時我們沒有要默認渲染的組件，所以直接返回 null
}

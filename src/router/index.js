import { createRouter, createWebHistory } from 'vue-router';
import HotelList from '../components/HotelList.vue'; 
import LoginForm from '../components/LoginForm.vue'; 
import AssignRoomType from '../components/AssignRoomType.vue';

const routes = [
  {
    path: '/login', // Ruta para inicio de sesión
    name: 'LoginForm',
    component: LoginForm,
  },
  {
    path: '/hotels', // Ruta para la lista de hoteles
    name: 'HotelList',
    component: HotelList,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/assign-room-type/:hotelId',
    name: 'AssignRoomType',
    component: AssignRoomType,
    props: true, 
    meta: { requiresAuth: true },
  },
  {
    path: '/hotels/create', // Ruta para crear hoteles
    name: 'HotelFormCreate',
    component: () => import('../components/HotelForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/hotels/:id/edit', // Ruta para editar hoteles
    name: 'HotelFormEdit',
    component: () => import('../components/HotelForm.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/:catchAll(.*)', // Redirigir rutas no encontradas al login
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Protección de rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Comprueba si el usuario tiene un token
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir al login
    next('/login');
  } else {
    next(); // Si está autenticado o la ruta no requiere autenticación, permitir acceso
  }
});

export default router;

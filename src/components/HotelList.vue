<template>
  <div class="container mt-5">
    <h1 class="mb-4">Lista de Hoteles</h1>
  
    <router-link to="/hotels/create" class="btn btn-primary mb-3">
      Nuevo Hotel
    </router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Ciudad</th>
          <th>NIT</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="hotel in hotels" :key="hotel.id">
          <td>{{ hotel.name }}</td>
          <td>{{ hotel.address }}</td>
          <td>{{ hotel.city }}</td>
          <td>{{ hotel.nit }}</td>
          <td>
            <button 
              @click="editHotel(hotel.id)" 
              class="btn btn-warning btn-sm me-2">
              Editar
            </button>
            <button 
              @click="deleteHotel(hotel.id)" 
              class="btn btn-danger btn-sm me-2">
              Eliminar
            </button>
            <button 
              @click="assignRoom(hotel.id)" 
              class="btn btn-success btn-sm">
              Asignar Habitación
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HotelList',
  data() {
    return {
      hotels: [], // Lista de hoteles
    };
  },
  created() {
    this.fetchHotels(); // Cargar los hoteles al crear el componente
  },
  methods: {
    async fetchHotels() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/hotels');
        this.hotels = response.data;
      } catch (error) {
        console.error('Hubo un error al obtener los hoteles:', error);
      }
    },
    editHotel(hotelId) {
      this.$router.push(`/hotels/${hotelId}/edit`); // Redirige a la página de edición del hotel
    },
    async deleteHotel(hotelId) {
      if (confirm('¿Estás seguro de que deseas eliminar este hotel?')) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/hotels/${hotelId}`);
          this.hotels = this.hotels.filter(hotel => hotel.id !== hotelId); 
        } catch (error) {
          console.error('Hubo un error al eliminar el hotel:', error);
        }
      }
    },
    assignRoom(hotelId) {
      this.$router.push(`/assign-room-type/${hotelId}`); 
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}

td {
  word-wrap: break-word;
}

.mb-3 {
  margin-bottom: 15px;
}

.btn {
  font-size: 14px;
  padding: 5px 10px;
}

.btn-sm {
  padding: 4px 8px;
}

.me-2 {
  margin-right: 8px;
}
</style>

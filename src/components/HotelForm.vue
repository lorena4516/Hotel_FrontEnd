<template>
  <div class="container mt-5">
    <h1 class="mb-4">{{ isEditMode ? 'Editar' : 'Crear' }} Hotel</h1>
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>

    <div v-if="errors && Object.keys(errors).length > 0" class="alert alert-danger">
    <ul>
      <li v-for="(errorMessages, fieldName) in errors" :key="fieldName">
        <strong>{{ fieldName }}:</strong>
        <ul>
          <li v-for="(errorMessage, index) in errorMessages" :key="index">
            {{ errorMessage }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
    <form @submit.prevent="saveHotel" class="needs-validation" novalidate>
      <div class="mb-3">
        <label for="name" class="form-label">Nombre:</label>
        <input
          type="text"
          v-model="hotel.name"
          id="name"
          class="form-control"
          required
        />
        <div class="invalid-feedback">
          Por favor ingresa el nombre del hotel.
        </div>
      </div>
      
      <div class="mb-3">
        <label for="address" class="form-label">Dirección:</label>
        <input
          type="text"
          v-model="hotel.address"
          id="address"
          class="form-control"
          required
        />
        <div class="invalid-feedback">
          La dirección es requerida.
        </div>
      </div>
      
      <div class="mb-3">
        <label for="city" class="form-label">Ciudad:</label>
        <input
          type="text"
          v-model="hotel.city"
          id="city"
          class="form-control"
          required
        />
        <div class="invalid-feedback">
          La ciudad es requerida.
        </div>
      </div>
      
      <div class="mb-3">
        <label for="nit" class="form-label">NIT:</label>
        <input
          type="text"
          v-model="hotel.nit"
          id="nit"
          class="form-control"
          required
        />
        <div class="invalid-feedback">
          El NIT es requerido.
        </div>
      </div>
      
      <div class="mb-3">
        <label for="max_rooms" class="form-label">Máximo de Habitaciones:</label>
        <input
          type="number"
          v-model="hotel.max_rooms"
          id="max_rooms"
          class="form-control"
          required
        />
        <div class="invalid-feedback">
          El número máximo de habitaciones es requerido.
        </div>
      </div>

      <button type="submit" class="btn btn-primary">
        {{ isEditMode ? 'Actualizar' : 'Crear' }} Hotel
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HotelForm',
  data() {
    return {
      hotel: {
        name: '',
        address: '',
        city: '',
        nit: '',
        max_rooms: null,
      },
      isEditMode: false,
      errors: {}, 
    };
  },
  created() {
    const hotelId = this.$route.params.id;
    if (hotelId) {
      this.isEditMode = true;
      this.fetchHotel(hotelId);
    }
  },
  methods: {
    async fetchHotel(id) {
      try {
        const response = await axios.get(`http://localhost:8000/api/hotels/${id}`);
        this.hotel = response.data;
      } catch (error) {
        console.error('Hubo un error al obtener los detalles del hotel:', error);
      }
    },
    async saveHotel() {
      try {
        
        if (this.isEditMode) {
          
          await this.updateHotel();
        } else {
          
          await this.createHotel();
        }       
        this.$router.push('/hotels');
      } catch (error) {
        this.handleError(error);
      }
    },

    // Función para actualizar el hotel
    async updateHotel() {
      try {
        await axios.put(`http://localhost:8000/api/hotels/${this.hotel.id}`, this.hotel);
      } catch (error) {
        console.error('Error al actualizar el hotel:', error);
        throw error; // Propagar el error para que sea manejado por el bloque catch principal
      }
    },

    // Función para crear un nuevo hotel
    async createHotel() {
      try {
        await axios.post('http://localhost:8000/api/hotels', this.hotel);
      } catch (error) {
        console.error('Error al crear el hotel:', error);
        throw error; // Propagar el error para que sea manejado por el bloque catch principal
      }
    },

    // Función para manejar errores
    handleError(error) {
      if (error.response) {
        // Si hay errores de validación en la respuesta
        if (error.response.data.errors) {
          this.errors = error.response.data.errors;  // Asignamos los errores a la variable
        } else {
          this.errors = { general: [error.response.data.message || 'Hubo un error en la solicitud'] };
        }
      } else {
        // Si no hubo respuesta, asignamos un mensaje general
        this.errors = { general: ['No se recibió respuesta del servidor.'] };
      }
    },  

  },
};
</script>

<style scoped>
/* Puedes agregar más estilos personalizados aquí si lo necesitas */

/* Agregar margen en los inputs si es necesario */
.form-control {
  width: 100%;
}

button {
  margin-top: 20px;
}
</style>

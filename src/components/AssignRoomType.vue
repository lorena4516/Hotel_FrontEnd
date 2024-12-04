<template>
    <div class="container">
      <h1 class="title">Asignar Tipos de Habitación</h1>
      <!-- Mensajes -->
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <form @submit.prevent="assignRoomTypes" class="form">
        <div class="form-group">
          <label for="hotel" class="form-label">Seleccionar Hotel:</label>
          <select v-model="selectedHotel" class="form-control" id="hotel" disabled>
            <option v-for="hotel in hotels" :key="hotel.id" :value="hotel.id">{{ hotel.name }}</option>
          </select>
        </div>

  
        <div class="form-group">
          <label for="room_type" class="form-label">Seleccionar Tipo de Habitación:</label>
          <select v-model="selectedRoomType" class="form-control" id="room_type">
            <option v-for="roomType in roomTypes" :key="roomType.id" :value="roomType.id">{{ roomType.type }}</option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="accommodation" class="form-label">Seleccionar Acomodación:</label>
          <select v-model="selectedAccommodations" class="form-control" id="accommodation">
            <option v-for="accommodation in validAccommodations" :key="accommodation" :value="accommodation">
              {{ accommodation }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="quantity" class="form-label">Cantidad:</label>
          <input v-model="quantity" type="number" min="1" class="form-control" id="quantity" placeholder="Cantidad">
        </div>

  
        <button type="submit" class="btn-submit">Asignar</button>
      </form>
    </div>
  </template>
  
  <style scoped>
  .container {
    width: 80%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  .form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .form-control:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .btn-submit {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-submit:hover {
    background-color: #0056b3;
  }
  .success-message {
    color: green;
    margin-bottom: 15px;
  }
  .error-message {
    color: red;
    margin-bottom: 15px;
  }
  </style>
  
  <script>
import axios from 'axios';

export default {
  props: ['hotelId'],
  data() {
    return {
      hotels: [],
      roomTypes: [],
      validAccommodations: [],
      selectedHotel: null,
      selectedRoomType: null,
      selectedAccommodations: [],
      quantity: null,
    };
  },
  created() {
    this.fetchHotels();
    this.fetchRoomTypes();
    this.preselectHotel();
  },
  watch: {
   
    selectedRoomType(newRoomTypeId) {
      if (newRoomTypeId) {
        this.fetchAccommodations(newRoomTypeId);
       
        this.selectedAccommodations = [];
      } else {
        this.validAccommodations = []; 
      }
    },
  },
  methods: {
    async fetchHotels() {
      const response = await axios.get('http://localhost:8000/api/hotels');
      this.hotels = response.data;
    },
    async fetchRoomTypes() {
      const response = await axios.get('http://localhost:8000/api/room-types');
      this.roomTypes = response.data;
    },
    async fetchAccommodations(roomTypeId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/room-types/${roomTypeId}`);
        this.validAccommodations = response.data.validAccommodations; 
      } catch (error) {
        console.error('Error al obtener acomodaciones válidas:', error);
      }
    },
    async assignRoomTypes() {
      if (!this.selectedHotel || !this.selectedRoomType || this.selectedAccommodations.length === 0) {
        this.errorMessage = 'Todos los campos son obligatorios.';
        return;
      }
    
    const hotel = this.hotels.find(hotel => hotel.id === this.selectedHotel); 
    const hotelQuantity = hotel ? hotel.quantity : 0; 

    if (this.quantity > hotelQuantity) {
        this.errorMessage = `La cantidad de acomodaciones no puede superar la cantidad de habitaciones del hotel (${hotelQuantity}).`;
        return;
    }

      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      try {
        const payload = {
          hotel_id: this.selectedHotel,
          room_type_id: this.selectedRoomType,
          accommodation: this.selectedAccommodations,
          quantity: this.quantity,            
        };

        const response = await axios.post('http://localhost:8000/api/assign-room-type', payload);

        if (response.status === 200) {
            this.successMessage = '¡Asignación guardada exitosamente!';
            
            this.fetchAccommodations(this.selectedRoomType); 
            this.$router.push({ name: 'HotelList' });
          } else {
            this.errorMessage = 'Error al guardar la asignación.';
        }
      } catch (error) {
        console.error('Error al asignar tipos de habitación:', error);
        this.errorMessage = 'Ocurrió un error al guardar la asignación.';
      } finally {
        this.loading = false;
      }
    },
    preselectHotel() {
      this.selectedHotel = this.hotelId ? Number(this.hotelId) : null;
    },
  },
};
</script>

  
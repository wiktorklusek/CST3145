<template>
  <!-- The root container element -->
  <div class="container py-5 px-md-5" id="app">
    <!-- The website name -->
    <p class="text-center">{{ sitename }}</p>
    <hr>

    <!-- The checkout button -->
    <div class="row mb-3 text-center">
      <div class="col-8">
        <br>
          <button :class="{ 'disabled': cart.length <= 0 }" class="card-link btn btn-dark btn-sm px-3 text-center"
            @click="showCheckout">
            <i class="fas fa-arrow-right mx-2"></i>Checkout {{ cart.reduce((total, item) => total + item.numberOfSpaces, 0) }}
          </button>
        <br>
      </div>
    </div>
    <br>

    <!-- The main component section -->
    <div class="row pt-2">
      <main class="d-flex justify-content-center">
        <!-- The current view component -->
        <component :is="currentView" :lessonList="lessons" :baseURL="baseURL" @add-to-cart="addToCart"
          @remove-from-cart="removeFromCart" :cart="cart" />
      </main>
    </div>
  </div>
</template>

<script>
import ProductList from "./components/ProductList.vue";
import Checkout from "./components/Checkout.vue";

export default {
  name: "App",

  // Define initial data values
  data() {
    return {
      sitename: "RAVEO",
      currentView: ProductList,
      lessons: [],
      cart: [],
      name: '',
      search: '',
      phoneNumber: '',
      baseURL: 'https://cst3145-wk186.herokuapp.com/collections'
    }
  },
  
  // Register components used in the template
  components: { ProductList, Checkout },

  // Fetch lessons from the API when the component is created
  created: function () {
    this.fetchLessons();
  },
  methods: {
    // Fetch lessons from the API using the fetch API
    fetchLessons() {
      let vm = this;
      fetch("https://cst3145-wk186.herokuapp.com/collections/products").then(
        function (response) {
          response.json().then(
            function (json) {
              // Store lessons in the vm.lessons array
              vm.lessons = json;
            }
          )
        });
    },

    // Add a lesson to the cart
    addToCart(_id) {
      // Find the selected lesson by ID
      var lesson = this.getLessonById(_id);
      
      // Check if there is space available for the lesson
      if (lesson.numberOfSpaces > 0) {
        // Decrease lesson space
        --lesson.numberOfSpaces;
        
        // Find the existing item in the cart
        var itemInCart = this.getCartItemFromCartByLessonId(_id);
        
        if (itemInCart != null) {
          // If the item is already in the cart, update its number of spaces
          ++itemInCart.numberOfSpaces;
        } else {
          // Otherwise, add a new item to the cart
          itemInCart = { lessonId: _id, numberOfSpaces: 1, lesson: lesson };
          this.cart.push(itemInCart);
        }
      }
    },

    // Remove a lesson from the cart
    removeFromCart(lessonId) {
      // Find the selected lesson in the cart
      var itemInCart = this.getCartItemFromCartByLessonId(lessonId);
      
      // If the item has only one space left, remove it completely from the cart
      if (itemInCart.numberOfSpaces == 1) {
        var index = this.cart.map(x => x.lessonId).indexOf(lessonId);
        this.cart.splice(index, 1);
        
        // If the cart is now empty, show the checkout page
        if (this.cart.length <= 0) {
          this.showCheckout();
        }
      } else {
        // Otherwise, reduce the number of spaces of the item in the cart
        --itemInCart.numberOfSpaces;
      }
      
      // Increase the lesson space 
      var lesson = this.getLessonById(lessonId);
      ++lesson.numberOfSpaces;
    },

    // Get a lesson by ID
    getLessonById(_id) {
      var lesson = this.lessons.find(u => u._id == _id);
      return lesson;
    },
    
    // Get an item from the cart by lesson ID
    getCartItemFromCartByLessonId(lessonId) {
      var item = this.cart.find(u => u.lessonId == lessonId);
      return item;
    },

    // Show the checkout page
    showCheckout() {
      if (this.currentView === Checkout) { 
        this.title = 'Cart';
        this.currentView = ProductList }
      else { 
        this.title = 'Home';
        this.currentView = Checkout };
    }
  }
}
</script>
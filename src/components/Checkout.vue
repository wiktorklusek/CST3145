<template>
  <div>
    <div class="row">
      <!-- Products DIVs -->
      <div class="col-sm-6 col-md-6 col-lg-4 mt-2" v-for="item in cart">
        <div class="card card-width rounded-0 shadow-sm">
          <div class="card-body d-flex justify-content-between">
            <div>
              <!-- Display product information -->
              <span class="card-text fs-14">Subject:
                <b class="card-subtitle mb-2 fs-14">{{ item.lesson.subject }}</b>
              </span>
              <br />
              <span class="card-text fs-14">Location:
                <b class="card-subtitle mb-2 fs-14">{{ item.lesson.location }}</b>
              </span>
              <br />
              <span class="card-text fs-14">Price:
                <b class="card-subtitle mb-2 fs-14">£{{ item.lesson.price }}</b>
              </span>
              <br />
              <span class="card-text fs-14">Spaces:
                <b class="card-subtitle mb-2 fs-14">{{ item.numberOfSpaces }}</b>
              </span>
              <br />
              <!-- Remove button for the product -->
              <span class="card-text fs-18"><i v-bind:class="item.lesson.icon"></i></span><br />
                        <button @click="removeFromCart(item.lessonId)" class="card-link btn btn-dark btn-sm mt-md-5 px-lg-2">
            <i class="fas fa-minus mx-1"></i> Remove
          </button>
        </div>
        <!-- Display product image -->
        <img v-bind:src="item.lesson.image" v-bind:alt="item.lesson.altText" class="img-fluid border rounded"
          style="height: 300px; width: 300px;" />
      </div>
    </div>
  </div>
</div>
<!-- Checkout DIVs -->
<hr>
<!-- Checkout form for user information -->
<p class="text-center mt-5">Checkout</p>
<form>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <input type="text" class="form-control" placeholder="Enter name">
    </div>
    <div class="col-md-6 col-lg-4">
      <input type="number" class="form-control" placeholder="Enter phone number">
    </div>
  </div>
</form>
<!-- Checkout button to confirm purchase -->
<div class="row mt-5 text-center">
  <div class="col-12">
    <button v-on:click="showConfirmationDialog" class="card-link btn btn-dark btn-sm px-3">
      <i class="fas fa-check mx-2"></i> Checkout
    </button>
  </div>
</div>
 </div>
</template>

<script>
export default {
    name: "Checkout",
    props: ["cart"],
    methods: {
        /**
         * Emits a custom event that triggers the parent component to remove a lesson from cart
         * @param {string} _id - The id of the lesson to be removed from the cart
         */
        removeFromCart: function (_id) {
            this.$emit("remove-from-cart", _id);
        },
        /**
         * Displays a confirmation dialog after the user has submitted their order
         * and reloads the page.
         */
        showConfirmationDialog(){
            alert('Order has been submitted successfully')
            location.reload();
        }
    }
}
</script>

let webstore = new Vue({
  el: "#app", // mounting point selector, ID

  data: {
    products: [],
    // products: product, -> this code takes the array from products.js
    showProduct: true,
    cart: [],
    ascending: true,
    // sortBy: 'subject',
    search: "",
    searchValue: "",

    // Initial API functionality for search
    searchResults: [],

    // Creating a toggle/button for a different sorting functionality
    currentSort: "",

    // Used for storing the specific type of sorting(price, location, etc...)
    sortValue: "subject",
    sortClassesBy: "",

    // Names to be more specific below:
    searchTerm: "",
    sortStyle: "",

    inCartButton: "Remove",

    order: {
      firstName: null,
      phoneNumber: null,
    },

    baseURL: "http://localhost:3000",
    //Order information helper values
    lessonsIDs: [],
    orderLessonSpaces: null,
  },

  // This function runs when creating the Vue instance
  created: function () {
    // Replacing the URL to my Heroku app and route
    fetch("https://cst3145-wk186.herokuapp.com/collections/products").then(
      function (response) {
        response.json().then(function (json) {
          webstore.products = json;
          // note that I am using 'webstore.products' instead of 'this.products'
          console.log(json);
        });
      }
    );
  },

  methods: {
    //Searching functionality implemented in API
    searchAPI() {
      fetch(
        `https://cst3145-wk186.herokuapp.com/collections/products/search?q=${this.search}`
      )
        .then((response) => response.json())
        .then((data) => {
          webstore.products = [];
          this.searchResults = data;
          // webstore.products = json;
          webstore.products = data;
          console.log(data);
        })
        .catch((error) => console.error(error));
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    addClass(product) {
      this.cart.push(product.id);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    showCheckout() {
      this.showProduct = this.showProduct ? false : true;
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    canAddClass(product) {
      return product.numberOfSpaces > this.cartCount(product.id);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          count++;
        }
      }
      return count;
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    submitForm() {
      // const formIsValid = this.firstNameIsValid // && this.lastNameIsValid ...etc

      if (this.checkFormValidity) {
        alert("Order submitted!");
        // console.log('Form submitted', this.order)
      } else {
        alert("Order failed!");
        // console.log('Form not valid')
      }

      // alert('Order submitted!')
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // removeFromCart method
    removeFromCart(product) {
      let index = this.cart.indexOf(product.id);
      if (index > -1) {
        this.cart.splice(index, 1);
      }
      product.numberOfSpaces + 1; // here was the code that simply was adding two spaces instead of one, previously deleted
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // showInCart method
    showInCart(product, id) {
      // very javascripti :)
      let cartCount = this.cartCount(id);
      if (cartCount >= 0) {
        return product.name;
      }
    },

    checkFormValidity: function () {
      return (
        this.validName(this.order.firstName) &&
        this.validNumber(this.order.phoneNumber)
      );
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    submitCheckoutForm() {
      const newOrder = {
        name: this.order.firstName,
        numberOfSpaces: this.cart.length,
        id: this.cart,
        phoneNumber: this.order.phoneNumber,
      };

      console.log("newOrder.name: " + newOrder.name);
      console.log("newOrder.numberOfSpaces: " + newOrder.numberOfSpaces);
      console.log("newOrder.id: " + newOrder.id);
      console.log("newOrder.phoneNumber: " + newOrder.phoneNumber);

      if (!this.validLessons(newOrder.numberOfSpaces)) {
        console.log("Error: Number of lessons must be greater than 0");
        return;
      }

      Promise.all(newOrder.id.map((id) => this.updateNumberOfLessons(id)))
        .then((updatedProducts) => {
          console.log("Response data (numberOfSpaces):" + updatedProducts);
          this.postOrder(newOrder);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    async updateNumberOfLessons(id) {
      try {
        let product = null;

        // Retrieve the product from the database
        const res1 = await fetch(
          `https://cst3145-wk186.herokuapp.com/collections/products/${id}`
        );
        const data1 = await res1.json();
        product = data1;
        console.log("product.subject from MongoDB: " + product.subject);

        // Update the product in the database
        const res2 = await fetch(
          `https://cst3145-wk186.herokuapp.com/collections/products/${product._id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              numberOfSpaces: product.numberOfSpaces - 1,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Retrieve the updated product from the database
        const res3 = await fetch(
          `https://cst3145-wk186.herokuapp.com/collections/products/${id}`
        );
        const data3 = await res3.json();
        console.log(
          "Current number of available spaces: " + data3.numberOfSpaces
        );
        return data3.numberOfSpaces;
      } catch (error) {
        console.error(error);
      }
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    // Validation for the number of lessons being posted to the database
    validLessons(lessons) {
      return lessons > 0;
    },

    // sleep(ms) {
    //   return new Promise((resolve) => setTimeout(resolve, ms));
    // },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// A fetch that saves a new order with POST
    postOrder(jsonData) {
      fetch(`https://cst3145-wk186.herokuapp.com/collections/orders/`, {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log(
            "Response data (numberOfSpaces):" + responseData.numberOfSpaces
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //Input validation methods - improved
    validName(firstName) {
      return /^[a-zA-Z]+$/.test(firstName);
    },

    // Validation updated for the UK phone numbers
    validNumber(phoneNumber) {
      var phone_regex = /^\(?([0-9]{12})$/;
      return phone_regex.test(phoneNumber);
    },

    //Cart count method
    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          count++;
        }
      }
      return count;
    },

    //Classes left computation
    classesLeft(product) {
      return product.numberOfSpaces - this.cartCount(product.id);
    },

    //Removing lessons from the checkout
    removeLesson(index) {
      this.cart.splice(index, 1);
    },

    //Sorting method
    sort(s) {
      if (s === this.sortBy) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      }
      this.sortBy = s;
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  },

  computed: {
    totalItemsInTheCart: function () {
      return this.cart.length || " ";
    },

    // Computed properties can't have input parameters !!!

    cartItemCount() {
      return this.cart.length || "";
    },

    // validation computed properties
    firstNameIsValid() {
      return !!this.order.firstName;
    },

    phoneNumberIsValid() {
      return !!this.order.phoneNumber;
    },

    formIsValid() {
      return this.firstNameIsValid && this.phoneNumberIsValid;
    },

    // Retrieve Corresponding Item ID from a Basket - EXPERIMENT FUNCTION !!!
    retrieveCartItem(id) {
      var item = this.cart.find((x) => x.id == id);
      return item;
    },

    //----------------------------------------------------------------------------------------------------------------------------------------
    // TESTING                                                                                                                               |
    //----------------------------------------------------------------------------------------------------------------------------------------

    // 2nd approach
    filteredClasses() {
      if (this.products) {
        let tempClasses = this.products;

        // Sort by alphabetical Order
        // sort value has to change in order to be able to swap between different sorting techniques !!!
        tempClasses = tempClasses.sort((a, b) => {
          if (this.sortValue == "subject") {
            let fa = a.subject.toLowerCase(),
              fb = b.subject.toLowerCase();

            if (fa < fb) {
              return -1;
            }
            if (fa > fb) {
              return 1;
            }

            return 0;
          } else if (this.sortValue == "location") {
            let fa = a.location.toLowerCase(),
              fb = b.location.toLowerCase();

            if (fa < fb) {
              return -1;
            }
            if (fa > fb) {
              return 1;
            }
          } else if (this.sortValue == "price") {
            let fa = a.price,
              fb = b.price;

            if (fa < fb) {
              return -1;
            }
            if (fa > fb) {
              return 1;
            }
          } else if (this.sortValue == "availability") {
            let fa = a.numberOfSpaces,
              fb = b.numberOfSpaces;

            if (fa < fb) {
              return -1;
            }
            if (fa > fb) {
              return 1;
            }
          }
        });

        // Show sorted array in descending or ascending order
        if (!this.ascending) {
          tempClasses.reverse();
        }
        return tempClasses;
      }
    },

    // implement the toLowerCase() so that the search can be used with the both small and capital letters
    filteredClassesBar() {
      return this.products.filter((product) => {
        return (
          product.subject.toLowerCase().match(this.search.toLowerCase()) ||
          product.location.toLowerCase().match(this.search.toLowerCase()) ||
          product.description.toLowerCase().match(this.search.toLowerCase())
        ); // Not sure whether this is correct logic to search in search bar for a price? || product.price.match(this.search) || product.numberOfSpaces.match(this.search)
        console.log("I was here!");
        // || product.numberOfSpaces.match(parseInt(this.search))
      });
    },

    basketClasses() {
      if (product.numberOfSpaces > 0) {
        return product;
      }
    },

    ///////////////////////////////////////////////////////////////THE END OF THE FILE///////////////////////////////////////////////////////////////
  },
});

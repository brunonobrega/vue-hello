var eventBus = new Vue()

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: false
    }
  },
  template: `
    <div>

      <ul>
        <span class="tabs"
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              @click="selectedTab = tab"
              :key="tab"
        >{{ tab }}</span>
      </ul>

      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
            <li v-for="(review, index) in reviews" :key="index">
              <p>{{ review.name }}</p>
              <p>Rating:{{ review.rating }}</p>
              <p>{{ review.review }}</p>
              <p>{{ review.recommend }}</p>
            </li>
        </ul>
      </div>

      <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
      </div>

    </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: 'Reviews'
    }
  }
})

Vue.component('info-tabs', {
  props: {
    shipping: {
      required: true
    },
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <div>
    
      <ul>
        <span class="tabs" 
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              @click="selectedTab = tab"
              :key="tab"
        >{{ tab }}</span>
      </ul>

      <div v-show="selectedTab === 'Shipping'">
        <p>{{ shipping }}</p>
      </div>

      <div v-show="selectedTab === 'Details'">
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
      </div>
  
    </div>
  `,
  data() {
    return {
      tabs: ['Shipping', 'Details'],
      selectedTab: 'Shipping'
    }
  }
})

Vue.component('product-review', {
  template: `
     <form class="review-form" @submit.prevent="onSubmit">

      <p class="error" v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>Would you recommend this product?</p>
      <label>
        Yes
        <input type="radio" value="Yes" v-model="recommend"/>
      </label>
      <label>
        No
        <input type="radio" value="No" v-model="recommend"/>
      </label>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
  methods: {
      onSubmit() {
        this.errors = []
        if(this.name && this.review && this.rating && this.recommend) {
          let productReview = {
            name: this.name,
            review: this.review,
            rating: this.rating,
            recommend: this.recommend
          }
          eventBus.$emit('review-submitted', productReview)
          this.name = null
          this.review = null
          this.rating = null
          this.recommend = null
        } else {
          if(!this.name) this.errors.push("Name required.")
          if(!this.review) this.errors.push("Review required.")
          if(!this.rating) this.errors.push("Rating required.")
          if(!this.recommend) this.errors.push("Recommendation required.")
        }
      }
    }
  })

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required:true
    }
  },
  template: `
    <div class="product">
      <div class="product-image"> 
        <img v-bind:src="image" v-bind:alt="altText" />
      </div>

      <div class="product-info"> 
        <h1>{{ title }}</h1>
        <p v-if="inStock">In Stock</p>
        <p v-else :class="{ outOfStock: !inStock }">Out of stock</p>
        <info-tabs :shipping="shipping" :details="details"></info-tabs>
        <p>{{ sale }}</p>

        <product-details :details="details"></product-details>

        <ul>
          <li v-for="size in sizes">{{ size }}</li>
        </ul>

        <div class="color-box"
           v-for="(color, index) in colors"
           :key="color.colodId"
           :style="{ backgroundColor: color.colorName }"
           @mouseover="updateProduct(index)"
           >
        </div>

        <button v-on:click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
                >Add to cart
        </button>
        <button @click="removeFromCart">Remove from cart</button>

      </div> <!-- End Product Info -->

      <product-tabs :reviews="reviews"></product-tabs>

    </div> <!-- End Product -->
  `,
  data() {
    return {
      product: 'Socks',
      brand: 'Vue Mastery',
      altText: 'Par de Meias',
      selectedColor: 0,
      inventory: 10,
      onSale: true,
      details: ["80% cotton","20% polyester","Unissex"],
      colors: [
        {
          colorId: 1,
          colorName: "green",
          colorImage: './assets/images/vmSocks-green-onWhite.jpg',
          colorQuantity: 10,
        },
        {
          colorId: 2,
          colorName: "blue",
          colorImage: './assets/images/vmSocks-blue-onWhite.jpg',
          colorQuantity: 0,
        },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.colors[this.selectedColor].colorId)
    },
    updateProduct(index) {
      this.selectedColor = index
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.colors[this.selectedColor].colorId)
    },
    // addReview(productReview) {
    //   this.reviews.push(productReview)
    // }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.colors[this.selectedColor].colorImage
    },
    inStock(){
        return this.colors[this.selectedColor].colorQuantity
    },
    sale() {
      if (this.onSale) {
        return this.brand + ' ' + this.product + ' are on sale!'
      } 
        return  this.brand + ' ' + this.product + ' are not on sale'
    },
    shipping() {
      if (this.premium) {
        return "Free"
      } else {
        return '$2.99'
      }
    },
    mounted() {
      eventBus.$on('review-submitted', productReview => {
        this.reviews.push(productReview)
      })
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeItem(id) {
      for(var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    },
  }
})
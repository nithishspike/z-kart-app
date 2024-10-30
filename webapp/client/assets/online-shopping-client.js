"use strict";



define('online-shopping-client/app', ['exports', 'online-shopping-client/resolver', 'ember-load-initializers', 'online-shopping-client/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('online-shopping-client/components/cart-container', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    selectedDiscount: "",
    toast: Ember.inject.service(),
    DataStore: Ember.inject.service(),
    dealOfTheMoment: Ember.computed.alias('DataStore.dealOfTheMoment'),
    showCart: false,
    outOfStock: false,
    router: Ember.computed(function () {
      return Ember.getOwner(this).lookup('router:main');
    }),

    totalAmount: Ember.computed('cartItems.@each.quantity', 'cartItems.@each.product.productPrice', function () {
      var _this = this;

      var cartItems = this.get('cartItems') || [];
      if (!Array.isArray(cartItems)) {
        cartItems = [];
      }
      return cartItems.reduce(function (total, item) {
        var quantity = item.quantity || 0;
        var price = item.product.productPrice || 0;
        var OfferProduct = _this.get("dealOfTheMoment.productId");
        if (item.productId == OfferProduct) {
          price = (price * (1 - _this.get("dealOfTheMoment").percentage / 100)).toFixed(2);
        }
        return total + quantity * price;
      }, 0);
    }),

    total: Ember.computed('cartItems.@each.quantity', 'cartItems.@each.product.productPrice', 'selectedDiscount', function () {
      if (this.get("selectedDiscount")) {
        var total = this.get("totalAmount") * (100 - this.get("selectedDiscount").percentage) / 100;
        return parseFloat(total.toFixed(2));
      } else {
        return this.get("totalAmount");
      }
    }),
    updateProduct: function updateProduct(productId, quantity) {
      console.log("updating the cart product");

      (0, _ajaxReq.default)({
        endpoint: 'cart',
        method: 'PUT',
        data: JSON.stringify([{ product_id: productId, quantity: quantity }])
      }).then(function (res) {
        console.log(res);
      }).catch(function (error) {
        console.error('Update cart failed', error.responseJSON);
      });
      // Ember.$.ajax({
      //   url: "http://localhost:8002/api/v1/cart",
      //   type: 'PUT',
      //   contentType: 'application/json',
      //   data: JSON.stringify([{product_id:productId,quantity:quantity}]),
      //   success: (res) => {
      //     console.log(res);
      //   },
      //   error: (error) => {

      //     console.error('Update cart failed', error.responseJSON);
      //   }
      // });
    },
    checkOutOfStockItems: function checkOutOfStockItems() {
      // Check if any item in the cart is out of stock
      var outOfStockItems = this.get('cartItems').filter(function (item) {
        return item.product.stock === 0;
      });
      this.set('outOfStock', outOfStockItems.length > 0);
    },


    actions: {
      increaseQuantity: function increaseQuantity(item) {
        var newQuantity = item.quantity + 1;
        Ember.set(item, 'quantity', newQuantity);
        this.updateProduct(item.productId, newQuantity);
        this.checkOutOfStockItems(); // Check for out-of-stock after updating
      },
      decreaseQuantity: function decreaseQuantity(item) {
        if (item.quantity > 0) {
          var newQuantity = item.quantity - 1;
          if (newQuantity == 0) {
            console.log("removing the cartItem");
            this.get("cartItems").removeObject(item);
            console.log(this.cartItems);
          } else {
            Ember.set(item, 'quantity', newQuantity);
          }
          this.updateProduct(item.productId, newQuantity);
          this.checkOutOfStockItems(); // Check for out-of-stock after updating
        }
      },
      updateCart: function updateCart() {
        var _this2 = this;

        var filteredItems = this.get('cartItems').map(function (item) {
          return {
            product_id: item.productId,
            quantity: item.quantity
          };
        });
        (0, _ajaxReq.default)({
          endpoint: 'cart',
          method: 'PUT',
          data: JSON.stringify(filteredItems)
        }).then(function (res) {
          console.log(res);
          _this2.checkOutOfStockItems(); // Check for out-of-stock after updating
        }).catch(function (error) {
          console.error('Update cart failed', error.responseJSON);
        });
        // Ember.$.ajax({
        //   url: `http://localhost:8002/api/v1/cart`,
        //   type: 'PUT',
        //   data: JSON.stringify(filteredItems),
        //   success: (res) => {
        //     console.log(res);
        //     this.checkOutOfStockItems(); // Check for out-of-stock after updating
        //   },
        //   error: (error) => {
        //     console.error('Update cart failed', error.responseJSON);
        //   }
        // });
      },
      toggleCart: function toggleCart() {
        this.toggleProperty("showCart");
      },
      updateDiscount: function updateDiscount(discount) {
        this.set("selectedDiscount", discount);
      },
      purchase: function purchase(address, paymentMode, userDiscountId) {
        var _this3 = this;

        if (!paymentMode || !address) {
          this.get('toast').showToast(!paymentMode ? "Please select payment mode" : "Please Enter Shipping address", "Warning", "warning");
          return;
        }

        this.checkOutOfStockItems(); // Check for out-of-stock before proceeding
        if (this.get('outOfStock')) {
          this.get('toast').showToast('Some items in your cart are out of stock. Please remove them to proceed.', 'Warning', "warning");
          return;
        }
        console.log("Purchasing the product");
        (0, _ajaxReq.default)({
          endpoint: 'orders',
          method: 'POST',
          data: JSON.stringify({
            shipping_address: address ? address : '',
            payment_mode: paymentMode,
            user_discount_id: userDiscountId,
            deal: 200011
          })
        }).then(function (res) {
          _this3.get("DataStore").set("isOrderConfirm", true);
          if (res.discount_code != null) {
            console.log("query working");
            _this3.get("router").transitionTo('checkout.order-confirmation', { queryParams: { coupon: res.discount_code } });
          } else {
            _this3.get("router").transitionTo("checkout.order-confirmation", { queryParams: { coupon: '' } });
          }
          _this3.get('toast').showToast('Thank you for shopping with us', 'Order Placed Successfully!', 'success');
        });
      }
    }
  });
});
define('online-shopping-client/components/horizontal-scroll-items', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define('online-shopping-client/components/input-field', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    passwordVisible: false,
    label: '',
    inputType: 'text',
    tag: 'input',
    inputId: '',
    placeholder: '',
    value: '',
    error: '',
    required: false,
    forLabel: '',
    labelClass: '',
    inputClass: '',
    actions: {
      toggleVisibility: function toggleVisibility() {
        this.toggleProperty('passwordVisible');
      }
    }
  });
});
define('online-shopping-client/components/input-password', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    passwordVisible: false, // default to password being hidden

    actions: {
      toggleVisibility: function toggleVisibility() {
        this.toggleProperty('passwordVisible'); // toggle the password visibility
      }
    }
  });
});
define('online-shopping-client/components/login-page', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        email: '',
        actions: {
            submitEmail: function submitEmail() {
                // this.event.preventDefault;
                console.log("submitted the data");
                this.transitionToRoute("/");
                // if (this.email) {
                //     this.transitionToRoute('login/password', { queryParams: { email: this.email } });
                //   } else {
                //     alert('Please enter a valid email');
                //   }
            }
        }
    });
});
define('online-shopping-client/components/model-dialog', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        showOverlay: false,
        message: 'Are you sure?',
        yesAction: null,
        noAction: null,

        actions: {
            handleYesClick: function handleYesClick() {
                if (this.yesAction) {
                    this.yesAction();
                }
                this.set("showOverlay", false);
            },
            handleNoClick: function handleNoClick() {
                if (this.noAction) {
                    this.noAction();
                }
                this.set("showOverlay", false);
            },
            handleCloseClick: function handleCloseClick() {
                this.set("showOverlay", false);
            }
        }
    });
});
define('online-shopping-client/components/my-tour.js', ['exports', 'intro.js'], function (exports, _intro) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      this.startTour(); // Start the tour when the component is inserted
    },
    startTour: function startTour() {
      (0, _intro.default)().setOptions({
        steps: [{
          element: '.navbar-logo',
          intro: "Welcome! Let's explore the key features of our online shopping platform",
          position: 'bottom'
        }, {
          element: '.dropbtn:nth-of-type(1)', // First dropdown for Categories
          intro: "Use this dropdown to browse products by category",
          position: 'bottom'
        }, {
          element: '.dropbtn:nth-of-type(2)', // Second dropdown for Brands
          intro: "Select a brand to see all products from that brand",
          position: 'bottom'
        }, {
          element: '.search-field',
          intro: "Search for specific products using the search bar",
          position: 'bottom'
        }, {
          element: '.navbar-cart',
          intro: "Click here to view items in your cart",
          position: 'bottom'
        }, {
          element: '.navbar-account',
          intro: "Access your profile, update password, and view your orders here.",
          position: 'bottom'
        }],
        showBullets: false,
        showProgress: true
      }).start(); // Start the tour
    }
  });
});
define('online-shopping-client/components/product-container', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    products: [],
    isLoading: true,
    isImageError: false,
    dataStore: Ember.inject.service('data-store'),
    dealOfTheMoment: Ember.computed.alias('dataStore.dealOfTheMoment'),
    init: function init() {
      this._super.apply(this, arguments);
      this.fetchProducts();
    },

    actions: {
      load: function load() {
        console.log("Image loaded successfully");
        this.set("isImageError", false); // Reset image error state
      },
      error: function error() {
        console.log("Can't load the image");
        this.set("isImageError", true); // Set image error state
      }
    },

    fetchProducts: function fetchProducts() {
      var _this = this;

      // Simulate a delay to mimic data fetching
      setTimeout(function () {
        // Replace this with your actual data fetching logic
        _this.set('products', _this.get('products')); // Update with actual products
        _this.set('isLoading', false); // Set loading to false when done
      }, 10); // Simulate a short loading time
    }
  });
});
define('online-shopping-client/components/search-box', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    placeholder: 'Search...', // Default placeholder
    searchValue: '',
    actionName: ''

    //   didInsertElement() {
    //     this._super(...arguments);
    //     this.$('.search-input').on('keydown', this.handleKeyDown.bind(this));
    //     this.$('.search-input').on('keyup', this.handleKeyUp.bind(this));
    //   },

    //   willDestroyElement() {
    //     // Clean up event listeners
    //     this.$('.search-input').off('keydown');
    //     this.$('.search-input').off('keyup');
    //   },

    //   handleKeyDown(event) {
    //     const inputValue = event.target.value;

    //     if (event.keyCode === 38) { // Up arrow
    //       console.log('Up arrow pressed:', inputValue);
    //     } else if (event.keyCode === 40) { // Down arrow
    //       console.log('Down arrow pressed:', inputValue);
    //     }
    //   },

    //   handleKeyUp(event) {
    //     const inputValue = event.target.value;
    //     console.log('Key released:', event.key, 'Current input value:', inputValue);
    //   }
  });
});
define('online-shopping-client/components/shop-navbar', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    dataStore: Ember.inject.service('data-store'),
    isLoggedIn: Ember.computed.alias('dataStore.isLoggedIn'),
    isAdmin: Ember.computed.alias('dataStore.isAdmin'),
    categories: Ember.computed.alias('dataStore.categories'),
    brands: Ember.computed.alias('dataStore.brands'),
    searchQuery: '',
    searchResults: [],
    showSuggestion: false,
    selectedIndex: -1,
    showCart: false,
    router: Ember.computed(function () {
      return Ember.getOwner(this).lookup('router:main');
    }),

    liveSearch: Ember.observer('searchQuery', function () {
      var _this = this;

      if (this.get("searchQuery").length >= 3) {
        this.set('selectedIndex', -1);
        this.set("showSuggestion", true);
        (0, _ajaxReq.default)({
          endpoint: 'product',
          data: { filter_name: this.get("searchQuery"), page_size: 5 }
        }).then(function (response) {
          _this.set('searchResults', response.length ? response : [{ productName: "No Results Found" }]);
        }).catch(function (error) {
          _this.get('toast').showToast('Search failed. Please try again.', 'Warning', "warning");
          _this.set('searchResults', []);
        });
      } else {
        this.set("showSuggestion", false);
        this.set('searchResults', []);
      }
    }),

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      this.$('.search-input').on('keydown', this.handleKeyDown.bind(this));
      // this.$('.search-input').on('keyup', this.handleKeyUp.bind(this));
      this._clickOutsideListener = this.clickOutside.bind(this);
      document.addEventListener('click', this._clickOutsideListener);
    },
    willDestroyElement: function willDestroyElement() {
      this.$('.search-input').off('keydown');
      // this.$('.search-input').off('keyup');
      document.removeEventListener('click', this._clickOutsideListener);
    },
    handleKeyDown: function handleKeyDown(event) {
      var inputValue = event.target.value;
      var searchResults = this.get('searchResults');
      var selectedIndex = this.get('selectedIndex');
      if (event.keyCode === 38) {
        // Up arrow
        this.set('selectedIndex', Math.max(selectedIndex - 1, 0));
        console.log('Up arrow pressed:', inputValue, this.get('selectedIndex'));
      } else if (event.keyCode === 40) {
        // Down arrow
        this.set('selectedIndex', Math.min(selectedIndex + 1, searchResults.length - 1));

        console.log('Down arrow pressed:', inputValue, this.get('selectedIndex'));
      } else if (event.keyCode === 13 && selectedIndex >= 0) {
        // event.preventDefault();
        var selectedProduct = searchResults[selectedIndex];
        if (selectedProduct && selectedProduct.productId) {
          this.send('searchContent', selectedProduct.productId); // Trigger action with selected product ID
          this.set("showSuggestion", false); // Hide suggestions after selection
          this.set('searchQuery', '');
        }
      }
    },
    handleKeyUp: function handleKeyUp(event) {
      var inputValue = event.target.value;
      console.log('Key released:', event.key, 'Current input value:', inputValue, this.get('selectedIndex'));
    },
    clickOutside: function clickOutside(event) {
      var searchInput = this.$('.search-input')[0];
      var searchSuggestions = this.$('.search-suggestions')[0];
      var cartIcon = this.$('.navbar-cart')[0];
      if (!cartIcon.contains(event.target)) {
        this.set('showCart', false);
      }
      if (searchInput && searchSuggestions && !searchInput.contains(event.target) && !searchSuggestions.contains(event.target)) {
        this.set("showSuggestion", false);
      }
    },


    actions: {
      selectCategory: function selectCategory(value) {
        this.get("router").transitionTo('products', { queryParams: { filter_category: value, filter_brand: null } });
      },
      selectBrand: function selectBrand(value) {
        this.get("router").transitionTo('products', { queryParams: { filter_brand: value, filter_category: null } });
      },
      toggleCart: function toggleCart(getItems) {
        var _this2 = this;

        if (getItems) {
          (0, _ajaxReq.default)({
            endpoint: 'cart'
          }).then(function (response) {
            _this2.set("cartItems", response);
          }).catch(function (error) {
            _this2.get('toast').showToast('Something went wrong', 'Warning', "warning");
          });
        }
        this.toggleProperty("showCart");
      },
      handleKeydown: function handleKeydown(event) {
        if (event.keyCode === 13 && this.selectedIndex >= 0) {
          // Enter key
          var selectedProduct = this.get('searchResults')[this.selectedIndex];
          if (selectedProduct && selectedProduct.productId) {
            this.send('searchContent', selectedProduct.productId); // Call searchContent with selected product ID
          }
        }
      },
      searchContent: function searchContent(productId) {
        this.get('router').transitionTo('product', productId);
      }
    }
  });
});
define('online-shopping-client/components/toast-notification', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    toast: Ember.inject.service(),

    activateToast: Ember.computed.alias('toast.isVisible'),
    message: Ember.computed.alias('toast.message'),
    type: Ember.computed.alias('toast.type'),
    status: Ember.computed.alias('toast.status'),

    actions: {
      closeToast: function closeToast() {
        this.get('toast').set('isVisible', false);
      }
    }
  });
});
define('online-shopping-client/components/top-menu', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define('online-shopping-client/components/user-details', ['exports', 'online-shopping-client/utils/encrypt-data', 'online-shopping-client/utils/password-validation', 'online-shopping-client/utils/ajax-req'], function (exports, _encryptData, _passwordValidation, _ajaxReq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Ember$Component$exte;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  exports.default = Ember.Component.extend((_Ember$Component$exte = {
    isVerified: true,
    isPasswordVisible: false,
    disableEditDetails: true,
    toast: Ember.inject.service(),
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    validateEmail: /^([a-z A-Z 0-9 _\.\-])+\@(([a-z A-Z 0-9\-])+\.)+([a-z A-z 0-9]{3,3})+$/,
    error: '',
    emailError: '',
    selectedPayment: null
  }, _defineProperty(_Ember$Component$exte, 'toast', Ember.inject.service()), _defineProperty(_Ember$Component$exte, 'isDisabled', Ember.computed('isVerified', 'readOnly', function () {
    console.log("address value", this.get('isVerified'), this.get('readOnly'));
    return this.get('isVerified') && !this.get('readOnly');
  })), _defineProperty(_Ember$Component$exte, 'paymentOptions', [{ id: '0', value: 0, label: 'Cash On Delivery' }, { id: '1', value: 1, label: 'UPI' }, { id: '2', value: 2, label: 'Net Banking' }, { id: '3', value: 3, label: 'Debit/Credit Card' }]), _defineProperty(_Ember$Component$exte, 'init', function init() {
    this._super.apply(this, arguments);
    this.set('initialUserData', {
      firstName: this.get('model.firstName'),
      lastName: this.get('model.lastName'),
      mobile: this.get('model.mobile'),
      address: this.get('model.address'),
      email: this.get('model.email')
    });
    console.log("initial ", this.get("initialUserData"), this.get("model"));
  }), _defineProperty(_Ember$Component$exte, 'validateDetails', function validateDetails() {
    var isValid = true;
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.set('error', "Confirm password does not match the new password");
      isValid = false;
    }

    if (this.newPassword) {
      var passwordError = (0, _passwordValidation.validatePassword)(this.newPassword);
      if (passwordError) {
        this.set('error', passwordError);
        isValid = false;
      }
    }

    if (this.model.mobile.toString().length != 10) {

      this.set('mobileError', 'Mobile Number should containe 10 digits');
      isValid = false;
    }

    if (!this.get("validateEmail").test(this.get("model.email"))) {
      this.set('emailError', 'Enter the valid Email');
      isValid = false;
    }
    return isValid;
  }), _defineProperty(_Ember$Component$exte, 'actions', {
    editProfile: function editProfile() {
      // this.toast("")
      this.get('toast').showToast("You can now edit your profile details", "", "success");

      // this.toast("You can now edit your profile details",'success');
      this.set("disableEditDetails", false);
    },
    updatePayment: function updatePayment(value) {
      console.log("updating the payment");
      this.set("selectedPayment", value);
      this.set("paymentMode", value);
      console.log("payment Mode value is ", value, this.get("paymentMode"));
    },
    updateDetails: function updateDetails() {
      var _this = this;

      if (!this.validateDetails()) {
        return;
      }

      var userDetails = {};
      if (this.get('model.firstName') !== this.initialUserData.firstName) {
        userDetails.first_name = this.get('model.firstName');
      }

      if (this.get('model.lastName') !== this.initialUserData.lastName) {
        userDetails.last_name = this.get('model.lastName');
      }

      if (this.get('model.mobile') !== this.initialUserData.mobile) {
        userDetails.mobile = String(this.get('model.mobile'));
      }

      if (this.get('model.address') !== this.initialUserData.address) {
        userDetails.address = this.get('model.address');
      }
      if (this.get('model.email') !== this.initialUserData.email) {
        userDetails.email = this.get('model.email');
      }

      if (this.newPassword) {
        userDetails.new_password = (0, _encryptData.default)({ password: this.newPassword });
      }
      console.log(JSON.stringify(userDetails), userDetails);
      if (Object.keys(userDetails).length === 0) {
        this.set('error', "No changes detected. Please update at least one field.");
        return;
      }

      (0, _ajaxReq.default)({
        endpoint: 'users',
        method: 'PUT',
        data: JSON.stringify(userDetails)
      }).then(function (response) {
        _this.set('initialUserData', {
          firstName: _this.get('model.firstName'),
          lastName: _this.get('model.lastName'),
          mobile: _this.get('model.mobile'),
          address: _this.get('model.address'),
          email: _this.get('model.email')
        });
        _this.get('toast').showToast('Details updated successfully', 'success');
        _this.set('emailError', '');
        _this.set("mobileError", '');
        _this.set('error', '');
      }).catch(function (error) {
        var f = 0;
        if (error.responseJSON && error.responseJSON.email) {
          _this.set("emailError", error.responseJSON.email);
          f = 1;
        }
        if (error.responseJSON && error.responseJSON.mobile) {
          _this.set("mobileError", error.responseJSON.mobile);
          f = 1;
        }
        if (f === 0) {
          _this.set("error", error.message || "An unexpected error occurred");
          _this.get("toast").showToast(error.message || "An unexpected error occurred", "Error", "error");
        }
      });
    },
    cancel: function cancel() {
      console.log("cancelling");
      var router = Ember.getOwner(this).lookup("router:main");
      router.transitionTo("/");
      this.setProperties({
        isVerified: false,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        error: ''
      });
    }
  }), _Ember$Component$exte));
});
define('online-shopping-client/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('online-shopping-client/controllers/account', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        toast: Ember.inject.service(),
        isLoggedIn: Ember.computed.alias('dataStore.isLoggedIn'),
        isAdmin: Ember.computed.alias('dataStore.isAdmin'),
        isCurrentRoute: null,
        showOverlay: false,
        dataStore: Ember.inject.service('data-store'),
        init: function init() {
            this._super.apply(this, arguments);
            this.updateCurrentRouteName();
        },
        updateCurrentRouteName: function updateCurrentRouteName() {
            var _this = this;

            var router = Ember.getOwner(this).lookup('router:main');
            this.set('isCurrentRoute', router.get('currentRouteName') == "account.orders" || router.get("currentRouteName") == "account.users");
            console.log("working ", this.get("isCurrentRoute"));

            router.on('didTransition', function () {
                console.log("account router is " + router.get('currentRouteName'));

                _this.set('isCurrentRoute', router.get('currentRouteName') == "account.orders" || router.get("currentRouteName") == "account.users");
                console.log("working ", _this.get("isCurrentRoute"));
            });
        },

        actions: {
            logout: function logout() {
                var _this2 = this;

                (0, _ajaxReq.default)({
                    endpoint: 'auth/logout',
                    method: 'DELETE'
                }).then(function (response) {
                    console.log("Logout successful", response);
                }).catch(function (error) {
                    _this2.get('toast').showToast('Logout failed', 'Warning', "warning");
                }).then(function () {

                    _this2.get('toast').showToast('Logout Successfull', 'success', "success");
                    _this2.get("dataStore").set("isLoggedIn", false);
                    _this2.get("dataStore").set("isAdmin", false);
                    _this2.transitionToRoute("/");
                });
            },
            showModel: function showModel() {
                this.set("showOverlay", true);
            }
        }
    });
});
define('online-shopping-client/controllers/account/orders', ['exports', 'online-shopping-client/utils/transform-data', 'online-shopping-client/utils/ajax-req'], function (exports, _transformData, _ajaxReq) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        currentPage: 0,
        totalPage: null,
        isLoggedIn: Ember.computed.alias('dataStore.isLoggedIn'),
        isAdmin: Ember.computed.alias('dataStore.isAdmin'),
        // orders: [], 
        searchValue: null,
        adminMsg: "",
        disableNextPage: Ember.computed("currentPage", "totalPage", function () {
            return this.get('currentPage') === this.get('totalPage') - 1;
        }),
        userMsg: "No orders found. Please check back later or place a new order",
        isEmail: function isEmail() {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(this.get("searchValue"));
        },


        actions: {
            fetchOrdersHistory: function fetchOrdersHistory() {
                var _this = this;

                console.log("email is" + this.get("searchValue"));

                var data = {
                    page_number: this.currentPage,
                    page_size: 6
                };

                if (this.get("searchValue")) {
                    if (this.isEmail()) {
                        data.email = this.get("searchValue");
                    } else {
                        data.invoice_number = this.get("searchValue");
                    }
                }
                (0, _ajaxReq.default)({
                    endpoint: 'orders',
                    data: data
                }).then(function (res) {
                    if (res.length == 0) {
                        _this.set("totalPage", _this.currentPage - 1);
                        if (localStorage.getItem("isAdmin")) {
                            _this.set("adminMsg", "No results match your search");
                        }
                        if (_this.currentPage != 0) {
                            _this.set("disableNextPage", true);
                        }
                    } else {
                        _this.set('model', (0, _transformData.default)(res));
                        _this.set("disableNextPage", false);
                    }
                });
            },

            //     Ember.$.ajax({
            //         url: 'http://localhost:8002/api/v1/orders',
            //         data: data,
            //         type: "GET",
            //         contentType : 'application/json',
            //         error: (error) => {
            //             console.error('Error searching orders:', error);
            //         }
            //     })
            //     .then((res) => {
            //         if(res.length==0)
            //         {
            //             this.set("totalPage",this.currentPage-1);
            //             if(localStorage.getItem("isAdmin")){
            //                 this.set("adminMsg","No results match your search");
            //             }
            //             if(this.currentPage!=0){
            //                 this.set("disableNextPage",true)
            //             }
            //         }
            //         else{
            //             this.set('model', transformData(res)); 
            //             this.set("disableNextPage",false);
            //         }
            //     });
            // },
            incrementPage: function incrementPage() {
                this.set('currentPage', this.get('currentPage') + 1);
                this.send('fetchOrdersHistory');
            },
            decrementPage: function decrementPage() {
                var newPage = this.get('currentPage') - 1;
                if (newPage >= 1) {
                    this.set('currentPage', newPage);
                    this.send('fetchOrdersHistory');
                }
            }
        }
    });
});
define('online-shopping-client/controllers/account/profile', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    currentRouteName: null, // Initialize the property

    init: function init() {
      this._super.apply(this, arguments);
      this.updateCurrentRouteName();
    },
    updateCurrentRouteName: function updateCurrentRouteName() {
      var _this = this;

      var router = Ember.getOwner(this).lookup('router:main');
      this.set('currentRouteName', router.get('currentRouteName'));
      // Add an observer for route changes
      router.on('didTransition', function () {
        _this.set('currentRouteName', router.get('currentRouteName'));
      });
    },


    actions: {
      click: function click() {
        console.log('Current route:', this.get('currentRouteName'));
      }
    }
  });
});
define('online-shopping-client/controllers/account/profile/update-password', ['exports', 'online-shopping-client/utils/encrypt-data', 'online-shopping-client/utils/password-validation', 'online-shopping-client/utils/ajax-req'], function (exports, _encryptData, _passwordValidation, _ajaxReq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    isVerified: false,
    password: '',
    newPassword: "",
    confirmPassword: "",
    passwordError: '',
    newPasswordError: '',
    confirmPasswordError: "",
    error: "",
    toast: Ember.inject.service(),
    actions: {
      verifyPwd: function verifyPwd() {
        var _this = this;

        console.log("password " + this.password);
        if (this.password === undefined || this.password === '') {
          this.set('passwordError', 'Password is Empty');
          return;
        }
        (0, _ajaxReq.default)({
          endpoint: 'auth/login',
          method: 'PUT',
          data: JSON.stringify({ encryptedData: (0, _encryptData.default)({ password: this.password }) })
        }).then(function (res) {
          _this.set("isVerified", true);
          _this.set("error", '');
          _this.set('passwordError', '');
          console.log("success " + res);
        }).catch(function (error) {
          _this.set("passwordError", error.responseJSON.message);
        });
      },
      updateDetails: function updateDetails() {
        var _this2 = this;

        var passwordError = (0, _passwordValidation.validatePassword)(this.newPassword);
        var isValid = void 0;
        if (passwordError) {
          this.set('newPasswordError', passwordError);
          isValid = true;
        } else {
          this.set('newPasswordError', '');
        }

        if (this.newPassword && this.newPassword !== this.confirmPassword) {
          this.set('confirmPasswordError', "Confirm password does not match the new password");
          isValid = true;
        } else {
          this.set("confirmPasswordError", '');
        }
        if (isValid) {
          return;
        }

        (0, _ajaxReq.default)({
          endpoint: 'users',
          method: 'PUT',
          data: JSON.stringify({ new_password: (0, _encryptData.default)({ password: this.newPassword }) })
        }).then(function (response) {
          if (response.isValid) {
            _this2.get('toast').showToast('Details updated successfully!', 'Success');
            _this2.set('password', '');
            _this2.set('newPassword', '');
            _this2.set('confirmPassword', '');
          } else {
            console.log(response);

            _this2.set("error", response.responseJSON.message);
            _this2.get('toast').showToast('Error updating details. Please try again.!', 'Error', 'error');
          }
        }).catch(function (error) {
          _this2.set('newPasswordError', error.responseJSON.message);
        });
      }
    }
  });
});
define('online-shopping-client/controllers/account/users', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        userDetail: null,
        searchValue: null,
        isLoggedIn: Ember.computed.alias('dataStore.isLoggedIn'),
        isAdmin: Ember.computed.alias('dataStore.isAdmin'),
        actions: {
            fetchUser: function fetchUser() {
                var _this = this;

                console.log(this.get("searchValue"));
                (0, _ajaxReq.default)({
                    endpoint: 'users',
                    data: { "email": this.get("searchValue") }
                }).then(function (res) {
                    console.log(res);
                    _this.set("userDetail", res[0]);
                });
                // Ember.$.ajax({
                //     url:'http://localhost:8002/api/v1/users',
                //     type:'GET',
                //     data: {"email":this.get("searchValue") },
                //     contentType: 'application/json',
                // })
                // .then((res)=>{
                //     console.log(res);
                //     this.set("userDetail",res[0]);
                // })
            }
        }
    });
});
define('online-shopping-client/controllers/application', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    actions: {
      startTour: function startTour() {
        if (typeof window.introJs === 'function') {
          var intro = window.introJs().setOptions({
            steps: [{
              element: '.navbar-logo',
              intro: "Welcome to ZKart! Let us guide you through our online shopping features.",
              position: 'bottom'
            }, {
              element: '.dropbtn:nth-of-type(1)',
              intro: "Browse products by category to find what you need.",
              position: 'bottom'
            }, {
              element: '#brand',
              intro: "Choose a brand to see all available products from that brand.",
              position: 'bottom'
            }, {
              element: '.search-field',
              intro: "Use the search bar to quickly find specific products.",
              position: 'bottom'
            }, {
              element: '.navbar-cart',
              intro: "Click here to view items in your shopping cart.",
              position: 'bottom'
            }, {
              element: '.navbar-account',
              intro: "Access your account to update your profile, change your password, and view your order history.",
              position: 'bottom'
            }],
            showBullets: false,
            showProgress: true
          }).start();
        } else {
          console.error('Intro.js is not loaded');
        }
      }
    }
  });
});
define('online-shopping-client/controllers/checkout', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    currentRouteName: null, // Initialize the property

    init: function init() {
      this._super.apply(this, arguments);
      this.updateCurrentRouteName(); // Set the initial route name
      console.log("chekout page");
    },
    updateCurrentRouteName: function updateCurrentRouteName() {
      var _this = this;

      var router = Ember.getOwner(this).lookup('router:main');
      this.set('currentRouteName', router.get('currentRouteName'));
      // Add an observer for route changes
      router.on('didTransition', function () {
        _this.set('currentRouteName', router.get('currentRouteName'));
        console.log('Current route:', _this.get('currentRouteName'));
      });
    },

    actions: {
      view: function view() {
        // Use this.get to access model properties
        console.log("user ", this.get('model.UserDetails'), this.get("model"));
        console.log("cart ", this.get('model.cartItems'));
      }
    }
  });
});
define('online-shopping-client/controllers/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    //   dataStore: Ember.inject.service(), // Injecting the shopping-lists service


  });
});
define('online-shopping-client/controllers/login', ['exports', 'online-shopping-client/utils/encrypt-data', 'online-shopping-client/utils/ajax-req'], function (exports, _encryptData, _ajaxReq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    toast: Ember.inject.service(),
    DataStore: Ember.inject.service(),
    error: '',
    emailError: '',
    password: '',
    show_password: false,
    validateEmail: /^([a-z A-Z 0-9 _\.\-])+\@(([a-z A-Z 0-9\-])+\.)+([a-z A-z 0-9]{3,3})+$/,
    actions: {
      submitEmail: function submitEmail() {
        var _this = this;

        if (!this.validateEmail.test(this.get("email"))) {
          this.set("emailError", 'Enter the valid Email');
          return;
        }
        if (this.get("show_password")) {
          if (this.get("password").length <= 0) {
            this.set("passwordError", 'Enter the valid Password');
            return;
          }
        }
        console.log("submiting the data");

        var data = JSON.stringify(this.password ? { encryptedData: (0, _encryptData.default)({ email: this.email, password: this.password }) } : { email: this.email });
        (0, _ajaxReq.default)({
          endpoint: 'auth/login',
          method: 'PUT',
          data: data
        }).then(function (res) {
          _this.set('error', '');
          _this.set('emailError', '');
          _this.set('passwordError', '');
          if (_this.get("show_password")) {
            _this.get('DataStore').set('isLoggedIn', true);
            if (res.isAdmin) {

              _this.get('DataStore').set('isAdmin', true);
            }
            _this.set("email", '');
            _this.set("password", '');
            _this.set('show_password', false);
            _this.get('toast').showToast('Login successful!', 'Success', 'success');
            _this.transitionToRoute("/");
          } else {
            _this.set('show_password', true);
          }
        }).catch(function (error) {
          console.log(error);

          var f = 0;
          if (error.responseJSON && error.responseJSON.email) {
            _this.set("emailError", error.responseJSON.email);
            f = 1;
          }
          if (error.responseJSON && error.responseJSON.password) {
            _this.set("passwordError", error.responseJSON.password);
            f = 1;
          }
          if (f === 0) {
            _this.set("error", error.message || "An unexpected error occurred");
          }
        });
      }
    }
  });
});
define('online-shopping-client/controllers/product', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        DataStore: Ember.inject.service(),
        toast: Ember.inject.service(),
        isLoggedIn: Ember.computed.alias('dataStore.isLoggedIn'),
        isAdmin: Ember.computed.alias('dataStore.isAdmin'),
        dealOfTheMoment: Ember.computed.alias('DataStore.dealOfTheMoment'),
        //get category
        category: Ember.computed('model', 'DataStore', function () {
            var model = this.get('model');
            if (model.length === 0) {
                console.log("DataStore does not started");
                return null;
            }
            var categoryId = model.product.categoryId;
            console.log("value ", this.get('DataStore').getCategories(), categoryId);
            return this.get('DataStore').getCategories().find(function (category) {
                return category.categoryId === categoryId;
            });
        }),
        //get brand
        brand: Ember.computed('model', 'DataStore', function () {
            var model = this.get('model');
            if (model.length === 0) {
                return null;
            }
            var brandId = model.product.brandId;
            return this.get('DataStore').getBrands().find(function (brand) {
                return brand.brandId === brandId;
            });
        }),
        init: function init() {
            this._super.apply(this, arguments);
            console.log("DataStore  is " + this.get("DataStore"));
        },

        selectedQuantity: 1,
        actions: {
            updateQuantity: function updateQuantity(event) {
                // Update the selected quantity based on user selection
                this.set('selectedQuantity', parseInt(event.target.value, 10));
                console.log("updating");
            },
            AddItem: function AddItem(value) {
                var _this = this;

                if (this.get('DataStore').get('isLoggedIn')) {
                    console.log(this.get("model").product.productId, this.get("model").product, this.get("model"));
                    (0, _ajaxReq.default)({
                        endpoint: 'cart',
                        method: 'POST',
                        data: JSON.stringify({
                            "product_id": this.get("model").product.productId,
                            "quantity": this.get("selectedQuantity")
                        })
                    }).then(function (res) {
                        _this.get('toast').showToast('Cart item added successfully!', 'success');
                        if (value) {
                            _this.transitionToRoute("/checkout");
                        }
                    }).catch(function (error) {
                        _this.get('toast').showToast("An error occurred while adding to cart", 'Error', 'error');
                        console.error("Error adding item to cart:", error); // Log the complete error object for debugging
                    });
                } else {
                    this.get('toast').showToast("User is not logged in", 'Warning', 'warning');
                }
            }
        }
    });
});
define('online-shopping-client/controllers/products', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        showCategory: false,
        showBrand: false,
        showPrice: false,
        DataStore: Ember.inject.service(),
        selectedCategory: null,
        selectedBrand: null,
        selectedPriceRange: '',

        priceRanges: [{ value: 1, label: "Under ₹ 50000", condition: { max_price: 50000 } }, { value: 2, label: "₹ 50000 to ₹100000", condition: { min_price: 50000, max_price: 100000 } }, { value: 3, label: "₹ 100000 to ₹300000", condition: { min_price: 100000, max_price: 300000 } }, { value: 4, label: "₹ 300000 & Above", condition: { min_price: 300000 } }],

        categories: Ember.computed('model', 'DataStore', function () {
            return this.get('DataStore').getCategories();
        }),

        brands: Ember.computed('model', 'DataStore', function () {
            return this.get('DataStore').getBrands();
        }),

        init: function init() {
            this._super.apply(this, arguments);
            console.log("DataStore is " + this.get("DataStore"));
        },


        // Common function to handle filtering
        filterProducts: function filterProducts() {
            var selectedPriceRange = this.get('selectedPriceRange');
            // let priceCondition = selectedPriceRange ? this.get('priceRanges').findBy('value', selectedPriceRange).condition : {};

            this.transitionToRoute('products', {
                queryParams: {
                    filter_category: this.get("selectedCategory"),
                    filter_brand: this.get("selectedBrand"),
                    min_price: selectedPriceRange.min_price || null,
                    max_price: selectedPriceRange.max_price || null
                }
            });
        },


        actions: {
            toggleCategory: function toggleCategory() {
                this.toggleProperty("showCategory");
            },
            toggleBrand: function toggleBrand() {
                this.toggleProperty("showBrand");
            },
            togglePrice: function togglePrice() {
                this.toggleProperty("showPrice");
            },


            // Common method to call on any filter change
            updateFilter: function updateFilter(type, value) {
                // console.log(c);

                if (type === 'category') {
                    this.set('selectedCategory', value);
                } else if (type === 'brand') {
                    this.set('selectedBrand', value);
                } else if (type === 'price') {
                    console.log(this.get("selectedPriceRange"));

                    this.set('selectedPriceRange', value);
                }
                console.log(type + ' selected: ', value);

                // Call common filter method
                this.filterProducts();
            }
        }
    });
});
define('online-shopping-client/controllers/signup', ['exports', 'online-shopping-client/utils/password-validation', 'online-shopping-client/utils/encrypt-data', 'online-shopping-client/config/environment', 'online-shopping-client/utils/ajax-req'], function (exports, _passwordValidation, _encryptData, _environment, _ajaxReq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    toast: Ember.inject.service(),
    DataStore: Ember.inject.service(),
    first_name: '',
    last_name: '',
    mobile: '',
    address: '',
    email: '',
    password: '',
    confirm_password: '',
    error: '', // General error
    firstNameError: '', // Specific errors for each field
    lastNameError: '',
    mobileError: '',
    addressError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',

    validateFields: function validateFields() {
      var isValid = true;
      // Clear previous errors
      this.setProperties({
        firstNameError: '',
        lastNameError: '',
        mobileError: '',
        addressError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: ''
      });

      // Validate each field and set errors
      if (!this.first_name) {
        this.set('firstNameError', 'First name is required');
        isValid = false;
      }

      if (!this.last_name) {
        this.set('lastNameError', 'Last name is required');
        isValid = false;
      }

      if (!this.mobile) {
        this.set('mobileError', 'Mobile number is required');
        isValid = false;
      } else if (this.mobile.length != 10) {
        this.set('mobileError', 'Mobile number should container 10 digits');
        isValid = false;
      }

      if (!this.address) {
        this.set('addressError', 'Address is required');
        isValid = false;
      }
      if (!this.email) {
        this.set('emailError', 'Email is required');
        isValid = false;
      }
      if (!this.password) {
        this.set('passwordError', 'Password is required');
        isValid = false;
      }
      if (!this.confirm_password) {
        this.set('confirmPasswordError', 'Confirm password is required');
        isValid = false;
      } else if (this.password !== this.confirm_password) {
        this.set('confirmPasswordError', 'Passwords do not match');
        isValid = false;
      }

      var passwordError = (0, _passwordValidation.validatePassword)(this.password);
      if (passwordError) {
        this.set('passwordError', passwordError);
        isValid = false;
      }

      return isValid;
    },


    actions: {
      cancel: function cancel() {
        this.transitionToRoute("/");
      },
      submitSignup: function submitSignup() {
        var _this = this;

        if (!this.validateFields()) {
          return;
        }
        (0, _ajaxReq.default)({
          endpoint: 'auth/signup',
          method: 'POST',
          data: JSON.stringify({
            first_name: this.first_name,
            last_name: this.last_name,
            mobile: this.mobile,
            address: this.address,
            encryptedData: (0, _encryptData.default)({ email: this.email, password: this.password })
          })
        }).then(function (res) {
          _this.set('error', '1');
          _this.get("DataStore").set("isLoggedIn", true);
          if (res.isAdmin) {
            _this.get('DataStore').set('isAdmin', true);
          }

          _this.get("toast").showToast("Welcome to Z-kart!", "Signup Successful", 'success');
          _this.transitionToRoute("/");
        }).catch(function (error) {
          var f = 0;
          if (error.responseJSON && error.responseJSON.email) {
            _this.set("emailError", error.responseJSON.email);
            f = 1;
          }
          if (error.responseJSON && error.responseJSON.mobile) {
            _this.set("mobileError", error.responseJSON.mobile);
            f = 1;
          }
          if (f === 0) {
            _this.set("error", error.message || "An unexpected error occurred");
          }
        });
      }
    }
  });
});
define('online-shopping-client/helpers/app-version', ['exports', 'online-shopping-client/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define("online-shopping-client/helpers/calculate-discount-price", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.calculateDiscountPrice = calculateDiscountPrice;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function calculateDiscountPrice(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        price = _ref2[0],
        discount = _ref2[1];

    console.log("offer price is", price * (1 - discount / 100));

    return (price * (1 - discount / 100)).toFixed(2);
  }
  exports.default = Ember.Helper.helper(calculateDiscountPrice);
});
define('online-shopping-client/helpers/eq', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.eq = eq;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function eq(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        param1 = _ref2[0],
        param2 = _ref2[1];

    // console.log("helper eq is working "+param1,param2,param1==param2);
    return param1 == param2;
  }

  exports.default = Ember.Helper.helper(eq);
});
define('online-shopping-client/helpers/is-logged-in', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  exports.default = Ember.Helper.extend({
    dataStore: Ember.inject.service('data-store'),

    compute: function compute(_ref) {
      var _this = this;

      var _ref2 = _slicedToArray(_ref, 1),
          user = _ref2[0];

      var dataStore = this.get('dataStore');
      console.log("data is not loaded so initailling");

      if (!dataStore.get('isDataLoaded')) {
        return dataStore.loadData().then(function () {
          return _this.getUserStatus(user);
        });
      }
      return this.getUserStatus(user);
    },
    getUserStatus: function getUserStatus(user) {
      var dataStore = this.get('dataStore');

      if (user === "admin") {
        console.log("Admin check is ", dataStore.get('isAdmin'));
        return dataStore.get('isAdmin');
      } else {
        console.log("Login check is ", dataStore.get('isLoggedIn'));
        return dataStore.get('isLoggedIn');
      }
    }
  });
});
define('online-shopping-client/helpers/join-string', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.joinString = joinString;
  function joinString(params) {
    return params.join('');
  }

  exports.default = Ember.Helper.helper(joinString);
});
define('online-shopping-client/helpers/or', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.or = or;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function or(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        arg1 = _ref2[0],
        arg2 = _ref2[1];

    return arg1 || arg2;
  }

  exports.default = Ember.Helper.helper(or);
});
define('online-shopping-client/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('online-shopping-client/helpers/product-url', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.productUrl = productUrl;

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var productImages = {
        'Gaming Laptop Pro': 'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/y/x/x/15-fb0147ax-gaming-laptop-hp-original-imahf7yvwdz9jwpp.jpeg?q=70&crop=false',
        'Smart Fridge 2024': 'https://rukminim2.flixcart.com/image/416/416/xif0q/refrigerator-new/h/c/1/-original-imah2gjnkkgrh5xq.jpeg?q=70&crop=false',
        'Ultrabook X': 'https://rukminim2.flixcart.com/image/416/416/kar44280/computer/m/g/3/asus-na-thin-and-light-laptop-original-imafs92skhtaehcq.jpeg?q=70',
        'Smartphone Z': 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/m/x/a/z9-lite-5g-i2306-iqoo-original-imah3fdtbjbvhh55.jpeg?q=70',
        'Headphones Q': 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/m/x/a/z9-lite-5g-i2306-iqoo-original-imah3fdtbjbvhh55.jpeg?q=70',
        'iPhone 15 Pro': 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/m/h/c/-original-imagtc3h9h6kpbkc.jpeg?q=70',
        'iPad Pro': 'https://rukminim2.flixcart.com/image/312/312/xif0q/tablet/a/m/e/-original-imagj72vegwqvkxk.jpeg?q=70',
        'MacBook Pro 16': 'https://rukminim2.flixcart.com/image/312/312/kuyf8nk0/computer/c/8/u/mkgp3hn-a-thin-and-light-laptop-apple-original-imag7yznc5d2rsuh.jpeg?q=70',
        'Apple Watch 9': 'https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/h/c/3/-original-imagte4syszvbmt2.jpeg?q=70',
        'AirPods Pro 2': 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/e/a/f/-original-imagtc44nk4b3hfg.jpeg?q=70',
        'Apple TV 4K': 'https://rukminim2.flixcart.com/image/612/612/xif0q/television/i/j/6/-original-imah4kwn3vv9rgpa.jpeg?q=70',
        'iMac 24': 'https://rukminim2.flixcart.com/image/612/612/xif0q/allinone-desktop/4/n/f/-original-imaguw4jacxcepeb.jpeg?q=70',
        'MacBook Air': 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/m/b/n/-original-imagfdf4xnbyyxpa.jpeg?q=70',
        'iPad Mini': 'https://rukminim2.flixcart.com/image/612/612/ktop5e80/tablet/k/f/r/mlwr3hn-a-apple-original-imag6ygfbepytqcu.jpeg?q=70',
        'AirTag': 'https://rukminim2.flixcart.com/image/612/612/knt7zbk0/smart-tracker/f/0/1/mx532zm-a-apple-original-imag2ffs3exkrsgq.jpeg?q=70',
        'Galaxy S23 Ultra': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/i/5/1/-original-imagzm8pvabtmeys.jpeg?q=70',
        'Galaxy Z Fold 5': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/z/j/k/-original-imagztmggmgfdt8d.jpeg?q=70',
        'Galaxy Tab S9': 'https://rukminim2.flixcart.com/image/312/312/xif0q/tablet/8/i/q/-original-imaguyffv34ghmky.jpeg?q=70',
        'Galaxy Watch 6': 'https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/e/z/p/-original-imahfa7xekwfg7cc.jpeg?q=70',
        'Galaxy Buds 3': 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/2/l/s/-original-imah2nhzmmtzthfx.jpeg?q=70',
        'Samsung QLED TV': 'https://rukminim2.flixcart.com/image/312/312/xif0q/television/z/z/s/-original-imagttjpr7vphrks.jpeg?q=70',
        'Odyssey Monitor': 'https://rukminim2.flixcart.com/image/312/312/xif0q/monitor/6/0/0/-original-imagysfvpg8jw4bz.jpeg?q=70',
        'Smart Fridge': 'https://rukminim2.flixcart.com/image/312/312/xif0q/refrigerator-new/t/m/9/-original-imah4c6pbhvgerzn.jpeg?q=70',
        'Galaxy A54': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/2/a/t/-original-imagnrhknw9pbg3t.jpeg?q=70',
        'Galaxy Tab S6 Lite': 'https://rukminim2.flixcart.com/image/612/612/xif0q/screen-guard/screen-guard/q/o/l/sm-x110-sm-x115-sm-x117-techshield-original-imah4tyhh8aztevq.jpeg?q=70',
        'Oppo Find X6 Pro': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/3/4/i/-original-imagu8h9snemswmc.jpeg?q=70',
        'Oppo Reno8 Pro': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/p/v/p/-original-imah3cmbhgfymupr.jpeg?q=70',
        'Oppo F23 Pro 5G': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/0/n/9/-original-imagzfeavnt7gp5x.jpeg?q=70',
        'Oppo A78 5G': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/i/s/p/a78-5g-cph2495-oppo-original-imagrwbz6mqddemh.jpeg?q=70',
        'Oppo K10 5G': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/m/e/3/-original-imah37gwn2xbvzhy.jpeg?q=70',
        'Predator Helios 300': 'https://rukminim2.flixcart.com/image/312/312/ksgehzk0/computer/r/c/k/predator-helios-300-gaming-laptop-acer-original-imag6yjdmwdrksyn.jpeg?q=70',
        'Asus ROG Zephyrus G14': 'https://m.media-amazon.com/images/I/51671b+p4bL.jpg',
        'Dell XPS 13': 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/m/b/n/-original-imagfdf4xnbyyxpa.jpeg?q=70',
        'Lenovo Legion 7': 'https://rukminim2.flixcart.com/image/312/312/kdyus280/computer/t/w/3/lenovo-na-gaming-laptop-original-imafuqwpncg3bzhx.jpeg?q=70',
        'HP Spectre x360': 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/m/b/n/-original-imagfdf4xnbyyxpa.jpeg?q=70',
        'Acer Aspire 5': 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/4/z/v/aspire-5-thin-and-light-laptop-acer-original-imah3gaheyvb6hed.jpeg?q=70',
        'Lenovo Ideapad 3': 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/j/v/a/ideapad-3-thin-and-light-laptop-lenovo-original-imah2f9zfu3zxhrr.jpeg?q=70'
    };

    function productUrl(_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            productName = _ref2[0];

        return productImages[productName];
    }

    exports.default = Ember.Helper.helper(productUrl);
});
define('online-shopping-client/helpers/range', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.range = range;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function range(params) {
    var _params = _slicedToArray(params, 2),
        start = _params[0],
        end = _params[1];

    var array = [];
    for (var i = start; i <= end && i <= 5; i++) {
      array.push(i);
    }
    // console.log("array" ,array)
    return array;
  }

  exports.default = Ember.Helper.helper(range);
});
define('online-shopping-client/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define("online-shopping-client/helpers/split-lines", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.splitLines = splitLines;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function splitLines(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        specification = _ref2[0];

    console.log("specification is ", specification, specification.split("\\n"));
    return specification.split("\\n");
  }
  exports.default = Ember.Helper.helper(splitLines);
});
define('online-shopping-client/helpers/time-converter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.timeConverter = timeConverter;
  function timeConverter(millis) {
    var date = new Date(millis * 1000);

    var day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    var month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, add 1
    var year = date.getFullYear();

    // Return the formatted date as dd/mm/yyyy
    return day + '/' + month + '/' + year;
  }

  exports.default = Ember.Helper.helper(timeConverter);
});
define('online-shopping-client/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'online-shopping-client/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('online-shopping-client/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('online-shopping-client/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('online-shopping-client/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('online-shopping-client/initializers/export-application-global', ['exports', 'online-shopping-client/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('online-shopping-client/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('online-shopping-client/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('online-shopping-client/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("online-shopping-client/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('online-shopping-client/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('online-shopping-client/router', ['exports', 'online-shopping-client/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('products');
    this.route('login');
    this.route('signup');
    this.route('product', { path: '/product/:pid' });
    this.route('account', function () {
      this.route('profile', function () {
        this.route('update-password', { path: 'updatepassword' });
      });
      this.route('orders');
      this.route('users');
    });
    this.route('checkout', function () {
      this.route('order-confirmation');
    });
  });

  exports.default = Router;
});
define('online-shopping-client/routes/account', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    dataStore: Ember.inject.service('data-store'),

    model: function model() {
      var dataStore = this.get('dataStore');
      // Load data only if it hasn't been loaded yet
      console.log("reloading the data " + dataStore.get("isDataLoaded"));

      return dataStore.get('isDataLoaded') ? Ember.RSVP.resolve() // Data is already loaded, return resolved promise
      : dataStore.loadData(); // Load data if not already loaded
    },
    afterModel: function afterModel() {
      var dataStore = this.get('dataStore');

      if (!dataStore.get('isLoggedIn')) {
        this.transitionTo('/');
      }
    }
  });
});
define('online-shopping-client/routes/account/orders', ['exports', 'online-shopping-client/utils/transform-data', 'online-shopping-client/utils/ajax-req'], function (exports, _transformData, _ajaxReq) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        dataStore: Ember.inject.service('data-store'),
        model: function model() {

            if (localStorage.getItem("isAdmin") == "false") {

                return (0, _ajaxReq.default)({
                    endpoint: 'orders',
                    data: { page_size: 5, page_number: 1 }
                }).then(function (res) {
                    console.log(res);

                    return (0, _transformData.default)(res); // Return the transformed data
                }).catch(function (error) {
                    console.error('Error fetching orders:', error);
                    return { error: 'Error fetching orders' }; // Return error to handle in the template
                });
                // return Ember.$.ajax({
                //     url: 'http://localhost:8002/api/v1/orders',
                //     data: { page_size: 5, page_number: 1 },
                //     type: 'GET',
                //     contentType: 'application/json'
                // })
                // .then((res) => {
                //     console.log(res);

                //     return transformData(res); // Return the transformed data
                // })
                // .catch((error) => {
                //     console.error('Error fetching orders:', error);
                //     return { error: 'Error fetching orders' }; // Return error to handle in the template
                // });
            }
        },
        resetController: function resetController(controller, isExisting) {

            if (isExisting) {

                controller.set('orders', []); // Reset orders
                controller.set('currentPage', 0); // Reset current page
                controller.set('searchValue', null); // Reset search value
                controller.set('totalPage', null); // Reset total pages
                controller.set('adminMsg', ""); // Reset admin message
                controller.set('disableNextPage', false); // Reset disable next page flag
                controller.set('model', '');
            }
        }
    });
});
define('online-shopping-client/routes/account/profile', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      var _this = this;

      return (0, _ajaxReq.default)({
        endpoint: 'users'
      }).then(function (response) {
        console.log("profile " + response);
        return response[0];
      }).catch(function (error) {
        if (error.status === 401) {
          _this.transitionTo("login");
          localStorage.setItem("isLoggedIn", false);
          localStorage.setItem("isAdmin", false);
        } else {
          console.error('Error fetching users:', error);
        }
      });
      // return Ember.$.ajax({
      //   url: 'http://localhost:8002/api/v1/users',
      //   type: 'GET',
      //   xhrFields: {
      //     withCredentials: true // Use this instead of 'credentials' for including cookies.
      //   }
      // }).then((response) => {
      //   console.log("profile "+response);
      //   return response[0];
      // }).catch((error) => {
      //   if(error.status===401){
      //     this.transitionTo("login");
      //     localStorage.setItem("isLoggedIn",false);
      //     localStorage.setItem("isAdmin",false);
      //   }
      //   else{
      //     console.error('Error fetching users:', error);
      //   }
      // });
    }
  });
});
define('online-shopping-client/routes/account/profile/update-password', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        resetController: function resetController(controller, isExisting) {
            if (isExisting) {
                controller.set('password', '');
                controller.set('newPassword', '');
                controller.set('confirmPassword', '');
                controller.set('passwordError', '');
                controller.set('newPasswordError', '');
                controller.set('confirmPasswordError', '');
                controller.set('isVerified', false);
                controller.set('error', '');
            }
        }
    });
});
define('online-shopping-client/routes/account/users', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        resetController: function resetController(controller, isExisting) {
            if (isExisting) {
                controller.set('userDetail', '');
                controller.set('searchValue', '');
            }
        }
    });
});
define('online-shopping-client/routes/application', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('online-shopping-client/routes/checkout', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        dataStore: Ember.inject.service('data-store'),
        model: function model() {
            var _this = this;

            return Ember.RSVP.hash({
                userDetails: (0, _ajaxReq.default)({
                    endpoint: 'users'
                }),
                cartItems: (0, _ajaxReq.default)({
                    endpoint: 'cart'
                }),
                Discounts: (0, _ajaxReq.default)({
                    endpoint: 'discount'
                })
            }).then(function (responses) {
                console.log(responses);
                console.log(responses.userDetails[0]);
                console.log(responses.Discounts);
                var userDetails = responses.userDetails[0];
                var cartItems = responses.cartItems;

                return {
                    UserDetails: userDetails,
                    cartItems: cartItems,
                    Discounts: responses.Discounts
                };
            }).catch(function (error) {
                if (error.status === 401) {
                    _this.transitionTo('login');
                    _this.get('dataStore').set("isLoggedIn", false);
                    _this.get('dataStore').set("isAdmin", false);
                } else {
                    console.error('Error fetching data:', error);
                }
            });
        }
    });
});
define("online-shopping-client/routes/checkout/order-confirmation", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    DataStore: Ember.inject.service(),
    queryParams: {
      coupon: {
        refreshModel: true
      }
    },
    model: function model() {
      if (!this.get("DataStore.isOrderConfirm")) {
        this.transitionTo("/");
      }
    },
    afterModel: function afterModel(model, transition) {
      this.get("DataStore").set("isOrderConfirm", false);
    }
  });
});
define('online-shopping-client/routes/index', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return Ember.RSVP.hash({ // Use RSVP.hash to handle multiple promises
        products: (0, _ajaxReq.default)({
          endpoint: 'product',
          data: { 'page_number': 1, 'page_size': 20 }
        })
      }).then(function (response) {
        console.log("success", response);
        return response; // Response will be an object containing products, categories, and brands
      }).catch(function (error) {
        console.error('Error fetching data:', error, "value " + {});
        return {};
      });
    }
  });
});
define('online-shopping-client/routes/login', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    dataStore: Ember.inject.service('data-store'),

    model: function model() {
      var dataStore = this.get('dataStore');
      // Load data only if it hasn't been loaded yet
      return dataStore.get('isDataLoaded') ? Ember.RSVP.resolve() // Data is already loaded, return resolved promise
      : dataStore.loadData(); // Load data if not already loaded
    },
    afterModel: function afterModel() {
      var dataStore = this.get('dataStore');
      console.log(dataStore);
      console.log(dataStore.get('isLoggedIn'));

      if (dataStore.get('isLoggedIn')) {
        this.transitionTo('/');
      }
    }
  });
});
define('online-shopping-client/routes/product', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    queryParams: {
      categoryId: {
        refreshModel: true // Ensure the model is refreshed when this query param changes
      }
    },
    model: function model(params) {
      console.log("pid and categoryid ", params.pid, params.categoryId, params);
      return Ember.RSVP.hash({ // Use RSVP.hash to handle multiple promises
        products: (0, _ajaxReq.default)({
          endpoint: 'product',
          data: {
            product_id: params.pid
          }
        }),
        similarProducts: (0, _ajaxReq.default)({
          endpoint: 'product',
          data: {
            filter_category: params.categoryId,
            page_number: 0,
            page_size: 10
          }
        })
        // products: $.ajax({
        //   url: 'http://localhost:8002/api/v1/product',
        //   data:{
        //     product_id:params.pid
        //   },
        //   credentials: 'include',
        //   type: 'GET',
        // }),
        // similarProducts: $.ajax({
        //   url: 'http://localhost:8002/api/v1/product',
        //   data:{
        //     filter_category:params.categoryId,
        //     page_number:0,
        //     page_size:10,
        //   },
        //   credentials: 'include',
        //   type: 'GET'
        // }),
      }).then(function (response) {
        console.log("success product and similar product", response);
        response = {
          product: response.products[0],
          similarProducts: response.similarProducts
        };
        return response;
      }).catch(function (error) {
        console.error('Error fetching data:', error);
        return {};
      });
    },
    afterModel: function afterModel(model, transition) {
      // console.log(model[0],model);
      // return model[0];
    }
  });
});
define('online-shopping-client/routes/products', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        queryParams: {
            filter_brand: {
                refreshModel: true
            },
            filter_category: {
                refreshModel: true
            },
            max_price: {
                refreshModel: true
            },
            min_price: {
                refreshModel: true
            },
            max_stock: {
                refreshModel: true
            },
            page_number: {
                refreshModel: true
            },
            page_size: {
                refreshModel: true
            },
            filter_name: {
                refreshModel: true
            }
        },
        beforeModel: function beforeModel(transition) {
            // this._super(controller, model);
            console.log(transition);
        },
        model: function model(params) {
            console.log("Query parameters:", params);

            // Build the query string
            var query = {
                page_number: params.page_number || 0, // Default value if not provided
                page_size: params.page_size || 20, // Default value if not provided
                filter_brand: params.filter_brand,
                filter_category: params.filter_category,
                max_price: params.max_price,
                min_price: params.min_price,
                max_stock: params.max_stock, // Default value if not provided
                filter_name: params.filter_name
            };
            // Make the AJAX request with query parameters
            return (0, _ajaxReq.default)({
                endpoint: 'product',
                data: query
            });
            // return $.ajax({
            //     url: 'http://localhost:8002/api/v1/product',
            //     data: query, // Send the query parameters as data
            //     credentials: 'include',
            //     type: 'GET'
            // });
        }
    });
});
define('online-shopping-client/routes/signup', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    dataStore: Ember.inject.service('data-store'),

    model: function model() {
      var dataStore = this.get('dataStore');
      // Load data only if it hasn't been loaded yet
      return dataStore.get('isDataLoaded') ? Ember.RSVP.resolve() // Data is already loaded, return resolved promise
      : dataStore.loadData(); // Load data if not already loaded
    },
    afterModel: function afterModel() {
      var dataStore = this.get('dataStore');

      if (dataStore.get('isLoggedIn')) {
        this.transitionTo('/');
      }
    }
  });
});
define('online-shopping-client/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('online-shopping-client/services/data-store', ['exports', 'online-shopping-client/utils/ajax-req'], function (exports, _ajaxReq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    categories: null,
    brands: null,
    dealOfTheMoment: null,
    isLoggedIn: false,
    isAdmin: false,
    isDataLoaded: false,
    isOrderConfirm: false,
    init: function init() {
      this._super.apply(this, arguments);
      console.log('Service initialized');
      this.loadData();
    },
    getCategories: function getCategories() {
      console.log("try to get the categories");
      return this.get("categories");
    },
    getBrands: function getBrands() {
      console.log("try to get the brand");
      return this.get("brands");
    },
    getisLoggedIn: function getisLoggedIn() {
      return this.get("isLoggedIn");
    },
    loadData: function loadData() {
      var _this = this;

      console.log('Loading data');
      return Ember.RSVP.hashSettled({
        categories: (0, _ajaxReq.default)({
          endpoint: 'category'
        }),
        brands: (0, _ajaxReq.default)({
          endpoint: 'brand'
        }),
        dealOfTheMoment: (0, _ajaxReq.default)({
          endpoint: 'product',
          data: { deal: 200011 }
        }),
        discount: (0, _ajaxReq.default)({
          endpoint: 'discount',
          data: { discount_id: 200011 }
        }),
        user: (0, _ajaxReq.default)({
          endpoint: 'users'
        })
      }).then(function (res) {
        _this.set("isDataLoaded", true);
        if (res.categories.state === 'fulfilled') {
          _this.set('categories', res.categories.value);
        } else {
          console.error('Failed to load categories');
        }

        if (res.brands.state === 'fulfilled') {
          _this.set('brands', res.brands.value);
        } else {
          console.error('Failed to load brands');
        }

        if (res.dealOfTheMoment.state === 'fulfilled') {
          _this.set('dealOfTheMoment', res.dealOfTheMoment.value[0]);
        } else {
          console.error('Failed to load deal of the moment');
        }

        if (res.discount.state === 'fulfilled' && res.dealOfTheMoment.state === 'fulfilled') {
          _this.dealOfTheMoment.percentage = res.discount.value[0].percentage;
          _this.dealOfTheMoment.discountCode = res.discount.value[0].discountCode;
        } else {
          console.error('Failed to load discount');
        }

        if (res.user.state === 'fulfilled') {
          // this.set('user', res.user.value);
          console.log("user check is", res.user.value);
          _this.set("isLoggedIn", true);
          _this.set("isAdmin", res.user.value[0].isAdmin);
        } else {
          _this.set("isLoggedIn", false);
          _this.set("isAdmin", false);

          console.error('Failed and user is not logged in');
        }
        console.log('Data fetched successfully');
      }).catch(function (error) {
        _this.set("isDataLoaded", true);
        console.error('Overall error occurred', error);
      });
    }
  });
});
define('online-shopping-client/services/toast', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    isVisible: false,
    message: '',
    type: 'success',
    status: '',

    showToast: function showToast(message, type) {
      var _this = this;

      var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'success';

      // console.log(message,type,status);

      this.set('message', message);
      this.set('type', type);
      this.set('isVisible', true);
      this.set('status', status);
      console.log(this.get("status"));

      // Automatically hide the toast after 5 seconds
      Ember.run.later(this, function () {

        _this.set('isVisible', false);
      }, 3000);
    }
  });
});
define("online-shopping-client/templates/account", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "nXKzsgyQ", "block": "{\"statements\":[[0,\" \"],[1,[33,[\"model-dialog\"],null,[[\"message\",\"yesAction\",\"showOverlay\"],[\"Are you sure you want to logout?\",[33,[\"action\"],[[28,[null]],\"logout\"],null],[28,[null,\"showOverlay\"]]]]],false],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"account\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"account-sidebar flex-column\"],[13],[0,\"\\n       \"],[6,[\"link-to\"],[\"account.profile.index\"],[[\"classNames\",\"activeClass\"],[\"sidebar-item\",\"box-visited\"]],{\"statements\":[[11,\"img\",[]],[15,\"src\",\"/client/edit.png\"],[15,\"alt\",\"edit page\"],[15,\"class\",\"icon-small\"],[13],[14],[0,\"profile\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[0,\"            \"],[6,[\"link-to\"],[\"account.orders\"],[[\"class\"],[[33,[\"join-string\"],[\"sidebar-item  \",[33,[\"if\"],[[28,[\"isCurrentRoute\"]],\"box-visited\"],null]],null]]],{\"statements\":[[11,\"img\",[]],[15,\"src\",\"/client/user-gear.png\"],[15,\"alt\",\"shopping bag\"],[15,\"class\",\"icon-small\"],[13],[14],[0,\"Admin Panel\"]],\"locals\":[]},null],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"            \"],[6,[\"link-to\"],[\"account.orders\"],[[\"classNames\",\"activeClass\"],[\"sidebar-item\",\"box-visited\"]],{\"statements\":[[11,\"img\",[]],[15,\"src\",\"/client/shopping-bag.png\"],[15,\"alt\",\"shopping bag\"],[15,\"class\",\"icon-small\"],[13],[14],[0,\"Orders\"]],\"locals\":[]},null],[0,\"\\n\"]],\"locals\":[]}],[0,\"       \"],[6,[\"link-to\"],[\"account.profile.update-password\"],[[\"classNames\",\"activeClass\"],[\"sidebar-item\",\"box-visited\"]],{\"statements\":[[11,\"img\",[]],[15,\"src\",\"/client/padlock.png\"],[15,\"alt\",\"padlock\"],[15,\"class\",\"icon-small\"],[13],[14],[0,\"Update Password\"]],\"locals\":[]},null],[0,\"\\n       \"],[11,\"div\",[]],[15,\"class\",\"sidebar-item\"],[5,[\"action\"],[[28,[null]],\"showModel\"]],[13],[11,\"img\",[]],[15,\"src\",\"/client/logout.png\"],[15,\"alt\",\"padlock\"],[15,\"class\",\"icon-small\"],[13],[14],[0,\"Log out\"],[14],[0,\"\\n    \"],[14],[0,\"\\n     \"],[11,\"div\",[]],[15,\"class\",\"profile\"],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[6,[\"if\"],[[28,[\"isCurrentRoute\"]]],null,{\"statements\":[[0,\"              \"],[1,[26,[\"top-menu\"]],false],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[0,\"        \"],[1,[26,[\"outlet\"]],false],[0,\"\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/account.hbs" } });
});
define("online-shopping-client/templates/account/orders", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Ol02Sd0C", "block": "{\"statements\":[[6,[\"if\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"flex-row input-grp\"],[13],[0,\"\\n        \"],[1,[33,[\"input\"],null,[[\"type\",\"name\",\"class\",\"placeholder\",\"value\"],[\"text\",\"email\",\"auth-input\",\"Enter User or Invoice Number.\",[28,[\"searchValue\"]]]]],false],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"button-inner\"],[5,[\"action\"],[[28,[null]],\"fetchOrdersHistory\"]],[13],[0,\"Enter\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"order-container flex-column\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"order-details\"],[13],[0,\"\\n\"],[6,[\"if\"],[[33,[\"or\"],[[33,[\"eq\"],[[28,[\"model\",\"length\"]],0],null],[33,[\"eq\"],[[28,[\"model\",\"length\"]],[31]],null]],null]],null,{\"statements\":[[6,[\"if\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[0,\"                \"],[11,\"span\",[]],[15,\"class\",\"order-title\"],[13],[1,[26,[\"adminMsg\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"                \"],[11,\"span\",[]],[15,\"class\",\"order-title\"],[13],[1,[26,[\"userMsg\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}]],\"locals\":[]},{\"statements\":[[6,[\"if\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[0,\"                \"],[11,\"span\",[]],[15,\"class\",\"order-title\"],[13],[0,\"Orders \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"                \"],[11,\"span\",[]],[15,\"class\",\"order-title\"],[13],[0,\"Your Orders\"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"order-box\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"order-items\"],[13],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\" order-head flex-row\"],[13],[0,\"\\n                            \"],[11,\"div\",[]],[15,\"class\",\" order-head-items\"],[13],[0,\"\\n                                \"],[11,\"div\",[]],[15,\"class\",\"font-lt\"],[13],[0,\" Order Date:\"],[14],[0,\"\\n                                \"],[11,\"strong\",[]],[13],[1,[33,[\"time-converter\"],[[28,[\"order\",\"transactionTime\"]]],null],false],[14],[0,\"\\n                            \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[0,\"                                \"],[11,\"div\",[]],[15,\"class\",\"order-head-items\"],[13],[0,\"\\n                                    \"],[11,\"div\",[]],[15,\"class\",\"font-lt\"],[13],[0,\"Customer:\"],[14],[0,\"\\n                                    \"],[11,\"strong\",[]],[13],[1,[28,[\"order\",\"name\"]],false],[14],[0,\"\\n                                \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[28,[\"order\",\"discountCode\"]]],null,{\"statements\":[[0,\"                                \"],[11,\"div\",[]],[15,\"class\",\"order-head-items\"],[13],[0,\"\\n                                    \"],[11,\"div\",[]],[15,\"class\",\"font-lt\"],[13],[0,\"Discount Code:\"],[14],[0,\"\\n                                    \"],[11,\"strong\",[]],[13],[1,[28,[\"order\",\"discountCode\"]],false],[14],[0,\"\\n                                \"],[14],[0,\"\\n                                \"],[11,\"div\",[]],[15,\"class\",\"order-head-items\"],[13],[0,\"\\n                                    \"],[11,\"div\",[]],[15,\"class\",\"font-lt\"],[13],[0,\"Percentage:\"],[14],[0,\"\\n                                    \"],[11,\"strong\",[]],[13],[1,[28,[\"order\",\"percentage\"]],false],[0,\"% \"],[14],[0,\"\\n                                \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"                            \\n                            \"],[11,\"div\",[]],[15,\"class\",\"order-head-items\"],[13],[0,\"\\n                                \"],[11,\"div\",[]],[15,\"class\",\"font-lt\"],[13],[0,\"Total Amount:\"],[14],[0,\"\\n                                \"],[11,\"strong\",[]],[13],[0,\"₹\"],[1,[28,[\"order\",\"totalAmount\"]],false],[14],[0,\"\\n                            \"],[14],[0,\"\\n                        \"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"order\",\"invoice_items\"]]],null,{\"statements\":[[6,[\"link-to\"],[\"product\",[28,[\"product\",\"productId\"]]],[[\"class\"],[\"order-item\"]],{\"statements\":[[0,\"                                \"],[11,\"img\",[]],[15,\"class\",\"item-img\"],[16,\"src\",[33,[\"product-url\"],[[28,[\"product\",\"productName\"]]],null],null],[15,\"alt\",\"img\"],[13],[14],[0,\"\\n                                \"],[11,\"div\",[]],[15,\"class\",\"item-box\"],[13],[0,\"\\n                                    \"],[11,\"div\",[]],[15,\"class\",\"item-content\"],[13],[0,\"\\n                                        \"],[11,\"span\",[]],[15,\"class\",\"font-md\"],[13],[1,[28,[\"product\",\"productName\"]],false],[14],[0,\"\\n                                        \"],[11,\"strong\",[]],[15,\"class\",\"price\"],[13],[0,\"₹\"],[1,[28,[\"product\",\"price\"]],false],[14],[0,\"\\n                                    \"],[14],[0,\"\\n                                    \"],[11,\"span\",[]],[15,\"class\",\"font-lt\"],[13],[0,\"Quantity:\"],[11,\"span\",[]],[15,\"class\",\"text-dark\"],[13],[1,[28,[\"product\",\"quantity\"]],false],[14],[14],[0,\"\\n                                \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"product\"]},null],[0,\"                    \"],[14],[0,\"\\n\"]],\"locals\":[\"order\"]},null],[0,\"            \"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"pagination\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\" icon\"],[16,\"class\",[34,[[33,[\"if\"],[[33,[\"eq\"],[[28,[\"currentPage\"]],0],null],\"hide\"],null]]]],[5,[\"action\"],[[28,[null]],\"decrementPage\"]],[13],[0,\"«\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[16,\"class\",[34,[\"pg-no \",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"model\",\"length\"]],[31]],null],\"hide\",\"show\"],null]]]],[13],[1,[26,[\"currentPage\"]],false],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\" icon\"],[16,\"class\",[34,[[33,[\"if\"],[[33,[\"or\"],[[33,[\"or\"],[[33,[\"eq\"],[[28,[\"model\",\"length\"]],0],null],[33,[\"eq\"],[[28,[\"model\",\"length\"]],[31]],null]],null],[28,[\"disableNextPage\"]]],null],\"hide\",\"show\"],null]]]],[5,[\"action\"],[[28,[null]],\"incrementPage\"]],[13],[0,\"»\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/account/orders.hbs" } });
});
define("online-shopping-client/templates/account/profile", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "OpLr9GW5", "block": "{\"statements\":[[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"profile-items\"],[13],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"currentRouteName\"]],\"account.profile.index\"],null]],null,{\"statements\":[[0,\"      \"],[1,[33,[\"user-details\"],null,[[\"address\",\"model\",\"readOnly\",\"isVerified\"],[[28,[null,\"model\",\"address\"]],[28,[null,\"model\"]],false,false]]],false],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"      \"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[]}],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/account/profile.hbs" } });
});
define("online-shopping-client/templates/account/profile/update-password", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "4pSb8LD5", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"profile-items update-fields\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"update-container\"],[13],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"update-head\"],[13],[0,\"Change Password\"],[14],[0,\"\\n        \"],[11,\"p\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"error\"]],false],[14],[0,\"\\n\"],[6,[\"unless\"],[[28,[\"isVerified\"]]],null,{\"statements\":[[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"auth-box\"],[13],[0,\"\\n                    \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputType\",\"labelClass\",\"labelText\"],[\"password\",[28,[\"password\"]],\"Password\",[28,[\"passwordError\"]],\"password\",\"auth-label auth-text\",\"Password:\"]]],false],[0,\"\\n\"],[0,\"                    \"],[11,\"button\",[]],[15,\"type\",\"button\"],[15,\"class\",\"button-inner verify-btn\"],[5,[\"action\"],[[28,[null]],\"verifyPwd\"]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"content-center\"],[13],[0,\"Verify\"],[14],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"auth-box\"],[13],[0,\"\\n                    \"],[11,\"div\",[]],[15,\"class\",\"flex-row\"],[13],[0,\"\\n                        \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputType\",\"labelClass\",\"labelText\"],[\"newPassord\",[28,[\"newPassword\"]],\"New Password\",[28,[\"newPasswordError\"]],\"password\",\"auth-label auth-text\",\"New Password:\"]]],false],[0,\"\\n                            \\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"auth-box\"],[13],[0,\"\\n                    \"],[11,\"div\",[]],[15,\"class\",\"flex-row\"],[13],[0,\"\\n                        \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputType\",\"labelClass\",\"labelText\"],[\"confirmPassword\",[28,[\"confirmPassword\"]],\"Confirm Password\",[28,[\"confirmPasswordError\"]],\"password\",\"auth-label auth-text\",\"Confirm Password:\"]]],false],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"input-group-row\"],[13],[0,\"\\n                    \"],[11,\"button\",[]],[15,\"type\",\"button\"],[15,\"class\",\"button-inner\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"content-center\"],[13],[0,\"Cancel\"],[14],[0,\"\\n                    \"],[14],[0,\"\\n                    \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"button-inner\"],[16,\"disabled\",[26,[\"isVerified\"]],null],[5,[\"action\"],[[28,[null]],\"updateDetails\"]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"content-center\"],[13],[0,\"Update\"],[14],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/account/profile/update-password.hbs" } });
});
define("online-shopping-client/templates/account/users", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "x7l5tcsC", "block": "{\"statements\":[[6,[\"if\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"flex-row input-grp\"],[13],[0,\"\\n        \"],[1,[33,[\"input\"],null,[[\"type\",\"name\",\"class\",\"placeholder\",\"value\"],[\"text\",\"email\",\"auth-input\",\"     Enter User or Email\",[28,[\"searchValue\"]]]]],false],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"button-inner\"],[5,[\"action\"],[[28,[null]],\"fetchUser\"]],[13],[0,\"Enter\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[28,[\"userDetail\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"users-container\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"user-box\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[13],[0,\"\\n            \"],[11,\"span\",[]],[15,\"class\",\"user-label\"],[13],[0,\"First Name\"],[14],[0,\"\\n            \"],[11,\"span\",[]],[13],[1,[28,[\"userDetail\",\"firstName\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[13],[0,\"\\n            \"],[11,\"span\",[]],[15,\"class\",\"user-label\"],[13],[0,\"Last Name\"],[14],[0,\"\\n            \"],[11,\"span\",[]],[13],[1,[28,[\"userDetail\",\"lastName\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[13],[0,\"\\n            \"],[11,\"span\",[]],[13],[14],[0,\"\\n            \"],[11,\"span\",[]],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[13],[0,\"\\n            \"],[11,\"span\",[]],[15,\"class\",\"user-label\"],[13],[0,\"Address\"],[14],[0,\"\\n            \"],[11,\"span\",[]],[13],[1,[28,[\"userDetail\",\"address\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[13],[0,\"\\n            \"],[11,\"span\",[]],[15,\"class\",\"user-label\"],[13],[0,\"mobile\"],[14],[0,\"\\n            \"],[11,\"span\",[]],[13],[1,[28,[\"userDetail\",\"mobile\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[13],[0,\"\\n            \"],[11,\"span\",[]],[15,\"class\",\"user-label\"],[13],[0,\"Email\"],[14],[0,\"\\n            \"],[11,\"span\",[]],[13],[1,[28,[\"userDetail\",\"email\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/account/users.hbs" } });
});
define("online-shopping-client/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "sSxPeU0A", "block": "{\"statements\":[[0,\"\\n\"],[1,[26,[\"toast-notification\"]],false],[0,\"\\n\"],[4,\" app/templates/application.hbs \"],[0,\"\\n\"],[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"startTour\"]],[13],[0,\"Start Tour\"],[14],[0,\"\\n\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/application.hbs" } });
});
define("online-shopping-client/templates/checkout", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "TvI6NCwt", "block": "{\"statements\":[[6,[\"if\"],[[33,[\"eq\"],[[28,[\"currentRouteName\"]],\"checkout.index\"],null]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"order-container flex-row\"],[13],[0,\"\\n        \"],[1,[33,[\"user-details\"],null,[[\"model\",\"address\",\"paymentMode\",\"readOnly\",\"class\"],[[28,[\"model\",\"UserDetails\"]],[28,[\"model\",\"UserDetails\",\"address\"]],[28,[\"model\",\"UserDetails\",\"PaymentMode\"]],true,\"user-details\"]]],false],[0,\"\\n        \\n        \"],[1,[33,[\"cart-container\"],null,[[\"cartItems\",\"address\",\"paymentMode\",\"Discounts\",\"class\",\"isOrderpage\"],[[28,[\"model\",\"cartItems\"]],[28,[\"model\",\"UserDetails\",\"address\"]],[28,[\"model\",\"UserDetails\",\"PaymentMode\"]],[28,[\"model\",\"Discounts\"]],\"order-items\",true]]],false],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[]}]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/checkout.hbs" } });
});
define("online-shopping-client/templates/checkout/order-confirmation", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "RlJlmitK", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"confirmation-container\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"confirmation-box\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"icon-container\"],[13],[0,\"\\n            \"],[11,\"img\",[]],[15,\"class\",\"icon-big\"],[15,\"src\",\"/client/check.png\"],[15,\"alt\",\"check_img\"],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"h2\",[]],[13],[0,\"Order Confirmed!\"],[14],[0,\"\\n        \"],[11,\"p\",[]],[15,\"class\",\"font-ml\"],[13],[0,\"Your order is confirmed and we will deliver it to your shipping address shortly.\"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[null,\"coupon\"]]],null,{\"statements\":[[0,\"            \"],[11,\"p\",[]],[15,\"class\",\"font-md\"],[13],[11,\"strong\",[]],[13],[0,\"Congratulations!\"],[14],[0,\" You have successfully claimed the discount coupon code \"],[11,\"span\",[]],[15,\"class\",\"coupon-code\"],[13],[1,[28,[null,\"coupon\"]],false],[14],[0,\". Please note that this code will expire after your next 3 orders.\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"link-to\"],[\"index\"],[[\"class\"],[\"button-inner\"]],{\"statements\":[[0,\"            Continue Shopping\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/checkout/order-confirmation.hbs" } });
});
define("online-shopping-client/templates/components/cart-container", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "XTZM6WCE", "block": "{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"cart-container flex-column  \",[26,[\"class\"]]]]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isOrderpage\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"cart-title font-ml \"],[13],[0,\"\\n      \"],[11,\"span\",[]],[13],[0,\"Order Items\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"cart-header border-bt-line\"],[13],[0,\"\\n      \"],[11,\"img\",[]],[15,\"class\",\"icon-small\"],[15,\"src\",\"/client/cart.png\"],[15,\"alt\",\"cart\"],[13],[14],[0,\"\\n      \"],[11,\"div\",[]],[13],[0,\"My Cart \"],[14],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"close-btn\"],[5,[\"action\"],[[28,[null]],\"toggleCart\"]],[13],[0,\"×\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"cart-items flex-column border-bt-line\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"cartItems\"]]],null,{\"statements\":[[0,\"     \"],[11,\"div\",[]],[15,\"class\",\"cart-box border-bt-line\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"cart-item\"],[13],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"cart-img\"],[13],[0,\" \\n            \"],[11,\"img\",[]],[16,\"src\",[33,[\"product-url\"],[[28,[\"item\",\"product\",\"productName\"]]],null],null],[15,\"alt\",\"img\"],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"item-details flex-column\"],[13],[0,\"\\n            \"],[11,\"span\",[]],[15,\"class\",\"cart-text\"],[13],[1,[28,[\"item\",\"product\",\"productName\"]],false],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"dealOfTheMoment\",\"productId\"]],[28,[\"item\",\"productId\"]]],null]],null,{\"statements\":[[0,\"                  \"],[11,\"div\",[]],[15,\"class\",\"product-discount\"],[13],[0,\"\\n                      \"],[11,\"div\",[]],[15,\"class\",\"discount\"],[13],[0,\"\\n                        \"],[1,[28,[\"dealOfTheMoment\",\"percentage\"]],false],[0,\"% off \\n                      \"],[14],[0,\"\\n                      \"],[11,\"span\",[]],[15,\"class\",\"clr-red\"],[13],[0,\"\\n                        Deal of the Moment\\n                      \"],[14],[0,\"\\n                  \"],[14],[0,\"\\n                  \"],[11,\"div\",[]],[15,\"class\",\"item-discount\"],[13],[0,\"\\n                      \"],[11,\"strong\",[]],[15,\"class\",\"item-text\"],[13],[0,\"₹\"],[1,[33,[\"calculate-discount-price\"],[[28,[\"item\",\"product\",\"productPrice\"]],[28,[\"dealOfTheMoment\",\"percentage\"]]],null],false],[14],[0,\"\\n                      \"],[11,\"div\",[]],[15,\"class\",\"item-price\"],[13],[0,\"₹\"],[1,[28,[\"item\",\"product\",\"productPrice\"]],false],[14],[0,\"\\n                  \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"                \"],[11,\"strong\",[]],[13],[0,\"₹\"],[1,[28,[\"item\",\"product\",\"productPrice\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"            \\n            \"],[11,\"div\",[]],[15,\"class\",\"qty\"],[13],[0,\"\\n              \"],[11,\"span\",[]],[15,\"class\",\"cart-text\"],[5,[\"action\"],[[28,[null]],\"decreaseQuantity\",[28,[\"item\"]]]],[13],[0,\"-\"],[14],[0,\"\\n              \"],[11,\"strong\",[]],[13],[1,[28,[\"item\",\"quantity\"]],false],[14],[0,\"\\n              \"],[11,\"span\",[]],[15,\"class\",\"cart-text\"],[5,[\"action\"],[[28,[null]],\"increaseQuantity\",[28,[\"item\"]]]],[13],[0,\"+\"],[14],[0,\"\\n            \"],[14],[0,\"\\n          \"],[14],[0,\"  \\n        \"],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"item\",\"product\",\"stock\"]],0],null]],null,{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"out-of-stock\"],[13],[0,\"\\n            \"],[11,\"span\",[]],[15,\"class\",\"not-icon\"],[13],[0,\"❕\"],[14],[11,\"span\",[]],[13],[0,\"This item is currently out of stock\"],[14],[0,\"\\n          \"],[14],[0,\" \\n\"]],\"locals\":[]},null],[0,\"     \"],[14],[0,\" \\n\"]],\"locals\":[\"item\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isOrderpage\"]]],null,{\"statements\":[[6,[\"if\"],[[28,[\"Discounts\"]]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"cart-discount\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"cart-title \"],[13],[0,\"\\n          \"],[11,\"span\",[]],[15,\"class\",\"text-ml\"],[13],[0,\"User Discounts\"],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"discount-list \"],[13],[0,\"  \\n          \"],[11,\"div\",[]],[15,\"class\",\"discount-title border-bt-line\"],[13],[0,\"\\n            \"],[11,\"span\",[]],[13],[0,\"Discount Code\"],[14],[0,\"\\n            \"],[11,\"span\",[]],[13],[0,\"Percentage\"],[14],[0,\"\\n            \"],[11,\"span\",[]],[13],[0,\"Issued On\"],[14],[0,\"\\n          \"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"Discounts\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"discount-title border-bt-line\"],[13],[0,\"\\n              \"],[11,\"input\",[]],[15,\"type\",\"radio\"],[15,\"class\",\"radio\"],[16,\"checked\",[33,[\"eq\"],[[28,[\"discount\"]],[28,[\"selectedDiscount\"]]],null],null],[5,[\"action\"],[[28,[null]],\"updateDiscount\",[28,[\"discount\"]]],[[\"on\"],[\"change\"]]],[13],[14],[0,\"\\n              \"],[11,\"span\",[]],[13],[1,[28,[\"discount\",\"discound_code\"]],false],[14],[0,\"\\n              \"],[11,\"span\",[]],[13],[1,[28,[\"discount\",\"percentage\"]],false],[0,\"%\"],[14],[0,\"\\n              \"],[11,\"strong\",[]],[13],[1,[33,[\"time-converter\"],[[28,[\"discount\",\"created_time\"]]],null],false],[14],[0,\"\\n            \"],[14],[0,\"\\n\"]],\"locals\":[\"discount\"]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"cart-title\"],[13],[0,\"\\n         \"],[11,\"span\",[]],[15,\"class\",\"font-md\"],[13],[0,\"No Discounts Available\"],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]}]],\"locals\":[]},null],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"cart-actions flex-column\"],[13],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"flex-row border-bt-line cart-amount\"],[13],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"cart-amount\"],[13],[0,\"Gross Amount:\"],[14],[0,\"\\n          \"],[11,\"div\",[]],[13],[0,\"₹\"],[1,[26,[\"totalAmount\"]],false],[14],[0,\"\\n      \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isOrderpage\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"flex-row border-bt-line cart-amount\"],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"cart-amount\"],[13],[0,\"Discount:\"],[14],[0,\"\\n            \"],[11,\"div\",[]],[13],[1,[28,[\"selectedDiscount\",\"percentage\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"flex-row border-bt-line cart-amount\"],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"cart-amount\"],[13],[0,\"Total Amount:\"],[14],[0,\"\\n            \"],[11,\"div\",[]],[13],[0,\"₹\"],[1,[26,[\"total\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"cart-bt\"],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isOrderpage\"]]],null,{\"statements\":[[0,\"            \"],[11,\"button\",[]],[16,\"onclick\",[33,[\"action\"],[[28,[null]],\"purchase\",[28,[\"address\"]],[28,[\"paymentMode\"]],[28,[\"selectedDiscount\",\"user_discount_id\"]]],null],null],[13],[0,\"Place Order\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"link-to\"],[\"checkout\"],null,{\"statements\":[[0,\"            \"],[11,\"button\",[]],[13],[0,\"Place Order\"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]}],[0,\"    \"],[14],[0,\"\\n\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/cart-container.hbs" } });
});
define("online-shopping-client/templates/components/horizontal-scroll-items", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "8BY4Bj40", "block": "{\"statements\":[[11,\"div\",[]],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"wrapper\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"products\"]]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"item\"],[13],[0,\"\\n        \"],[1,[28,[\"product\",\"productId\"]],false],[11,\"br\",[]],[13],[14],[0,\"\\n        \"],[1,[28,[\"product\",\"productName\"]],false],[11,\"br\",[]],[13],[14],[0,\"\\n        ₹\"],[1,[28,[\"product\",\"productPrice\"]],false],[11,\"br\",[]],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n      \"],[11,\"br\",[]],[13],[14],[0,\"\\n\"]],\"locals\":[\"product\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"],[18,\"default\"],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/horizontal-scroll-items.hbs" } });
});
define("online-shopping-client/templates/components/input-field", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "QaDI+uO8", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"auth-box\"],[13],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"inputType\"]],\"password\"],null]],null,{\"statements\":[[0,\"        \"],[11,\"label\",[]],[16,\"for\",[26,[\"forLabel\"]],null],[16,\"class\",[26,[\"labelClass\"]],null],[13],[1,[26,[\"labelText\"]],false],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"input-fields\"],[13],[0,\"\\n            \"],[1,[33,[\"input\"],[[33,[\"-input-type\"],[[33,[\"if\"],[[28,[\"passwordVisible\"]],\"text\",\"password\"],null]],null]],[[\"id\",\"type\",\"value\",\"placeholder\",\"class\",\"required\",\"disabled\"],[[28,[\"inputId\"]],[33,[\"if\"],[[28,[\"passwordVisible\"]],\"text\",\"password\"],null],[28,[\"value\"]],[28,[\"placeholder\"]],\"auth-input\",[28,[\"required\"]],[28,[\"disabled\"]]]]],false],[0,\"\\n            \"],[11,\"img\",[]],[16,\"src\",[34,[\"/client/\",[33,[\"if\"],[[28,[\"passwordVisible\"]],\"eye-open.png\",\"eye-hidden.png\"],null]]]],[15,\"class\",\"icon-xs eye-icon auth-icon\"],[5,[\"action\"],[[28,[null]],\"toggleVisibility\"]],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"        \"],[11,\"label\",[]],[16,\"for\",[26,[\"inputId\"]],null],[16,\"class\",[26,[\"labelClass\"]],null],[13],[1,[26,[\"labelText\"]],false],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"tag\"]],\"input\"],null]],null,{\"statements\":[[0,\"                \"],[1,[33,[\"input\"],[[33,[\"-input-type\"],[[28,[\"inputType\"]]],null]],[[\"id\",\"type\",\"value\",\"placeholder\",\"class\",\"required\",\"disabled\"],[[28,[\"inputId\"]],[28,[\"inputType\"]],[28,[\"value\"]],[28,[\"placeholder\"]],[28,[\"inputClass\"]],[28,[\"required\"]],[28,[\"disabled\"]]]]],false],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"if\"],[[33,[\"eq\"],[[28,[\"tag\"]],\"text-area\"],null]],null,{\"statements\":[[0,\"                \"],[1,[33,[\"textarea\"],null,[[\"id\",\"type\",\"value\",\"placeholder\",\"class\",\"required\",\"disabled\"],[[28,[\"inputId\"]],[28,[\"inputType\"]],[28,[\"value\"]],[28,[\"placeholder\"]],[28,[\"inputClass\"]],[28,[\"required\"]],[28,[\"disabled\"]]]]],false],[0,\"\\n        \"]],\"locals\":[]},null]],\"locals\":[]}]],\"locals\":[]}],[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"error\"]],false],[14],[0,\"\\n    \\n\"],[14],[0,\"\\n\\n\"],[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/input-field.hbs" } });
});
define("online-shopping-client/templates/components/input-password", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "chzMGz1Q", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"auth-box\"],[13],[0,\"\\n  \"],[11,\"label\",[]],[15,\"for\",\"password\"],[15,\"class\",\"auth-label font-ml\"],[13],[1,[26,[\"labelText\"]],false],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"input-fields\"],[13],[0,\"\\n    \"],[1,[33,[\"input\"],[[33,[\"-input-type\"],[[33,[\"if\"],[[28,[\"passwordVisible\"]],\"text\",\"password\"],null]],null]],[[\"type\",\"value\",\"placeholder\",\"class\",\"required\",\"disabled\"],[[33,[\"if\"],[[28,[\"passwordVisible\"]],\"text\",\"password\"],null],[28,[\"value\"]],[28,[\"placeholder\"]],\"auth-input\",[28,[\"required\"]],[28,[\"disabled\"]]]]],false],[0,\"\\n    \"],[11,\"img\",[]],[16,\"src\",[34,[\"/client/\",[33,[\"if\"],[[28,[\"passwordVisible\"]],\"eye-open.png\",\"eye-hidden.png\"],null]]]],[15,\"class\",\"icon-small eye-icon auth-icon\"],[5,[\"action\"],[[28,[null]],\"toggleVisibility\"]],[13],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/input-password.hbs" } });
});
define("online-shopping-client/templates/components/model-dialog", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "wm9kbmGj", "block": "{\"statements\":[[6,[\"if\"],[[28,[\"showOverlay\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"model-box\"],[13],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"close\"],[5,[\"action\"],[[28,[null]],\"handleCloseClick\"]],[13],[11,\"span\",[]],[13],[0,\"×\"],[14],[14],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"message\"],[13],[1,[26,[\"message\"]],false],[14],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"model-btn\"],[13],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"button-inner\"],[5,[\"action\"],[[28,[null]],\"handleNoClick\"]],[13],[0,\"No\"],[14],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"button-inner\"],[5,[\"action\"],[[28,[null]],\"handleYesClick\"]],[13],[0,\"Yes\"],[14],[0,\"\\n      \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"span\",[]],[15,\"class\",\"overlay show\"],[13],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/model-dialog.hbs" } });
});
define("online-shopping-client/templates/components/my-tour.js", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "k3UpFMCa", "block": "{\"statements\":[[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/my-tour.js.hbs" } });
});
define("online-shopping-client/templates/components/product-container", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "wgS039qD", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"product-container\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"container-title\"],[13],[0,\"\\n    \"],[1,[26,[\"title\"]],false],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[16,\"class\",[34,[[26,[\"scroll\"]]]]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isLoading\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"shimmer-loader\"],[13],[0,\"\\n          \"],[6,[\"each\"],[[33,[\"range\"],[1,6],null]],null,{\"statements\":[[0,\" \"],[4,\" Adjust number for how many placeholders you want \"],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"item shimmer\"],[13],[0,\"\\n              \"],[11,\"div\",[]],[15,\"class\",\"image-box shimmer-image\"],[13],[14],[0,\"\\n              \"],[11,\"div\",[]],[15,\"class\",\"container-items\"],[13],[0,\"\\n                \"],[11,\"h2\",[]],[15,\"class\",\"item-text item-main shimmer-text\"],[13],[14],[0,\"\\n                \"],[11,\"p\",[]],[15,\"class\",\"item-text shimmer-text\"],[13],[14],[0,\"\\n              \"],[14],[0,\"\\n            \"],[14],[0,\"\\n\"]],\"locals\":[\"index\"]},null],[0,\"        \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"each\"],[[28,[\"products\"]]],null,{\"statements\":[[6,[\"link-to\"],[\"product\",[28,[\"product\",\"productId\"]],[33,[\"query-params\"],null,[[\"categoryId\"],[[28,[\"product\",\"categoryId\"]]]]]],null,{\"statements\":[[0,\"              \"],[11,\"div\",[]],[15,\"class\",\"item\"],[13],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"image-box\"],[13],[0,\"\\n                      \"],[11,\"img\",[]],[16,\"src\",[33,[\"product-url\"],[[28,[\"product\",\"productName\"]]],null],null],[16,\"alt\",[34,[[28,[\"product\",\"productName\"]]]]],[16,\"onerror\",[33,[\"action\"],[[28,[null]],\"error\"],null],null],[16,\"onload\",[33,[\"action\"],[[28,[null]],\"load\"],null],null],[16,\"class\",[34,[\"product-img \",[33,[\"if\"],[[28,[null,\"isImageError\"]],\"shrimmer-image\"],null]]]],[13],[14],[0,\"\\n                \"],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"dealOfTheMoment\",\"productId\"]],[28,[\"product\",\"productId\"]]],null]],null,{\"statements\":[[0,\"                  \"],[11,\"div\",[]],[15,\"class\",\"product-discount\"],[13],[0,\"\\n                      \"],[11,\"div\",[]],[15,\"class\",\"discount\"],[13],[0,\"\\n                        \"],[1,[28,[\"dealOfTheMoment\",\"percentage\"]],false],[0,\"% off \\n                      \"],[14],[0,\"\\n                      \"],[11,\"span\",[]],[13],[0,\"\\n                        Deal of the Moment\\n                      \"],[14],[0,\"\\n                  \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"product\",\"stock\"]],0],null]],null,{\"statements\":[[0,\"                  \"],[11,\"div\",[]],[15,\"class\",\"out-of-stock\"],[13],[0,\"\\n                    \"],[11,\"span\",[]],[15,\"class\",\"not-icon\"],[13],[0,\"❕\"],[14],[11,\"span\",[]],[13],[0,\"This item is currently out of stock\"],[14],[0,\"\\n                  \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"container-items\"],[13],[0,\"\\n                  \"],[11,\"h2\",[]],[15,\"class\",\"item-text item-main\"],[13],[1,[28,[\"product\",\"productName\"]],false],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"dealOfTheMoment\",\"productId\"]],[28,[\"product\",\"productId\"]]],null]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"item-discount\"],[13],[0,\"\\n                      \"],[11,\"span\",[]],[15,\"class\",\"item-text\"],[13],[0,\"₹\"],[1,[33,[\"calculate-discount-price\"],[[28,[\"product\",\"productPrice\"]],[28,[\"dealOfTheMoment\",\"percentage\"]]],null],false],[14],[0,\"\\n                      \"],[11,\"div\",[]],[15,\"class\",\"item-price\"],[13],[0,\"₹\"],[1,[28,[\"product\",\"productPrice\"]],false],[14],[0,\"\\n                    \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"                    \"],[11,\"span\",[]],[15,\"class\",\"item-text\"],[13],[0,\"₹\"],[1,[28,[\"product\",\"productPrice\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"                \\n                  \\n                \"],[14],[0,\"\\n              \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"product\"]},null]],\"locals\":[]}],[0,\"  \"],[14],[0,\"\\n  \\n\"],[14],[0,\"\\n\\n\\n\"],[18,\"default\"],[0,\"\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/product-container.hbs" } });
});
define("online-shopping-client/templates/components/search-box", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "2iysIvm0", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"search-box\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"search-container\"],[13],[0,\"\\n    \"],[1,[33,[\"input\"],null,[[\"type\",\"name\",\"class\",\"placeholder\",\"value\"],[\"text\",\"search\",\"search-input\",[28,[\"placeholder\"]],[28,[\"searchValue\"]]]]],false],[0,\"\\n    \"],[11,\"img\",[]],[15,\"src\",\"/client/search-icon.png\"],[15,\"alt\",\"search-img\"],[15,\"class\",\"search-btn icon-xs\"],[5,[\"action\"],[[28,[null]],[28,[\"actionName\"]]]],[13],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/search-box.hbs" } });
});
define("online-shopping-client/templates/components/shop-navbar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "XE4uDnK4", "block": "{\"statements\":[[11,\"nav\",[]],[15,\"class\",\"navbar\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"navbar-container\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"navbar-content\"],[13],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"navbar-logo\"],[13],[0,\"\\n\"],[6,[\"link-to\"],[\"index\"],[[\"class\"],[\"\"]],{\"statements\":[[0,\"            \"],[11,\"img\",[]],[15,\"class\",\"icon-ml\"],[15,\"src\",\"/client/z-kartLogo.png\"],[15,\"alt\",\"z-kart\"],[13],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"      \"],[14],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"dropdown\"],[13],[0,\"  \\n        \"],[11,\"button\",[]],[15,\"class\",\"dropbtn text-md\"],[13],[0,\"Categories\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"dropdown-content\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"categories\"]]],null,{\"statements\":[[0,\"             \"],[11,\"span\",[]],[5,[\"action\"],[[28,[null]],\"selectCategory\",[28,[\"category\",\"categoryId\"]]]],[13],[1,[28,[\"category\",\"displayName\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"category\"]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"div\",[]],[15,\"class\",\"dropdown \"],[15,\"id\",\"brand\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"dropbtn text-md\"],[13],[0,\"Brands\"],[14],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"dropdown-content\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"brands\"]]],null,{\"statements\":[[0,\"              \"],[11,\"span\",[]],[5,[\"action\"],[[28,[null]],\"selectBrand\",[28,[\"brand\",\"brandId\"]]]],[13],[1,[28,[\"brand\",\"brandName\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"brand\"]},null],[0,\"          \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"navbar-search flex-column\"],[13],[0,\"\\n       \"],[11,\"div\",[]],[15,\"class\",\"search-field\"],[13],[0,\"\\n          \"],[1,[33,[\"search-box\"],null,[[\"actionName\",\"placeholder\",\"searchValue\",\"class\"],[[33,[\"action\"],[[28,[null]],\"handleKeydown\"],null],\"Search..\",[28,[\"searchQuery\"]],\"search-input\"]]],false],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[16,\"class\",[34,[\"search-suggestions \",[33,[\"if\"],[[28,[\"showSuggestion\"]],\"show\",\"hide\"],null]]]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"searchResults\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[16,\"class\",[34,[[33,[\"if\"],[[33,[\"eq\"],[[28,[\"index\"]],[28,[null,\"selectedIndex\"]]],null],\"selectedProduct\"],null]]]],[13],[0,\"\\n\"],[6,[\"link-to\"],[\"product\",[28,[\"product\",\"productId\"]]],[[\"class\"],[\"flex-row search-item\"]],{\"statements\":[[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"search-img\"],[13],[0,\"\\n\"],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"product\",\"productName\"]],\"No Results Found\"],null]],null,{\"statements\":[[0,\"                    \"],[11,\"img\",[]],[16,\"src\",[33,[\"product-url\"],[[28,[\"product\",\"productName\"]]],null],null],[15,\"alt\",\"img\"],[13],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"                \"],[14],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"item-details\"],[13],[0,\"\\n                  \"],[11,\"div\",[]],[15,\"class\",\"search-product\"],[13],[1,[28,[\"product\",\"productName\"]],false],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"            \"],[14],[0,\"\\n\"]],\"locals\":[\"product\",\"index\"]},null],[14],[0,\"\\n    \"],[14],[0,\"\\n    \\n    \"],[11,\"div\",[]],[15,\"class\",\"navbar-right\"],[13],[0,\"\\n      \\n\"],[6,[\"if\"],[[28,[\"isLoggedIn\"]]],null,{\"statements\":[[6,[\"unless\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"navbar-cart\"],[13],[0,\"\\n              \"],[11,\"img\",[]],[15,\"class\",\"icon-small\"],[15,\"src\",\"/client/cart.png\"],[15,\"alt\",\"cart\"],[5,[\"action\"],[[28,[null]],\"toggleCart\",true],[[\"on\"],[\"click\"]]],[13],[14],[0,\"\\n            \"],[14],[0,\"\\n            \"],[1,[33,[\"cart-container\"],null,[[\"cartItems\",\"class\"],[[28,[null,\"cartItems\"]],[33,[\"if\"],[[28,[\"showCart\"]],\"open\",\"hidden\"],null]]]],false],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"navbar-account \"],[13],[0,\"\\n\"],[6,[\"link-to\"],[\"account.profile\"],null,{\"statements\":[[0,\"              \"],[11,\"img\",[]],[15,\"class\",\"icon-small\"],[15,\"src\",\"/client/account.png\"],[15,\"alt\",\"Account\"],[13],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"navbar-account\"],[13],[0,\"\\n\"],[6,[\"link-to\"],[\"login\"],[[\"class\"],[\"navbar-signup\"]],{\"statements\":[[0,\"                Sign Up\\n\"]],\"locals\":[]},null],[0,\"          \"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"],[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/shop-navbar.hbs" } });
});
define("online-shopping-client/templates/components/toast-notification", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "DDWk+uQW", "block": "{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"toast \",[33,[\"if\"],[[28,[\"activateToast\"]],\"active\",\"hidden\"],null],\" \"]]],[13],[0,\"\\n  \\n    \"],[11,\"div\",[]],[16,\"class\",[34,[\"toast-content \",[26,[\"status\"]]]]],[13],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"status\"]],\"success\"],null]],null,{\"statements\":[[0,\"         \"],[11,\"div\",[]],[15,\"class\",\"check\"],[13],[0,\"✓\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"if\"],[[33,[\"eq\"],[[28,[\"status\"]],\"error\"],null]],null,{\"statements\":[[0,\"         \"],[11,\"div\",[]],[15,\"class\",\"error\"],[13],[0,\"✖\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"if\"],[[33,[\"eq\"],[[28,[\"status\"]],\"warning\"],null]],null,{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"warning\"],[13],[0,\"⚠️\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"if\"],[[33,[\"eq\"],[[28,[\"staus\"]],\"info\"],null]],null,{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"check\"],[13],[11,\"i\",[]],[13],[0,\"i\"],[14],[14],[0,\"\\n      \"]],\"locals\":[]},null]],\"locals\":[]}]],\"locals\":[]}]],\"locals\":[]}],[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"message\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"text text-1\"],[13],[1,[26,[\"type\"]],false],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"text text-2\"],[13],[1,[26,[\"message\"]],false],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"close\"],[5,[\"action\"],[[28,[null]],\"closeToast\"]],[13],[0,\"×\"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/toast-notification.hbs" } });
});
define("online-shopping-client/templates/components/top-menu", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "MeUe8h+E", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"top-menu\"],[13],[0,\"\\n    \"],[11,\"ul\",[]],[15,\"class\",\"tabpane\"],[13],[0,\"\\n        \\n            \"],[6,[\"link-to\"],[\"account.users\"],[[\"class\",\"activeClass\"],[\"menu-tab\",\"show\"]],{\"statements\":[[11,\"li\",[]],[15,\"class\",\"\"],[13],[0,\"Users\"],[14]],\"locals\":[]},null],[0,\"\\n        \\n        \\n            \"],[6,[\"link-to\"],[\"account.orders\"],[[\"class\",\"activeClass\"],[\"menu-tab\",\"show\"]],{\"statements\":[[11,\"li\",[]],[15,\"class\",\"\"],[13],[0,\" Orders\"],[14]],\"locals\":[]},null],[0,\"\\n        \\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/top-menu.hbs" } });
});
define("online-shopping-client/templates/components/user-details", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "7cCuYQHl", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"profile-items\"],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"readOnly\"]]],null,{\"statements\":[[0,\"       \"],[11,\"div\",[]],[15,\"class\",\"font-md\"],[13],[0,\"Shipping Information\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"       \"],[11,\"img\",[]],[15,\"src\",\"/client/profile.png\"],[15,\"alt\",\"profile\"],[15,\"class\",\"profile-icon\"],[13],[14],[0,\"\\n       \"],[11,\"button\",[]],[15,\"id\",\"edit-btn\"],[15,\"class\",\"button-inner\"],[5,[\"action\"],[[28,[null]],\"editProfile\"]],[13],[11,\"img\",[]],[15,\"class\",\"icon-small\"],[15,\"src\",\"/client/editing.png\"],[15,\"alt\",\"edit\"],[13],[14],[0,\"Edit\"],[14],[0,\"\\n\\n\"]],\"locals\":[]}],[0,\"    \"],[11,\"p\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"error\"]],false],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"input-group-row\"],[13],[0,\"\\n        \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputClass\",\"labelClass\",\"labelText\",\"disabled\"],[\"first_name\",[28,[\"model\",\"firstName\"]],\"First Name\",[28,[\"firstNameError\"]],\"auth-input\",\"auth-label auth-text\",\"First name:\",[33,[\"or\"],[[28,[\"readOnly\"]],[28,[\"disableEditDetails\"]]],null]]]],false],[0,\"\\n        \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputClass\",\"labelClass\",\"labelText\",\"disabled\"],[\"last_name\",[28,[\"model\",\"lastName\"]],\"Last Name\",[28,[\"lastNameError\"]],\"auth-input\",\"auth-label auth-text\",\"Last name:\",[33,[\"or\"],[[28,[\"readOnly\"]],[28,[\"disableEditDetails\"]]],null]]]],false],[0,\"\\n    \"],[14],[0,\"\\n    \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"inputType\",\"value\",\"placeholder\",\"error\",\"inputType\",\"inputClass\",\"labelClass\",\"labelText\",\"disabled\"],[\"email\",\"email\",[28,[\"model\",\"email\"]],\"Email\",[28,[\"emailError\"]],\"email\",\"auth-input\",\"auth-label auth-text\",\"Email:\",[33,[\"or\"],[[28,[\"readOnly\"]],[28,[\"disableEditDetails\"]]],null]]]],false],[0,\"\\n\\n    \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"inputType\",\"value\",\"placeholder\",\"error\",\"inputClass\",\"labelClass\",\"labelText\",\"disabled\"],[\"mobile\",\"number\",[28,[\"model\",\"mobile\"]],\"Mobile\",[28,[\"mobileError\"]],\"auth-input\",\"auth-label auth-text\",\"Mobile:\",[33,[\"or\"],[[28,[\"readOnly\"]],[28,[\"disableEditDetails\"]]],null]]]],false],[0,\"\\n\\n    \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"tag\",\"inputClass\",\"labelClass\",\"labelText\",\"disabled\"],[\"address\",[28,[\"address\"]],\"Address\",[28,[\"addressError\"]],\"text-area\",\"auth-input\",\"auth-label auth-text\",\"Address:\",[33,[\"or\"],[[28,[\"readOnly\"]],[28,[\"disableEditDetails\"]]],null]]]],false],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"readOnly\"]]],null,{\"statements\":[[0,\"        \"],[11,\"span\",[]],[15,\"class\",\"auth-label auth-text\"],[13],[0,\"Payment Mode\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"input-group-row\"],[13],[0,\" \\n\"],[6,[\"each\"],[[28,[\"paymentOptions\"]]],null,{\"statements\":[[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"flex-row\"],[13],[0,\"\\n                  \"],[11,\"input\",[]],[15,\"type\",\"radio\"],[16,\"id\",[34,[\"payment-\",[28,[\"payment\",\"id\"]]]]],[15,\"name\",\"payment\"],[16,\"value\",[34,[[28,[\"payment\",\"value\"]]]]],[16,\"checked\",[33,[\"eq\"],[[28,[\"payment\",\"value\"]],[28,[\"selectedPayment\"]]],null],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],\"updatePayment\",[28,[\"payment\",\"value\"]]],null],null],[15,\"required\",\"true\"],[13],[14],[0,\"\\n                  \"],[11,\"label\",[]],[16,\"for\",[34,[\"payment-\",[28,[\"payment\",\"id\"]]]]],[15,\"class\",\"auth-label auth-text\"],[13],[1,[28,[\"payment\",\"label\"]],false],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[\"payment\"]},null],[0,\"        \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},null],[6,[\"unless\"],[[33,[\"or\"],[[28,[\"readOnly\"]],[28,[\"disableEditDetails\"]]],null]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"input-group-row profile-btn\"],[13],[0,\"\\n            \"],[11,\"button\",[]],[15,\"type\",\"button\"],[15,\"class\",\"button-inner\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"\\n                \"],[11,\"span\",[]],[15,\"class\",\"content-center\"],[13],[0,\"Cancel\"],[14],[0,\"\\n            \"],[14],[0,\"\\n            \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"button-inner\"],[16,\"disabled\",[26,[\"isVerified\"]],null],[5,[\"action\"],[[28,[null]],\"updateDetails\"]],[13],[0,\"\\n                \"],[11,\"span\",[]],[15,\"class\",\"content-center\"],[13],[0,\"Update\"],[14],[0,\"\\n            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[14],[0,\"\\n\"],[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/components/user-details.hbs" } });
});
define("online-shopping-client/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "+AqzFs5p", "block": "{\"statements\":[[0,\"\\n\"],[1,[26,[\"shop-navbar\"]],false],[0,\"\\n\"],[11,\"br\",[]],[13],[14],[0,\"\\n\\n\"],[1,[33,[\"product-container\"],null,[[\"products\",\"scroll\",\"title\"],[[28,[\"model\",\"products\"]],\"vertical-scroll\",\"Discover Cool Gadgets\"]]],false],[0,\"\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/index.hbs" } });
});
define("online-shopping-client/templates/login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "n9LxHzZf", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"auth-workflow\"],[13],[0,\"\\n \"],[11,\"div\",[]],[15,\"class\",\"auth-container\"],[13],[0,\"\\n\"],[6,[\"link-to\"],[\"index\"],[[\"classNames\"],[\"auth-navbar \"]],{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"content-center\"],[13],[0,\"\\n       \"],[11,\"img\",[]],[15,\"class\",\"icon-md\"],[15,\"src\",\"/client/z-kartLogo.png\"],[15,\"alt\",\"z-kart\"],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"auth-mainportal\"],[13],[0,\"\\n    \"],[11,\"h1\",[]],[15,\"class\",\"auth-head\"],[13],[0,\"Login\"],[14],[0,\"\\n    \"],[11,\"p\",[]],[15,\"class\",\"error-message content-center\"],[13],[1,[26,[\"error\"]],false],[14],[0,\"\\n    \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitEmail\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n        \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputClass\"],[\"email\",[28,[\"email\"]],\"Email\",[28,[\"emailError\"]],\"auth-input\"]]],false],[0,\"\\n\"],[6,[\"if\"],[[28,[\"show_password\"]]],null,{\"statements\":[[0,\"          \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputType\"],[\"password\",[28,[\"password\"]],\"Enter your password\",[28,[\"passwordError\"]],\"password\"]]],false],[0,\"\\n\"]],\"locals\":[]},null],[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"button-box\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"button-inner\"],[13],[0,\"\\n          \"],[11,\"span\",[]],[15,\"class\",\"content-center\"],[13],[0,\"Login\"],[14],[0,\"\\n        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n      \\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"divider-break content-center\"],[13],[0,\"New to Z-kart\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\" content-center\"],[15,\"type\",\"submit\"],[13],[0,\"\\n\"],[6,[\"link-to\"],[\"signup\"],null,{\"statements\":[[0,\"            \"],[11,\"span\",[]],[15,\"class\",\"content-conter auth-text\"],[13],[0,\"\\n                Create your z-kart Account\\n            \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/login.hbs" } });
});
define("online-shopping-client/templates/product", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "hjGqeRbW", "block": "{\"statements\":[[1,[26,[\"shop-navbar\"]],false],[0,\"\\n\"],[11,\"ul\",[]],[15,\"class\",\"breadcrumb\"],[13],[0,\"\\n  \"],[11,\"li\",[]],[13],[6,[\"link-to\"],[\"index\"],null,{\"statements\":[[0,\"Home\"]],\"locals\":[]},null],[14],[0,\"\\n  \"],[11,\"li\",[]],[13],[6,[\"link-to\"],[\"products\",[33,[\"query-params\"],null,[[\"filter_category\",\"filter_brand\"],[[28,[\"category\",\"categoryId\"]],null]]]],null,{\"statements\":[[1,[28,[\"category\",\"displayName\"]],false]],\"locals\":[]},null],[14],[0,\"\\n  \"],[11,\"li\",[]],[13],[6,[\"link-to\"],[\"products\",[33,[\"query-params\"],null,[[\"filter_brand\",\"filter_category\"],[[28,[\"brand\",\"brandId\"]],null]]]],null,{\"statements\":[[1,[28,[\"brand\",\"brandName\"]],false]],\"locals\":[]},null],[14],[0,\"\\n  \"],[11,\"li\",[]],[13],[1,[28,[\"model\",\"product\",\"productName\"]],false],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"product-wrapper\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"img-box\"],[13],[0,\"\\n\"],[0,\"                \"],[11,\"img\",[]],[16,\"src\",[33,[\"product-url\"],[[28,[\"model\",\"product\",\"productName\"]]],null],null],[16,\"alt\",[34,[[28,[\"model\",\"product\",\"productName\"]]]]],[15,\"class\",\"product-img \"],[13],[14],[0,\"\\n\"],[0,\"    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"product-items\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"product-box\"],[13],[0,\"\\n\"],[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"font-xl\"],[13],[1,[28,[\"model\",\"product\",\"productName\"]],false],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"dealOfTheMoment\",\"productId\"]],[28,[\"model\",\"product\",\"productId\"]]],null]],null,{\"statements\":[[0,\"                  \"],[11,\"div\",[]],[15,\"class\",\"product-discounts\"],[13],[0,\"\\n                      \"],[11,\"span\",[]],[13],[0,\"\\n                        \"],[1,[28,[\"dealOfTheMoment\",\"percentage\"]],false],[0,\"% off \\n                      \"],[14],[0,\"\\n                      \"],[11,\"div\",[]],[15,\"class\",\"discounts\"],[13],[0,\"\\n                        Deal of the Moment\\n                      \"],[14],[0,\"\\n                  \"],[14],[0,\"\\n                  \"],[11,\"div\",[]],[15,\"class\",\"item-discounts\"],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"font-md\"],[13],[0,\"₹\"],[1,[33,[\"calculate-discount-price\"],[[28,[\"model\",\"product\",\"productPrice\"]],[28,[\"dealOfTheMoment\",\"percentage\"]]],null],false],[14],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\"item-price\"],[13],[0,\"₹\"],[1,[28,[\"model\",\"product\",\"productPrice\"]],false],[14],[0,\"\\n                  \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"                 \"],[11,\"div\",[]],[15,\"class\",\"text-large\"],[13],[0,\" ₹ \"],[1,[28,[\"model\",\"product\",\"productPrice\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"        \"],[14],[0,\"\\n        \"],[11,\"hr\",[]],[13],[14],[0,\"\\n        \"],[11,\"table\",[]],[15,\"class\",\"line-height-low\"],[13],[0,\"\\n            \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[33,[\"split-lines\"],[[28,[\"model\",\"product\",\"specification\"]]],null]],null,{\"statements\":[[0,\"                \"],[11,\"tr\",[]],[13],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"index\"]],0],null]],null,{\"statements\":[[0,\"                            \"],[11,\"span\",[]],[15,\"class\",\"text-dark\"],[13],[0,\" Specification \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"                    \"],[14],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[13],[1,[28,[\"line\"]],false],[14],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[\"line\",\"index\"]},null],[0,\"                \"],[11,\"tr\",[]],[13],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"text-dark\"],[13],[0,\"Category\"],[14],[0,\"\\n                    \"],[14],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"text grey\"],[13],[1,[28,[\"category\",\"displayName\"]],false],[14],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n                \"],[11,\"tr\",[]],[13],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"text-dark\"],[13],[0,\" \"],[14],[0,\"\\n                    \"],[14],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"text grey\"],[13],[1,[28,[\"category\",\"categoryDescription\"]],false],[14],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n                \"],[11,\"tr\",[]],[13],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"text-dark\"],[13],[0,\"Brand\"],[14],[0,\"\\n                    \"],[14],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"text grey\"],[13],[1,[28,[\"brand\",\"brandName\"]],false],[14],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n                \"],[11,\"tr\",[]],[13],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"text-dark\"],[13],[0,\" \"],[14],[0,\"\\n                    \"],[14],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"text grey\"],[13],[1,[28,[\"brand\",\"brandDescription\"]],false],[14],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"hr\",[]],[13],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"a-dropdown\"],[13],[0,\"\\n                \"],[11,\"span\",[]],[15,\"class\",\"a-dropdown-label\"],[13],[0,\"Quantity:\"],[14],[0,\"\\n                \"],[11,\"select\",[]],[15,\"class\",\"a-dropdown-select\"],[16,\"value\",[26,[\"selectedQuantity\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],\"updateQuantity\"],null],null],[13],[0,\"\\n\"],[6,[\"each\"],[[33,[\"range\"],[1,[28,[\"model\",\"product\",\"stock\"]]],null]],null,{\"statements\":[[0,\"                        \"],[11,\"option\",[]],[16,\"value\",[28,[\"i\"]],null],[13],[1,[28,[\"i\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"i\"]},null],[0,\"                \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\"],[6,[\"unless\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[6,[\"if\"],[[33,[\"eq\"],[[28,[\"model\",\"product\",\"stock\"]],0],null]],null,{\"statements\":[[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"out-of-stock\"],[13],[0,\"\\n                    \"],[11,\"span\",[]],[15,\"class\",\"not-icon\"],[13],[0,\"❕\"],[14],[11,\"span\",[]],[13],[0,\"This item is currently out of stock\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"input-group-row\"],[13],[0,\"\\n                    \"],[11,\"button\",[]],[15,\"type\",\"button\"],[15,\"class\",\"button-inner product-btn\"],[16,\"onclick\",[33,[\"action\"],[[28,[null]],\"AddItem\",false],null],null],[13],[11,\"img\",[]],[15,\"class\",\"icon-small\"],[15,\"src\",\"/client/white-cart.png\"],[15,\"alt\",\"cart\"],[13],[14],[11,\"span\",[]],[13],[0,\" Add to Cart\"],[14],[14],[0,\"\\n                    \"],[11,\"button\",[]],[15,\"type\",\"button\"],[15,\"class\",\"button-inner\"],[16,\"onclick\",[33,[\"action\"],[[28,[null]],\"AddItem\",true],null],null],[13],[0,\"Buy now\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[]}]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n    \\n\"],[14],[0,\"\\n\"],[1,[33,[\"product-container\"],null,[[\"products\",\"scroll\",\"title\"],[[28,[\"model\",\"similarProducts\"]],\"horizontal-scroll\",\"Similar Products\"]]],false],[0,\"\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/product.hbs" } });
});
define("online-shopping-client/templates/products", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "DXhqE/W2", "block": "{\"statements\":[[1,[26,[\"shop-navbar\"]],false],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"filter-wrapper flex-row\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"filter-container flex-column\"],[13],[0,\"\\n        \"],[4,\" Category Filter \"],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"filter-box border-bt-line\"],[15,\"data-intro\",\"Click here to get started\"],[15,\"data-step\",\"5\"],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"text-large filters\"],[13],[0,\"\\n                \"],[11,\"span\",[]],[15,\"class\",\"font-xs\"],[13],[0,\"FILTERS\"],[14],[0,\"\\n\"],[0,\"            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"filter-box border-bt-line\"],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"filters\"],[13],[0,\"\\n                \"],[11,\"span\",[]],[15,\"class\",\"font-xs\"],[13],[0,\"CATEGORY\"],[14],[0,\"\\n                \"],[11,\"img\",[]],[15,\"class\",\"icon-xs\"],[15,\"src\",\"/client/down-arrow.png\"],[15,\"alt\",\"down-icon\"],[16,\"onclick\",[33,[\"action\"],[[28,[null]],\"toggleCategory\"],null],null],[13],[14],[0,\"\\n            \"],[14],[0,\"\\n            \\n            \"],[4,\" Category Filter \"],[0,\"\\n            \"],[11,\"div\",[]],[16,\"class\",[34,[\"checkbox-fields flex-column \",[33,[\"if\"],[[28,[\"showCategory\"]],\"visible\",\"hidden\"],null]]]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"categories\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"label\",[]],[15,\"class\",\"text-sm\"],[13],[0,\"\\n                        \"],[11,\"input\",[]],[15,\"type\",\"radio\"],[15,\"class\",\"radio\"],[16,\"checked\",[33,[\"eq\"],[[28,[\"category\",\"categoryId\"]],[28,[\"selectedCategory\"]]],null],null],[5,[\"action\"],[[28,[null]],\"updateFilter\",\"category\",[28,[\"category\",\"categoryId\"]]],[[\"on\"],[\"change\"]]],[13],[14],[0,\"\\n                        \"],[1,[28,[\"category\",\"displayName\"]],false],[0,\"\\n                    \"],[14],[0,\"\\n\"]],\"locals\":[\"category\"]},null],[0,\"            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"filter-box border-bt-line\"],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"filters\"],[13],[0,\"\\n                \"],[11,\"span\",[]],[15,\"class\",\"font-xs\"],[13],[0,\"BRAND\"],[14],[0,\"\\n                \"],[11,\"img\",[]],[15,\"class\",\"icon-xs\"],[15,\"src\",\"/client/down-arrow.png\"],[15,\"alt\",\"down-icon\"],[16,\"onclick\",[33,[\"action\"],[[28,[null]],\"toggleBrand\"],null],null],[13],[14],[0,\"\\n            \"],[14],[0,\"\\n            \"],[4,\" Brand Filter \"],[0,\"\\n            \"],[11,\"div\",[]],[16,\"class\",[34,[\"checkbox-fields flex-column \",[33,[\"if\"],[[28,[\"showBrand\"]],\"visible\",\"hidden\"],null]]]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"brands\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"label\",[]],[15,\"class\",\"text-sm\"],[13],[0,\"\\n                        \"],[11,\"input\",[]],[15,\"type\",\"radio\"],[15,\"class\",\"radio\"],[16,\"checked\",[33,[\"eq\"],[[28,[\"brand\",\"brandId\"]],[28,[\"selectedBrand\"]]],null],null],[5,[\"action\"],[[28,[null]],\"updateFilter\",\"brand\",[28,[\"brand\",\"brandId\"]]],[[\"on\"],[\"change\"]]],[13],[14],[0,\"\\n                        \"],[1,[28,[\"brand\",\"brandName\"]],false],[0,\"\\n                    \"],[14],[0,\"\\n\"]],\"locals\":[\"brand\"]},null],[0,\"            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n            \"],[4,\" Price Range Filter \"],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"filter-box border-bt-line\"],[13],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"filters\"],[13],[0,\"\\n                    \"],[11,\"span\",[]],[15,\"class\",\"font-xs\"],[13],[0,\"PRICE RANGE\"],[14],[0,\"\\n                    \"],[11,\"img\",[]],[15,\"class\",\"icon-xs\"],[15,\"src\",\"/client/down-arrow.png\"],[15,\"alt\",\"down-icon\"],[16,\"onclick\",[33,[\"action\"],[[28,[null]],\"togglePrice\"],null],null],[13],[14],[0,\"\\n                \"],[14],[0,\"\\n                \"],[11,\"div\",[]],[16,\"class\",[34,[\"checkbox-fields flex-column \",[33,[\"if\"],[[28,[\"showPrice\"]],\"visible\",\"hidden\"],null]]]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"priceRanges\"]]],null,{\"statements\":[[0,\"                        \"],[11,\"label\",[]],[15,\"class\",\"text-sm\"],[13],[0,\"\\n                            \"],[11,\"input\",[]],[15,\"type\",\"radio\"],[15,\"class\",\"radio\"],[16,\"value\",[28,[\"priceRange\",\"value\"]],null],[16,\"checked\",[33,[\"eq\"],[[28,[\"priceRange\",\"condition\"]],[28,[\"selectedPriceRange\"]]],null],null],[5,[\"action\"],[[28,[null]],\"updateFilter\",\"price\",[28,[\"priceRange\",\"condition\"]]],[[\"on\"],[\"change\"]]],[13],[14],[0,\"\\n                            \"],[1,[28,[\"priceRange\",\"label\"]],false],[0,\"\\n                        \"],[14],[0,\"\\n\"]],\"locals\":[\"priceRange\"]},null],[0,\"                \"],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[1,[33,[\"product-container\"],null,[[\"products\",\"scroll\"],[[28,[\"model\"]],\"vertical-scroll\"]]],false],[0,\"\\n\"],[14],[0,\"\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/products.hbs" } });
});
define("online-shopping-client/templates/signup", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "v9xETvOI", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"auth-workflow\"],[13],[0,\"\\n \"],[11,\"div\",[]],[15,\"class\",\"auth-container\"],[13],[0,\"\\n\"],[6,[\"link-to\"],[\"index\"],[[\"classNames\"],[\"auth-navbar \"]],{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"content-center\"],[13],[0,\"\\n       \"],[11,\"img\",[]],[15,\"class\",\"icon-md\"],[15,\"src\",\"/client/z-kartLogo.png\"],[15,\"alt\",\"z-kart\"],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"auth-mainportal\"],[13],[0,\"\\n    \"],[11,\"h1\",[]],[15,\"class\",\"auth-head\"],[13],[0,\"Create your Z-kart Account\"],[14],[0,\"\\n    \"],[11,\"p\",[]],[15,\"class\",\"error-message \"],[13],[1,[26,[\"error\"]],false],[14],[0,\"\\n    \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitSignup\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"input-group-row\"],[13],[0,\"\\n          \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputClass\"],[\"first_name\",[28,[\"first_name\"]],\"First Name\",[28,[\"firstNameError\"]],\"auth-input\"]]],false],[0,\"\\n          \\n            \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputClass\"],[\"last_name\",[28,[\"last_name\"]],\"Last Name\",[28,[\"lastNameError\"]],\"auth-input\"]]],false],[0,\"\\n        \"],[14],[0,\"\\n        \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"tag\",\"inputClass\"],[\"address\",[28,[\"address\"]],\"Address\",[28,[\"addressError\"]],\"text-area\",\"auth-input\"]]],false],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"input-group-row\"],[13],[0,\"\\n            \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputType\",\"inputClass\"],[\"email\",[28,[\"email\"]],\"Email\",[28,[\"emailError\"]],\"email\",\"auth-input\"]]],false],[0,\"\\n            \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"inputType\",\"value\",\"placeholder\",\"error\",\"inputClass\"],[\"mobile\",\"number\",[28,[\"mobile\"]],\"Mobile\",[28,[\"mobileError\"]],\"auth-input\"]]],false],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"input-group-row\"],[13],[0,\"\\n            \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputType\"],[\"password\",[28,[\"password\"]],\"Password\",[28,[\"passwordError\"]],\"password\"]]],false],[0,\"\\n            \"],[1,[33,[\"input-field\"],null,[[\"inputId\",\"value\",\"placeholder\",\"error\",\"inputType\"],[\"confirm_password\",[28,[\"confirm_password\"]],\"Confirm Password\",[28,[\"confirmPasswordError\"]],\"password\"]]],false],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"input-group-row\"],[13],[0,\"\\n            \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"button-inner\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"\\n                \"],[11,\"span\",[]],[15,\"class\",\"content-center\"],[13],[0,\"Cancel\"],[14],[0,\"\\n            \"],[14],[0,\"\\n            \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"button-inner\"],[13],[0,\"\\n                \"],[11,\"span\",[]],[15,\"class\",\"content-center\"],[13],[0,\"Continue\"],[14],[0,\"\\n            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"divider-break content-center font-md\"],[13],[0,\"\\n        Already have an account? \"],[6,[\"link-to\"],[\"login\"],null,{\"statements\":[[11,\"span\",[]],[15,\"class\",\"auth-text\"],[13],[0,\"Login\"],[14]],\"locals\":[]},null],[0,\"\\n    \"],[14],[0,\"\\n \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "online-shopping-client/templates/signup.hbs" } });
});
define("online-shopping-client/utils/ajax-req", ["exports", "online-shopping-client/config/environment"], function (exports, _environment) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ajaxReq;
  function ajaxReq(_ref) {
    var endpoint = _ref.endpoint,
        _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data,
        _ref$method = _ref.method,
        method = _ref$method === undefined ? 'GET' : _ref$method;


    // console.log(ENV);
    // console.log(ENV.API_BASE_URL);

    var url = "http://localhost:8002/api/v1/" + endpoint;

    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
        url: url,
        data: data,
        type: method,
        credentials: 'include',
        contentType: 'application/json'
      }).done(function (res) {
        resolve(res);
      }).fail(function (error) {
        reject(error);
      });
    });
  }
});
define("online-shopping-client/utils/encrypt-data", ["exports", "online-shopping-client/config/environment"], function (exports, _environment) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = encryptData;
  function encryptData(data) {
    var encrypt = new JSEncrypt();
    var publicKey = _environment.default.publicKey;
    encrypt.setPublicKey(publicKey);
    var encrypted = encrypt.encrypt(JSON.stringify(data));
    if (!encrypted) {
      console.error("Encryption failed. Check your public key and data format.");
    }
    console.log(encrypted, data);

    return encrypted;
  }
});
define("online-shopping-client/utils/password-validation", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.validatePassword = validatePassword;
  function validatePassword(password) {
    console.log("password validation started");
    var lowerCaseRegex = /[a-z]/g;
    var upperCaseRegex = /[A-Z]/g;
    var numberRegex = /\d/g;

    // Check if password length is at least 6
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    // Check for at least 2 lowercase letters
    var lowerCaseMatches = password.match(lowerCaseRegex) || [];
    if (lowerCaseMatches.length < 2) {
      return "Password must contain at least 2 lowercase letters.";
    }

    // Check for at least 2 uppercase letters
    var upperCaseMatches = password.match(upperCaseRegex) || [];
    if (upperCaseMatches.length < 2) {
      return "Password must contain at least 2 uppercase letters.";
    }

    // Check for at least 2 numbers
    var numberMatches = password.match(numberRegex) || [];
    if (numberMatches.length < 2) {
      return "Password must contain at least 2 numbers.";
    }

    return null; // Password is valid
  }
});
define("online-shopping-client/utils/transform-data", ["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = transformData;
    function transformData(data) {
        console.log("transforming data is ", data);

        var transformedData = data.reduce(function (acc, current) {
            var totalAmount = current.totalAmount,
                product = current.product,
                discount = current.discount,
                discountId = current.discountId,
                createdTime = current.createdTime,
                paymentMode = current.paymentMode,
                shippingAddress = current.shippingAddress,
                invoiceId = current.invoiceId,
                invoiceNumber = current.invoiceNumber,
                invoiceItems = current.invoiceItems,
                user = current.user;


            var existingInvoice = acc.find(function (invoice) {
                return invoice.invoiceId === invoiceId;
            });
            if (existingInvoice) {
                // Add invoice item to existing invoice
                existingInvoice.invoice_items.push({
                    price: invoiceItems ? invoiceItems.price : null,
                    productId: invoiceItems ? invoiceItems.productId : null,
                    quantity: invoiceItems ? invoiceItems.quantity : null,
                    productName: product ? product.productName : null,
                    specification: product ? product.specification : null
                });
            } else {
                acc.push({
                    invoiceId: invoiceId,
                    paymentMode: paymentMode,
                    invoiceNumber: invoiceNumber,
                    discountCode: discount ? discount.discountCode : null,
                    totalAmount: totalAmount,
                    percentage: discount ? discount.percentage : null,
                    shippingAddress: shippingAddress,
                    transactionTime: createdTime,
                    name: user ? user.firstName + user.lastName : null,
                    invoice_items: [{
                        price: invoiceItems ? invoiceItems.price : null,
                        productId: invoiceItems ? invoiceItems.productId : null,
                        quantity: invoiceItems ? invoiceItems.quantity : null,
                        productName: product ? product.productName : null,
                        specification: product ? product.specification : null
                    }]
                });
            }
            return acc;
        }, []);

        return transformedData;
    }
});


define('online-shopping-client/config/environment', ['ember'], function(Ember) {
  var prefix = 'online-shopping-client';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("online-shopping-client/app")["default"].create({"name":"online-shopping-client","version":"0.0.0+4ebc80de"});
}
//# sourceMappingURL=online-shopping-client.map

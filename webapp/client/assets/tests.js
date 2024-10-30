'use strict';

define('online-shopping-client/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/cart-container.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/cart-container.js should pass ESLint\n\n41:5 - Unexpected console statement. (no-console)\n49:7 - Unexpected console statement. (no-console)\n52:7 - Unexpected console statement. (no-console)\n86:11 - Unexpected console statement. (no-console)\n88:11 - Unexpected console statement. (no-console)\n109:9 - Unexpected console statement. (no-console)\n113:9 - Unexpected console statement. (no-console)\n148:7 - Unexpected console statement. (no-console)\n162:11 - Unexpected console statement. (no-console)');
  });

  QUnit.test('components/horizontal-scroll-items.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/horizontal-scroll-items.js should pass ESLint\n\n');
  });

  QUnit.test('components/input-field.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/input-field.js should pass ESLint\n\n');
  });

  QUnit.test('components/input-password.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/input-password.js should pass ESLint\n\n');
  });

  QUnit.test('components/login-page.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/login-page.js should pass ESLint\n\n7:13 - Unexpected console statement. (no-console)');
  });

  QUnit.test('components/model-dialog.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/model-dialog.js should pass ESLint\n\n');
  });

  QUnit.test('components/my-tour.js.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/my-tour.js.js should pass ESLint\n\n3:10 - \'run\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('components/product-container.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/product-container.js should pass ESLint\n\n15:7 - Unexpected console statement. (no-console)\n19:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('components/search-box.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/search-box.js should pass ESLint\n\n');
  });

  QUnit.test('components/shop-navbar.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/shop-navbar.js should pass ESLint\n\n30:15 - \'error\' is defined but never used. (no-unused-vars)\n60:7 - Unexpected console statement. (no-console)\n64:7 - Unexpected console statement. (no-console)\n79:5 - Unexpected console statement. (no-console)\n111:17 - \'error\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('components/toast-notification.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/toast-notification.js should pass ESLint\n\n');
  });

  QUnit.test('components/top-menu.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/top-menu.js should pass ESLint\n\n');
  });

  QUnit.test('components/user-details.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/user-details.js should pass ESLint\n\n18:3 - Duplicate key \'toast\'. (no-dupe-keys)\n20:5 - Unexpected console statement. (no-console)\n39:5 - Unexpected console statement. (no-console)\n79:10 - Unexpected console statement. (no-console)\n82:10 - Unexpected console statement. (no-console)\n114:5 - Unexpected console statement. (no-console)\n125:14 - \'response\' is defined but never used. (no-unused-vars)\n156:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/account.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/account.js should pass ESLint\n\n20:9 - Unexpected console statement. (no-console)\n23:13 - Unexpected console statement. (no-console)\n26:11 - Unexpected console statement. (no-console)\n37:17 - Unexpected console statement. (no-console)\n39:17 - \'error\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/account/orders.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/account/orders.js should pass ESLint\n\n24:13 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/account/profile.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/account/profile.js should pass ESLint\n\n23:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/account/profile/update-password.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/account/profile/update-password.js should pass ESLint\n\n18:13 - Unexpected console statement. (no-console)\n32:15 - Unexpected console statement. (no-console)\n73:15 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/account/users.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/account/users.js should pass ESLint\n\n11:13 - Unexpected console statement. (no-console)\n17:17 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/application.js should pass ESLint\n\n7:15 - \'intro\' is assigned a value but never used. (no-unused-vars)\n44:9 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/checkout.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/checkout.js should pass ESLint\n\n9:7 - Unexpected console statement. (no-console)\n18:9 - Unexpected console statement. (no-console)\n24:13 - Unexpected console statement. (no-console)\n25:13 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/login.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/login.js should pass ESLint\n\n2:8 - \'$\' is defined but never used. (no-unused-vars)\n28:7 - Unexpected console statement. (no-console)\n58:9 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/product.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/product.js should pass ESLint\n\n2:8 - \'$\' is defined but never used. (no-unused-vars)\n14:13 - Unexpected console statement. (no-console)\n18:9 - Unexpected console statement. (no-console)\n32:9 - Unexpected console statement. (no-console)\n39:13 - Unexpected console statement. (no-console)\n44:17 - Unexpected console statement. (no-console)\n53:24 - \'res\' is defined but never used. (no-unused-vars)\n60:17 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/products.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/products.js should pass ESLint\n\n29:9 - Unexpected console statement. (no-console)\n67:17 - Unexpected console statement. (no-console)\n71:13 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/signup.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/signup.js should pass ESLint\n\n4:8 - \'$\' is defined but never used. (no-unused-vars)\n5:8 - \'ENV\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('helpers/calculate-discount-price.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/calculate-discount-price.js should pass ESLint\n\n4:3 - Unexpected console statement. (no-console)');
  });

  QUnit.test('helpers/eq.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/eq.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/is-logged-in.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/is-logged-in.js should pass ESLint\n\n8:5 - Unexpected console statement. (no-console)\n22:7 - Unexpected console statement. (no-console)\n25:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('helpers/join-string.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/join-string.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/or.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/or.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/product-url.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/product-url.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/range.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/range.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/split-lines.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/split-lines.js should pass ESLint\n\n4:3 - Unexpected console statement. (no-console)');
  });

  QUnit.test('helpers/time-converter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/time-converter.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/account.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/account.js should pass ESLint\n\n9:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/account/orders.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/account/orders.js should pass ESLint\n\n16:17 - Unexpected console statement. (no-console)\n21:17 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/account/profile.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/account/profile.js should pass ESLint\n\n9:7 - Unexpected console statement. (no-console)\n18:9 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/account/profile/update-password.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/account/profile/update-password.js should pass ESLint\n\n');
  });

  QUnit.test('routes/account/users.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/account/users.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });

  QUnit.test('routes/checkout.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/checkout.js should pass ESLint\n\n19:13 - Unexpected console statement. (no-console)\n20:13 - Unexpected console statement. (no-console)\n21:13 - Unexpected console statement. (no-console)\n37:17 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/checkout/order-confirmation.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/checkout/order-confirmation.js should pass ESLint\n\n14:25 - \'transition\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/index.js should pass ESLint\n\n2:8 - \'$\' is defined but never used. (no-unused-vars)\n14:9 - Unexpected console statement. (no-console)\n17:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/login.js should pass ESLint\n\n16:5 - Unexpected console statement. (no-console)\n17:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/product.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/product.js should pass ESLint\n\n2:8 - \'$\' is defined but never used. (no-unused-vars)\n13:9 - Unexpected console statement. (no-console)\n49:15 - Unexpected console statement. (no-console)\n56:13 - Unexpected console statement. (no-console)\n60:23 - \'transition\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/products.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/products.js should pass ESLint\n\n33:9 - Unexpected console statement. (no-console)\n36:9 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/signup.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/signup.js should pass ESLint\n\n');
  });

  QUnit.test('services/data-store.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/data-store.js should pass ESLint\n\n2:8 - \'$\' is defined but never used. (no-unused-vars)\n16:5 - Unexpected console statement. (no-console)\n20:5 - Unexpected console statement. (no-console)\n24:5 - Unexpected console statement. (no-console)\n31:5 - Unexpected console statement. (no-console)\n55:9 - Unexpected console statement. (no-console)\n61:9 - Unexpected console statement. (no-console)\n68:9 - Unexpected console statement. (no-console)\n75:9 - Unexpected console statement. (no-console)\n80:9 - Unexpected console statement. (no-console)\n87:9 - Unexpected console statement. (no-console)\n89:7 - Unexpected console statement. (no-console)\n92:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('services/toast.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/toast.js should pass ESLint\n\n16:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('utils/ajax-req.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'utils/ajax-req.js should pass ESLint\n\n3:8 - \'ENV\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('utils/encrypt-data.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'utils/encrypt-data.js should pass ESLint\n\n3:21 - \'JSEncrypt\' is not defined. (no-undef)\n8:7 - Unexpected console statement. (no-console)\n10:3 - Unexpected console statement. (no-console)');
  });

  QUnit.test('utils/password-validation.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'utils/password-validation.js should pass ESLint\n\n2:3 - Unexpected console statement. (no-console)');
  });

  QUnit.test('utils/transform-data.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'utils/transform-data.js should pass ESLint\n\n2:5 - Unexpected console statement. (no-console)\n5:46 - \'discountId\' is assigned a value but never used. (no-unused-vars)');
  });
});
define('online-shopping-client/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('online-shopping-client/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'online-shopping-client/tests/helpers/start-app', 'online-shopping-client/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var resolve = Ember.RSVP.resolve;
});
define('online-shopping-client/tests/helpers/resolver', ['exports', 'online-shopping-client/resolver', 'online-shopping-client/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('online-shopping-client/tests/helpers/start-app', ['exports', 'online-shopping-client/app', 'online-shopping-client/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('online-shopping-client/tests/integration/components/cart-container-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('cart-container', 'Integration | Component | cart container', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "KI+t+ne+",
      "block": "{\"statements\":[[1,[26,[\"cart-container\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "6YrYBa3F",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"cart-container\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/horizontal-scroll-items-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('horizontal-scroll-items', 'Integration | Component | horizontal scroll items', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "iVht29HN",
      "block": "{\"statements\":[[1,[26,[\"horizontal-scroll-items\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "kjPw7gBA",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"horizontal-scroll-items\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/input-field-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('input-field', 'Integration | Component | input field', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "2Bvrnl1M",
      "block": "{\"statements\":[[1,[26,[\"input-field\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "6Kv7WcDo",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"input-field\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/input-password-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('input-password', 'Integration | Component | input password', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "aDDiZzrm",
      "block": "{\"statements\":[[1,[26,[\"input-password\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "M4iBn64Q",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"input-password\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/login-page-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('login-page', 'Integration | Component | login page', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "MN6uxQbC",
      "block": "{\"statements\":[[1,[26,[\"login-page\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "1c/loGdJ",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"login-page\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/model-dialog-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('model-dialog', 'Integration | Component | model dialog', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "vAO7dyLi",
      "block": "{\"statements\":[[1,[26,[\"model-dialog\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "3l3ZOUlL",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"model-dialog\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/my-tour.js-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('my-tour.js', 'Integration | Component | my tour.js', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "hdE/QJRQ",
      "block": "{\"statements\":[[1,[28,[\"my-tour\",\"js\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "SObE27Gg",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"component\"],[[28,[\"my-tour\",\"js\"]]],null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/product-container-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('product-container', 'Integration | Component | product container', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "ABMP1t1q",
      "block": "{\"statements\":[[1,[26,[\"product-container\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "f+w0rCC5",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"product-container\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/search-box-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('search-box', 'Integration | Component | search box', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "AEqHaaGW",
      "block": "{\"statements\":[[1,[26,[\"search-box\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "LeHjmhXB",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"search-box\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/shop-navbar-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('shop-navbar', 'Integration | Component | shop navbar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "fSLNlXUF",
      "block": "{\"statements\":[[1,[26,[\"shop-navbar\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "g0+0jwSJ",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"shop-navbar\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/toast-notification-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('toast-notification', 'Integration | Component | toast notification', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "SvHltb9u",
      "block": "{\"statements\":[[1,[26,[\"toast-notification\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "GUtYzDEo",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"toast-notification\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/top-menu-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('top-menu', 'Integration | Component | top menu', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "LinOaNIt",
      "block": "{\"statements\":[[1,[26,[\"top-menu\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "RBny+x3F",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"top-menu\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/components/user-details-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('user-details', 'Integration | Component | user details', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "ylTQOBU8",
      "block": "{\"statements\":[[1,[26,[\"user-details\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "m4RMUlTW",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"user-details\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('online-shopping-client/tests/integration/helpers/calculate-discount-price-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('calculate-discount-price', 'helper:calculate-discount-price', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "co36PbAh",
      "block": "{\"statements\":[[1,[33,[\"calculate-discount-price\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('online-shopping-client/tests/integration/helpers/eq-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('eq', 'helper:eq', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "1SYOrDlN",
      "block": "{\"statements\":[[1,[33,[\"eq\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('online-shopping-client/tests/integration/helpers/is-logged-in-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('is-logged-in', 'helper:is-logged-in', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "T6IZ74kp",
      "block": "{\"statements\":[[1,[33,[\"is-logged-in\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('online-shopping-client/tests/integration/helpers/join-string-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('join-string', 'helper:join-string', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "djsOzsPH",
      "block": "{\"statements\":[[1,[33,[\"join-string\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('online-shopping-client/tests/integration/helpers/or-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('or', 'helper:or', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "l5tNo+6p",
      "block": "{\"statements\":[[1,[33,[\"or\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('online-shopping-client/tests/integration/helpers/product-url-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('product-url', 'helper:product-url', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "Hr9kznpr",
      "block": "{\"statements\":[[1,[33,[\"product-url\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('online-shopping-client/tests/integration/helpers/range-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('range', 'helper:range', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "UJ7HN/VG",
      "block": "{\"statements\":[[1,[33,[\"range\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('online-shopping-client/tests/integration/helpers/split-lines-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('split-lines', 'helper:split-lines', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "dKILL0X3",
      "block": "{\"statements\":[[1,[33,[\"split-lines\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('online-shopping-client/tests/integration/helpers/time-converter-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('time-converter', 'helper:time-converter', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "fepCjN8T",
      "block": "{\"statements\":[[1,[33,[\"time-converter\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('online-shopping-client/tests/test-helper', ['online-shopping-client/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('online-shopping-client/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/cart-container-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/cart-container-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/horizontal-scroll-items-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/horizontal-scroll-items-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/input-field-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/input-field-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/input-password-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/input-password-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/login-page-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/login-page-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/model-dialog-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/model-dialog-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/my-tour.js-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/my-tour.js-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/product-container-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/product-container-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/search-box-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/search-box-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/shop-navbar-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/shop-navbar-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/toast-notification-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/toast-notification-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/top-menu-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/top-menu-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/user-details-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/user-details-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/calculate-discount-price-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/calculate-discount-price-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/eq-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/eq-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/is-logged-in-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/is-logged-in-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/join-string-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/join-string-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/or-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/or-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/product-url-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/product-url-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/range-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/range-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/split-lines-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/split-lines-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/time-converter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/time-converter-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/account-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/account-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/account/orders-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/account/orders-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/account/profile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/account/profile-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/account/profile/update-password-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/account/profile/update-password-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/account/users-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/account/users-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/checkout-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/checkout-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/product-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/product-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/products-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/products-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/signup-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/signup-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/account-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/account-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/account/orders-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/account/orders-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/account/profile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/account/profile-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/account/profile/update-password-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/account/profile/update-password-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/account/users-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/account/users-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/checkout-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/checkout-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/checkout/order-confirmation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/checkout/order-confirmation-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/index/login1-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index/login1-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/product-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/product-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/products/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/products/login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/signup-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/signup-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/auth-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/auth-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/data-store-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/data-store-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/toast-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/toast-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/ajax-req-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/ajax-req-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/encrypt-data-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/encrypt-data-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/google-image-search-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/google-image-search-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/password-validation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/password-validation-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/transform-data-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/transform-data-test.js should pass ESLint\n\n');
  });
});
define('online-shopping-client/tests/unit/controllers/account-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:account', 'Unit | Controller | account', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/account/orders-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:account/orders', 'Unit | Controller | account/orders', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/account/profile-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:account/profile', 'Unit | Controller | account/profile', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/account/profile/update-password-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:account/profile/update-password', 'Unit | Controller | account/profile/update password', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/account/users-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:account/users', 'Unit | Controller | account/users', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/checkout-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:checkout', 'Unit | Controller | checkout', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:index', 'Unit | Controller | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/login-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:login', 'Unit | Controller | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/product-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:product', 'Unit | Controller | product', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/products-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:products', 'Unit | Controller | products', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/controllers/signup-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:signup', 'Unit | Controller | signup', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('online-shopping-client/tests/unit/routes/account-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:account', 'Unit | Route | account', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/account/orders-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:account/orders', 'Unit | Route | account/orders', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/account/profile-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:account/profile', 'Unit | Route | account/profile', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/account/profile/update-password-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:account/profile/update-password', 'Unit | Route | account/profile/update password', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/account/users-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:account/users', 'Unit | Route | account/users', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/checkout-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:checkout', 'Unit | Route | checkout', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/checkout/order-confirmation-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:checkout/order-confirmation', 'Unit | Route | checkout/order confirmation', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/index/login1-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:index/login1', 'Unit | Route | index/login1', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/login-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:login', 'Unit | Route | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/product-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:product', 'Unit | Route | product', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/products/login-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:products/login', 'Unit | Route | products/login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/routes/signup-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:signup', 'Unit | Route | signup', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('online-shopping-client/tests/unit/services/auth-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:auth', 'Unit | Service | auth', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('online-shopping-client/tests/unit/services/data-store-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:data-store', 'Unit | Service | data store', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('online-shopping-client/tests/unit/services/toast-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:toast', 'Unit | Service | toast', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('online-shopping-client/tests/unit/utils/ajax-req-test', ['online-shopping-client/utils/ajax-req', 'qunit'], function (_ajaxReq, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | ajax req');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _ajaxReq.default)();
    assert.ok(result);
  });
});
define('online-shopping-client/tests/unit/utils/encrypt-data-test', ['online-shopping-client/utils/encrypt-data', 'qunit'], function (_encryptData, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | encrypt data');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _encryptData.default)();
    assert.ok(result);
  });
});
define('online-shopping-client/tests/unit/utils/google-image-search-test', ['online-shopping-client/utils/google-image-search', 'qunit'], function (_googleImageSearch, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | google image search');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _googleImageSearch.default)();
    assert.ok(result);
  });
});
define('online-shopping-client/tests/unit/utils/password-validation-test', ['online-shopping-client/utils/password-validation', 'qunit'], function (_passwordValidation, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | password validation');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _passwordValidation.default)();
    assert.ok(result);
  });
});
define('online-shopping-client/tests/unit/utils/transform-data-test', ['online-shopping-client/utils/transform-data', 'qunit'], function (_transformData, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | transform data');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _transformData.default)();
    assert.ok(result);
  });
});
require('online-shopping-client/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map

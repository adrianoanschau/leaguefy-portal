/*-------------------------------------------------*/
/* forms */
/*-------------------------------------------------*/

leaguefy.toastr = {
  defaults: {
    offset: {
      x: 0,
      y: -6,
    },
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: 'bg-primary',
    style: {
      background: 'none',
    },
  },
  className: 'bg-primary',

  toast: function (message, options) {
    if (typeof options == 'undefined') {
      options = { text: message };
    } else {
      options.text = message;
    }
    options.className = this.className;
    let toastOptions = merge_default(this.defaults, options);
    Toastify(toastOptions).showToast();
  },

  success: function (text, obj) {
    this.className = 'bg-success';
    this.toast(text, obj);
  },
  alert: function (text, obj) {
    this.className = 'bg-warning';
    this.toast(text, obj);
  },
  warning: function (text, obj) {
    this.className = 'bg-warning';
    this.toast(text, obj);
  },
  error: function (text, obj) {
    this.className = 'bg-danger';
    this.toast(text, obj);
  },
  info: function (text, obj) {
    this.className = 'bg-info';
    this.toast(text, obj);
  },
};

leaguefy.toast = function (text, obj) {
  leaguefy.toastr.toast(text, obj);
};

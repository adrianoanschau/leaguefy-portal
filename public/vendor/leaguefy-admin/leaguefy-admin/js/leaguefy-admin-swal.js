leaguefy.swal = {
  init: function () {
    this.swalConfirmSubmit();
  },

  refresh: function () {
    this.swalConfirmSubmit('#main');
  },
  swalConfirmSubmit: function (container = null) {
    container = container
      ? `${container} [data-swal-confirm='submit']`
      : "[data-swal-confirm='submit']";
    const elements = document.querySelectorAll(container);
    for (let element of elements) {
      element.addEventListener('click', function (event) {
        event.preventDefault();
        const form = document.querySelector(
          event.currentTarget.dataset.swalTarget,
        );
        if (form) {
          Swal.fire({
            title: 'Você tem certeza?',
            text: 'Esta ação é irreverzsível!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, exclua isto!',
            cancelButtonText: 'Não, cancelar!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              form.dispatch(
                new Event('submit', {
                  bubbles: true,
                  cancelable: true,
                }),
              );
            }
          });
        }
      });
    }
  },
};

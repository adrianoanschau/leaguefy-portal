leaguefy.tournaments = {
  init: function () {
    this.load();
  },
  refresh: function () {
    this.load('#main');
  },
  unmount: function () {
    Array.from(document.getElementsByClassName('connection-line')).forEach(
      (el) => el.remove(),
    );
  },
  load: function (container = null) {
    container = container
      ? `${container} [data-leaguefy-stages='container']`
      : "[data-leaguefy-stages='container']";
    const config = document.querySelector(container);
    if (config) {
      const events = {
        'new-stage': this.newStage.bind(this),
      };
      const action = config.getAttribute('action');
      const method = config.getAttribute('method');

      this.connectStages(document.querySelector(container));
      window.addEventListener('resize', () => {
        this.connectStages(document.querySelector(container));
      });

      this.updateStages();
      this.removeStages();

      // $("#editStage").on("show.bs.modal", (event) => {
      //     console.log(event);
      // });

      config.querySelectorAll('[data-leaguefy-stages]').forEach((el) => {
        el.addEventListener('click', (event) => {
          const eventName = event.currentTarget.dataset.leaguefyStages;
          if (Object.keys(events).includes(eventName)) {
            events[eventName](action, method, event);
          }
        });
      });
    }
  },
  newStage: function (url, method, event) {
    const { lane, position, laneInsert, positionInsert } =
      event.currentTarget.dataset;

    leaguefy.ajax.request(url, {
      method,
      url,
      data: {
        lane: lane ? parseInt(lane, 10) : undefined,
        position: position ? parseInt(position, 10) : undefined,
        laneInsert,
        positionInsert,
      },
    });
  },

  createConnection: function (div1, div2) {
    const form = document.querySelector("[data-leaguefy-stages='connection']");
    const url = form.getAttribute('action');
    const method = form.getAttribute('method');
    const [parentLane, parentPosition] = div1
      .getAttribute('id')
      .replace('stage-', '')
      .split(':')
      .map((n) => parseInt(n, 10));
    const [childLane, childPosition] = div2
      .getAttribute('id')
      .replace('stage-', '')
      .split(':')
      .map((n) => parseInt(n, 10));

    leaguefy.ajax.request(url, {
      method,
      url,
      data: {
        parent: {
          lane: parentLane,
          position: parentPosition,
        },
        child: {
          lane: childLane,
          position: childPosition,
        },
      },
    });
  },

  updateStages: function () {
    document.querySelectorAll('.stage-name').forEach((el) => {
      el.addEventListener('click', function (event) {
        event.currentTarget.classList.toggle('edit-name');
        if (event.currentTarget.classList.contains('edit-name')) {
          event.currentTarget.querySelector('input').focus();
        }
      });
    });
    document
      .querySelectorAll("[data-leaguefy-stages='update']")
      .forEach((el) => {
        if (el.tagName === 'INPUT') {
          let inputOldValue = '';
          el.addEventListener('focus', function (event) {
            event.currentTarget.select();
            inputOldValue = event.currentTarget.value;
          });
          el.addEventListener('blur', function (event) {
            event.currentTarget.parentNode.classList.remove('edit-name');
            event.currentTarget.value = inputOldValue;
            inputOldValue = '';
          });
          el.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
              event.preventDefault();

              const { url, leaguefyField } = event.currentTarget.dataset;
              leaguefy.ajax.request(url, {
                method: 'put',
                url,
                data: {
                  [leaguefyField]: event.currentTarget.value,
                },
              });
            }
            if (event.key === 'Escape') {
              event.currentTarget.parentNode.classList.remove('edit-name');
              event.currentTarget.blur();
              event.currentTarget.value = inputOldValue;
              inputOldValue = '';
            }
          });
        } else {
          el.addEventListener('click', function (event) {
            const { url, leaguefyField, leaguefyValue } =
              event.currentTarget.dataset;
            leaguefy.ajax.request(url, {
              method: 'put',
              url,
              data: {
                [leaguefyField]: leaguefyValue,
              },
            });
          });
        }
      });

    const editStageModalEl = document.getElementById('editStage');
    const editStageModal = new bootstrap.Modal(editStageModalEl);
    $('#editStage').on('hidden.bs.modal', function (event) {
      const form = event.currentTarget.querySelector('form');
      editStageModalEl.querySelector('form').action = form.action.replace(
        `/${form.dataset.stageId}`,
        `/#editStage`,
      );
    });

    document
      .querySelectorAll("[data-leaguefy-stages='form-modal']")
      .forEach((el) => {
        el.addEventListener('click', (event) => {
          const { title, stage, ...rest } = event.currentTarget.dataset;
          const form = editStageModalEl.querySelector('form');

          JSON.parse(rest.fields).forEach((field) => {
            const [name, value] = field.split(':');
            form.querySelector(`input#${name}`).value = value;
          });

          editStageModalEl.querySelector('.modal-title').innerText = title;

          form.setAttribute('data-stage-id', `${stage}`);

          editStageModalEl.querySelector('form').action = form.action.replace(
            '#editStage',
            `${stage}`,
          );

          editStageModal.show();
          form.addEventListener('submit', function (event) {
            editStageModal.hide();
          });
        });
      });
  },

  removeStages: function () {
    document
      .querySelectorAll("[data-leaguefy-stages='remove']")
      .forEach((el) => {
        el.addEventListener('click', function (event) {
          const { url } = event.currentTarget.dataset;
          leaguefy.ajax.request(url, {
            method: 'delete',
            url,
          });
        });
      });
  },

  connectStages: function (container) {
    this.unmount();
    const colors = ['RoyalBlue', 'Red', 'Orange', 'Purple'];

    container.querySelectorAll('[data-connect-to]').forEach((el) => {
      const id = el.getAttribute('id');
      const connections = JSON.parse(el.dataset.connectTo);
      if (connections) {
        connections.forEach((connect) => {
          connect = `stage-${connect}`;
          const div1 = document.getElementById(id);
          const div2 = document.getElementById(connect);
          const [lane, position] = id
            .replace('stage-', '')
            .split(':')
            .map((n) => parseInt(n, 10));

          const totalLaneConnections = Array.from(
            document
              .getElementById(`lane-${lane}`)
              .querySelectorAll('[data-connect-to]'),
          ).length;

          if (div1 && div2) {
            this.connect(
              div2,
              div1,
              'RoyalBlue',
              // colors.concat(colors)[position],
              1,
              (position - Math.floor(totalLaneConnections / 2)) * 5,
            );
            if (div2.querySelector(`.parent-link`)) {
              div2.querySelector(`.parent-link`).remove();
            }
          }
        });
      }
    });

    Array.from(container.querySelectorAll('.stage-card')).forEach((el) => {
      const connectLink = el.querySelector('.connect-link');
      if (connectLink) {
        el.querySelector('.connect-link').addEventListener('click', (event) => {
          if (
            event.currentTarget.parentNode.parentNode.parentNode.parentNode.classList.contains(
              'stage-link-connect',
            )
          ) {
            this.createConnection(
              event.currentTarget.parentNode,
              document.querySelector('.stage-link-disconnect'),
            );
          }
        });
      }

      const stageLink = el.querySelector('.stage-link');
      if (!stageLink) return;

      const id = el.parentNode.parentNode.parentNode.getAttribute('id');
      const lane = parseInt(id.replace('lane-', ''), 10);

      stageLink.addEventListener('click', (event) => {
        const parentClasses = event.currentTarget.parentNode.classList;
        const { connectTo } = event.currentTarget.parentNode.dataset;
        let connections;
        if (connectTo) {
          connections = JSON.parse(
            event.currentTarget.parentNode.dataset.connectTo,
          );
        }
        event.currentTarget.parentNode.classList.toggle(
          'stage-link-disconnect',
        );
        document
          .querySelector(`#lane-${lane - 1}`)
          .classList.toggle('stage-link-connect');
        document
          .querySelector('#app')
          .classList.toggle('stage-link-in-connection');

        if (connections) {
          connections.forEach((connection) => {
            document
              .getElementById(`stage-${connection}`)
              .classList.toggle('stage-connected');
          });
        }
      });
    });
  },

  getOffset: function (el) {
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width || el.offsetWidth,
      height: rect.height || el.offsetHeight,
    };
  },

  line: function (x1, y1, x2, y2, color, thickness) {
    var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var cx = (x1 + x2) / 2 - length / 2;
    var cy = (y1 + y2) / 2 - thickness / 2;
    var angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);

    const p = document.createElement('p');
    p.classList.add('connection-line');
    p.style.padding = '0px';
    p.style.margin = '0px';
    p.style.height = `${thickness}px`;
    p.style.backgroundColor = `${color}`;
    p.style.lineHeight = `1px`;
    p.style.position = `absolute`;
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    p.style.width = `${length}px`;
    p.style['-moz-transform'] = `rotate(${angle}deg)`;
    p.style['-webkit-transform'] = `rotate(${angle}deg)`;
    p.style['-o-transform'] = `rotate(${angle}deg)`;
    p.style['-ms-transform'] = `rotate(${angle}deg)`;
    p.style['transform'] = `rotate(${angle}deg)`;

    document.body.appendChild(p);
  },

  connect: function (div1, div2, color, thickness, yOffset = 0) {
    var off1 = this.getOffset(div1);
    var off2 = this.getOffset(div2);
    var x1 = off1.left + off1.width / 2;
    var y1 = off1.top + off1.height;
    var x4 = off2.left + off2.width / 2;
    var y4 = off2.top;

    var x2 = x1;
    var y2 = y1 + (y4 - y1) / 2 + yOffset;
    var x3 = x4;
    var y3 = y2;

    this.line(x1, y1, x2, y2, color, thickness);
    this.line(x2, y2, x3, y3, color, thickness);
    this.line(x3, y3, x4, y4, color, thickness);
  },
};

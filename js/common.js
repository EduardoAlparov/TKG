document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove('preload');

    const debounce = (func, wait, immediate) => {
        var timeout;
        return function () {
          var context = this, 
              args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          callNow && func.apply(context, args);
        };
    }

    function DragMenu (options) {
        const self    = this;
        self.menu     = options.el;
        self.hasTouch = 'ontouchstart' in window;
        self.isMoving = false;
        self.isOpen   = false;
        
        const compStyles = window.getComputedStyle(self.menu);
        self.position = {
            min: parseInt(compStyles.left),
            max: 0,
            current: 0
        };
        self.position.snapBorder = (self.position.min + self.position.max) * 0.5;
        
        self.btn = options.toggleButton;
        self.btn && self.btn.addEventListener('click', function() {
            self.setOpen(!self.isOpen);
        });
        
        if (self.hasTouch) {
            self.eventStart  = 'touchstart';
            self.eventMove = 'touchmove';
            self.eventEnd  = 'touchend';
        } else {
            self.eventStart  = 'mousedown';
            self.eventMove = 'mousemove';
            self.eventEnd  = 'mouseup';
        }
        
        self.menu.addEventListener(self.eventStart, e => {
            e.preventDefault();
            var evt = e.type === 'touchstart' ? e.changedTouches[0] : e;
            self.position.current = Math.abs(self.menu.offsetLeft - evt.clientX);
            self.menu.style.pointerEvents = 'none';
            var l = parseInt(menu.style.left);
        });
        
        window.addEventListener(self.eventMove, debounce(e => {
            if (self.menu.style.pointerEvents === 'none') {
            self.menu.classList.add('is-moving');
            var evt = e.type === 'touchmove' ? e.changedTouches[0] : e;
            var move = evt.clientX - self.position.current;
            if (move >= self.position.min && move <= self.position.max) {
                self.setOpen(false);
                self.menu.style.left = `${move}px`;
            }
            };
        }), 200);
        
        window.addEventListener(self.eventEnd, e => {
            self.menu.classList.remove('is-moving');
            var evt = e.type === 'touchstart' ? e.changedTouches[0] : e;
            var l = parseInt(menu.style.left);
            if(l > self.position.snapBorder) {
            self.setOpen(true);
            }
            self.menu.style.left = null;
            self.menu.style.pointerEvents = 'initial';
        });
        
        self.setOpen = isOpen => {
            self.isOpen = isOpen;
            self.btn.classList[isOpen ? 'add' : 'remove']('menu--open');
            self.menu.classList[isOpen ? 'add' : 'remove']('open');
            document.body.classList[isOpen ? 'add' : 'remove']('sidebar-menu-open');
        }
    }

    const btn = document.getElementById('btn-menu');
    const menu = document.getElementById('aside');

    new DragMenu({el: menu, toggleButton: btn});

    menu.addEventListener('mouseover', (e) => {
        menu.classList.add('step');
        
        e.target.addEventListener('mouseout', () => {
            menu.classList.remove('step');
        })
    })

    // add, delete form:
    const formTemplate = document.getElementById('template-form');
    const vacancyItemTemplate = document.getElementById('template-vacancy-item');
    const formContainer = document.getElementById('form-container');
    const vacancyContainer = document.getElementById('vacancy-container');
    const addFormButton = document.querySelector('.js-add-form');
    const input = document.querySelector('.search-bar__input');
    const vacanciesListHeading = document.querySelector('.vacancies__list-heading');
    let vacancyArray = [];

    window.addEventListener('click', (event) => {
        if(!event.target.closest('.search-bar__input')) {
            input.value = ''
        }

        if(event.target.closest('.js-add-form')) {
            let cloneFormTemplateInner = formTemplate.cloneNode(true);
            formContainer.innerHTML = '';
            formContainer.innerHTML = cloneFormTemplateInner.innerHTML;
            event.target.closest('.js-add-form').disabled = true;

            let completeForm = document.querySelector('.js-complete-form');

            if(completeForm) {
                completeForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    // forming data srart
                    const formData = new FormData(e.target);
                    let object = {};
                    formData.forEach(function(value, key){
                        object[key] = value;
                    });
                    object.id = Math.floor(Math.random() * Date.now());
                    // forming data end

                    // render html list start
                    let cloneVacancyItemTemplateInner = vacancyItemTemplate.cloneNode(true);
                    let li = document.createElement('li');
                    li.classList.add('vacancies__item');
                    li.innerHTML = cloneVacancyItemTemplateInner.innerHTML;
                    renderVacTemplate(li, object);
                    vacancyContainer.appendChild(li);
                    vacanciesListHeading.classList.toggle('visually-hidden', vacancyContainer.childNodes.length < 0)
                    formContainer.innerHTML = '';
                    addFormButton.disabled = false;
                    // render html list end

                    // work with data =>
                    vacancyArray.push(object);
                    let json = JSON.stringify(vacancyArray);
                    console.log(json);
                    document.cookie = 'data=' + json;
                })
            }

            function renderVacTemplate(template ,obj) {
                template.querySelector('[data-role="name"]').innerText = obj.name;

                switch(obj.position) {
                    case 'analyst': 
                        template.querySelector('[data-role="position"]').innerText = 'Аналитик';  
                        break;
                  
                    case 'manager': 
                        template.querySelector('[data-role="position"]').innerText = 'Менеджер';
                        break;
                  
                    case 'programmer': 
                        template.querySelector('[data-role="position"]').innerText = 'Программист';
                        break;
                  
                    case 'lawyer': 
                        template.querySelector('[data-role="position"]').innerText = 'Юрист';
                        break;
                  
                    default:
                        template.querySelector('[data-role="position"]').innerText = 'Не выбрано';
                        break;
                  }
                template.querySelector('[data-role="date"]').innerText = obj.date;
                template.querySelector('[data-role="comment"]').innerText = obj.comment;
            }

            // masks for inputs:
            const forms = document.getElementsByTagName('form');
            const nameInputs = document.querySelectorAll('.js-input-mask_text');
        
            if(forms.length) { 
                nameInputs.forEach(nameInput => {
                    const nameMask = IMask(nameInput, {
                    mask: /^[А-Яа-яЁёA-Za-z ]+$/,
                    });
                })
            }
        }

        if(event.target.closest('.js-delete-form')) {
            event.target.closest('.vacancies__request').innerHTML = '';
            addFormButton.disabled = false;
        }
    })
})

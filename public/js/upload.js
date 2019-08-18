const fileInput = document.querySelector('#file');
const submit = document.querySelector('#submit');

submit.addEventListener('click', function () {
    let files = fileInput.files;
    for(let i = 0; i < files.length; i++) {
        let img = new Image();
        let reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.addEventListener('load', function (e) {
            img.src = e.target.result;
            img.addEventListener('load', function () {
                let progress = document.querySelector('#progress');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                let jpeg = canvas.toDataURL("image/jpeg", 0.65);

                let xhr = new XMLHttpRequest();
                let upload = new FormData();
                upload.append('img', jpeg);
                xhr.open("POST", '/upload', true);
                xhr.upload.onprogress = function(event) {
                    progress.setAttribute('max', event.total);
                    progress.value = event.loaded;
                    console.log('Загружено ' + event.loaded + ' из ' + event.total);
                };
                xhr.onreadystatechange = function () {
                    if(xhr.readyState === 4 && xhr.status === 200) {
                        let res = this.responseText;
                        let jpg = new Image();
                        jpg.src = res;
                        jpg.style.width = '100%';
                        jpg.style.height = '100%';
                        jpg.style.borderRadius = '5px';
                        function createElem(tagElem, classElem) {
                            try {
                                if(!Array.isArray(classElem)) {
                                    throw new Error()
                                }
                                let newElem = document.createElement(tagElem);
                                newElem.classList.add(...classElem);
                                return newElem;
                            } catch (e) {
                                console.error('Переданный аргумент не является массивом')
                            }
                        }

                        function createAndAppend(tag, classElem, where) {
                            let create = createElem(tag, classElem);
                            where.append(create);
                        }

                        const container = createElem('DIV', ['resize__container']);
                        const resize = createElem('DIV', ['resize']);

                        document.querySelector('.popup__container').append(resize);
                        resize.appendChild(container);

                        createAndAppend('SPAN', ['resize-cont-nw', 'resize-event'], container);
                        createAndAppend('SPAN', ['resize-cont-ne', 'resize-event'], container);
                        createAndAppend('SPAN', ['resize-cont-sw', 'resize-event'], container);
                        createAndAppend('SPAN', ['resize-cont-se', 'resize-event'], container);

                        document.querySelectorAll('.resize-event').forEach(function (elem) {
                            elem.addEventListener('mousedown', function (e) {
                                console.log('Изменение')
                            });
                        });

                        container.append(jpg)
                    }
                };
                xhr.send(upload);
                reader.abort()
            });
        });
    }
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
});
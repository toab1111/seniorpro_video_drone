(() => {
    const audioElem = document.querySelector('video');
    const playBtnElem = document.querySelector('.play');
    const progressBarElem = document.querySelector('.progress-bar');
    const startTimeELem = document.querySelector('.start-time');
    const endTimeElem = document.querySelector('.end-time');
    const button_csv = document.getElementById('botton-csv');
    const csvfile = document.getElementById('upload-csv');
    const botton_mp4 = document.getElementById('botton-mp4');
    const botton_re = document.getElementById('botton-re');
    const mp4file = document.getElementById('upload-mp4');
    const hidetable = document.querySelector('.buttonhide');;
    const table = document.getElementById("table");
    const lat_tr = document.getElementById("lat_tr");
    const lon_tr = document.getElementById("lon_tr");
    const time_tr = document.getElementById("time_tr");
    const drawpoint = document.getElementById('botton_drawpoint');
    const clearpoint = document.getElementById('botton_clearpoint');
    const uploadvideo = document.querySelector('.upvideo');


    let logfile = {};
    let drawcoor = [];

    function getDuration(time) {
        const minute = Math.floor(time / 60 % 60).toString();
        const second = Math.floor(time % 60)
            .toString()
            .padStart(2, '0');
        return `${minute}:${second}`;
    }

    function onClick() {
        if (audioElem.paused) {
            audioElem.play();
            playBtnElem.className = 'pause';
        } else {
            audioElem.pause();
            playBtnElem.className = 'play';
        }
    }

    function onLoadedData() {
        endTimeElem.innerHTML = getDuration(audioElem.duration);
        progressBarElem.max = audioElem.duration;
        totaltime = audioElem.duration;
    }

    let s = 0;

    function onTimeUpdate() {

        startTimeELem.innerHTML = getDuration(audioElem.currentTime);
        progressBarElem.value = audioElem.currentTime;
        currenttime = audioElem.currentTime;
        // if (currenttime <= route_f[s][2] + 1) {
        //     preframe = s;
        //     postframe = s + 1;
        //     interval_down = route_f[postframe][2] - route_f[preframe][2];
        //     interval_up = currenttime - route_f[preframe][2];
        //     percent = interval_up / interval_down;
        //     dlat = parseFloat(route_f[preframe][0]) + ((parseFloat(route_f[postframe][0]) - parseFloat(route_f[preframe][0])) * percent);
        //     dlon = parseFloat(route_f[preframe][1]) + ((parseFloat(route_f[postframe][1]) - parseFloat(route_f[preframe][1])) * percent);
        // } else {
        //     s += 1
        //     preframe = s;
        //     postframe = s + 1;
        //     interval_down = route_f[postframe][2] - route_f[preframe][2];
        //     interval_up = currenttime - route_f[preframe][2];
        //     percent = interval_up / interval_down;
        //     dlat = parseFloat(route_f[preframe][0]) + ((parseFloat(route_f[postframe][0]) - parseFloat(route_f[preframe][0])) * percent);
        //     dlon = parseFloat(route_f[preframe][1]) + ((parseFloat(route_f[postframe][1]) - parseFloat(route_f[preframe][1])) * percent);
        // }
        // console.log(percent);
        frames = (currenttime * ((totalframe) / totaltime));
        intervaltime = frames % 1;
        preframe = parseInt(frames - intervaltime);
        postframe = parseInt(preframe + 1);
        dlat = parseFloat(route_f[preframe][0]) + (parseFloat(route_f[postframe][0]) - parseFloat(route_f[preframe][0])) * intervaltime;
        dlon = parseFloat(route_f[preframe][1]) + (parseFloat(route_f[postframe][1]) - parseFloat(route_f[preframe][1])) * intervaltime;
        console.log(currenttime, frames, preframe, postframe, intervaltime);
        lat_tr.innerHTML = dlat.toString();
        lon_tr.innerHTML = dlon.toString();
        time_tr.innerHTML = getDuration(audioElem.currentTime);
        point.clearLayers();
        L.circle([dlat, dlon], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 1,
            radius: 7.5
        }).addTo(point);

    }


    function onEnded() {
        playBtnElem.className = 'play';
        audioElem.currentTime = 0;
    }

    function onInput() {
        audioElem.currentTime = progressBarElem.value;
    }

    function onhide() {
        if (table.style.display === "none") {
            table.style.display = "block";
        } else {
            table.style.display = "none";
        }
    }

    function draw() {
        L.circleMarker([dlat, dlon], {
            color: 'black',
            fillOpacity: 1,
            radius: 5
        }).addTo(draw_s);
        drawcoor.push({ 'lat': dlat, 'lot': dlon });
        console.log(drawcoor);
    }

    function clear() {
        draw_s.clearLayers();
        drawcoor = [];
    }

    function refile() {
        location.reload();
    }

    function readvideo() {
        uploadvideo.innerHTML = ""
        console.log(mp4file.files[0].name)
        newvideo = mp4file.files[0].name
        var source = document.createElement('source');
        source.setAttribute('src', newvideo);
        uploadvideo.appendChild(source);
        console.log(uploadvideo)
        botton_mp4.style.display = "none"
        mp4file.style.display = "none"
        botton_re.style.display = "block"
    }

    function dates() {

    }

    function run() {
        playBtnElem.addEventListener('click', onClick);
        hidetable.addEventListener('click', onhide);
        drawpoint.addEventListener("click", draw)
        clearpoint.addEventListener("click", clear)
        audioElem.addEventListener('loadeddata', onLoadedData);
        audioElem.addEventListener('timeupdate', onTimeUpdate);
        audioElem.addEventListener('ended', onEnded);
        progressBarElem.addEventListener('input', onInput);
        botton_mp4.addEventListener('click', readvideo);
        botton_re.addEventListener('click', refile)
        button_csv.addEventListener('click', () => {
            Papa.parse(csvfile.files[0], {
                download: true,
                header: true,
                complete: function(results) {
                    logfile = results.data;
                    // d1_list = logfile[0].day.split('.')
                    // var d1 = new Date(d1_list[0], d1_list[1], d1_list[2], logfile[0].time_h, logfile[0].time_m, logfile[0].time_s);
                    // d1 = d1 / 1000;
                    let route = [];
                    for (let index = 0; index < logfile.length; index++) {
                        if (logfile[index].lat && logfile[index].lon != '') {
                            // d_list = logfile[index].day.split('.')
                            // var d = new Date(d_list[0], d_list[1], d_list[2], logfile[index].time_h, logfile[index].time_m, logfile[index].time_s);
                            // d = (d / 1000) - d1;
                            route.push([logfile[index].lat, logfile[index].lon])
                        }
                    }
                    console.log(route)
                    totalframe = route.length;
                    route_f = route;
                    route_layer.clearLayers();
                    var routelog = L.polyline(route).addTo(route_layer);
                    var bounds = routelog.getBounds();
                    mymap.fitBounds(bounds);

                }


            });


        });
    }
    run();



})();
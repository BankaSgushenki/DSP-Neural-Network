var canvas1 = new Canvas();
var canvas2 = new Canvas();
var canvas3 = new Canvas();
var n = 400;

Object.observe(canvas1, function() {canvas2.update(canvas1.map)});

// canvas1.loadImage('images/б.bmp');
// canvas1.loadImage('images/г.bmp');
// canvas1.loadImage('images/к.bmp');
// canvas1.loadImage('images/д.bmp');

var testImage_b = vectorizeImage(JSON.parse(localStorage.getItem("b")));
var testImage_g = vectorizeImage(JSON.parse(localStorage.getItem("g")));
var testImage_k = vectorizeImage(JSON.parse(localStorage.getItem("k")));
var testImage_d = vectorizeImage(JSON.parse(localStorage.getItem("d")));
var testImage_j = vectorizeImage(JSON.parse(localStorage.getItem("j")));
// var testImage_l = JSON.parse(localStorage.getItem("testObject_l"));

var weightMatrix = [];

for (var i = 0; i < n; i++) {
    weightMatrix[i] = [];
    for(var j = 0; j < n; j++) {
        weightMatrix[i][j] = 0;
    }
}

function teach(image) {
    for (var i = 0; i < n; i++)
        for(var j = 0; j < n; j++) {
            if(i === j) weightMatrix[i][j] = 0;
            else weightMatrix[i][j] += image[i]*image[j]
        }
}

function check(sample) {
    var image = vectorizeImage(sample);
    for(var j = 0; j < 5000; j++) {
        var r = getRandomInt(400);
        var sum = 0;
        for(var i = 0; i < n; i++) {
            sum += image[i] * weightMatrix[i][r];
        }
        var s = signum(sum);
        image[r] = s;
    }
    	
    // canvas2.map = result;
    // canvas2.erase();
    canvas3.update(devectorize(image));
}

function loadLetter() {
    canvas1.erase();
    canvas2.erase();
    canvas3.erase();
    canvas1.loadImage('images/' + document.getElementById("letter").value + '.bmp')
}

function vectorizeImage(image) {
    var result = [];
    for (var i = 0; i < 20; i++) {
        for(var j = 0; j < 20; j++) {
            result[i*20 + j] = image[i][j];
        }
    }
    return result;
}

function devectorize(vector) {
    var result = [];

    for (var i = 0; i < 20; i++) {
        result[i] = [];
            for(var j = 0; j < 20; j++) {
                result[i][j] = vector[i*20 + j];
        }
    }
    return result;
}

function signum(i) {
    if (i >=0) return 1;
    else return -1;
}

teach(testImage_b);
// teach(testImage_g);
teach(testImage_k);
// teach(testImage_j);
// teach(testImage_d);

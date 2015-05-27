var getRandomInt = function(n) {
    return Math.floor( Math.random() *n);
}

var Canvas = function() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = 400;
    this.height = this.canvas.height = 400;
    this.pixels = this.ctx.getImageData(0, 0, this.width, this.height);
    this.flag = false;
    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;
    this.dot_flag = false;
    this.map = [];

    for (var i = 0; i < 20; i++) {
        this.map[i] = [];
        for(var j = 0; j < 20; j++) {
            this.map[i][j] = -1;
        }
    }

    this.x = "black";
    this.y = 40;

    var self = this;

    this.canvas.addEventListener("mousemove", function (e) {self.findxy.call(self,'move', e)}, false);
    this.canvas.addEventListener("mousedown", function (e) {self.findxy.call(self,'down', e)}, false);
    this.canvas.addEventListener("mouseup", function (e) {self.findxy.call(self,'up', e)}, false);
    this.canvas.addEventListener("mouseout", function (e) {self.findxy.call(self,'out', e)}, false);

    document.body.appendChild(this.canvas);
}

Canvas.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.x;
    this.ctx.lineWidth = this.y;
    this.ctx.stroke();
    this.ctx.closePath();
}

Canvas.prototype.erase = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
     for (var i = 0; i < 20; i++)
        for(var j = 0; j < 20; j++) {
            this.map[i][j] = -1;
        }
    // document.getElementById("canvasimg").style.display = "none";
}

Canvas.prototype.findxy = function(res, e) {
    if (res == 'down') {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - this.canvas.offsetLeft;
        this.currY = e.clientY - this.canvas.offsetTop;

        this.flag = true;
        this.dot_flag = true;
        if (this.dot_flag) {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.x;
            this.ctx.arc(this.currX, this.currY, 20, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.closePath();
            this.dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        this.flag = false; 
        // this.getPixels();
    }
    if (res == 'move') {
        if (this.flag) {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX = e.clientX - this.canvas.offsetLeft;
            this.currY = e.clientY - this.canvas.offsetTop;
            this.draw();
        }
    }
}

Canvas.prototype.getPixels = function() {
    this.pixels = this.ctx.getImageData(0, 0, this.width, this.height);
    for(var y = 0; y < this.height; y +=20)
        for(var x = 0; x < this.width; x +=20) {
            this.checkArea(x,y);
        }
};

Canvas.prototype.checkArea = function(x,y) {
    var count = 0;
    for(var i = 0; i < 20; i ++)
        for(var j = 0; j < 20; j ++) {
            // console.log(this.getColor(x + j, y + i).g)
            if(this.getColor(x + j, y + i).g === 0) {
                count ++;
            }
        }
    if (count > 200) {
        this.setArea(x/20,y/20,1);
        // console.log(x/40,y/40);
    }        
};

Canvas.prototype.getColor = function(x,y) {
    return {
        r :this.pixels.data[(x + y*this.width)*4],
        g :this.pixels.data[(x + y*this.width)*4 + 1], 
        b :this.pixels.data[(x + y*this.width)*4 + 2], 
    };
};

Canvas.prototype.setColor = function(x,y,color) {
    this.pixels.data[(x + y*this.width)*4] = color.r;
    this.pixels.data[(x + y*this.width)*4 + 1] = color.g;
    this.pixels.data[(x + y*this.width)*4 + 2] = color.b;
};


Canvas.prototype.setArea = function (x,y,value) {
    this.map[x][y] = value;
};

Canvas.prototype.getArea = function (x,y) {
    return map.field[x][y];
};

Canvas.prototype.drawSquare = function (x,y,color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x*20, y*20, 20, 20);
};

Canvas.prototype.update = function (map) {
    for(var i = 0; i < 20; i ++)
        for(var j = 0; j < 20; j ++) {
            if(map[i][j] === 1) {
                this.drawSquare(i,j);
                this.map[i][j] = 1;
            }
        }
};

Canvas.prototype.addNoise = function() {
    var level = parseInt(document.querySelector('input[type="range"]').value);
    for(var i = 0; i < 20; i ++)
        for(var j = 0; j < 20; j ++) {
            if(this.map[i][j] === -1)  {
                if(getRandomInt(100) < level)  {
                    this.drawSquare(i,j, "black");
                    this.map[i][j] = 1;
                }
            }
            if(this.map[i][j] === 1) {
                if(getRandomInt(100) < level) {
                    this.drawSquare(i,j, "white");
                    this.map[i][j] = -1;
                }
            }
        }
};

Canvas.prototype.loadImage = function(src) {
    var self = this;
    this.originalImage = new Image();
    this.originalImage.src = src;
    this.originalImage.onload = function() {
        self.ctx.drawImage(self.originalImage, 0, 0);
        self.getPixels();
    };
};
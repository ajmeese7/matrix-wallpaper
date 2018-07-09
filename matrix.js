// Modified from http://steamcommunity.com/sharedfiles/filedetails/?id=892374811
var canvas = document.getElementById("matrix");
var ctx = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

// Unicode Russian characters
var matrix = "\u0402\u0403\u040A\u040B\u0411\u0414\u0416\u0419\u041B\u0423\u0424\u0426\u0429\u042A\u042E\u042F\u0434\u0436\u0444\u0452\u0457\u045C\u0461\u0463\u0464\u0466\u0468\u046A\u046E\u0471\u0472\u047A\u0481\u0482\u0483\u0494\u0498\u049C\u04A0\u04A8\u04B0\u04B4\u04FC\u04FD\u04FE\u04C7\u04C3\u04C1";
matrix = matrix.split('');
var rainColor = "rgb(0, 255, 0)";
var backgroundColor = "#000000";

var style = window.getComputedStyle(canvas, null).getPropertyValue('font-size');
canvas.style.fontSize = (font_size + 1) + 'px';
var font_size = parseFloat(style);

// NOTE: Doesn't work well when text size reduced. Rework?
var num_columns = canvas.width / font_size;
var drops = [];

for (var xCoord = 0; xCoord < num_columns; xCoord++) {
  drops[xCoord] = 1;
}

function draw() {
  canvas.style.fontSize = (font_size + 1) + 'px';

  var viewportHeight = (typeof window.innerHeight != 'undefined' ? window.innerHeight : document.body.offsetHeight);
  document.getElementById("container").setAttribute("style","height:" + viewportHeight + "px")

  // Makes the previous letters dim
  // IDEA: Somehow make background color/image modifiable?
  ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = rainColor;
  ctx.font = font_size + "px arial";

  for (var i = 0; i < drops.length; i++) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(i * font_size, drops[i] * font_size, font_size, font_size);

    ctx.fillStyle = rainColor;
    var letter = matrix[Math.floor(Math.random() * matrix.length)];
    ctx.fillText(letter, i * font_size, drops[i] * font_size);

    if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }

  if (fastSpeedOver) {
    setTimeout(draw, speed);
  }
}

// Makes it start off fast (to cover the whole screen) then slow down
var speed = 40;
var fastSpeedOver = false;
var interval = setInterval(draw, 10); // TODO: Figure out some math to make this exactly fit the SCREEN height on every device?
setTimeout(function() {
  clearInterval(interval);
  fastSpeedOver = true;
  draw();
}, 1000);
// IDEA: Add rainbow mode?


/* ################################################
            Wallpaper Engine Interaction
   ################################################ */
window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        // Read text
        if (properties.text) {
            var text = properties.text.value;
            document.getElementById("text").innerText = text;
        }

        // Read text color
        if (properties.textcolor) {
          // Convert the text color to be applied as a CSS style
            var textColor = properties.textcolor.value.split(' ');
            textColor = textColor.map(function(c) {
              return Math.ceil(c * 255);
            });
            var textColorAsCSS = 'rgb(' + textColor + ')';
            document.getElementById("text").style.color = textColorAsCSS;
        }

        // Read text size
        if (properties.textsize) {
          // IDEA: Add font support
            var textSize = properties.textsize.value + "px";
            document.getElementById("text").style.fontSize = textSize;
        }

        // Read rain color
        if (properties.raincolor) {
          // Convert the rain color to be applied as a CSS style
            var color = properties.raincolor.value.split(' ');
            color = color.map(function(c) {
              return Math.ceil(c * 255);
            });
            rainColor = 'rgb(' + color + ')';
        }

        // Set rain size
        if (properties.rainsize) {
            font_size = properties.rainsize.value;
        }

        // Read rain background color
        if (properties.rainbackground) {
            if (properties.rainbackground.value === "0") {
                backgroundColor = '#000000';
            } else {
              // Convert the rain background color to be applied as a CSS style
                var backColor = properties.rainbackground.value.split(' ');
                backColor = backColor.map(function(c) {
                  return Math.ceil(c * 255);
                });
                backgroundColor = 'rgb(' + backColor + ')';
            }
        }

        // Read scheme color
        if (properties.schemecolor) {
          // Convert the scheme color to be applied as a CSS style
            var schemeColor = properties.schemecolor.value.split(' ');
            schemeColor = schemeColor.map(function(c) {
              return Math.ceil(c * 255);
            });
            var schemeColorAsCSS = 'rgb(' + schemeColor + ')';
        }

        // Read custom slider
        if (properties.speed) {
            speed = 101 - properties.speed.value;
        }
    } // applyUserProperties
};
